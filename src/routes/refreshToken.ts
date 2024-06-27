import { Router } from "express";
import refreshTokenController from "@controllers/refreshTokenController";
import verifyRefreshToken from "@util/verifyRefreshToken";

const router = Router();

router.post("/", verifyRefreshToken, refreshTokenController.refreshToken);

// logout
router.delete("/", refreshTokenController.deleteRefreshToken);

export default router;
