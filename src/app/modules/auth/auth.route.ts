import { Router } from 'express';

import { AuthController } from './auth.controller';

const router = Router();

router.post(
  '/signup',
  // validateRequest(UserValidations.userValidationSchema),
  AuthController.register,
);

router.post(
  '/signin',
  //   validateRequest(AuthValidations.signinUserValidationSchema),
  AuthController.signin,
);

router.get(
  '/getuserbyemail/:email',
  // auth('admin'),
  AuthController.getUserByEmail,
);

router.get(
  '/getuserbyid/:id',
  // auth('admin'),
  AuthController.getUserById,
);

export const AuthRoutes = router;
