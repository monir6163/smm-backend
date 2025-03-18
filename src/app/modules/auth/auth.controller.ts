import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.register(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User registered successfully',
    data: result,
  });
});

const signin = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.signin(req.body);
  return res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged in successfully',
    data: result.user,
  });
});

export const AuthController = {
  register,
  signin,
};
