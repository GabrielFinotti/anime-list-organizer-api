import Anime from "@/domain/entity/anime.entity";
import IAnime, { Status } from "@/domain/interface/anime.interface";

jest.mock("@/domain/value-object/name.vo");
jest.mock("@/domain/value-object/objectId.vo");
jest.mock("@/domain/value-object/releaseDate.vo");
jest.mock("@/domain/value-object/synopsis.vo");

describe("Anime Entity", () => {
  const mockAnimeData: IAnime = {
    id: "anime-123",
    name: "Test Anime",
    synopsis: "A test anime synopsis",
    category: "category-123",
    genres: ["genre-1", "genre-2"],
    typeOfMaterialOrigin: "Manga",
    materialOriginName: "Test Manga",
    releaseDate: new Date("2023-01-01"),
    isAMovie: false,
    derivates: {
      movies: ["Movie 1"],
      ova: ["OVA 1"],
      specials: ["Special 1"],
    },
    lastReleaseSeason: 2,
    lastWatchedSeason: 1,
    lastWatchedEpisode: 12,
    status: "watching" as Status,
  };

  const mockMovieData: IAnime = {
    ...mockAnimeData,
    isAMovie: true,
    derivates: null,
    lastReleaseSeason: null,
    lastWatchedSeason: null,
    lastWatchedEpisode: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    const mockVO = (value: any) => ({ value });

    require("@/domain/value-object/name.vo").default.create = jest.fn().mockImplementation(mockVO);
    require("@/domain/value-object/objectId.vo").default.create = jest.fn().mockImplementation(mockVO);
    require("@/domain/value-object/releaseDate.vo").default.create = jest.fn().mockImplementation(mockVO);
    require("@/domain/value-object/synopsis.vo").default.create = jest.fn().mockImplementation(mockVO);
  });

  describe("create()", () => {
    it("deve criar uma instância válida de Anime", () => {
      const anime = Anime.create(mockAnimeData);

      expect(anime.id).toBe(mockAnimeData.id);
      expect(anime.name).toBe(mockAnimeData.name);
      expect(anime.status).toBe(mockAnimeData.status);
    });

    it("deve criar uma instância válida de filme", () => {
      const movie = Anime.create(mockMovieData);

      expect(movie.id).toBe(mockMovieData.id);
      expect(movie.isAMovie).toBe(true);
      expect(movie.derivates).toBeNull();
    });
  });

  describe("Getters", () => {
    let anime: Anime;

    beforeEach(() => {
      anime = Anime.create(mockAnimeData);
    });

    it("deve retornar valores corretos para todas as propriedades", () => {
      expect(anime.id).toBe(mockAnimeData.id);
      expect(anime.name).toBe(mockAnimeData.name);
      expect(anime.synopsis).toBe(mockAnimeData.synopsis);
      expect(anime.category).toBe(mockAnimeData.category);
      expect(anime.genres).toEqual(mockAnimeData.genres);
      expect(anime.typeOfMaterialOrigin).toBe(mockAnimeData.typeOfMaterialOrigin);
      expect(anime.materialOriginName).toBe(mockAnimeData.materialOriginName);
      expect(anime.releaseDate).toBe(mockAnimeData.releaseDate);
      expect(anime.isAMovie).toBe(mockAnimeData.isAMovie);
      expect(anime.lastReleaseSeason).toBe(mockAnimeData.lastReleaseSeason);
      expect(anime.lastWatchedSeason).toBe(mockAnimeData.lastWatchedSeason);
      expect(anime.lastWatchedEpisode).toBe(mockAnimeData.lastWatchedEpisode);
      expect(anime.status).toBe(mockAnimeData.status);
    });

    it("deve retornar uma cópia defensiva dos arrays", () => {
      const genres = anime.genres;
      genres.push("new-genre");

      expect(anime.genres).toEqual(mockAnimeData.genres);
      expect(anime.genres).not.toContain("new-genre");
    });

    it("deve retornar uma cópia defensiva dos derivates", () => {
      const derivates = anime.derivates;
      if (derivates?.movies) {
        derivates.movies.push("New Movie");
      }

      expect(anime.derivates?.movies).toEqual(mockAnimeData.derivates?.movies);
      expect(anime.derivates?.movies).not.toContain("New Movie");

      expect(derivates).not.toBe(anime.derivates);
    });
  });

  describe("Setters", () => {
    let anime: Anime;

    beforeEach(() => {
      anime = Anime.create(mockAnimeData);
    });

    describe("synopsis", () => {
      it("deve atualizar a sinopse com valor válido", () => {
        const newSynopsis = "Nova sinopse do anime";
        anime.synopsis = newSynopsis;

        expect(anime.synopsis).toBe(newSynopsis);
      });
    });

    describe("category", () => {
      it("deve atualizar a categoria com valor válido", () => {
        const newCategory = "new-category-123";
        anime.category = newCategory;

        expect(anime.category).toBe(newCategory);
      });
    });

    describe("genres", () => {
      it("deve atualizar os gêneros com array válido", () => {
        const newGenres = ["new-genre-1", "new-genre-2"];
        anime.genres = newGenres;

        expect(anime.genres).toEqual(newGenres);
      });
    });
  });

  describe("updateStatus()", () => {
    describe("para séries", () => {
      let anime: Anime;

      beforeEach(() => {
        anime = Anime.create(mockAnimeData);
      });

      it("deve permitir marcar como completed com temporada assistida", () => {
        anime.updateStatus("completed");
        expect(anime.status).toBe("completed");
      });

      it("deve lançar erro ao marcar como completed sem temporada assistida", () => {
        const animeWithoutSeasons = Anime.create({
          ...mockAnimeData,
          lastWatchedSeason: null,
        });

        expect(() => animeWithoutSeasons.updateStatus("completed")).toThrow(
          "É necessário ter assistido pelo menos uma temporada para marcar como completo"
        );
      });

      it("deve lançar erro ao marcar como dropped sem temporada assistida", () => {
        const animeWithoutSeasons = Anime.create({
          ...mockAnimeData,
          lastWatchedSeason: null,
        });

        expect(() => animeWithoutSeasons.updateStatus("dropped")).toThrow(
          "É necessário ter assistido pelo menos uma temporada para marcar como droppado"
        );
      });

      it("deve permitir marcar como watching sem validações extras", () => {
        anime.updateStatus("watching");
        expect(anime.status).toBe("watching");
      });

      it("deve permitir marcar como in list sem validações extras", () => {
        anime.updateStatus("in list");
        expect(anime.status).toBe("in list");
      });

      it("não deve fazer nada se o status for o mesmo", () => {
        anime.updateStatus("watching");
        expect(anime.status).toBe("watching");
      });
    });

    describe("para filmes", () => {
      let movie: Anime;

      beforeEach(() => {
        movie = Anime.create(mockMovieData);
      });

      it("deve permitir marcar filme como completed sem validações", () => {
        movie.updateStatus("completed");
        expect(movie.status).toBe("completed");
      });

      it("deve permitir marcar filme como dropped sem validações", () => {
        movie.updateStatus("dropped");
        expect(movie.status).toBe("dropped");
      });
    });
  });

  describe("updateLastReleaseSeason()", () => {
    let anime: Anime;

    beforeEach(() => {
      anime = Anime.create(mockAnimeData);
    });

    it("deve atualizar temporada de lançamento com valor válido", () => {
      anime.updateLastReleaseSeason(3);
      expect(anime.lastReleaseSeason).toBe(3);
    });

    it("deve lançar erro para valor negativo", () => {
      expect(() => anime.updateLastReleaseSeason(-1)).toThrow(
        "Temporada de lançamento não pode ser negativa"
      );
    });

    it("deve lançar erro ao tentar retroceder temporada", () => {
      expect(() => anime.updateLastReleaseSeason(1)).toThrow(
        "Não é possível retroceder a temporada de lançamento"
      );
    });

    it("não deve fazer nada se o valor for o mesmo", () => {
      anime.updateLastReleaseSeason(2);
      expect(anime.lastReleaseSeason).toBe(2);
    });

    it("deve permitir definir como null", () => {
      anime.updateLastReleaseSeason(null);
      expect(anime.lastReleaseSeason).toBeNull();
    });
  });

  describe("updateLastWatchedSeason()", () => {
    let anime: Anime;

    beforeEach(() => {
      anime = Anime.create(mockAnimeData);
    });

    it("deve atualizar temporada assistida com valor válido", () => {
      anime.updateLastWatchedSeason(2);
      expect(anime.lastWatchedSeason).toBe(2);
    });

    it("deve lançar erro para valor negativo", () => {
      expect(() => anime.updateLastWatchedSeason(-1)).toThrow(
        "Temporada assistida não pode ser negativa"
      );
    });

    it("deve lançar erro ao tentar retroceder temporada", () => {
      expect(() => anime.updateLastWatchedSeason(0)).toThrow(
        "Não é possível retroceder a temporada assistida"
      );
    });

    it("não deve fazer nada se o valor for o mesmo", () => {
      anime.updateLastWatchedSeason(1);
      expect(anime.lastWatchedSeason).toBe(1);
    });

    it("deve permitir definir como null", () => {
      anime.updateStatus("in list");
      anime.updateLastWatchedEpisode(null);
      anime.updateLastWatchedSeason(null);

      expect(anime.lastWatchedSeason).toBeNull();
    });
  });

  describe("updateLastWatchedEpisode()", () => {
    let anime: Anime;

    beforeEach(() => {
      anime = Anime.create(mockAnimeData);
    });

    it("deve atualizar episódio assistido com valor válido", () => {
      anime.updateLastWatchedEpisode(24);
      expect(anime.lastWatchedEpisode).toBe(24);
    });

    it("deve lançar erro para valor negativo", () => {
      expect(() => anime.updateLastWatchedEpisode(-1)).toThrow(
        "Episódio assistido não pode ser negativo"
      );
    });

    it("deve lançar erro ao tentar retroceder episódio", () => {
      expect(() => anime.updateLastWatchedEpisode(10)).toThrow(
        "Não é possível retroceder o episódio assistido"
      );
    });

    it("não deve fazer nada se o valor for o mesmo", () => {
      anime.updateLastWatchedEpisode(12);
      expect(anime.lastWatchedEpisode).toBe(12);
    });

    it("deve permitir definir como null", () => {
      anime.updateLastWatchedEpisode(null);
      expect(anime.lastWatchedEpisode).toBeNull();
    });
  });

  describe("updateDerivates()", () => {
    describe("validações básicas", () => {
      let anime: Anime;

      beforeEach(() => {
        anime = Anime.create(mockAnimeData);
      });

      it("deve atualizar derivates com dados válidos", () => {
        const newDerivates = {
          movies: ["New Movie"],
          ova: ["New OVA"],
          specials: ["New Special"],
        };

        anime.updateDerivates(newDerivates);

        expect(anime.derivates).toEqual({
          movies: ["New Movie"],
          ova: ["New OVA"],
          specials: ["New Special"],
        });
      });

      it("deve permitir definir derivates como null", () => {
        anime.updateDerivates(null);
        expect(anime.derivates).toBeNull();
      });

      it("não deve fazer nada se os derivates forem iguais", () => {
        const sameDerivates = { ...mockAnimeData.derivates };
        anime.updateDerivates(sameDerivates);
      });
    });

    describe("validações de negócio", () => {
      it("deve lançar erro se filme tentar ter OVAs", () => {
        const movie = Anime.create(mockMovieData);

        expect(() =>
          movie.updateDerivates({
            movies: [],
            ova: ["OVA 1"],
            specials: [],
          })
        ).toThrow("Filmes não podem ter OVAs como derivado");
      });

      it("deve lançar erro para nomes vazios", () => {
        const anime = Anime.create(mockAnimeData);

        expect(() =>
          anime.updateDerivates({
            movies: [""],
            ova: [],
            specials: [],
          })
        ).toThrow("Filme derivado na posição 1 não pode estar vazio");
      });

      it("deve lançar erro para nomes muito curtos", () => {
        const anime = Anime.create(mockAnimeData);

        expect(() =>
          anime.updateDerivates({
            movies: ["A"],
            ova: [],
            specials: [],
          })
        ).toThrow('Filme derivado "A" deve ter pelo menos 2 caracteres');
      });

      it("deve lançar erro para nomes muito longos", () => {
        const anime = Anime.create(mockAnimeData);
        const longName = "A".repeat(101);

        expect(() =>
          anime.updateDerivates({
            movies: [longName],
            ova: [],
            specials: [],
          })
        ).toThrow("Filme derivado \"" + longName + "\" deve ter no máximo 100 caracteres");
      });

      it("deve lançar erro para nomes duplicados", () => {
        const anime = Anime.create(mockAnimeData);

        expect(() =>
          anime.updateDerivates({
            movies: ["Same Name"],
            ova: ["Same Name"],
            specials: [],
          })
        ).toThrow("Nomes de derivates devem ser únicos. Duplicados encontrados: Same Name");
      });

      it("deve lançar erro para muitos derivates do mesmo tipo", () => {
        const anime = Anime.create(mockAnimeData);
        const manyMovies = Array.from({ length: 21 }, (_, i) => `Movie ${i + 1}`);

        expect(() =>
          anime.updateDerivates({
            movies: manyMovies,
            ova: [],
            specials: [],
          })
        ).toThrow("Máximo de 20 filmes derivados permitido");
      });
    });
  });

  describe("validateConsistency()", () => {
    it("deve lançar erro se temporada assistida > temporada lançada", () => {
      const invalidAnime = Anime.create({
        ...mockAnimeData,
        lastReleaseSeason: 1,
        lastWatchedSeason: 2,
      });

      expect(() => invalidAnime.updateLastWatchedSeason(3)).toThrow(
        "Não é possível ter assistido uma temporada que ainda não foi lançada"
      );
    });

    it("deve lançar erro se tem episódio mas não temporada assistida", () => {
      const invalidAnime = Anime.create({
        ...mockAnimeData,
        lastWatchedSeason: null,
        lastWatchedEpisode: 5,
      });

      expect(() => invalidAnime.updateLastWatchedEpisode(6)).toThrow(
        "Deve especificar a temporada quando informar episódio assistido"
      );
    });

    it("deve lançar erro se status completed mas sem temporada assistida", () => {
      const invalidAnime = Anime.create({
        ...mockAnimeData,
        lastWatchedSeason: null,
        status: "in list" as Status,
      });

      expect(() => invalidAnime.updateStatus("completed")).toThrow(
        "É necessário ter assistido pelo menos uma temporada para marcar como completo"
      );
    });

    it("deve lançar erro se status watching mas sem temporada assistida", () => {
      const invalidAnime = Anime.create({
        ...mockAnimeData,
        lastWatchedSeason: null,
        lastWatchedEpisode: 5,
        status: "in list" as Status,
      });

      expect(() => invalidAnime.updateStatus("watching")).toThrow(
        "Deve especificar a temporada quando informar episódio assistido"
      );
    });
  });

  describe("Cenários de integração", () => {
    it("deve permitir fluxo completo de assistir um anime", () => {
      const anime = Anime.create({
        ...mockAnimeData,
        lastWatchedSeason: null,
        lastWatchedEpisode: null,
        status: "in list" as Status,
      });

      anime.updateLastWatchedSeason(1);
      anime.updateLastWatchedEpisode(12);

      anime.updateStatus("watching");
      expect(anime.status).toBe("watching");

      anime.updateLastReleaseSeason(2);
      anime.updateLastWatchedSeason(2);
      anime.updateLastWatchedEpisode(15);

      anime.updateStatus("completed");
      expect(anime.status).toBe("completed");
    });

    it("deve permitir adicionar derivates válidos", () => {
      const anime = Anime.create(mockAnimeData);

      const newDerivates = {
        movies: ["Movie 1", "Movie 2"],
        ova: ["OVA 1"],
        specials: ["Special 1", "Special 2"],
      };

      anime.updateDerivates(newDerivates);
      expect(anime.derivates).toEqual(newDerivates);
    });

    it("deve manter consistência após múltiplas operações", () => {
      const anime = Anime.create(mockAnimeData);

      anime.updateLastWatchedSeason(2);
      anime.updateLastWatchedEpisode(24);
      anime.updateStatus("completed");

      expect(anime.lastWatchedSeason).toBe(2);
      expect(anime.lastWatchedEpisode).toBe(24);
      expect(anime.status).toBe("completed");
    });
  });
});
