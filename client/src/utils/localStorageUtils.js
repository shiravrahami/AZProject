export const saveUserToLocalStorage = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUserFromLocalStorage = () => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};
