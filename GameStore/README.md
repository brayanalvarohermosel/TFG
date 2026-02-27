# GameKeys Store

Una aplicación web de tienda de videojuegos que permite a los usuarios navegar, visualizar detalles de juegos y gestionar un carrito de compras.

## 📋 Descripción del Proyecto

GameKeys Store es una aplicación de demostración que implementa las funcionalidades básicas de una tienda online de videojuegos, incluyendo:

- **Catálogo de juegos**: Visualización de lista de juegos disponibles con filtrado por plataforma
- **Detalle de juegos**: Vista detallada con información completa de cada juego
- **Carrito de compras**: Gestión de artículos en el carrito con cantidades y total
- **Autenticación**: Sistema de login con dos roles diferenciados (admin y cliente)
- **Panel de administración**: Gestión completa de juegos (añadir, editar, eliminar)
- **Interfaz responsiva**: Diseño adaptable a diferentes dispositivos

## 🛠️ Tecnologías

- **Angular 21**: Framework principal
- **TypeScript**: Lenguaje de programación
- **RxJS**: Programación reactiva
- **Angular Router**: Enrutamiento de aplicación
- **Angular Forms**: Manejo de formularios
- **MockAPI**: API REST externa para persistencia de datos

## 👤 Credenciales de Acceso

La aplicación dispone de dos tipos de usuario con diferentes permisos:

### Administrador
- **Usuario**: `admin`
- **Contraseña**: `admin`
- **Permisos**: Acceso completo. Puede ver el catálogo, filtrar juegos, añadir juegos al carrito, añadir nuevos juegos, editar juegos existentes y eliminar juegos.

> ⚠️ **Nota conocida**: Tras añadir un juego nuevo como administrador, es necesario recargar la página para que el nuevo juego aparezca en el catálogo. Esta limitación será corregida en futuras versiones.

### Cliente
- **Usuario**: `cliente`
- **Contraseña**: `cliente`
- **Permisos**: Acceso de solo lectura. Puede ver el catálogo, filtrar por plataforma, consultar el detalle de cada juego y añadir juegos al carrito.

## 📁 Estructura del Proyecto
```
src/
├── app/
│   ├── components/
│   │   ├── carrito/
│   │   ├── game-card/
│   │   ├── game-detail/
│   │   ├── game-form/
│   │   ├── game-list/
│   │   ├── login/
│   │   └── navbar/
│   ├── models/
│   │   ├── carrito.model.ts
│   │   ├── game.model.ts
│   │   └── user.model.ts
│   ├── services/
│   │   ├── auth.ts
│   │   ├── carrito.ts
│   │   └── game.ts
│   ├── app.routes.ts
│   ├── app.ts
│   └── app.config.ts
├── index.html
├── main.ts
└── styles.css
```

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js (v20 o superior)
- npm (v11 o superior)
- Angular CLI (v21)

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>

# Instalar dependencias
npm install
```

### Servidor de Desarrollo
```bash
npm start
```

o
```bash
ng serve
```

Abre el navegador y navega a `http://localhost:4200/`.

## 🔨 Build
```bash
ng build
```

Los artefactos compilados se almacenarán en el directorio `dist/`.

## 📦 Componentes Principales

### Game Card (`game-card`)
Muestra una tarjeta individual con imagen, título, plataforma, precio con descuento y botones de acción según el rol del usuario.

### Game List (`game-list`)
Lista todos los juegos disponibles con filtrado por plataforma (Todos, PC, PS5, Xbox, Switch).

### Game Detail (`game-detail`)
Muestra información detallada de un juego: imagen, descripción, precio, descuento y botón de añadir al carrito.

### Game Form (`game-form`)
Formulario modal para crear o editar juegos. Solo accesible para administradores.

### Carrito (`carrito`)
Panel lateral con los juegos añadidos, cantidades, controles para aumentar/reducir unidades y total de la compra.

### Login (`login`)
Formulario de autenticación con validación de credenciales y control de rol.

### Navbar (`navbar`)
Barra de navegación con filtros de plataforma, acceso al carrito con contador, botón de añadir juego (solo admin) y cierre de sesión.

## 🔌 Servicios

### Game Service (`game.ts`)
Maneja todas las operaciones CRUD contra MockAPI (GET, POST, PUT, DELETE) y gestiona el filtro de plataforma y el estado del formulario mediante RxJS.

### Carrito Service (`carrito.ts`)
Gestiona el estado del carrito: añadir, eliminar, aumentar/reducir cantidad y calcular el total.

### Auth Service (`auth.ts`)
Maneja la autenticación de usuarios, el rol activo y el estado de sesión.

## 📊 Modelos de Datos

### Game Model
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

### Carrito Model
```typescript
interface Carrito {
  game: Game;
  quantity: number;
}
```

## ⚠️ Limitaciones Conocidas

- Tras añadir un juego nuevo, es necesario recargar la página para verlo en el catálogo.
- Los usuarios y credenciales están hardcodeados. En la versión final se conectará a una base de datos real.