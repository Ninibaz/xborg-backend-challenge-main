import { SignUpDTO } from 'lib-server';

import { User } from '../../prisma/types/user.types';

export const mockUser: User = {
  id: 'uuid',
  userName: 'johndoe',
  address: 'someethaddress',
  email: 'johndoe@gmail.com',
  profile: {
    id: 'uuid',
    firstName: 'John',
    lastName: 'Doe',
    location: 'location',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockCreateUser = {
  address: 'ethaddress',
  userName: 'johndoe',
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@gmail.com',
};

export const mockSignupRequest: SignUpDTO = {
  address: 'address',
  userName: 'userName',
  email: 'email',
  firstName: 'firstName',
  lastName: 'lastName',
};
