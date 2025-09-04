import CategoryController from "@/controller/category.controller";
import { Router } from "express";

const route = Router();

// route.get("/animes");
// route.post("/animes");
// route.put("/animes/update/:animeId");
// route.delete("/animes/delete/:animeId");
// route.delete("/animes/delete-all");

route.get("/categories", CategoryController.getAll);
// route.get("/genres", GenreController.getAll);

const animeRoute = route;

export default animeRoute;
