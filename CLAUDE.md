# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a full-stack inventory management application with:
- **Backend**: NestJS with TypeScript, Prisma ORM, PostgreSQL database
- **Frontend**: React with TypeScript, Vite, Material-UI, Redux Toolkit, React Router
- **Authentication**: JWT-based auth with AWS Amplify support (currently disabled)
- **Database**: PostgreSQL with Prisma schema using `inventory` schema

## Directory Structure

```
Backend/                 # NestJS API server
├── src/
│   ├── products/       # Product CRUD operations
│   ├── auth/           # JWT authentication
│   ├── prisma/         # Prisma service
│   └── seeding/        # Database seeding
├── prisma/             # Database schema and migrations
└── dist/               # Compiled output

Frontend/my-store-frontend/  # React application
├── src/
│   ├── features/       # Feature-based components (products)
│   ├── components/     # Reusable UI components
│   ├── app/            # Redux store configuration
│   └── api/            # API client code
```

## Common Development Commands

### Backend (run from `Backend/` directory)
```bash
# Development
npm run start:dev        # Start in watch mode
npm run start:debug      # Start with debugging
npm run build           # Build for production
npm run start:prod      # Run production build

# Database
npx prisma generate     # Generate Prisma client
npx prisma db push      # Push schema to database
npx prisma studio       # Open Prisma Studio

# Testing
npm run test            # Unit tests
npm run test:e2e        # End-to-end tests
npm run test:cov        # Test coverage

# Code Quality
npm run lint            # ESLint
npm run format          # Prettier formatting
```

### Frontend (run from `Frontend/my-store-frontend/` directory)
```bash
# Development
npm run dev             # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # ESLint
```

## Database Schema

The application uses a PostgreSQL database with the `inventory` schema:
- **Product** model with fields: id, name, category, description, price, quantity, inStock, createdAt
- Supports Arabic translations (arabic_name, arabic_description)
- Vector embeddings support for search functionality
- Tags and image URL support

## Key Technologies & Patterns

### Backend
- **NestJS modules**: ProductsModule, AuthModule with dependency injection
- **Prisma ORM**: Type-safe database client with PostgreSQL
- **JWT Authentication**: Passport-based with JwtStrategy
- **Swagger**: API documentation with @nestjs/swagger
- **Docker**: Containerized deployment ready

### Frontend
- **React Router**: Simple routing with products list and detail pages
- **Redux Toolkit**: State management with RTK Query for API calls
- **Material-UI**: Component library for UI
- **Formik + Yup**: Form handling and validation
- **AWS Amplify**: Configured but currently disabled

## Development Notes

- Backend serves on port 3000 by default
- Frontend development server uses Vite
- Database connection via `DATABASE_URL` environment variable
- TypeScript strict mode enabled on both frontend and backend
- ESLint and Prettier configured for code quality