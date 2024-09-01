import { Router } from 'express';
import userController from '@controllers/userController';
import validateSchema from '@util/validation/validateSchema';
import { createProfileValidation, updateProfileValidation } from '@util/validation/validationSchema';
import { upload } from '@util/upload';

const router = Router();
router.get('/', userController.get);
router.get('/users/:userId', userController.getOneById);
router.post('/', upload.single('picture'), validateSchema(createProfileValidation), userController.create);
router.put('/', upload.single('picture'), validateSchema(updateProfileValidation), userController.update);
router.get('/search', userController.getAll);

export default router;
