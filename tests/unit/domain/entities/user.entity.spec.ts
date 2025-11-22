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
    expect(user.favoriteAnimes.list.length).toBe(0);
  });

  it('should add and remove anime from animeList', () => {
    const user = User.create(defaultUserData);

    const category = Category.create('Action', 'Action description');
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
    expect(() => user.addAnimeToAnimeList(anime)).toThrow('Anime is already in the anime list');

    // Remove
    user.removeAnimeFromAnimeList(anime);
    expect(user.animeList.list.length).toBe(0);
    // Removing non existing should throw
    expect(() => user.removeAnimeFromAnimeList(anime)).toThrow('Anime is not in the anime list');
  });

  it('should add and remove anime from favorites', () => {
    const user = User.create(defaultUserData);

    const category = Category.create('Action', 'Action description');
    const genre = Genre.create('Adventure', 'Awesome genre', false);
    const anime = Anime.create({
      imageUrl: 'http://example.com/a.png',
      name: 'Fav Anime',
      synopsis: 'Synopsis long enough',
      category,
      genres: [genre],
      animeType: 'serie',
      productionType: 'original',
      movies: [],
      seasons: [
        Season.create({ seasonNumber: 1, releaseDate: new Date(2020, 0, 1), totalEpisodes: 12 }),
      ],
      isAdultContent: false,
    });

    user.addAnimeToFavorites(anime);
    expect(user.favoriteAnimes.list.length).toBe(1);
    expect(user.favoriteAnimes.list[0].equals(anime)).toBe(true);

    expect(() => user.addAnimeToFavorites(anime)).toThrow('Anime is already in favorites');

    user.removeAnimeFromFavorites(anime);
    expect(user.favoriteAnimes.list.length).toBe(0);
    expect(() => user.removeAnimeFromFavorites(anime)).toThrow('Anime is not in favorites');
  });

  it('should update movie and season statuses (and validate belong to anime)', () => {
    const user = User.create(defaultUserData);

    const category = Category.create('Action', 'Action description');
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
      'Movie does not belong to the anime',
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
      'Season does not belong to the anime',
    );
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
});
