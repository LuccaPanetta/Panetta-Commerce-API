from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas, utils
from ..dependencies import get_current_admin_user

router = APIRouter(tags=["Products & Categories"])

@router.get("/categories/", response_model=List[schemas.Category])
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

@router.post("/categories/", response_model=schemas.Category)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin_user)):
    db_category = db.query(models.Category).filter(models.Category.name == category.name).first()
    if db_category:
        raise HTTPException(status_code=400, detail="La categoría ya existe")
    
    new_category = models.Category(name=category.name, slug=category.slug)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@router.get("/products/", response_model=List[schemas.Product])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).order_by(models.Product.id).all()

@router.post("/products/", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin_user)):
    category = db.query(models.Category).filter(models.Category.id == product.category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="La categoría no existe")
    
    new_product = models.Product(**product.model_dump()) 
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.patch("/products/{product_id}/stock", response_model=schemas.Product)
def update_stock(product_id: int, new_stock: int, db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin_user)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    product.stock = new_stock
    db.commit()
    db.refresh(product)
    return product

@router.post("/upload-image/")
def upload_product_image(file: UploadFile = File(...), admin: models.User = Depends(get_current_admin_user)):
    image_url = utils.upload_image_to_cloudinary(file.file)
    if not image_url:
        raise HTTPException(status_code=500, detail="No se pudo subir la imagen a Cloudinary")
    return {"image_url": image_url}

@router.put("/products/{product_id}", response_model=schemas.Product) 
def update_product(product_id: int, updated_data: schemas.ProductCreate, db: Session = Depends(get_db),current_user: models.User = Depends(utils.get_current_user)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="No tienes permisos de administrador")

    # Actualizamos los campos
    product.name = updated_data.name
    product.price = updated_data.price

    db.commit()
    db.refresh(product)
    return product