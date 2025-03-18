import { NextFunction, Request, Response } from "express";

import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import config from "../config";
import { USER_ROLES } from "../modules/user/user.constant";
import { AuthError } from "../errors/authError";
import { User } from "../modules/user/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";


export const auth = (...requiredRoles: (keyof typeof USER_ROLES)[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req?.headers?.authorization?.split(" ")[1];
        if (!token) {
            return AuthError(req, res);
        }

        const decoded = jwt.verify(
            token,
            config.JWT_ACCRESS_SECRET as string
        ) as JwtPayload;

        if (!decoded) {
            return AuthError(req, res);
        }

        const { email, role } = decoded;

        const user = await User.findOne({ email });

        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, "User is not found !");
        }

        if (!requiredRoles.includes(role)) {
            return AuthError(req, res);
        }

        next();
    });
};