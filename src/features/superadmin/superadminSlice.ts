import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';
import Cookies from 'js-cookie';

interface SuperadminState {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialToken = Cookies.get('admin_token') || null;

const initialState: SuperadminState = {
  user: null,
  token: initialToken,
  isAuthenticated: !!initialToken,
  isLoading: false,
  error: null,
};

export const loginSuperadmin = createAsyncThunk(
  'superadmin/login',
  async (credentials: { username: string; password: string }) => {
    try {
      // Log request for debugging
      console.log('Sending request to:', '/admin/login', credentials);
      
      const response = await axiosInstance.post('/admin/login', credentials, {
        baseURL: 'http://localhost:3000/api/v0',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { token, user } = response.data;
      console.log('Login response:', response.data);

      if (token) {
        Cookies.set('admin_token', token, { expires: 7 }); 
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      return { token, user };
    } catch (error: any) {
      console.error('Login error:', error.response || error);
      throw error;
    }
  }
);

export const getSuperadminMe = createAsyncThunk(
  'superadmin/getMe',
  async () => {
    const response = await axiosInstance.get('/admin/me');
    return response.data;
  }
);

const superadminSlice = createSlice({
  name: 'superadmin',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      Cookies.remove('admin_token');
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginSuperadmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginSuperadmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(getSuperadminMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      });
  },
});

export const { logout } = superadminSlice.actions;
export default superadminSlice.reducer;
