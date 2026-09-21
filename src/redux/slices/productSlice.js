import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    products: [],
    productsByCategory: [],
    sliders: [],
    unstitchs: [],
    error: null,
    product: null,           // 👈 stitched ke liye
    unstitchProduct: null,   // 👈 NEW — unstitch ke liye
    loading: false,
    cart: 2
}

const ProductSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.loading = true
        },
        setProducts: (state, { payload }) => {
            state.loading = false
            if (payload && Array.isArray(payload.products)) {
                state.products = payload.products
            } else if (Array.isArray(payload)) {
                state.products = payload
            } else {
                state.products = []
            }
        },
        setProductsByCategory: (state, { payload }) => {
            state.loading = false
            if (payload && Array.isArray(payload.products)) {
                state.productsByCategory = payload.products
            } else if (Array.isArray(payload)) {
                state.productsByCategory = payload
            } else {
                state.productsByCategory = []
            }
        },
        setsliders: (state, { payload }) => {
            state.loading = false
            state.sliders = payload
        },
        setProduct: (state, { payload }) => {
            state.loading = false
            state.product = payload
        },
        // 👈 NEW REDUCER
        setUnstitchProduct: (state, { payload }) => {
            state.loading = false
            state.unstitchProduct = payload
        },
        // 👈 RESET REDUCER (optional but useful)
        resetProducts: (state) => {
            state.product = null
            state.unstitchProduct = null
        },
        setError: (state, { payload }) => {
            state.loading = false
            state.error = payload
        },
        setUnstitchs: (state, { payload }) => {
            state.loading = false
            state.unstitchs = payload || [];
        },
    }
})

export const {
    setLoading,
    setProducts,
    setProduct,
    setError,
    setProductsByCategory,
    setsliders,
    setUnstitchs,
    setUnstitchProduct,   // 👈 export karo
    resetProducts         // 👈 export karo
} = ProductSlice.actions

export default ProductSlice.reducer