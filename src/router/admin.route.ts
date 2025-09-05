import CategoryController from "@/controller/category.controller";
import GenreController from "@/controller/genre.controller";
import AdultGenreController from "@/controller/adultGenre.controller";
import { Router } from "express";

const route = Router();

route.post("/category", CategoryController.create);
route.delete("/category/:categoryId", CategoryController.delete);
route.post("/genre", GenreController.create);
route.delete("/genre/:genreId", GenreController.delete);
route.post("/adult-genre", AdultGenreController.create);
route.delete("/adult-genre/:adultGenreId", AdultGenreController.delete);

const adminRoute = route;

export default adminRoute;
