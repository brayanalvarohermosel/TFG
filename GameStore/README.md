# GameKeys Store

Aplicación web full-stack de tienda de claves digitales con Angular 19, Supabase y Stripe. Los usuarios pueden navegar, comprar juegos con pago simulado por tarjeta y recibir códigos de activación únicos al instante.

## 📋 Descripción del Proyecto

- **Catálogo de juegos**: Grid responsive con filtro por plataforma (PC, PlayStation, Xbox, Switch) y buscador por nombre
- **Detalle de juegos**: Vista con imagen, precio, descuento, descripción y características
- **Carrito de compras**: Panel lateral con Signals + persistencia en localStorage
- **Pago con Stripe**: Modal con tarjeta de crédito en modo test
- **Generación de códigos**: Tras el pago, se generan códigos `GAMEK-XXXX-XXXX-XXXX`
- **Historial de pedidos**: Página `/orders` con códigos y botón copiar
- **Autenticación**: Supabase Auth con perfiles admin/cliente
- **Panel admin**: Añadir, editar y eliminar juegos
- **Diseño glassmorphism**: Tema oscuro con gradientes, backdrop-filter y animaciones

## 🛠️ Tecnologías

- **Angular 19**: Framework principal (standalone components, Signals)
- **Supabase**: PostgreSQL, Auth, Edge Functions
- **Stripe**: Payment Intents API en modo test
- **TypeScript**: Lenguaje de programación
- **RxJS**: Programación reactiva para llamadas HTTP
- **CSS3**: Variables CSS, gradientes, backdrop-filter, animaciones

## 👤 Credenciales de Acceso

### Administrador
- **Email**: `admin@game.com`
- **Contraseña**: `admin123`
- **Permisos**: Catálogo, filtros, carrito, compra, historial + añadir/editar/eliminar juegos

### Cliente
- **Email**: `cliente@game.com`
- **Contraseña**: `cliente123`
- **Permisos**: Catálogo, filtros, carrito, compra, historial

## 📁 Estructura del Proyecto
```
GameStore/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── navbar/       # Barra de navegación con filtros
│   │   │   ├── game-list/    # Grid de juegos + hero
│   │   │   ├── game-card/    # Tarjeta individual
│   │   │   ├── game-detail/  # Página de detalle
│   │   │   ├── game-form/    # Formulario admin
│   │   │   ├── carrito/      # Panel lateral del carrito
│   │   │   ├── login/        # Pantalla de inicio de sesión
│   │   │   ├── payment/      # Modal de pago Stripe
│   │   │   └── orders/       # Historial de pedidos
│   │   ├── services/
│   │   │   ├── supabase.ts   # Cliente Supabase
│   │   │   ├── auth.ts       # Autenticación con Supabase Auth
│   │   │   ├── game.ts       # CRUD contra Supabase + caché
│   │   │   └── carrito.ts    # Carrito con Signals + localStorage
│   │   ├── models/
│   │   │   ├── game.model.ts
│   │   │   └── user.model.ts
│   │   ├── app.ts
│   │   ├── app.html
│   │   ├── app.css
│   │   ├── app.config.ts     # APP_INITIALIZER
│   │   └── app.routes.ts     # /, /game/:id, /orders
│   ├── index.html
│   ├── main.ts
│   └── styles.css            # Variables CSS + gradiente global
└── supabase/
    └── functions/
        └── create-payment-intent/
            └── index.ts       # Edge Function de Stripe
```

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js (v20 o superior)
- npm (v11 o superior)
- Angular CLI (v19)

### Instalación
```bash
git clone <repository-url>
cd GameStore
npm install
```

### Servidor de Desarrollo
```bash
ng serve
```

Abre el navegador en `http://localhost:4200/`.

## 🔨 Build
```bash
ng build
```

Los artefactos se almacenan en `dist/`.

## 📦 Componentes Principales

### Navbar (`navbar`)
Barra superior con logo, buscador, filtros por plataforma, carrito con badge y botón de salir. Efecto glassmorphism con backdrop-filter.

### Game List (`game-list`)
Grid de tarjetas con hero animado (gradiente púrpura/dorado pulsante). Carga esqueletos (skeleton shimmer) mientras obtiene datos.

### Game Card (`game-card`)
Tarjeta con imagen, nombre, plataforma (borde coloreado), precio, badge de descuento y botones de acción. Efecto hover con elevación y glow dorado.

### Game Detail (`game-detail`)
Dos columnas: imagen + info. Muestra precio, descuento, características y botón "Añadir al carrito" con feedback visual. Carga instantánea gracias a la caché de GameService.

### Game Form (`game-form`)
Modal para crear/editar juegos. Solo visible para administradores. Campos: nombre, plataforma, precio, precio anterior, imagen.

### Carrito (`carrito`)
Panel lateral deslizante. Muestra items con imagen, nombre, cantidad (+/-), precio y total. Persiste en localStorage mediante Signals.

### Payment (`payment`)
Modal con Stripe Elements para introducir datos de tarjeta. Se comunica con la Edge Function para crear el PaymentIntent y confirma el pago con confirmCardPayment.

### Orders (`orders`)
Historial de pedidos con fecha, total, juegos comprados, códigos de activación y botón "Copiar". Incluye skeleton loading mientras carga.

### Login (`login`)
Pantalla completa con formulario de email/contraseña. Autentica contra Supabase Auth y crea perfil automáticamente.

## 🔌 Servicios

### Supabase Client (`supabase.ts`)
Cliente inicializado con `createClient()` usando las credenciales del proyecto Supabase.

### Auth Service (`auth.ts`)
Maneja login, registro, cierre de sesión y restauración de sesión mediante Supabase Auth. Expone `isLoggedIn()`, `isAdmin()` y `getUser()` como observables. Usa APP_INITIALIZER para restaurar la sesión antes del primer cambio de detección.

### Game Service (`game.ts`)
Operaciones CRUD contra Supabase (select, insert, update, delete). Incluye caché en memoria (`cachedGames`) para que `getGameById()` devuelva los datos instantáneamente si ya se cargaron antes. Gestiona filtros y búsqueda con BehaviorSubject.

### Carrito Service (`carrito.ts`)
Gestiona el carrito con Signals de Angular. Métodos: `addGame()`, `removeGame()`, `updateQuantity()`, `clearCart()`, `getTotal()` (computed). Persiste en localStorage automáticamente.

## 💳 Flujo de Pago

1. El usuario añade juegos al carrito y hace clic en "Comprar"
2. Se abre el modal de pago con Stripe Elements
3. El frontend llama a la Edge Function `create-payment-intent`
4. La Edge Function crea un PaymentIntent en Stripe con la clave secreta
5. Stripe devuelve un `clientSecret`
6. El frontend llama a `stripe.confirmCardPayment(clientSecret)`
7. Si es exitoso, se genera un código por cada juego: `GAMEK-XXXX-XXXX-XXXX`
8. El pedido se guarda en Supabase (tabla `orders`)
9. Se muestra overlay con códigos y botón copiar

Tarjeta de prueba: `4242 4242 4242 4242`, cualquier fecha futura, cualquier CVC.

## 📊 Modelos de Datos

### Game
```typescript
interface Game {
  id?: string;
  name: string;
  platform: string;
  oldPrice: number;
  price: number;
  image: string;
}
```

### User
```typescript
interface User {
  id: string;
  email: string;
  username: string;
  is_admin: boolean;
}
```

## 🎨 Diseño

- **Tema**: Oscuro con acentos dorados (#c9a84c) y púrpura (#7c3aed)
- **Tipografía**: Orbitron (títulos) + Rajdhani (cuerpo)
- **Efectos**: Glassmorphism (backdrop-filter), gradientes animados, hover glow, skeleton shimmer
- **Responsive**: Grid 5→4→3→2 columnas según pantalla

## ⚠️ Limitaciones Conocidas

- Stripe en modo test (no cobros reales)
- Catálogo limitado (juegos de ejemplo)
- Sin notificaciones por email
- Sin paginación en el catálogo
- Tras introducir email y contraseña, si la app tarda más de 2 minutos en responder, hacer clic de nuevo en el campo de email o contraseña para forzar la entrada
- Al hacer clic en "Mis pedidos" o "Salir", puede requerir un segundo clic si la sesión no se ha restaurado completamente (el APP_INITIALIZER aún está resolviendo el perfil del usuario)