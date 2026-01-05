from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Esquema base para Categorías
class CategoryBase(BaseModel):
    name: str
    slug: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int

    class Config:
        from_attributes = True 

# Esquema base para Productos
class ProductBase(BaseModel):
    name: str
    slug: str
    description: str
    price: float
    stock: int
    image_url: str
    category_id: int

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    rating: float

    class Config:
        from_attributes = True

# Esquema para los ítems que vienen en el pedido
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

# Esquema para crear la orden completa
class OrderCreate(BaseModel):
    items: List[OrderItemCreate]

# Esquema de respuesta
class OrderResponse(BaseModel):
    id: int
    total_price: float
    status: str

    class Config:
        from_attributes = True

# Esquemas para Usuarios
class UserBase(BaseModel):
    full_name: str
    email: str

class UserCreate(UserBase):
    password: str 

class User(UserBase):
    id: int
    is_admin: bool

    class Config:
        from_attributes = True

# Esquema para recibir credenciales
class UserLogin(BaseModel):
    email: str
    password: str

# Esquema para devolver el token
class Token(BaseModel):
    access_token: str
    token_type: str

class OrderItemDetail(BaseModel):
    product_id: int
    quantity: int
    unit_price: float
    product: Optional[Product] = None

    class Config:
        from_attributes = True

class UserOrderResponse(BaseModel):
    id: int
    total_price: float
    status: str
    created_at: datetime 
    items: List[OrderItemDetail]

    class Config:
        from_attributes = True