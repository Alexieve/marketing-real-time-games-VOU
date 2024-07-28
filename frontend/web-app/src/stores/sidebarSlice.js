/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit'

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState: {
        sidebarShow: true,
        sidebarUnfoldable: false,
        theme: 'light',
    },
    reducers: {
        setSidebarShow: (state, action) => {
            state.sidebarShow = action.payload
        },
        setSidebarUnfoldable: (state, action) => {
            state.sidebarUnfoldable = action.payload
        },
    },
})

export const sidebarActions = sidebarSlice.actions

export default sidebarSlice.reducer