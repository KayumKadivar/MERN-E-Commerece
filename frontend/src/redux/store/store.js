import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import { userAuthApi } from '../api/authApi';

const store = configureStore({
    reducer: {
        auth: authReducer,
        [userAuthApi.reducerPath]: userAuthApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userAuthApi.middleware),
});

export default store;