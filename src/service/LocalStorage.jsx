export const KEY_TOKEN = "token";

export const setToken = (token) => {
  localStorage.setItem(KEY_TOKEN, token);
  // Dispatch event để các component khác biết token đã thay đổi
  window.dispatchEvent(new Event('tokenChanged'));
};

export const getToken = () => {
  return localStorage.getItem(KEY_TOKEN);
};

export const removeToken = () => {
  localStorage.removeItem(KEY_TOKEN);
  // Dispatch event khi xóa token
  window.dispatchEvent(new Event('tokenChanged'));
};