import { Router } from "express";

const route = Router();

route.get("/anime");
route.get("/anime/:id");
route.post("/anime");
route.put("/anime/:id");
route.delete("/anime/:id");

const animeRoute = route;

export default animeRoute;
