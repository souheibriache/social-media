import { Router } from "express";
import userController from "@controllers/userController";
import verifyAccessToken from "@util/verifyAccessToken";
import validateSchema from "@util/validateSchema";
import { createProfileValidation } from "@util/validationSchema";
const router = Router();

router.get("/", verifyAccessToken, userController.get);
router.post(
  "/",
  verifyAccessToken,
  validateSchema(createProfileValidation),
  userController.create
);

export default router;
