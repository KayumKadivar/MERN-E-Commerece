import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import adminAuthReducer from '../slices/adminAuthSlice';
import { userAuthApi } from '../api/authApi';
import { adminAuthApi } from '../api/adminAuthApi';

const store = configureStore({
    reducer: {
        auth: authReducer,
        adminAuth: adminAuthReducer,
        [userAuthApi.reducerPath]: userAuthApi.reducer,
        [adminAuthApi.reducerPath]: adminAuthApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(userAuthApi.middleware)
            .concat(adminAuthApi.middleware),
});

export default store;