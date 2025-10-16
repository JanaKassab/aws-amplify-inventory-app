import * as React from 'react';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
} from '@mui/material';

interface AddProductDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

export default function AddProductDialog({ open, onClose, onSubmit }: AddProductDialogProps) {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        // Extract form data and convert to the correct types
        const productData = {
            name: formData.get('name') as string,
            category: formData.get('category') as string,
            price: Number(formData.get('price')),
            quantity: Number(formData.get('quantity')),
            inStock: formData.get('inStock') === 'true',
            description: formData.get('description') as string,
            imageUrl: formData.get('imageUrl') as string,
            tags: (formData.get('tags') as string)
                .split(',')
                .map((tag) => tag.trim())
                .filter(tag => tag), // Filter out empty tags
        };

        onSubmit(productData);
        onClose(); // Close the dialog after submission
    };

    return (
        <Dialog open={open} onClose={onClose}>
            {/* Use a proper form element for submission */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogContent>
                    <TextField required fullWidth margin="dense" name="name" label="Name" autoFocus />
                    <TextField fullWidth margin="dense" name="category" label="Category" />
                    <TextField required fullWidth margin="dense" name="price" label="Price" type="number" />
                    <TextField required fullWidth margin="dense" name="quantity" label="Quantity" type="number" />
                    <TextField required fullWidth margin="dense" name="inStock" label="In Stock (true/false)" helperText="Enter 'true' or 'false'" />
                    <TextField fullWidth margin="dense" name="description" label="Description" multiline rows={3} />
                    <TextField fullWidth margin="dense" name="imageUrl" label="Image URL" />
                    <TextField fullWidth margin="dense" name="tags" label="Tags (comma separated)" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit">Add Product</Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}