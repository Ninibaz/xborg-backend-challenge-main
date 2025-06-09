import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import cookies from 'js-cookie';
import { User } from '../axios/user/types';

export const SESSION_COOKIE = 'xborg.session';

type UserSessionContextProps = {
  user: User | undefined;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setSessionCookie: (token: string) => void;
  deleteSessionCookie: () => void;
};

interface UserSessionProviderProps {
  children: ReactNode;
}

const UserSessionContext = createContext<UserSessionContextProps>({
  user: undefined,
  isAuthenticated: false,
  setUser: () => undefined,
  setSessionCookie: () => null,
  deleteSessionCookie: () => null,
});

export const useUserSession = () => useContext(UserSessionContext);

export const getSessionCookie = () => {
  return cookies.get(SESSION_COOKIE);
};

export const UserSessionProvider = ({ children }: UserSessionProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    const cookie = getSessionCookie();
    if (cookie) setIsAuthenticated(true);
  });

  const setSessionCookie = (token: string) => {
    cookies.set(SESSION_COOKIE, token);
    setIsAuthenticated(true);
  };

  const deleteSessionCookie = () => {
    cookies.remove(SESSION_COOKIE);
    setUser(undefined);
    setIsAuthenticated(false);
  };

  return (
    <UserSessionContext.Provider
      value={{
        isAuthenticated,
        setSessionCookie,
        deleteSessionCookie,
        user,
        setUser,
      }}
    >
      {children}
    </UserSessionContext.Provider>
  );
};
