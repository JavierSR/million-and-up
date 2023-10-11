import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { AppState } from './store'

export interface PageState {
    currentPage: number
}

const initialState: PageState = {
    currentPage: 1
}

export const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
        increasePage(state) {
            state.currentPage = state.currentPage + 1
        },
        decreasePage(state) {
            if(state.currentPage !== 1) {
                state.currentPage = state.currentPage - 1
            }
        }
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.page
            }
        }
    }
})

export const { increasePage, decreasePage } = pageSlice.actions

export const getPage = (state: AppState) => state.page.currentPage

export default pageSlice.reducer