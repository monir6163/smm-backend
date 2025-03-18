import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    },
  );

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
};

// need for prisma error handling
const handlePrismaError = (err: PrismaClientKnownRequestError) => {
  const statusCode = err.code === 'P2002' ? 409 : 400;

  // for more specific error handling you can use the following code
  switch (err.code) {
    case 'P2002':
      return {
        statusCode,
        message: 'Unique constraint failed',
      };
    default:
      return {
        statusCode,
        message: err.message,
      };
  }
};

export { handlePrismaError, handleValidationError };
