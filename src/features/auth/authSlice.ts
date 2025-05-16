/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';
import { tokenManager } from '../../utils/tokenManager';
import Cookies from 'js-cookie';

interface AuthState {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: tokenManager.getToken(),
  isAuthenticated: tokenManager.isAuthenticated(),
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { dispatch }) => {
    try {
      const response = await axiosInstance.post('/company-user/login', credentials);
      const { token, user } = response.data;

      if (token) {
        tokenManager.setToken(token);
        // Set admin status in cookie
        Cookies.set('admin_view', user.admin.toString(), { expires: 7 }); // expires in 7 days
        await dispatch(getMe());
      }

      return { token, user };
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  }
);

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/company-user/me');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch user details');
  }
});

export const checkAuth = createAsyncThunk('auth/check', async (_, { dispatch }) => {
  if (tokenManager.isAuthenticated()) {
    await dispatch(getMe());
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  // Clear auth_token cookie
  document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  // Clear admin_view cookie
  Cookies.remove('admin_view');
  // Clear localStorage if needed
  localStorage.removeItem('auth_token');
  return null;
});

// Add a check auth helper
export const checkAuthToken = () => {
  const cookies = document.cookie.split(';');
  const authToken = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
  return !!authToken;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        state.isAuthenticated = false;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export default authSlice.reducer;
