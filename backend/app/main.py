from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import users, products, orders

# Crea las tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Panetta Commerce API")

# Configuración de CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluimos los routers
app.include_router(users.router)
app.include_router(products.router)
app.include_router(orders.router)

@app.get("/")
def read_root():
    return {"status": "online", "message": "Backend Refactorizado y listo para React"}