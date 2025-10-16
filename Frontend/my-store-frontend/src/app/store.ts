import { configureStore } from '@reduxjs/toolkit'
import productsReducer from '../features/products/productsSlice'

export const store = configureStore({
    reducer: {
        products: productsReducer,
    },
})

// (optional) export types for use in hooks
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
