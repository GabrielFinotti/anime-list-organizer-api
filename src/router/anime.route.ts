import CategoryController from "@/controller/category.controller";
import GenreController from "@/controller/genre.controller";
import AdultGenreController from "@/controller/adultGenre.controller";
import { Router } from "express";
import AnimeController from "@/controller/anime.controller";

const route = Router();

route.get("/animes", AnimeController.getByQuery);
route.get("/animes/:animeId", AnimeController.getData);
route.get("/animes/category/:category", AnimeController.getAnimeByCategory);
route.get("/animes/genre/:genre", AnimeController.getAnimeByGenre);
route.get(
  "/animes/adult-genre/:adultGenre",
  AnimeController.getAnimeByAdultGenre
);
route.post("/animes", AnimeController.create);
route.put("/anime/update/:animeId", AnimeController.update);
route.delete("/anime/delete/:animeId", AnimeController.delete);
route.delete("/animes/delete-all", AnimeController.deleteAll);

route.get("/categories", CategoryController.getAll);
route.get("/genres", GenreController.getAll);
route.get("/adult-genres", AdultGenreController.getAll);

const animeRoute = route;

export default animeRoute;
