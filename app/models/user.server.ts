import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

interface IGetUserByEmailOrCreate {
  email: User["email"];
  refreshToken?: string;
  accessToken: string;
}

export async function getUserByEmailOrCreate({
  email,
  refreshToken,
  accessToken,
}: IGetUserByEmailOrCreate): Promise<User> {
  const userWithToken = await prisma.user.findUnique({
    where: { email },
    include: { token: true },
  });
  if (userWithToken) {
    const { token, ...user } = userWithToken;
    const updateOrCreate = {
      ...(refreshToken && { refresh: refreshToken }),
      access: accessToken,
    };
    await prisma.user.update({
      where: { id: user.id },
      data: {
        token: {
          ...(token ? { update: updateOrCreate } : { create: updateOrCreate }),
        },
      },
    });

    return user;
  }
  return prisma.user.create({ data: { email } });
}

interface ICreateUser {
  email: User["email"];
  password: string;
  refreshToken?: string;
  accessToken?: string;
}

export async function createUser({
  email,
  password,
  refreshToken,
  accessToken,
}: ICreateUser) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      ...(accessToken && {
        token: {
          create: {
            ...(refreshToken && { refresh: refreshToken }),
            access: accessToken,
          },
        },
      }),
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: { password: true },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
