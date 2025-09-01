import { Router } from "express";

const route = Router();

route.post("/category");
route.delete("/category/:id");
route.post("/genre");
route.delete("/genre/:id");

const adminRoute = route;

export default adminRoute;
