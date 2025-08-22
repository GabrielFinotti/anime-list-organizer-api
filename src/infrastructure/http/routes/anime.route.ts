import { Router } from "express";
import GetAllDataAnimeController from "@/infrastructure/http/controllers/animes/getAllData.controller";
import GetAnimeDataController from "../controllers/animes/getAnimeData.controller";
import CreateAnimeController from "@/infrastructure/http/controllers/animes/create.controller";
import UpdateAnimeController from "@/infrastructure/http/controllers/animes/update.controller";
import DeleteAnimeController from "@/infrastructure/http/controllers/animes/delete.controller";
import DeleteAllAnimeController from "@/infrastructure/http/controllers/animes/deleteAll.controller";
import { validateObjectId } from "../middlewares/validateObjectId";

const route = Router();

const getAllDataAnimeController = new GetAllDataAnimeController();
const getAnimeDataController = new GetAnimeDataController();
const createAnimeController = new CreateAnimeController();
const updateAnimeController = new UpdateAnimeController();
const deleteAnimeController = new DeleteAnimeController();
const deleteAllAnimeController = new DeleteAllAnimeController();

route.get("/animes", getAllDataAnimeController.handle);
route.get("/animes/:id", validateObjectId, getAnimeDataController.handle);
route.post("/animes", createAnimeController.handle);
route.put("/animes/:id", validateObjectId, updateAnimeController.handle);
route.delete("/animes/:id", validateObjectId, deleteAnimeController.handle);
route.delete("/animes", deleteAllAnimeController.handle);

const animeRoutes = route;

export default animeRoutes;
