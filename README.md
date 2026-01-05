# 🛒 Panetta HW - E-commerce de Hardware 

**Panetta HW** es una plataforma de comercio electrónico **Full-Stack** especializada en componentes de hardware. Este proyecto demuestra la integración de una arquitectura moderna basada en microservicios, gestión de estado asíncrona en el frontend y una API robusta con autenticación JWT y permisos jerárquicos.

---

## 🚀 Características Principales

* **Autenticación y Seguridad**: Sistema de registro y login con persistencia de sesión mediante **JWT (JSON Web Tokens)** y protección de rutas privadas.
* **Gestión de Stock Transaccional**: Algoritmo en el backend que descuenta automáticamente las unidades del inventario al confirmar una compra satisfactoria.
* **Historial de Pedidos Detallado**: Interfaz personalizada que recupera compras pasadas mediante consultas relacionales, mostrando nombres de productos y precios históricos.
* **Panel Administrativo**: Modo administrador integrado que permite la edición dinámica de precios, nombres y control de stock directamente desde la UI.
* **Diseño Moderno**: Interfaz diseñada con **Tailwind CSS**, con feedback visual de carga y animaciones fluidas.

---

## 🛠️ Stack Tecnológico

### **Backend (FastAPI)**
* **Python 3.11**: Lenguaje base centrado en el rendimiento.
* **SQLAlchemy**: ORM para el mapeo de relaciones complejas (Users, Orders, Products).
* **Pydantic**: Validación de datos y esquemas de respuesta estrictos.
* **Docker & Docker Compose**: Contenerización para un despliegue y desarrollo consistentes.

### **Frontend (React)**
* **Vite**: Entorno de desarrollo de última generación para React.
* **Tailwind CSS**: Estilizado basado en utilidades para una interfaz responsiva.
* **Axios**: Gestión de peticiones HTTP y manejo de tokens de seguridad.
* **Lucide React**: Set de iconos vectoriales optimizados.

---

## 📦 Instalación y Configuración

Seguí estos pasos para ejecutar el proyecto en tu entorno local:

### 1. Clonar el Repositorio
```bash
git clone [https://github.com/LuccaPanetta/Panetta-Commerce-API.git](https://github.com/LuccaPanetta/Panetta-Commerce-API.git)
cd Panetta-Commerce-API
```

### 2. Levantar el Backend (Docker)
Fijate de tener Docker instalado y ejecutá el siguiente comando en la carpeta backend:
```bash
docker-compose up --build
```

### 3. Configurar y Levantar el Frontend
Abre una nueva terminal para iniciar la interfaz de usuario con Vite:
```bash
cd frontend
npm install
npm run dev
