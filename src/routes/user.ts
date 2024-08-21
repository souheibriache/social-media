import { Router } from 'express';
import userController from '@controllers/userController';
import validateSchema from '@util/validation/validateSchema';
import { createProfileValidation, updateProfileValidation } from '@util/validation/validationSchema';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files to 'public/uploads'
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });
const router = Router();
router.get('/', userController.get);
router.get('/users/:userId', userController.getOneById);
router.post('/', validateSchema(createProfileValidation), upload.single(), userController.create);
router.put('/', validateSchema(updateProfileValidation), upload.single('picture'), userController.update);
router.get('/search', userController.getAll);

export default router;
