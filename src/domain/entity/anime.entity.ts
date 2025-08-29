import IAnime, { Status } from "../interface/anime.interface";
import Name from "../value-object/name.vo";
import ObjectId from "../value-object/objectId.vo";
import ReleaseDate from "../value-object/releaseDate.vo";
import Synopsis from "../value-object/synopsis.vo";

class Anime {
  private readonly _id: string;
  private readonly _name: string;
  private _synopsis: string;
  private _category: string;
  private _genres: string[];
  private readonly _typeOfMaterialOrigin: string;
  private readonly _materialOriginName: string;
  private readonly _releaseDate: Date;
  private readonly _isAMovie: boolean;
  private _derivates: {
    movies?: string[];
    ova?: string[];
    specials?: string[];
  } | null;
  private _lastReleaseSeason: number | null;
  private _lastWatchedSeason: number | null;
  private _lastWatchedEpisode: number | null;
  private _status: Status = "in list";

  private constructor(data: IAnime) {
    this._id = ObjectId.create(data.id).value;
    this._name = Name.create(data.name).value;
    this._synopsis = Synopsis.create(data.synopsis).value;
    this._category = ObjectId.create(data.category).value;
    this._genres = data.genres.map((genre) => ObjectId.create(genre).value);
    this._typeOfMaterialOrigin = Name.create(data.typeOfMaterialOrigin).value;
    this._materialOriginName = Name.create(data.materialOriginName).value;
    this._releaseDate = ReleaseDate.create(data.releaseDate).value;
    this._isAMovie = data.isAMovie;
    this._derivates = data.derivates
      ? {
          movies: data.derivates.movies?.map(
            (movie) => Name.create(movie).value
          ),
          ova: data.derivates.ova?.map((ova) => Name.create(ova).value),
          specials: data.derivates.specials?.map(
            (special) => Name.create(special).value
          ),
        }
      : null;
    this._lastReleaseSeason = data.lastReleaseSeason;
    this._lastWatchedSeason = data.lastWatchedSeason;
    this._lastWatchedEpisode = data.lastWatchedEpisode;
    this._status = data.status;
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get synopsis() {
    return this._synopsis;
  }
  get category() {
    return this._category;
  }
  get genres() {
    return [...this._genres];
  }
  get typeOfMaterialOrigin() {
    return this._typeOfMaterialOrigin;
  }
  get materialOriginName() {
    return this._materialOriginName;
  }
  get releaseDate() {
    return this._releaseDate;
  }
  get isAMovie() {
    return this._isAMovie;
  }
  get derivates() {
    return this._derivates ? {
      movies: [...(this._derivates.movies || [])],
      ova: [...(this._derivates.ova || [])],
      specials: [...(this._derivates.specials || [])],
    } : null;
  }
  get lastReleaseSeason() {
    return this._lastReleaseSeason;
  }
  get lastWatchedSeason() {
    return this._lastWatchedSeason;
  }
  get lastWatchedEpisode() {
    return this._lastWatchedEpisode;
  }
  get status() {
    return this._status;
  }

  set synopsis(newSynopsis: string) {
    this._synopsis = Synopsis.create(newSynopsis).value;
  }

  set category(newCategory: string) {
    this._category = ObjectId.create(newCategory).value;
  }

  set genres(newGenres: string[]) {
    this._genres = newGenres.map((genre) => ObjectId.create(genre).value);
  }

  static create(data: IAnime) {
    return new Anime(data);
  }

  updateStatus(newStatus: Status) {
    if (newStatus === this._status) return;

    if (newStatus === "completed") {
      if (this._isAMovie) {
        this._status = newStatus;
        return;
      }

      if (!this._lastWatchedSeason || this._lastWatchedSeason <= 0) {
        throw new Error(
          "É necessário ter assistido pelo menos uma temporada para marcar como completo"
        );
      }

      this._status = newStatus;
      return;
    }

    if (newStatus === "dropped") {
      if (
        !this._isAMovie &&
        (!this._lastWatchedSeason || this._lastWatchedSeason <= 0)
      ) {
        throw new Error(
          "É necessário ter assistido pelo menos uma temporada para marcar como droppado"
        );
      }

      this._status = newStatus;
      return;
    }

    this._status = newStatus;

    this.validateConsistency();
  }

  updateLastReleaseSeason(newSeason: number | null) {
    if (newSeason === this._lastReleaseSeason) return;

    if (newSeason !== null && newSeason < 0) {
      throw new Error("Temporada de lançamento não pode ser negativa");
    }

    if (
      this._lastReleaseSeason !== null &&
      newSeason !== null &&
      newSeason < this._lastReleaseSeason
    ) {
      throw new Error("Não é possível retroceder a temporada de lançamento");
    }

    this._lastReleaseSeason = newSeason;

    this.validateConsistency();
  }

  updateLastWatchedSeason(newSeason: number | null) {
    if (newSeason === this._lastWatchedSeason) return;

    if (newSeason !== null && newSeason < 0) {
      throw new Error("Temporada assistida não pode ser negativa");
    }

    if (
      this._lastWatchedSeason !== null &&
      newSeason !== null &&
      newSeason < this._lastWatchedSeason
    ) {
      throw new Error("Não é possível retroceder a temporada assistida");
    }

    this._lastWatchedSeason = newSeason;

    this.validateConsistency();
  }

  updateLastWatchedEpisode(newEpisode: number | null) {
    if (newEpisode === this._lastWatchedEpisode) return;

    if (newEpisode !== null && newEpisode < 0) {
      throw new Error("Episódio assistido não pode ser negativo");
    }

    if (
      this._lastWatchedEpisode !== null &&
      newEpisode !== null &&
      newEpisode < this._lastWatchedEpisode
    ) {
      throw new Error("Não é possível retroceder o episódio assistido");
    }

    this._lastWatchedEpisode = newEpisode;

    this.validateConsistency();
  }

  private validateConsistency(): void {
    if (
      this._lastWatchedSeason &&
      this._lastReleaseSeason &&
      this._lastWatchedSeason > this._lastReleaseSeason
    ) {
      throw new Error(
        "Não é possível ter assistido uma temporada que ainda não foi lançada"
      );
    }

    if (this._lastWatchedEpisode && !this._lastWatchedSeason) {
      throw new Error(
        "Deve especificar a temporada quando informar episódio assistido"
      );
    }

    if (this._lastWatchedEpisode && this._lastWatchedEpisode < 0) {
      throw new Error("Episódio assistido não pode ser negativo");
    }

    if (
      this._status === "completed" &&
      !this._isAMovie &&
      (!this._lastWatchedSeason || this._lastWatchedSeason <= 0)
    ) {
      throw new Error(
        "Anime marcado como completo deve ter pelo menos uma temporada assistida"
      );
    }

    if (
      this._status === "watching" &&
      !this._isAMovie &&
      (!this._lastWatchedSeason || this._lastWatchedSeason <= 0)
    ) {
      throw new Error(
        "Anime marcado como assistindo deve ter pelo menos uma temporada assistida"
      );
    }
  }

  updateDerivates(
    derivateGroup: {
      movies?: string[];
      ova?: string[];
      specials?: string[];
    } | null
  ) {
    if (this.areDerivatesEqual(derivateGroup, this._derivates)) {
      return;
    }

    this.validateDerivates(derivateGroup);

    this._derivates = derivateGroup
      ? {
          movies: derivateGroup.movies?.map(
            (movie) => Name.create(movie).value
          ),
          ova: derivateGroup.ova?.map((ova) => Name.create(ova).value),
          specials: derivateGroup.specials?.map(
            (special) => Name.create(special).value
          ),
        }
      : null;

    this.validateConsistency();
  }

  private areDerivatesEqual(
    a: { movies?: string[]; ova?: string[]; specials?: string[] } | null,
    b: { movies?: string[]; ova?: string[]; specials?: string[] } | null
  ): boolean {
    if (a === b) return true;
    if (!a || !b) return false;

    const arraysEqual = (arr1?: string[], arr2?: string[]): boolean => {
      if (!arr1 && !arr2) return true;
      if (!arr1 || !arr2) return false;
      if (arr1.length !== arr2.length) return false;
      return arr1.every((val, index) => val === arr2[index]);
    };

    return (
      arraysEqual(a.movies, b.movies) &&
      arraysEqual(a.ova, b.ova) &&
      arraysEqual(a.specials, b.specials)
    );
  }

  private validateDerivates(
    derivateGroup: {
      movies?: string[];
      ova?: string[];
      specials?: string[];
    } | null
  ): void {
    if (!derivateGroup) return;

    if (this._isAMovie && derivateGroup.ova && derivateGroup.ova.length > 0) {
      throw new Error("Filmes não podem ter OVAs como derivado");
    }

    const validateNames = (names: string[], type: string) => {
      names.forEach((name, index) => {
        if (!name || name.trim().length === 0) {
          throw new Error(
            `${type} na posição ${index + 1} não pode estar vazio`
          );
        }

        if (name.length < 2) {
          throw new Error(`${type} "${name}" deve ter pelo menos 2 caracteres`);
        }

        if (name.length > 100) {
          throw new Error(
            `${type} "${name}" deve ter no máximo 100 caracteres`
          );
        }
      });
    };

    if (derivateGroup.movies)
      validateNames(derivateGroup.movies, "Filme derivado");
    if (derivateGroup.ova) validateNames(derivateGroup.ova, "OVA derivada");
    if (derivateGroup.specials)
      validateNames(derivateGroup.specials, "Especial derivado");

    const allNames = [
      ...(derivateGroup.movies || []),
      ...(derivateGroup.ova || []),
      ...(derivateGroup.specials || []),
    ];

    const uniqueNames = new Set(allNames);
    
    if (uniqueNames.size !== allNames.length) {

      const duplicates = allNames.filter(
        (name, index) => allNames.indexOf(name) !== index
      );

      throw new Error(
        `Nomes de derivates devem ser únicos. Duplicados encontrados: ${[
          ...new Set(duplicates),
        ].join(", ")}`
      );
    }

    const maxDerivatesPerType = 20;
    if (derivateGroup.movies && derivateGroup.movies.length > maxDerivatesPerType) {
      throw new Error(`Máximo de ${maxDerivatesPerType} filmes derivados permitido`);
    }
    if (derivateGroup.ova && derivateGroup.ova.length > maxDerivatesPerType) {
      throw new Error(`Máximo de ${maxDerivatesPerType} OVAs derivadas permitido`);
    }
    if (derivateGroup.specials && derivateGroup.specials.length > maxDerivatesPerType) {
      throw new Error(`Máximo de ${maxDerivatesPerType} especiais derivados permitido`);
    }
  }
}

export default Anime;
