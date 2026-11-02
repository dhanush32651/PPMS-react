import { createContext, useContext, useState } from 'react';
import { read, write, remove, uid } from '../utils/localStorage';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read('loggedInUser', null));

  const register = ({ name, email, phone, password, role }) => {
    const users = read('users', []);
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase()))
      return { ok: false, error: 'An account with this email already exists. Please log in instead.' };
    write('users', [...users, { id: uid(), name: name.trim(), email: email.trim(), phone: phone.trim(), password, role }]);
    return { ok: true };
  };

  const login = (email, password, role) => {
    const found = read('users', []).find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found || found.password !== password) return { ok: false, error: 'Incorrect email or password.' };
    if (found.role !== role)
      return { ok: false, error: `This account is registered as ${found.role === 'owner' ? 'an Owner' : 'a Tenant'}. Choose "${found.role === 'owner' ? 'Owner' : 'Tenant'}" in Login As.` };
    const { password: _pw, ...safe } = found;
    write('loggedInUser', safe);
    setUser(safe);
    return { ok: true, user: safe };
  };

  // Only the session is cleared – users, properties etc. stay in Local Storage.
  const logout = () => {
    remove('loggedInUser');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, register, login, logout }}>{children}</AuthContext.Provider>;
}
