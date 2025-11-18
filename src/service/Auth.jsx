import axios from 'axios';
import { base } from './Base';

const getErrorMessage = (error, fallbackMessage) =>
  error?.response?.data?.message || fallbackMessage;

export const login = async ({ fullName, password }) => {
  if (!fullName || !password) {
    throw new Error('Vui lòng nhập đầy đủ thông tin đăng nhập');
  }

  try {
    const response = await axios.post(`${base}/auth/token`, { fullName, password });

    if (response.status === 200) {
      const token = response.data?.result?.token;
      if (token) {
        localStorage.setItem('token', token);
      }
    }

    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Đăng nhập thất bại'));
  }
};

export const register = async (formData) => {
  if (!formData) {
    throw new Error('Không có dữ liệu đăng ký');
  }

  try {
    const response = await axios.post(`${base}/users`, formData);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Đăng ký thất bại'));
  }
};

export const logout = async (token) => {
  const currentToken = token || localStorage.getItem('token');
  if (!currentToken) {
    throw new Error('Không tìm thấy token đăng nhập');
  }

  try {
    const response = await axios.post(`${base}/auth/logout`, { token: currentToken });

    if (response.status === 200) {
      localStorage.clear();
    }

    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Đăng xuất thất bại'));
  }
};

const authService = { login, register, logout };

export default authService;

