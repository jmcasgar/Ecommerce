
# Ecommerce App - Aplicación Móvil Híbrida

## Descripción del Proyecto

Esta es una aplicación móvil híbrida de ecommerce desarrollada con Ionic y Angular que cumple con todos los criterios especificados para el desarrollo de aplicaciones móviles multiplataforma. La aplicación incluye autenticación, servicios API, carrito de compras y almacenamiento local, funcionando tanto en Android como en iOS.

## Características Principales

###  Autenticación
- Sistema de registro e inicio de sesión
- Autenticación con JWT (JSON Web Tokens)
- Persistencia de sesión entre reinicios


###  Carrito de Compras
- Agregar productos al carrito
- Gestión de cantidades
- Eliminación de productos


###  Servicios API
- Catálogo de productos con imágenes
- Búsqueda y filtrado por categorías
- Gestión de órdenes
- Datos mockeados para demostración
- Manejo de estados de carga y error

###  Almacenamiento Local
- Persistencia de datos de usuario
- Almacenamiento del carrito de compras
- Historial de órdenes offline
- Recuperación de datos tras reinicio
- Funcionalidad offline básica

## Tecnologías Utilizadas

- **Frontend**: Ionic 7 + Angular 20
- **Backend**: Servicios API mockeados
- **Almacenamiento**: Capacitor Preferences
- **Autenticación**: JWT con almacenamiento seguro
- **Plataformas**: Android (API 34) e iOS (17.0)
- **Herramientas**: Ionic CLI, Capacitor, Angular CLI



## Instalación y Configuración

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Ionic CLI
- Android Studio (para Android)
- Xcode (para iOS)

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/your-user/ecommerce-app.git
   cd ecommerce-app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Instalar Ionic CLI globalmente**
   ```bash
   npm install -g @ionic/cli
   ```

4. **Agregar plataformas**
   ```bash
   ionic capacitor add android
   ionic capacitor add ios
   ```

### Desarrollo

1. **Ejecutar en navegador**
   ```bash
   ionic serve
   ```

2. **Ejecutar en Android**
   ```bash
   ionic capacitor run android
   ```

3. **Ejecutar en iOS**
   ```bash
   ionic capacitor run ios
   ```




Plataformas: Android 34 y iOS 17
Herramientas: Ionic CLI, Capacitor, Angular CLI

