import CategoryController from "@/controller/category.controller";
import { Router } from "express";

const route = Router();

route.post("/category", CategoryController.create);
route.delete("/category/:categoryId", CategoryController.delete);
// route.post("/genre", GenreController.create);
// route.delete("/genre/:id", GenreController.delete);

const adminRoute = route;

export default adminRoute;
