import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Link as RouterLink } from 'react-router-dom';
import ProductFilter from './ProductFilter';
import {
  createProduct,
  fetchProducts,
  deleteProduct,
  updateProduct,
  filterProducts,
} from "./productsSlice";
import AddProductDialog from "./AddProductDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import UpdateProductDialog from "./UpdateProductDialog";
import {
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  Avatar,
  Stack,
  TableContainer,
  Paper,
  IconButton,
  Snackbar,
  Link,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// Define the Product type to be used in state
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

const initialFilterState = {
  category: "",
  minPrice: "",
  maxPrice: "",
  inStock: "all", // Use a string to handle the 'all' option
};

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((s) => s.products);

  // --- DIALOG STATES ---
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);

  // --- STATE FOR SELECTED ITEMS (Consistent Object-based approach) ---
  const [productToDelete, setProductToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [productToUpdate, setProductToUpdate] = useState<Product | null>(null);

  // --- SNACKBAR STATE ---
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  // --- NEW STATE FOR FILTER INPUTS ---
  const [filters, setFilters] = useState(initialFilterState);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // --- NOTIFICATION HANDLER ---
  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // --- ADD PRODUCT HANDLERS ---
  const handleAddProduct = async (productData: any) => {
    try {
      await dispatch(createProduct(productData)).unwrap();
      showSnackbar("Product added successfully!", "success");
      dispatch(fetchProducts()); // Refresh list
    } catch (err) {
      console.error("Failed to add product:", err);
      showSnackbar("Failed to add product.", "error");
    }
  };

  // --- DELETE PRODUCT HANDLERS (Using the productToDelete state object) ---
  const handleDeleteClick = (product: { id: number; name: string }) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      await dispatch(deleteProduct(productToDelete.id)).unwrap();
      showSnackbar("Product deleted successfully!", "success");
    } catch (err) {
      console.error("Failed to delete product:", err);
      showSnackbar("Failed to delete product.", "error");
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  // --- UPDATE PRODUCT HANDLERS ---
  const handleUpdateClick = (product: Product) => {
    setProductToUpdate(product);
    setUpdateDialogOpen(true);
  };

  const handleUpdateSubmit = async (productData: Product) => {
    try {
      await dispatch(updateProduct(productData)).unwrap();
      showSnackbar("Product updated successfully!", "success");
    } catch (err) {
      console.error("Failed to update product:", err);
      showSnackbar("Failed to update product.", "error");
    } finally {
      setUpdateDialogOpen(false);
      setProductToUpdate(null);
    }
  };

  // --- NEW FILTER HANDLERS ---
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    setFilters({
      ...filters,
      [e.target.name as string]: e.target.value,
    });
  };

  const handleApplyFilters = () => {
    // 1. Clean the filter data before sending
    const cleanedFilters: any = {};
    if (filters.category) cleanedFilters.category = filters.category;
    if (filters.minPrice) cleanedFilters.minPrice = Number(filters.minPrice);
    if (filters.maxPrice) cleanedFilters.maxPrice = Number(filters.maxPrice);
    if (filters.inStock !== "all")
      cleanedFilters.inStock = filters.inStock === "true";

    // 2. Dispatch the filter action
    dispatch(filterProducts(cleanedFilters));
  };

  const handleClearFilters = () => {
    setFilters(initialFilterState);
    // Fetch all products again to reset the view
    dispatch(fetchProducts());
  };

  return (
    <Container>


      <ProductFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        onAddProduct={() => setAddDialogOpen(true)}
      />

      {/* --- DIALOGS --- */}
      <AddProductDialog
        open={isAddDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleAddProduct}
      />

      {productToDelete && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          productName={productToDelete.name}
        />
      )}

      <UpdateProductDialog
        open={isUpdateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        onSubmit={handleUpdateSubmit}
        product={productToUpdate}
      />

      {/* --- TABLE & LOADING/ERROR STATES --- */}
      {status === "loading" && <CircularProgress />}
      {status === "failed" && <Alert severity="error">{error}</Alert>}
      {status === "succeeded" && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                {[
                  "Image",
                  "Name",
                  "Category",
                  "Price",
                  "Quantity",
                  "In Stock",
                  "Actions",
                ].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: "bold" }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(items) &&
                items.map((p) => (
                  <TableRow
                    key={p.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      {p.imageUrl ? (
                        <Avatar src={p.imageUrl} alt={p.name} />
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <Link component={RouterLink} to={`/products/${p.id}`} underline="hover">{p.name}</Link></TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>${p.price}</TableCell>
                    <TableCell>{p.quantity}</TableCell>
                    <TableCell>{p.inStock ? "✅" : "❌"}</TableCell>


                    <TableCell>
                      <Stack direction="row" spacing={0}>
                        <IconButton
                          onClick={() => handleUpdateClick(p)}
                          color="primary"
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            handleDeleteClick({ id: p.id, name: p.name })
                          }
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* --- SNACKBAR FOR NOTIFICATIONS --- */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
