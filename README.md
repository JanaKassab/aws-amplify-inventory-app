# Mini Inventory Management System

A full-stack inventory management application built with NestJS, React, and AWS Cognito authentication. This system provides complete CRUD operations for product management with advanced features like filtering, search, and secure authentication.

## Features

### Backend (NestJS)
- **RESTful API** with Swagger documentation
- **JWT Authentication** via AWS Cognito
- **PostgreSQL Database** with Prisma ORM
- **Product Management**:
  - Create, Read, Update, Delete (CRUD) operations
  - Advanced filtering and search
  - Inventory value calculations
  - Vector similarity search support
  - Arabic language support
- **Security**: Protected endpoints with JWT guards
- **Testing**: Unit and E2E tests with Jest

### Frontend (React)
- **Modern UI** with Material-UI components
- **State Management** with Redux Toolkit
- **Authentication** via AWS Amplify
- **Features**:
  - Product listing with filtering
  - Product details view
  - Add/Edit/Delete products
  - Real-time search
  - Responsive design
- **Routing** with React Router v7

## Tech Stack

### Backend
- **Framework**: NestJS 11
- **Language**: TypeScript
- **Database**: PostgreSQL (AWS RDS)
- **ORM**: Prisma 6
- **Authentication**: Passport.js + JWT + AWS Cognito
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Validation**: class-validator, class-transformer

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite 7
- **UI Library**: Material-UI (MUI) 7
- **State Management**: Redux Toolkit + RTK Query
- **Routing**: React Router 7
- **Authentication**: AWS Amplify 6
- **Form Handling**: Formik + Yup
- **HTTP Client**: Axios

### Infrastructure
- **Cloud Provider**: AWS
- **Authentication**: AWS Cognito (User Pool ID: `us-east-1_zM5eEuym4`)
- **Database**: PostgreSQL on AWS RDS
- **Region**: us-east-1

## Project Structure

```
mini-inventory/
├── Backend/                    # NestJS API Server
│   ├── src/
│   │   ├── products/          # Product module (CRUD, filtering)
│   │   ├── auth/              # JWT authentication (Cognito integration)
│   │   ├── prisma/            # Prisma service
│   │   └── seeding/           # Database seeding utilities
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── test/                  # E2E tests
│   └── dist/                  # Compiled output
│
├── Frontend/my-store-frontend/ # React Application
│   ├── src/
│   │   ├── features/
│   │   │   └── products/      # Product components (list, details, dialogs)
│   │   ├── components/        # Reusable UI components
│   │   ├── app/               # Redux store configuration
│   │   ├── api/               # API client with Axios interceptors
│   │   ├── routes.tsx         # Route definitions
│   │   └── aws-exports.js     # AWS Amplify configuration
│   └── amplify/               # AWS Amplify backend config
│
├── CLAUDE.md                   # Project documentation for Claude Code
└── README.md                   # This file
```

## Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **PostgreSQL**: v14 or higher (or AWS RDS access)
- **AWS Account**: For Cognito authentication
- **Git**: For version control

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mini-inventory
```

### 2. Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database and Cognito credentials
```

**Environment Variables** (`.env`):
```env
DATABASE_URL=postgresql://username:password@host:5432/database_name

# AWS Cognito Configuration
COGNITO_CLIENT_ID=your-cognito-user-pool-id
COGNITO_ISSUER_URL=https://cognito-idp.us-east-1.amazonaws.com/your-user-pool-id
```

```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# (Optional) Seed the database
npm run seed

# Start development server
npm run start:dev
```

The backend will run on `http://localhost:3000`

API Documentation (Swagger): `http://localhost:3000/api`

### 3. Frontend Setup

```bash
cd Frontend/my-store-frontend

# Install dependencies
npm install

# Configure AWS Amplify (aws-exports.js should already be configured)
# Ensure aws-exports.js contains your Cognito User Pool credentials

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## Database Schema

The application uses PostgreSQL with the `inventory` schema:

```prisma
model Product {
  id                 Int       @id @default(autoincrement())
  name               String
  category           String?
  description        String?
  price              Decimal   @db.Decimal(10, 2)
  quantity           Int
  inStock            Boolean?  @default(true)
  createdAt          DateTime? @default(now())

  // Additional features
  arabic_name        String?
  arabic_description String?
  tags               String?
  imageUrl           String?
  embedding          vector?   # For similarity search
}
```

## API Endpoints

### Public Endpoints (No Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products/FindAll` | Get all products |
| GET | `/products/FindOne/:id` | Get product by ID |
| GET | `/products/filter` | Filter products by query params |
| GET | `/products/FindTotalInventoryValue` | Get total inventory value |
| GET | `/products/FindAverageProductPrice` | Get average product price |
| GET | `/products/GetTopNExpensiveProducts/:N` | Get top N expensive products |
| GET | `/products/GetProductsAddedinLastNDays/:N` | Get recently added products |
| POST | `/products/search-similarity` | Search by name similarity |

### Protected Endpoints (Requires JWT Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products/CreateProduct` | Create a new product |
| PATCH | `/products/UpdateProduct/:id` | Update product by ID |
| DELETE | `/products/DeleteProduct/:id` | Delete product by ID |

### Authentication Flow

1. User signs in via AWS Cognito (frontend)
2. Amplify retrieves JWT ID token
3. Axios interceptor adds token to `Authorization: Bearer <token>` header
4. Backend validates token against Cognito JWKS endpoint
5. Protected endpoints grant access to authenticated users

## Development Commands

### Backend

```bash
# Development
npm run start:dev        # Start with hot-reload
npm run start:debug      # Start with debugging
npm run build           # Build for production
npm run start:prod      # Run production build

# Database
npx prisma generate     # Generate Prisma client
npx prisma db push      # Push schema changes
npx prisma studio       # Open Prisma Studio GUI

# Testing
npm run test            # Run unit tests
npm run test:e2e        # Run E2E tests
npm run test:cov        # Generate coverage report

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format with Prettier
```

### Frontend

```bash
# Development
npm run dev             # Start dev server (Vite)
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
```

## Authentication Setup

This application uses **AWS Amplify** and **AWS Cognito** for authentication.

### AWS Cognito Configuration

- **Region**: us-east-1
- **User Pool ID**: us-east-1_zM5eEuym4
- **App Client ID**: 5b6tqlmpsg8jk978sabi2ovtfu
- **MFA**: Disabled
- **Sign-in Method**: Email
- **Password Policy**: Minimum 8 characters

### User Registration

Users can register through the Amplify UI or AWS Cognito console.

### Token Flow

1. Frontend: User logs in → Amplify retrieves JWT token
2. Frontend: Axios interceptor adds token to all API requests
3. Backend: JWT strategy validates token against Cognito JWKS
4. Backend: Protected routes check for valid token

## Testing

### Backend Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

### Frontend Tests

```bash
npm run test
```

## Deployment

### Backend Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variables on your hosting platform

3. Run production server:
   ```bash
   npm run start:prod
   ```

### Frontend Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to your hosting service (Vercel, Netlify, AWS S3, etc.)

3. Ensure environment variables are configured

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# AWS Cognito
COGNITO_CLIENT_ID=your-user-pool-id
COGNITO_ISSUER_URL=https://cognito-idp.region.amazonaws.com/user-pool-id
```

### Frontend (aws-exports.js)

This file is auto-generated by AWS Amplify CLI and contains:
- User Pool ID
- App Client ID
- Region
- OAuth configuration
- MFA settings

## Security Features

- **JWT Authentication**: All mutation endpoints protected
- **Token Validation**: Real-time validation against AWS Cognito
- **CORS**: Configured for frontend origin
- **Input Validation**: class-validator on all DTOs
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **Environment Variables**: Sensitive credentials in .env files

## Common Issues

### Backend won't start
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Run `npx prisma generate`

### Authentication fails
- Verify Cognito credentials in `.env` and `aws-exports.js`
- Check that `Amplify.configure()` is uncommented in `main.tsx`
- Ensure user exists in Cognito User Pool

### CORS errors
- Verify frontend URL matches CORS config in `Backend/src/main.ts`
- Default: `http://localhost:5173`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the UNLICENSED license.

## Author

Your Name

## Acknowledgments

- NestJS team for the excellent framework
- AWS Amplify for authentication services
- Material-UI for beautiful components
- Prisma for the type-safe ORM

---

**Built with** NestJS, React, TypeScript, PostgreSQL, and AWS Cognito
