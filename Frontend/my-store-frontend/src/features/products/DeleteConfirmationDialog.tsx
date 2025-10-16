import * as React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

interface DeleteConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    productName: string;
}

export default function DeleteConfirmationDialog({
    open,
    onClose,
    onConfirm,
    productName,
}: DeleteConfirmationDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {`Delete "${productName}"?`}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this product? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onConfirm} autoFocus color="error">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}