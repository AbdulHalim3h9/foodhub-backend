import express, { Router } from 'express';
import { userController } from './user.controller';
import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

router.get(
    "/me",
    auth(UserRole.CUSTOMER, UserRole.PROVIDER, UserRole.ADMIN),
    userController.getMyProfile
)
router.put(
    "/me",
    auth(UserRole.CUSTOMER, UserRole.PROVIDER, UserRole.ADMIN),
    userController.updateProfile
)
//add admin approval
router.post(
    "/apply-provider",
    auth(UserRole.CUSTOMER),
    userController.applyForProvider
)

//update profile, password



export const userRouter: Router = router;
