/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { comparePassword, hashPassword } from '../../utils/passHelper';
import { TSigninUser, TUser } from './auth.interface';

const register = async (payload: TUser) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This user is already exist !');
  }

  const hashedPassword = await hashPassword(payload.password);

  const result = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
    },
  });

  const { password: _, ...userData } = result;

  return userData;
};

const signin = async (payload: TSigninUser) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload?.email,
    },
  });

  if (!user || !user.password) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  const passwordMatch = await comparePassword(payload.password, user.password);

  if (!passwordMatch) {
    throw new Error('Password not matched');
  }

  const { password, ...userData } = user;
  return { user: userData };
};

const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  const { password: _, ...userData } = user;
  return userData;
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  const { password: _, ...userData } = user;
  return userData;
};

export const AuthServices = { register, signin, getUserByEmail, getUserById };
