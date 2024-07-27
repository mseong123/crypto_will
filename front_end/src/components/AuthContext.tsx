import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  userSpecificData: UserSpecificData | null;
}

export interface UserSpecificData {
  maxEpoch: number;
  privateKey: string;
  randomness: string;
  nonce: string;
}

export const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
	userSpecificData: null,
};

interface AuthPayload {
	token: string;
	user: any;
	userSpecificData: UserSpecificData;
}

interface Action {
	type: 'LOGIN' | 'LOGOUT';
	payload: AuthPayload | null;
}

function authReducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return {
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
		userSpecificData: action.payload.userSpecificData,
      };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load state from sessionStorage
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const user = sessionStorage.getItem('user');
    if (token && user) {
      dispatch({ type: 'LOGIN', payload: { token, user: JSON.parse(user) } });
    }
  }, []);

  // Save state to sessionStorage
  useEffect(() => {
    if (state.token) {
      sessionStorage.setItem('token', state.token);
      sessionStorage.setItem('user', JSON.stringify(state.user));
    } else {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    }
  }, [state.token, state.user]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
