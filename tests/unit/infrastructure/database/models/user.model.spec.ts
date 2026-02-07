import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import UserModel from '../../../../../src/infrastructure/database/models/user.model';

describe('UserModel', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
  });

  const validUserData = {
    _id: 'user-123',
    imageUrl: 'https://example.com/avatar.jpg',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword123',
    biography: 'A test user biography',
    animeList: {
      list: [],
      updatedAt: new Date(),
    },
    role: 'user' as const,
  };

  describe('create', () => {
    it('should create a user with valid data', async () => {
      const user = await UserModel.create(validUserData);

      expect(user._id).toBe(validUserData._id);
      expect(user.username).toBe(validUserData.username);
      expect(user.email).toBe(validUserData.email);
      expect(user.password).toBe(validUserData.password);
      expect(user.biography).toBe(validUserData.biography);
      expect(user.role).toBe(validUserData.role);
    });

    it('should create timestamps automatically', async () => {
      const user = (await UserModel.create(validUserData)) as any;

      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should create user with admin role', async () => {
      const adminUser = {
        ...validUserData,
        _id: 'admin-123',
        email: 'admin@example.com',
        role: 'admin' as const,
      };

      const user = await UserModel.create(adminUser);

      expect(user.role).toBe('admin');
    });

    it('should create user with anime list', async () => {
      const userWithAnimeList = {
        ...validUserData,
        _id: 'user-with-list',
        email: 'withlist@example.com',
        animeList: {
          list: [
            {
              anime: 'anime-123',
              status: 'watching' as const,
              moviesStatus: [],
              seasonsStatus: [],
              isLiked: true,
            },
          ],
          updatedAt: new Date(),
        },
      };

      const user = await UserModel.create(userWithAnimeList);

      expect(user.animeList.list).toHaveLength(1);
      expect(user.animeList.list[0].anime).toBe('anime-123');
      expect(user.animeList.list[0].status).toBe('watching');
      expect(user.animeList.list[0].isLiked).toBe(true);
    });

    it('should fail when _id is missing', async () => {
      const invalidData = {
        imageUrl: 'https://example.com/avatar.jpg',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        biography: 'Bio',
        animeList: { list: [], updatedAt: new Date() },
        role: 'user',
      };

      await expect(UserModel.create(invalidData)).rejects.toThrow();
    });

    it('should fail when username is missing', async () => {
      const invalidData = {
        _id: 'user-invalid',
        imageUrl: 'https://example.com/avatar.jpg',
        email: 'test@example.com',
        password: 'password',
        biography: 'Bio',
        animeList: { list: [], updatedAt: new Date() },
        role: 'user',
      };

      await expect(UserModel.create(invalidData)).rejects.toThrow();
    });

    it('should fail when email is missing', async () => {
      const invalidData = {
        _id: 'user-invalid',
        imageUrl: 'https://example.com/avatar.jpg',
        username: 'testuser',
        password: 'password',
        biography: 'Bio',
        animeList: { list: [], updatedAt: new Date() },
        role: 'user',
      };

      await expect(UserModel.create(invalidData)).rejects.toThrow();
    });

    it('should fail when password is missing', async () => {
      const invalidData = {
        _id: 'user-invalid',
        imageUrl: 'https://example.com/avatar.jpg',
        username: 'testuser',
        email: 'test@example.com',
        biography: 'Bio',
        animeList: { list: [], updatedAt: new Date() },
        role: 'user',
      };

      await expect(UserModel.create(invalidData)).rejects.toThrow();
    });

    it('should fail with invalid role', async () => {
      const invalidData = {
        ...validUserData,
        _id: 'user-invalid-role',
        email: 'invalid@example.com',
        role: 'superadmin' as any,
      };

      await expect(UserModel.create(invalidData)).rejects.toThrow();
    });

    it('should enforce unique email', async () => {
      await UserModel.create(validUserData);

      const duplicateData = {
        ...validUserData,
        _id: 'user-duplicate',
      };

      await expect(UserModel.create(duplicateData)).rejects.toThrow();
    });

    it('should enforce unique _id', async () => {
      await UserModel.create(validUserData);

      const duplicateData = {
        ...validUserData,
        email: 'different@example.com',
      };

      await expect(UserModel.create(duplicateData)).rejects.toThrow();
    });
  });

  describe('role enum', () => {
    it('should accept user role', async () => {
      const user = await UserModel.create({
        ...validUserData,
        _id: 'user-role',
        email: 'userrole@example.com',
        role: 'user',
      });

      expect(user.role).toBe('user');
    });

    it('should accept admin role', async () => {
      const user = await UserModel.create({
        ...validUserData,
        _id: 'admin-role',
        email: 'adminrole@example.com',
        role: 'admin',
      });

      expect(user.role).toBe('admin');
    });
  });

  describe('animeList.list status enum', () => {
    const createUserWithAnimeStatus = async (status: string, id: string, email: string) => {
      return UserModel.create({
        ...validUserData,
        _id: id,
        email,
        animeList: {
          list: [
            {
              anime: 'anime-123',
              status,
              moviesStatus: [],
              seasonsStatus: [],
              isLiked: false,
            },
          ],
          updatedAt: new Date(),
        },
      });
    };

    it('should accept watching status', async () => {
      const user = await createUserWithAnimeStatus(
        'watching',
        'user-watching',
        'watching@test.com',
      );
      expect(user.animeList.list[0].status).toBe('watching');
    });

    it('should accept finished status', async () => {
      const user = await createUserWithAnimeStatus(
        'finished',
        'user-finished',
        'finished@test.com',
      );
      expect(user.animeList.list[0].status).toBe('finished');
    });

    it('should accept in_list status', async () => {
      const user = await createUserWithAnimeStatus('in_list', 'user-inlist', 'inlist@test.com');
      expect(user.animeList.list[0].status).toBe('in_list');
    });

    it('should accept dropped status', async () => {
      const user = await createUserWithAnimeStatus('dropped', 'user-dropped', 'dropped@test.com');
      expect(user.animeList.list[0].status).toBe('dropped');
    });

    it('should fail with invalid status', async () => {
      await expect(
        createUserWithAnimeStatus('invalid', 'user-invalid', 'invalid@test.com'),
      ).rejects.toThrow();
    });
  });

  describe('find operations', () => {
    beforeEach(async () => {
      await UserModel.create(validUserData);
    });

    it('should find user by id', async () => {
      const user = await UserModel.findById(validUserData._id);

      expect(user).not.toBeNull();
      expect(user!.username).toBe(validUserData.username);
    });

    it('should find user by email', async () => {
      const user = await UserModel.findOne({ email: validUserData.email });

      expect(user).not.toBeNull();
      expect(user!._id).toBe(validUserData._id);
    });

    it('should find user by username', async () => {
      const user = await UserModel.findOne({ username: validUserData.username });

      expect(user).not.toBeNull();
      expect(user!.email).toBe(validUserData.email);
    });

    it('should find users by role', async () => {
      await UserModel.create({
        ...validUserData,
        _id: 'admin-123',
        email: 'admin@example.com',
        role: 'admin',
      });

      const admins = await UserModel.find({ role: 'admin' });
      const users = await UserModel.find({ role: 'user' });

      expect(admins).toHaveLength(1);
      expect(users).toHaveLength(1);
    });

    it('should return all users', async () => {
      await UserModel.create({
        ...validUserData,
        _id: 'user-456',
        email: 'another@example.com',
      });

      const users = await UserModel.find();

      expect(users).toHaveLength(2);
    });

    it('should return null for non-existent user', async () => {
      const user = await UserModel.findById('non-existent-id');

      expect(user).toBeNull();
    });
  });

  describe('update operations', () => {
    beforeEach(async () => {
      await UserModel.create(validUserData);
    });

    it('should update user fields', async () => {
      await UserModel.updateOne({ _id: validUserData._id }, { biography: 'Updated biography' });

      const user = await UserModel.findById(validUserData._id);
      expect(user!.biography).toBe('Updated biography');
    });

    it('should update username', async () => {
      await UserModel.updateOne({ _id: validUserData._id }, { username: 'newusername' });

      const user = await UserModel.findById(validUserData._id);
      expect(user!.username).toBe('newusername');
    });

    it('should update user role', async () => {
      await UserModel.updateOne({ _id: validUserData._id }, { role: 'admin' });

      const user = await UserModel.findById(validUserData._id);
      expect(user!.role).toBe('admin');
    });

    it('should update anime list', async () => {
      const newAnimeList = {
        list: [
          {
            anime: 'anime-new',
            status: 'watching',
            moviesStatus: [],
            seasonsStatus: [],
            isLiked: true,
          },
        ],
        updatedAt: new Date(),
      };

      await UserModel.updateOne({ _id: validUserData._id }, { animeList: newAnimeList });

      const user = await UserModel.findById(validUserData._id);
      expect(user!.animeList.list).toHaveLength(1);
      expect(user!.animeList.list[0].anime).toBe('anime-new');
    });

    it('should update updatedAt on modification', async () => {
      const original = (await UserModel.findById(validUserData._id)) as any;
      const originalUpdatedAt = original!.updatedAt;

      await new Promise((resolve) => setTimeout(resolve, 100));

      await UserModel.updateOne({ _id: validUserData._id }, { biography: 'New biography' });

      const updated = (await UserModel.findById(validUserData._id)) as any;
      expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('delete operations', () => {
    beforeEach(async () => {
      await UserModel.create(validUserData);
    });

    it('should delete user by id', async () => {
      await UserModel.deleteOne({ _id: validUserData._id });

      const user = await UserModel.findById(validUserData._id);
      expect(user).toBeNull();
    });

    it('should delete all users', async () => {
      await UserModel.create({
        ...validUserData,
        _id: 'user-456',
        email: 'another@example.com',
      });

      await UserModel.deleteMany({});

      const users = await UserModel.find();
      expect(users).toHaveLength(0);
    });
  });

  describe('complex anime list scenarios', () => {
    it('should create user with complex anime status including movies and seasons', async () => {
      const complexUser = {
        ...validUserData,
        _id: 'complex-user',
        email: 'complex@example.com',
        animeList: {
          list: [
            {
              anime: 'anime-123',
              status: 'watching' as const,
              moviesStatus: [
                {
                  movie: { title: 'Movie 1', releaseDate: new Date('2020-01-01') },
                  status: 'finished' as const,
                  isLiked: true,
                },
              ],
              seasonsStatus: [
                {
                  season: {
                    seasonNumber: 1,
                    releaseDate: new Date('2020-01-01'),
                    totalEpisodes: 12,
                  },
                  status: 'watching' as const,
                  lastEpisodeWatched: 6,
                  isLiked: true,
                },
              ],
              isLiked: true,
            },
          ],
          updatedAt: new Date(),
        },
      };

      const user = await UserModel.create(complexUser);

      expect(user.animeList.list[0].moviesStatus).toHaveLength(1);
      expect(user.animeList.list[0].moviesStatus[0].movie.title).toBe('Movie 1');
      expect(user.animeList.list[0].seasonsStatus).toHaveLength(1);
      expect(user.animeList.list[0].seasonsStatus[0].season.seasonNumber).toBe(1);
      expect(user.animeList.list[0].seasonsStatus[0].lastEpisodeWatched).toBe(6);
    });
  });
});
