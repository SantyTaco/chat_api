import express from "express";
import user from "../controllers/user.js";
import { encode } from "../middlewares/jwt.js";

const router = express.Router();

router
  .post("/sign_up", user.onCreateUser)
  .post("/login", encode, (req, res) => {
    return res.status(200).json({
      success: true,
      authorization: req.authToken,
    });
  });

export default router;
