import { Prisma } from '@prisma/client';

export const userArgs = {
  select: {
    id: true,
    address: true,
    userName: true,
    email: true,
    profile: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        location: true,
        createdAt: true,
        updatedAt: true,
      },
    },
    createdAt: true,
    updatedAt: true,
  },
};

const userData = Prisma.validator<Prisma.UserArgs>()(userArgs);

export type User = Prisma.UserGetPayload<typeof userData>;
