from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
import sqlalchemy
from typing import List
from ..database import get_db
from .. import models, schemas, utils
from ..dependencies import get_current_admin_user

router = APIRouter(tags=["Orders"])

@router.post("/orders/", response_model=schemas.OrderResponse)
def create_order(order_data: schemas.OrderCreate, db: Session = Depends(get_db), current_user: models.User = Depends(utils.get_current_user)):
    total_amount = 0
    order_items_to_create = []
    for item in order_data.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product or product.stock < item.quantity:
            raise HTTPException(status_code=400, detail="Producto no encontrado o sin stock")
        total_amount += product.price * item.quantity
        product.stock -= item.quantity 
        order_items_to_create.append(models.OrderItem(product_id=product.id, quantity=item.quantity, unit_price=product.price))

    new_order = models.Order(user_id=current_user.id, total_price=total_amount, status="paid")
    db.add(new_order)
    db.flush()
    for item in order_items_to_create:
        item.order_id = new_order.id
        db.add(item)
    db.commit()
    db.refresh(new_order)
    return new_order

# app/routers/orders.py
@router.get("/my-orders/", response_model=List[schemas.UserOrderResponse])
def get_my_orders(db: Session = Depends(get_db), current_user: models.User = Depends(utils.get_current_user)):
    return db.query(models.Order)\
             .options(
                 joinedload(models.Order.items)
                 .joinedload(models.OrderItem.product)
             )\
             .filter(models.Order.user_id == current_user.id)\
             .all()

@router.get("/admin/orders/", response_model=List[schemas.UserOrderResponse])
def get_all_orders(db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin_user)):
    return db.query(models.Order).all()

@router.get("/admin/stats/")
def get_admin_stats(db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin_user)):
    total_sales = db.query(models.Order).count()
    revenue = db.query(models.Order).with_entities(sqlalchemy.func.sum(models.Order.total_price)).scalar()
    return {"total_orders": total_sales, "total_revenue": revenue or 0, "admin_active": admin.full_name}