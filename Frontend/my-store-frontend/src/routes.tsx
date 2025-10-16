// src/routes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import ProductsPage from './features/products/ProductsPage';
import ProductDetailsPage from './features/products/ProductDetailsPage';

export default function AppRoutes() {
    return (
        <Routes>
            {/* 
              --- NO NESTING ---
              Each route is a top-level entry. The router will match ONLY ONE.
            */}

            {/* 
              This route matches the exact path "/products" and renders ONLY the list page.
            */}
            <Route path="/products" element={<ProductsPage />} />

            {/* 
              This route matches "/products/:id" and renders ONLY the details page.
              There is no longer a parent rendering at the same time.
            */}
            <Route path="/products/:id" element={<ProductDetailsPage />} />

            {/* 
              A default route to redirect users from "/" to your main product list.
            */}
            <Route path="/" element={<Navigate to="/products" replace />} />

        </Routes>
    );
}