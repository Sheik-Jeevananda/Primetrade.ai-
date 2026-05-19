import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/dashboard",protect,adminOnly, (req, res) => {
    res.json({
      message: "Welcome Admin",
    });
  }
);

export default router;