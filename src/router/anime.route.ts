import { Router } from "express";
import { listAnimes } from "@/controllers/anime/listAnimes.controller";
import { getAnime } from "@/controllers/anime/getAnime.controller";
import { createAnime } from "@/controllers/anime/createAnime.controller";
import { updateAnime } from "@/controllers/anime/updateAnime.controller";
import { deleteAnime } from "@/controllers/anime/deleteAnime.controller";
import { fetchAnimeAi } from "@/controllers/anime/fetchAnimeAi.controller";

const route = Router();

route.get("/anime", listAnimes);
route.get("/anime/ai/search", fetchAnimeAi);
route.get("/anime/:id", getAnime);
route.post("/anime", createAnime);
route.put("/anime/:id", updateAnime);
route.delete("/anime/:id", deleteAnime);

const animeRoute = route;

export default animeRoute;
