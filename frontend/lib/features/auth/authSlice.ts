import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export interface AuthType {
    token: null | string;
    user: any;
    loading: boolean;
    error: null | unknown
}

const initialState: AuthType = {
    token: null,
    user: null,
    loading: false,
    error: null
}

export const userLogin = createAsyncThunk("/login/user", async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, credentials)

        console.log({ reduce: response.data });
        return response.data

    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data.message);
        }
        return rejectWithValue('Something went wrong. Please try again.');
    }
}
)

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(userLogin.pending, (state) => {
            state.token = null;
            state.user = null;
            state.loading = true;
            state.error = null;

        }).addCase(userLogin.fulfilled, (state, action) => {
            state.loading = false;
            state.token = action.payload.accessToken;
            state.user = action.payload.user;
            state.error = null;

        }).addCase(userLogin.rejected, (state, action) => {
            state.loading = false;
            state.token = null;
            state.user = null;
            state.error = action.payload;
        })
    }
})

export const { logout } = authSlice.actions;

export default authSlice.reducer