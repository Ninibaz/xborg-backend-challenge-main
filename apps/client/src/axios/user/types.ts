export interface SignupReq {
  message: string;
  signature: string;
  userName: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginReq {
  message: string;
  signature: string;
}

export interface AuthTokenRes {
  token: string;
}

export interface User {
  id: string;
  address: string;
  email?: string;
  userName?: string;
  profile?: Profile;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  firstName?: string;
  lastName?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}
