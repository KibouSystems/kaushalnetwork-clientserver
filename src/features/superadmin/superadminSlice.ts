import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

interface SuperadminState {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: SuperadminState = {
  user: null,
  token: localStorage.getItem('admin_token'),
  isAuthenticated: !!localStorage.getItem('admin_token'),
  isLoading: false,
  error: null,
};

export const loginSuperadmin = createAsyncThunk(
  'superadmin/login',
  async (credentials: { username: string; password: string }) => {
    const response = await axiosInstance.post('/admin/login', credentials);
    const { token, user } = response.data;
    
    if (token) {
      localStorage.setItem('admin_token', token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    return { token, user };
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
      localStorage.removeItem('admin_token');
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
