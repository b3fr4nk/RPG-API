import Express from "express";

import { createCharacter } from "../controllers/characters/characters";

const router = Express.Router();

router.use("/characters", router);

router.post("/create", createCharacter);

export default router;
