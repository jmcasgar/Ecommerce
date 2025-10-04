# Credenciales de Prueba - Aplicación Ecommerce

## 👤 Usuario Regular

**Email**: `usuario@ejemplo.com`  
**Contraseña**: `usuario123`  
**Rol**: Usuario  
**Acceso**: Funciones de cliente

### Funcionalidades del Usuario:
- ✅ Navegación de productos
- ✅ Carrito de compras
- ✅ Realizar pedidos
- ✅ Ver historial de pedidos
- ✅ Gestión de perfil

## 🔐 Registro de Nuevos Usuarios

Los usuarios pueden registrarse con cualquier email válido. Por defecto, todos los nuevos usuarios tendrán rol de **usuario**.

### Ejemplo de Registro:
- **Nombre**: Juan Pérez
- **Apellido**: García
- **Email**: `juan@ejemplo.com`
- **Teléfono**: `+1234567890`
- **Contraseña**: `mipassword123`

## 📱 Cómo Probar las Funcionalidades

### 1. Login como Administrador
1. Abrir la aplicación
2. Ir a "Iniciar Sesión"
3. Usar: `admin@ecommerce.com` / `admin123`
4. Acceder al perfil y ver "Panel de Administración"

### 2. Login como Usuario
1. Abrir la aplicación
2. Ir a "Iniciar Sesión"
3. Usar: `usuario@ejemplo.com` / `usuario123`
4. Explorar productos y realizar compras

### 3. Registro de Nuevo Usuario
1. Ir a "Registrarse"
2. Completar formulario
3. Confirmar registro
4. Acceder automáticamente

## 🛒 Flujo de Compra Completo

### Para Usuarios:
1. **Login/Registro** → Acceder a la aplicación
2. **Explorar Productos** → Ver catálogo con imágenes reales
3. **Agregar al Carrito** → Seleccionar productos y cantidades
4. **Revisar Carrito** → Verificar productos y totales
5. **Checkout** → Completar dirección y método de pago
6. **Confirmar Pedido** → Finalizar compra
7. **Ver Pedidos** → Consultar historial en perfil

### Para Administradores:
1. **Login Admin** → Acceder con credenciales de admin
2. **Panel Admin** → Ver estadísticas y pedidos
3. **Gestionar Pedidos** → Cambiar estados de pedidos
4. **Filtrar Pedidos** → Ver por estado específico
5. **Actualizar Estados** → Procesar → Enviar → Entregar

## 🎯 Estados de Pedidos

- **Pendiente**: Pedido recién creado
- **Procesando**: En preparación
- **Enviado**: En camino al cliente
- **Entregado**: Completado exitosamente
- **Cancelado**: Pedido cancelado

## 📊 Estadísticas Disponibles

### En Panel de Administración:
- **Total de Pedidos**: Cantidad total
- **Pedidos Completados**: Entregados exitosamente
- **Pedidos Pendientes**: En proceso
- **Ingresos Totales**: Suma de pedidos entregados

## 🔧 Funciones Técnicas

### Autenticación:
- JWT tokens con expiración
- Persistencia de sesión
- Guards de protección de rutas
- Roles y permisos

### Almacenamiento:
- Datos de usuario persistentes
- Carrito guardado localmente
- Historial de pedidos offline
- Recuperación automática

### API Mock:
- Productos con imágenes reales
- Categorías funcionales
- Sistema de pedidos completo
- Simulación de delays realistas

---

## 📞 Soporte

Si tienes problemas con las credenciales o funcionalidades, verifica:

1. **Conexión a Internet**: Para cargar imágenes de productos
2. **Permisos de Almacenamiento**: Para guardar datos localmente
3. **Navegador Actualizado**: Para mejor rendimiento
4. **JavaScript Habilitado**: Para funcionalidad completa

**Estado**: ✅ Todas las credenciales están funcionando correctamente

