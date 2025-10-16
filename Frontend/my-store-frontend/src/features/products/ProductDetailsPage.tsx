import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { findProductById, clearCurrentItem } from './productsSlice';
import {
    Container,
    Typography,
    CircularProgress,
    Alert,
    Paper,
    Grid,
    Box,
    Chip,
    Stack,
    Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export default function ProductDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentItem: product, status, error } = useAppSelector((s) => s.products);

    useEffect(() => {
        if (id) {
            dispatch(findProductById(Number(id)));
        }

        // Cleanup function to clear the item when the component unmounts
        return () => {
            dispatch(clearCurrentItem());
        };
    }, [id, dispatch]);

    if (status === 'loading') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (status === 'failed') {
        return <Alert severity="error">{error || 'Could not load product details.'}</Alert>;
    }

    if (!product) {
        // This can happen briefly after loading or if an error occurred without a message
        return <Typography>Product not found.</Typography>
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/products')} sx={{ mb: 2 }}>
                Back to Products
            </Button>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={5}>
                        <Box
                            component="img"
                            src={product.imageUrl || 'https://via.placeholder.com/400'}
                            alt={product.name}
                            sx={{ width: '100%', borderRadius: 2, maxHeight: 400, objectFit: 'cover' }}
                        />
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Typography variant="h4" gutterBottom>
                            {product.name}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            {product.category}
                        </Typography>
                        <Typography variant="body1" sx={{ my: 2 }}>
                            {product.description || 'No description available.'}
                        </Typography>
                        <Stack direction="row" spacing={4} sx={{ my: 3 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">PRICE</Typography>
                                <Typography variant="h5">${product.price}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">QUANTITY</Typography>
                                <Typography variant="h5">{product.quantity}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">STATUS</Typography>
                                <Chip
                                    label={product.inStock ? 'In Stock' : 'Out of Stock'}
                                    color={product.inStock ? 'success' : 'error'}
                                />
                            </Box>
                        </Stack>

                        {product.tags && product.tags.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>TAGS</Typography>
                                <Stack direction="row" spacing={1}>
                                    {(typeof product.tags === "string"
                                        ? product.tags.split(",")
                                        : product.tags
                                    ).map((tag, idx) => (
                                        <Chip
                                            key={idx}
                                            label={tag.trim()}
                                            size="small"
                                            sx={{ bgcolor: "lightblue" }}
                                        />
                                    ))}
                                </Stack>
                            </Box>
                        )}
                        <Box sx={{ mt: 4, color: 'text.secondary', fontSize: '0.8rem' }}>
                            <Typography variant="caption">
                                Created: {new Date(product.createdAt).toLocaleString()} | Last Updated: {new Date(product.updatedAt).toLocaleString()}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}