from sqlalchemy.orm import Session
from .database import SessionLocal
from . import models

def seed_db():
    db: Session = SessionLocal()
    
    # Limpieza total para resetear la tienda con las imágenes locales
    db.query(models.Product).delete()
    db.commit()

    # Asegurar Categorías
    categories_list = ["Procesadores", "Placas de Video", "Monitores", "Periféricos"]
    for name in categories_list:
        if not db.query(models.Category).filter(models.Category.name == name).first():
            db.add(models.Category(name=name, slug=name.lower().replace(" ", "-")))
    db.commit()

    cpu_id = db.query(models.Category).filter(models.Category.name == "Procesadores").first().id
    gpu_id = db.query(models.Category).filter(models.Category.name == "Placas de Video").first().id
    mon_id = db.query(models.Category).filter(models.Category.name == "Monitores").first().id
    per_id = db.query(models.Category).filter(models.Category.name == "Periféricos").first().id

    # Lista de 16 Productos
    products = [
        # PROCESADORES
        {"name": "AMD Ryzen 5 5600X", "slug": "r5-5600x", "price": 210.0, "category_id": cpu_id, "image_url": "/images/AMD Ryzen 5 5600X.jpg", "description": "Procesador de alto rendimiento para gaming."},
        {"name": "AMD Ryzen 9 7950X", "slug": "r9-7950x", "price": 650.0, "category_id": cpu_id, "image_url": "/images/AMD Ryzen 9 7950X.webp", "description": "Lo máximo en potencia multihilo para creadores."},
        {"name": "Intel Core i5-13600K", "slug": "i5-13600k", "price": 320.0, "category_id": cpu_id, "image_url": "/images/Intel Core i5-13600K.webp", "description": "Excelente balance entre precio y rendimiento."},
        {"name": "Intel Core i9-12900K", "slug": "i9-12900k", "price": 520.0, "category_id": cpu_id, "image_url": "/images/Intel Core i9-12900K.webp", "description": "Potencia extrema para los setups más exigentes."},

        # PLACAS DE VIDEO
        {"name": "NVIDIA RTX 4070 Ti", "slug": "rtx-4070ti", "price": 850.0, "category_id": gpu_id, "image_url": "/images/NVIDIA RTX 4070 Ti.jpg", "description": "Tecnología DLSS 3 y Ray Tracing de última generación."},
        {"name": "ASUS Dual RTX 3060", "slug": "rtx-3060", "price": 340.0, "category_id": gpu_id, "image_url": "/images/ASUS Dual RTX 3060.jpg", "description": "La placa ideal para jugar a todo en 1080p."},
        {"name": "AMD Radeon RX 7900", "slug": "rx-7900", "price": 999.0, "category_id": gpu_id, "image_url": "/images/AMD Radeon RX 7900.jpg", "description": "Poder absoluto en 4K nativo."},
        {"name": "MSI Ventus RTX 4060", "slug": "rtx-4060", "price": 299.0, "category_id": gpu_id, "image_url": "/images/MSI Ventus RTX 4060.png", "description": "Eficiencia y frescura para tu PC."},

        # MONITORES
        {"name": "Samsung Odyssey G5", "slug": "g5-27", "price": 310.0, "category_id": mon_id, "image_url": "/images/Samsung Odyssey G5.avif", "description": "Monitor curvo QHD con 144Hz."},
        {"name": "LG UltraGear 24", "slug": "lg-24", "price": 180.0, "category_id": mon_id, "image_url": "/images/LG UltraGear 24.jpg", "description": "Panel IPS de 1ms de respuesta."},
        {"name": "ASUS ROG Swift 360", "slug": "rog-360", "price": 699.0, "category_id": mon_id, "image_url": "/images/ASUS ROG Swift 360.webp", "description": "Velocidad competitiva profesional."},
        {"name": "Gigabyte M27Q", "slug": "m27q", "price": 350.0, "category_id": mon_id, "image_url": "/images/Gigabyte M27Q.webp", "description": "Monitor KVM integrado para productividad."},

        # PERIFÉRICOS
        {"name": "Logitech G Pro X", "slug": "gpro-x", "price": 140.0, "category_id": per_id, "image_url": "/images/Logitech G Pro X.jpg", "description": "Mouse inalámbrico ultra liviano."},
        {"name": "Razer DeathAdder V3", "slug": "v3-pro", "price": 155.0, "category_id": per_id, "image_url": "/images/Razer DeathAdder V3.jpg", "description": "Ergonomía icónica para gaming profesional."},
        {"name": "Corsair K70 RGB", "slug": "k70-rgb", "price": 135.0, "category_id": per_id, "image_url": "/images/Corsair K70 RGB.jpg", "description": "Teclado mecánico con iluminación dinámica."},
        {"name": "HyperX Cloud Alpha", "slug": "alpha-s", "price": 95.0, "category_id": per_id, "image_url": "/images/HyperX Cloud Alpha.webp", "description": "Comodidad y audio premium."}
    ]

    for p in products:
        db.add(models.Product(**p, stock=10))
    
    db.commit()
    print(f"🚀 Base de datos poblada con éxito: 16 productos con imágenes locales.")
    db.close()

if __name__ == "__main__":
    seed_db()