import { Router } from 'express';
import userController from '@controllers/userController';
import validateSchema from '@util/validation/validateSchema';
import { createProfileValidation, updateProfileValidation } from '@util/validation/validationSchema';
const router = Router();

router.get('/', userController.get);
router.post('/', validateSchema(createProfileValidation), userController.create);
router.put('/', validateSchema(updateProfileValidation), userController.update);
router.get('/search', userController.getAll);

export default router;
