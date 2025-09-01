import { Router } from "express";

const route = Router();

route.get("/animes");
route.post("/animes");
route.put("/animes/update/:id");
route.delete("/animes/delete/:id");
route.delete("/animes/delete-all");

const animeRoute = route;

export default animeRoute;
