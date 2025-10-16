import React, { useState, useEffect } from 'react';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
} from '@mui/material';

// The full Product interface should be available, or defined here
interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
    inStock: boolean;
    description?: string;
    imageUrl?: string;
    tags?: string[];
}

interface UpdateProductDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Product) => void;
    product: Product | null; // The product to edit
}

export default function UpdateProductDialog({ open, onClose, onSubmit, product }: UpdateProductDialogProps) {
    // Internal state to manage form data
    const [formData, setFormData] = useState<any | null>(null);

    // When the 'product' prop changes, update the internal form state.
    useEffect(() => {
        if (product) {
            setFormData({
                ...product,
                tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
            });
        }
    }, [product, open]);

    // Handle changes in any form field
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (formData) {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (formData) {
            // --- CORRECTED LOGIC ---
            // Instead of spreading the entire formData object, we construct a new, clean
            // payload. This prevents sending read-only fields like `createdAt` and `updatedAt`
            // that would be rejected by the backend, causing the 400 error.
            const updatePayload: Product = {
                id: formData.id, // The ID is required to identify the product for update.
                name: formData.name,
                category: formData.category,
                price: Number(formData.price),
                quantity: Number(formData.quantity),
                inStock: String(formData.inStock).toLowerCase() === 'true',
                description: formData.description || '',
                imageUrl: formData.imageUrl || '',
                tags: typeof formData.tags === 'string'
                    ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
                    : [],
            };

            // We now submit the clean payload.
            onSubmit(updatePayload);
        }
        onClose();
    };

    // Don't render if there's no data
    if (!formData) return null;

    return (
        <Dialog open={open} onClose={onClose}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <DialogTitle>Edit Product: {product?.name}</DialogTitle>
                <DialogContent>
                    {/* Form fields remain unchanged */}
                    <TextField name="name" label="Name" value={formData.name} onChange={handleChange} required fullWidth margin="dense" />
                    <TextField name="category" label="Category" value={formData.category} onChange={handleChange} required fullWidth margin="dense" />
                    <TextField name="price" label="Price" type="number" value={formData.price} onChange={handleChange} required fullWidth margin="dense" />
                    <TextField name="quantity" label="Quantity" type="number" value={formData.quantity} onChange={handleChange} required fullWidth margin="dense" />
                    <TextField name="inStock" label="In Stock (true/false)" value={String(formData.inStock)} onChange={handleChange} required fullWidth margin="dense" />
                    <TextField name="description" label="Description" value={formData.description || ''} onChange={handleChange} fullWidth margin="dense" multiline rows={3} />
                    <TextField name="imageUrl" label="Image URL" value={formData.imageUrl || ''} onChange={handleChange} fullWidth margin="dense" />
                    <TextField name="tags" label="Tags (comma separated)" value={formData.tags || ''} onChange={handleChange} fullWidth margin="dense" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}