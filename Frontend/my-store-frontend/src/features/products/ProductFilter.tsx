// src/features/products/ProductFilter.tsx
import React from 'react';
import SearchInput from '../../components/SearchInput';
import {
    Paper,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Box,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

// Define the shape of the filter data
interface FilterState {
    search: string;
    category: string;
    minPrice: string;
    maxPrice: string;
    inStock: string;
}

// Define the props that this component will accept
interface ProductFilterProps {
    filters: FilterState;
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent) => void;
    onApplyFilters: () => void;
    onClearFilters: () => void;
    onAddProduct: () => void;
}

export default function ProductFilter({
    filters,
    onFilterChange,
    onApplyFilters,
    onClearFilters,
    onAddProduct,
}: ProductFilterProps) {
    return (
        // Paper provides the card-like container with a shadow, which is key to a good design
        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="flex-end">

                <Grid item xs={12} sm={6} md={3}>
                    <SearchInput
                        placeholder="Search by name…"
                        name="search"
                        value={filters.search}
                        onChange={onFilterChange}
                    />
                </Grid>


                <Grid item xs={12} sm={6} md={3}>

                    <TextField
                        fullWidth
                        label="Category"
                        name="category"
                        value={filters.category}
                        onChange={onFilterChange}
                        variant="standard" // Standard variant looks clean in filter bars
                    />
                </Grid>
                <Grid item xs={6} sm={3} md={2}>
                    <TextField
                        fullWidth
                        label="Min Price"
                        name="minPrice"
                        type="number"
                        value={filters.minPrice}
                        onChange={onFilterChange}
                        variant="standard"
                    />
                </Grid>
                <Grid item xs={6} sm={3} md={2}>
                    <TextField
                        fullWidth
                        label="Max Price"
                        name="maxPrice"
                        type="number"
                        value={filters.maxPrice}
                        onChange={onFilterChange}
                        variant="standard"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <FormControl fullWidth variant="standard">
                        <InputLabel>Stock Status</InputLabel>
                        <Select
                            name="inStock"
                            label="Stock Status"
                            value={filters.inStock}
                            onChange={onFilterChange}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="true">In Stock</MenuItem>
                            <MenuItem value="false">Out of Stock</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                {/* Box is used to group the buttons together */}
                <Grid item xs={12} md={3}>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start', pt: 2 }}>
                        <Button
                            variant="contained"
                            onClick={onApplyFilters}
                        >
                            Apply Filters
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={onClearFilters}
                        >
                            Clear
                        </Button>


                        <Button
                            variant="contained"
                            color="secondary" // Use the secondary color to make it stand out
                            onClick={onAddProduct}
                        >
                            Add New Product
                        </Button>

                    </Box>
                </Grid>
            </Grid>
        </Paper >
    );
}