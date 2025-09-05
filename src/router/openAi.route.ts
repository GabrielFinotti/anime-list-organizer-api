import { Router } from "express";
import AnimeLookupController from "@/controller/animeLookup.controller";

const route = Router();

route.get("/anime/lookup", AnimeLookupController.lookup);

const openAiRoute = route;

export default openAiRoute;
