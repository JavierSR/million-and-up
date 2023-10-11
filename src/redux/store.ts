import { configureStore, Store } from '@reduxjs/toolkit'
import { pageSlice } from './page'
import { createWrapper } from 'next-redux-wrapper'

const makeStore = () : Store => {
    return configureStore({
        reducer: {
            [pageSlice.name]: pageSlice.reducer,
        },
        devTools: true,
    });
}

export type AppStore = ReturnType<typeof makeStore>

export type AppState = ReturnType<AppStore['getState']>

export const wrapper = createWrapper<AppStore>(makeStore)