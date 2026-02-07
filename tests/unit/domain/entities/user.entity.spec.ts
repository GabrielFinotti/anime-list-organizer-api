import User from '../../../../src/domain/entities/User.entity';
import Category from '../../../../src/domain/entities/Category.entity';
import Genre from '../../../../src/domain/entities/Genre.entity';
import Anime from '../../../../src/domain/entities/Anime.entity';
import Movie from '../../../../src/domain/value-objects/movie.value-object';
import Season from '../../../../src/domain/value-objects/season.value-object';
import MovieStatus from '../../../../src/domain/value-objects/movieStatus.value-object';
import SeasonStatus from '../../../../src/domain/value-objects/seasonStatus.value-object';

describe('User Entity', () => {
  const defaultUserData = {
    imageUrl: 'http://example.com/avatar.png',
    username: 'john_doe',
    email: 'john.doe@example.com',
    password: 'P@ssw0rd1',
    biography: 'Hello there',
  };

  it('should create a User with default values', () => {
    const user = User.create(defaultUserData);

    expect(user.id).toBeDefined();
    expect(user.role).toBe('user');
    expect(user.animeList.list.length).toBe(0);
    expect(user.favoriteAnimes.length).toBe(0);
  });

  it('should add and remove anime from animeList', () => {
    const user = User.create(defaultUserData);

    const category = Category.create(
      'Action',
      'Action Translated',
      'Shounen',
      'Action description',
    );
    const genre = Genre.create('Adventure', 'Awesome genre', false);
    const movie = Movie.create({ name: 'Movie 1', releaseDate: new Date(2020, 0, 1) });
    const season = Season.create({
      seasonNumber: 1,
      releaseDate: new Date(2020, 0, 1),
      totalEpisodes: 12,
    });

    const anime = Anime.create({
      imageUrl: 'http://example.com/a.png',
      name: 'My Anime',
      synopsis: 'Synopsis long enough',
      category,
      genres: [genre],
      animeType: 'mixed',
      productionType: 'original',
      typeOfMaterialOrigin: 'none',
      movies: [movie],
      seasons: [season],
      isAdultContent: false,
    });

    user.addAnimeToAnimeList(anime);

    expect(user.animeList.list.length).toBe(1);
    const animeStatus = user.animeList.list[0];
    expect(animeStatus.anime.equals(anime)).toBe(true);
    expect(animeStatus.moviesStatus.length).toBe(1);
    expect(animeStatus.seasonsStatus.length).toBe(1);

    // Adding again should throw
    expect(() => user.addAnimeToAnimeList(anime)).toThrow(
      'animeList: anime is already in the list',
    );

    // Remove
    user.removeAnimeFromAnimeList(anime);
    expect(user.animeList.list.length).toBe(0);
    // Removing non existing should throw
    expect(() => user.removeAnimeFromAnimeList(anime)).toThrow(
      'animeList: anime is not in the list',
    );
  });

  it('should add and remove anime from favorites using updateAnimeLikeStatus', () => {
    const user = User.create(defaultUserData);

    const category = Category.create(
      'Action',
      'Action Translated',
      'Shounen',
      'Action description',
    );
    const genre = Genre.create('Adventure', 'Awesome genre', false);
    const anime = Anime.create({
      imageUrl: 'http://example.com/a.png',
      name: 'Fav Anime',
      synopsis: 'Synopsis long enough',
      category,
      genres: [genre],
      animeType: 'serie',
      productionType: 'original',
      typeOfMaterialOrigin: 'none',
      movies: [],
      seasons: [
        Season.create({ seasonNumber: 1, releaseDate: new Date(2020, 0, 1), totalEpisodes: 12 }),
      ],
      isAdultContent: false,
    });

    user.addAnimeToAnimeList(anime);
    user.updateAnimeLikeStatus(anime);
    expect(user.favoriteAnimes.length).toBe(1);
    expect(user.favoriteAnimes[0].equals(anime)).toBe(true);

    // toggling again will remove it from favorites
    user.updateAnimeLikeStatus(anime);
    expect(user.favoriteAnimes.length).toBe(0);

    // toggling an anime not in the list should throw
    const anotherAnime = Anime.create({
      imageUrl: 'http://example.com/a2.png',
      name: 'NotInList',
      synopsis: 'Not in list',
      category,
      genres: [genre],
      animeType: 'serie',
      productionType: 'original',
      typeOfMaterialOrigin: 'none',
      movies: [],
      seasons: [
        Season.create({ seasonNumber: 1, releaseDate: new Date(2021, 0, 1), totalEpisodes: 4 }),
      ],
      isAdultContent: false,
    });

    expect(() => user.updateAnimeLikeStatus(anotherAnime)).toThrow(
      'animeList: anime not found in list',
    );
  });

  it('should update movie and season statuses (and validate belong to anime)', () => {
    const user = User.create(defaultUserData);

    const category = Category.create(
      'Action',
      'Action Translated',
      'Shounen',
      'Action description',
    );
    const genre = Genre.create('Adventure', 'Awesome genre', false);
    const movie = Movie.create({ name: 'Movie 1', releaseDate: new Date(2020, 0, 1) });
    const season = Season.create({
      seasonNumber: 1,
      releaseDate: new Date(2020, 0, 1),
      totalEpisodes: 12,
    });

    const anime = Anime.create({
      imageUrl: 'http://example.com/a.png',
      name: 'My Anime',
      synopsis: 'Synopsis long enough',
      category,
      genres: [genre],
      animeType: 'mixed',
      productionType: 'original',
      typeOfMaterialOrigin: 'none',
      movies: [movie],
      seasons: [season],
      isAdultContent: false,
    });

    user.addAnimeToAnimeList(anime);

    const newMovieStatus = MovieStatus.create({ movie, status: 'finished', isLiked: true });
    user.updateMovieStatus(anime, newMovieStatus);

    const animeStatus = user.animeList.list[0];
    const msIndex = animeStatus.moviesStatus.findIndex((ms) => ms.movie.equals(movie));
    expect(animeStatus.moviesStatus[msIndex].status).toBe('finished');
    expect(animeStatus.moviesStatus[msIndex].isLiked).toBe(true);

    // Trying to update with a movie that doesn't belong
    const anotherMovie = Movie.create({ name: 'Other', releaseDate: new Date(2019, 5, 5) });
    const invalidMovieStatus = MovieStatus.create({
      movie: anotherMovie,
      status: 'watching',
      isLiked: false,
    });
    expect(() => user.updateMovieStatus(anime, invalidMovieStatus)).toThrow(
      'movie: does not belong to the anime',
    );

    // Season update
    const newSeasonStatus = SeasonStatus.create({
      season,
      status: 'watching',
      lastEpisodeWatched: 2,
      isLiked: false,
    });
    user.updateSeasonStatus(anime, newSeasonStatus);
    const updatedAnimeStatus = user.animeList.list[0];
    const ssIndex = updatedAnimeStatus.seasonsStatus.findIndex((ss) => ss.season.equals(season));
    expect(updatedAnimeStatus.seasonsStatus[ssIndex].status).toBe('watching');
    expect(updatedAnimeStatus.seasonsStatus[ssIndex].lastEpisodeWatched).toBe(2);

    const otherSeason = Season.create({
      seasonNumber: 2,
      releaseDate: new Date(2021, 0, 1),
      totalEpisodes: 4,
    });
    const invalidSeasonStatus = SeasonStatus.create({
      season: otherSeason,
      status: 'in_list',
      lastEpisodeWatched: 0,
      isLiked: false,
    });
    expect(() => user.updateSeasonStatus(anime, invalidSeasonStatus)).toThrow(
      'season: does not belong to the anime',
    );
  });

  it('should not allow setting anime status to finished if any movie or season is not finished', () => {
    const user = User.create(defaultUserData);

    const category = Category.create(
      'Action',
      'Action Translated',
      'Shounen',
      'Action description',
    );
    const genre = Genre.create('Adventure', 'Awesome genre', false);
    const movie = Movie.create({ name: 'Movie 1', releaseDate: new Date(2020, 0, 1) });
    const season = Season.create({
      seasonNumber: 1,
      releaseDate: new Date(2020, 0, 1),
      totalEpisodes: 12,
    });

    const anime = Anime.create({
      imageUrl: 'http://example.com/a.png',
      name: 'My Anime',
      synopsis: 'Synopsis long enough',
      category,
      genres: [genre],
      animeType: 'mixed',
      productionType: 'original',
      typeOfMaterialOrigin: 'none',
      movies: [movie],
      seasons: [season],
      isAdultContent: false,
    });

    user.addAnimeToAnimeList(anime);

    // Try to set anime to finished while sub-statuses are still 'in_list'
    expect(() => user.updateAnimeStatus(anime, 'finished')).toThrow(
      'animeList: anime cannot be marked as finished while it has movies or seasons that are not finished',
    );
  });

  it('should allow setting anime status to finished if all movies and seasons are finished', () => {
    const user = User.create(defaultUserData);

    const category = Category.create(
      'Action',
      'Action Translated',
      'Shounen',
      'Action description',
    );
    const genre = Genre.create('Adventure', 'Awesome genre', false);
    const movie = Movie.create({ name: 'Movie 1', releaseDate: new Date(2020, 0, 1) });
    const season = Season.create({
      seasonNumber: 1,
      releaseDate: new Date(2020, 0, 1),
      totalEpisodes: 12,
    });

    const anime = Anime.create({
      imageUrl: 'http://example.com/a.png',
      name: 'My Anime',
      synopsis: 'Synopsis long enough',
      category,
      genres: [genre],
      animeType: 'mixed',
      productionType: 'original',
      typeOfMaterialOrigin: 'none',
      movies: [movie],
      seasons: [season],
      isAdultContent: false,
    });

    user.addAnimeToAnimeList(anime);

    // Set movie and season statuses to finished
    const newMovieStatus = MovieStatus.create({ movie, status: 'finished', isLiked: false });
    user.updateMovieStatus(anime, newMovieStatus);

    const newSeasonStatus = SeasonStatus.create({
      season,
      status: 'finished',
      lastEpisodeWatched: 12,
      isLiked: false,
    });
    user.updateSeasonStatus(anime, newSeasonStatus);

    // Now setting anime status to finished should succeed
    user.updateAnimeStatus(anime, 'finished');
    const animeStatus = user.animeList.list[0];
    expect(animeStatus.status).toBe('finished');
  });

  it('should enforce validation for movie-only animes (no seasons)', () => {
    const user = User.create(defaultUserData);

    const category = Category.create(
      'Action',
      'Action Translated',
      'Shounen',
      'Action description',
    );
    const genre = Genre.create('Adventure', 'Awesome genre', false);
    const movie = Movie.create({ name: 'Movie 1', releaseDate: new Date(2020, 0, 1) });

    const animeMovieOnly = Anime.create({
      imageUrl: 'http://example.com/m.png',
      name: 'Movie Only Anime',
      synopsis: 'Synopsis long enough',
      category,
      genres: [genre],
      animeType: 'movie',
      productionType: 'original',
      typeOfMaterialOrigin: 'none',
      movies: [movie],
      seasons: [],
      isAdultContent: false,
    });

    user.addAnimeToAnimeList(animeMovieOnly);

    // movie is still in_list -> cannot set anime to finished
    expect(() => user.updateAnimeStatus(animeMovieOnly, 'finished')).toThrow(
      'animeList: anime cannot be marked as finished while it has movies or seasons that are not finished',
    );

    // Mark movie as finished
    const finishedMovieStatus = MovieStatus.create({ movie, status: 'finished', isLiked: false });
    user.updateMovieStatus(animeMovieOnly, finishedMovieStatus);

    // Now should succeed
    user.updateAnimeStatus(animeMovieOnly, 'finished');
    const ms = user.animeList.list.find((s) => s.anime.equals(animeMovieOnly));
    expect(ms?.status).toBe('finished');
  });

  it('should enforce validation for series-only animes (no movies)', () => {
    const user = User.create(defaultUserData);

    const category = Category.create(
      'Action',
      'Action Translated',
      'Shounen',
      'Action description',
    );
    const genre = Genre.create('Adventure', 'Awesome genre', false);
    const season = Season.create({
      seasonNumber: 1,
      releaseDate: new Date(2020, 0, 1),
      totalEpisodes: 12,
    });

    const animeSeriesOnly = Anime.create({
      imageUrl: 'http://example.com/s.png',
      name: 'Series Only Anime',
      synopsis: 'Synopsis long enough',
      category,
      genres: [genre],
      animeType: 'serie',
      productionType: 'original',
      typeOfMaterialOrigin: 'none',
      movies: [],
      seasons: [season],
      isAdultContent: false,
    });

    user.addAnimeToAnimeList(animeSeriesOnly);

    // season is still in_list -> cannot set anime to finished
    expect(() => user.updateAnimeStatus(animeSeriesOnly, 'finished')).toThrow(
      'animeList: anime cannot be marked as finished while it has movies or seasons that are not finished',
    );

    // Mark season as finished
    const finishedSeasonStatus = SeasonStatus.create({
      season,
      status: 'finished',
      lastEpisodeWatched: 12,
      isLiked: false,
    });
    user.updateSeasonStatus(animeSeriesOnly, finishedSeasonStatus);

    // Now should succeed
    user.updateAnimeStatus(animeSeriesOnly, 'finished');
    const ss = user.animeList.list.find((s) => s.anime.equals(animeSeriesOnly));
    expect(ss?.status).toBe('finished');
  });

  it('should update profile image and common info', () => {
    const user = User.create(defaultUserData);
    const newImage = 'http://example.com/another.png';
    user.updateProfileImage(newImage);

    expect(user.imageUrl.value).toBe(newImage);

    user.updateCommonInfo({
      username: 'new',
      email: 'a@b.com',
      password: 'Aa1!bb',
      biography: 'New biography here',
    });
    expect(user.username.value).toBe('new');
    expect(user.email.value).toBe('a@b.com');
    expect(user.biography.value).toBe('New biography here');
  });

  it('toDomain should reconstruct a User from a persistence-like object', () => {
    const user = User.create(defaultUserData);

    const doc = {
      id: user.id.value,
      imageUrl: user.imageUrl.value,
      username: user.username.value,
      email: user.email.value,
      password: user.password.value,
      biography: user.biography.value,
      animeList: user.animeList,
      favoriteAnimes: user.favoriteAnimes,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as any;

    const reconstructed = User.toDomain(doc);

    expect(reconstructed).toBeDefined();
    expect(reconstructed.id.value).toBe(user.id.value);
    expect(reconstructed.imageUrl.value).toBe(user.imageUrl.value);
    expect(reconstructed.username.value).toBe(user.username.value);
    expect(reconstructed.email.value).toBe(user.email.value);
    expect(reconstructed.biography.value).toBe(user.biography.value);
    expect(reconstructed.role).toBe(user.role);
  });
});
