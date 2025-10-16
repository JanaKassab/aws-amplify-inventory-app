import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios-instance';

// Define the full Product interface to match the data structure
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
    createdAt: string;
    updatedAt: string;
}

// This interface was missing in your last code snippet
interface FilterProductsDto {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
}

// Define the arguments for the createProduct thunk, omitting generated fields
type CreateProductArgs = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

// Define the state structure
interface ProductsState {
    items: Product[];
    currentItem: Product | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    totalInventoryValue: number | null;
    averageProductPrice: number | null;
}

const initialState: ProductsState = {
    items: [],
    currentItem: null,
    status: 'idle',
    error: null,
    totalInventoryValue: null,
    averageProductPrice: null,
};

// --- Async Thunks ---
// The return type of the async function here (e.g., `Promise<Product[]>`)
// will be used to infer the type of `action.payload` in the fulfilled reducer.
export const fetchProducts = createAsyncThunk<Product[]>('products/fetchProducts', async () => {
    const response = await axiosInstance.get('products/FindAll');
    return response.data;
});

export const findProductById = createAsyncThunk<Product, number>(
    'products/findProductById',
    async (id) => {
        const response = await axiosInstance.get(`/products/FindOne/${id}`);
        return response.data;
    }
);

export const createProduct = createAsyncThunk<Product, CreateProductArgs>('products/createProduct', async (product) => {
    const response = await axiosInstance.post('/products/CreateProduct', product);
    return response.data;
});

export const deleteProduct = createAsyncThunk<number, number>('products/deleteProduct', async (id) => {
    await axiosInstance.delete(`/products/DeleteProduct/${id}`);
    return id; // The payload will be the 'id' of the deleted product
});

export const updateProduct = createAsyncThunk<Product, Product>(
    'products/updateProduct',
    async (product) => {
        // --- THE FIX IS HERE ---
        // We use object destructuring to separate the 'id' from the rest of the product data.
        const { id, ...updateData } = product;

        // The 'updateData' object now contains all the product fields EXCEPT for the 'id'.
        // This is the clean payload that the backend's validation DTO expects.
        // The 'id' is used only in the URL, where it belongs.
        const response = await axiosInstance.patch(
            `/products/UpdateProduct/${id}`,
            updateData // Send the object without the 'id' field in the body.
        );

        // The server response should be the full, updated product object.
        return response.data;
    }
);

export const filterProducts = createAsyncThunk<Product[], FilterProductsDto>(
    'products/filterProducts',
    async (filters) => {
        // Axios' `params` property automatically converts the `filters` object
        // into URL query parameters (e.g., ?category=Electronics&minPrice=100)
        const response = await axiosInstance.get('/products/filter', {
            params: filters,
        });
        return response.data;
    }
);

export const findTotalInventoryValue = createAsyncThunk<number>('products/findTotalInventoryValue', async () => {
    const response = await axiosInstance.get('/products/FindTotalInventoryValue');
    return response.data;
});

export const findAverageProductPrice = createAsyncThunk<number>('products/findAverageProductPrice', async () => {
    const response = await axiosInstance.get('/products/FindAverageProductPrice');
    return response.data;
});

export const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearCurrentItem: (state) => {
            state.currentItem = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchProducts
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            // `action.payload` is automatically typed as `Product[]` here
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch products';
            })
            // `action.payload` is automatically typed as `Product`
            .addCase(createProduct.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items.push(action.payload);
            })
            // `action.payload` is automatically typed as `number` (the product ID)
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            })
            // `action.payload` is automatically typed as `number`
            .addCase(findTotalInventoryValue.fulfilled, (state, action) => {
                state.totalInventoryValue = action.payload;
            })
            // `action.payload` is automatically typed as `number`
            .addCase(findAverageProductPrice.fulfilled, (state, action) => {
                state.averageProductPrice = action.payload;
            })
            .addCase(updateProduct.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload; // Update the item in the state
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to update product';
            })
            .addCase(filterProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(filterProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // When filtering is successful, replace the items with the filtered results.
                state.items = action.payload;
            })
            .addCase(filterProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to filter products';
            })
            .addCase(findProductById.pending, (state) => {
                state.status = 'loading';
                state.currentItem = null; // Clear previous item while loading
            })
            .addCase(findProductById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Set the fetched product as the current item
                state.currentItem = action.payload;
            })
            .addCase(findProductById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch product details';
            });
    },
});

export const { clearCurrentItem } = productsSlice.actions;
export default productsSlice.reducer;