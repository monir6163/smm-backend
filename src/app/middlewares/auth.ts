import { NextFunction, Request, Response } from 'express';

import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { AuthError } from '../errors/authError';
import { prisma } from '../lib/prisma';
import { USER_ROLES } from '../modules/auth/user.constant';
import catchAsync from '../utils/catchAsync';

export const auth = (...requiredRoles: (keyof typeof USER_ROLES)[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req?.headers?.authorization?.split(' ')[1];
    if (!token) {
      return AuthError(req, res);
    }

    const decoded = jwt.verify(
      token,
      config.nextauth_secret as string,
    ) as JwtPayload;

    if (!decoded) {
      return AuthError(req, res);
    }

    const { email, role } = decoded;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User is not found !');
    }

    if (!requiredRoles.includes(role)) {
      return AuthError(req, res);
    }

    next();
  });
};
