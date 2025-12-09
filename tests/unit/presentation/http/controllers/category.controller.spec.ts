import { Request, Response, NextFunction } from 'express';
import { CategoryController } from '../../../../../src/presentation/http/controllers/category.controller';
import { CreateCategoryUseCase } from '../../../../../src/application/use-cases/category/create-category.use-case';
import { GetCategoryByIdUseCase } from '../../../../../src/application/use-cases/category/get-category-by-id.use-case';
import { GetAllCategoriesUseCase } from '../../../../../src/application/use-cases/category/get-all-categories.use-case';
import { DeleteCategoryUseCase } from '../../../../../src/application/use-cases/category/delete-category.use-case';
import { CategoryOutputDTO } from '../../../../../src/application/dtos/category.dto';

describe('CategoryController', () => {
  let categoryController: CategoryController;
  let mockCreateCategoryUseCase: jest.Mocked<CreateCategoryUseCase>;
  let mockGetCategoryByIdUseCase: jest.Mocked<GetCategoryByIdUseCase>;
  let mockGetAllCategoriesUseCase: jest.Mocked<GetAllCategoriesUseCase>;
  let mockDeleteCategoryUseCase: jest.Mocked<DeleteCategoryUseCase>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  const mockCategoryOutput: CategoryOutputDTO = {
    id: 'category-123',
    name: 'Action',
    translatedName: 'Ação',
    targetAudience: 'Shounen',
    description: 'Action category',
  };

  beforeEach(() => {
    mockCreateCategoryUseCase = {
      execute: jest.fn(),
    } as any;

    mockGetCategoryByIdUseCase = {
      execute: jest.fn(),
    } as any;

    mockGetAllCategoriesUseCase = {
      execute: jest.fn(),
    } as any;

    mockDeleteCategoryUseCase = {
      execute: jest.fn(),
    } as any;

    categoryController = new CategoryController(
      mockCreateCategoryUseCase,
      mockGetCategoryByIdUseCase,
      mockGetAllCategoriesUseCase,
      mockDeleteCategoryUseCase,
    );

    mockRequest = {
      body: {},
      params: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a category and return 201', async () => {
      mockRequest.body = {
        name: 'Action',
        translatedName: 'Ação',
        targetAudience: 'Shounen',
        description: 'Action category',
      };

      mockCreateCategoryUseCase.execute.mockResolvedValue(mockCategoryOutput);

      await categoryController.create(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockCreateCategoryUseCase.execute).toHaveBeenCalledWith({
        name: 'Action',
        translatedName: 'Ação',
        targetAudience: 'Shounen',
        description: 'Action category',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCategoryOutput);
    });

    it('should call next with error when create fails', async () => {
      mockRequest.body = {
        name: 'Action',
        translatedName: 'Ação',
        targetAudience: 'Shounen',
        description: 'Action category',
      };

      const error = new Error('Create failed');
      mockCreateCategoryUseCase.execute.mockRejectedValue(error);

      await categoryController.create(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getById', () => {
    it('should get a category by id and return 200', async () => {
      mockRequest.params = { id: 'category-123' };

      mockGetCategoryByIdUseCase.execute.mockResolvedValue(mockCategoryOutput);

      await categoryController.getById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockGetCategoryByIdUseCase.execute).toHaveBeenCalledWith('category-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCategoryOutput);
    });

    it('should call next with error when getById fails', async () => {
      mockRequest.params = { id: 'category-123' };

      const error = new Error('Category not found');
      mockGetCategoryByIdUseCase.execute.mockRejectedValue(error);

      await categoryController.getById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAll', () => {
    it('should get all categories and return 200', async () => {
      const categories = [mockCategoryOutput];
      mockGetAllCategoriesUseCase.execute.mockResolvedValue(categories);

      await categoryController.getAll(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockGetAllCategoriesUseCase.execute).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(categories);
    });

    it('should call next with error when getAll fails', async () => {
      const error = new Error('Failed to get categories');
      mockGetAllCategoriesUseCase.execute.mockRejectedValue(error);

      await categoryController.getAll(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('delete', () => {
    it('should delete a category and return 204', async () => {
      mockRequest.params = { id: 'category-123' };

      mockDeleteCategoryUseCase.execute.mockResolvedValue(undefined);

      await categoryController.delete(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockDeleteCategoryUseCase.execute).toHaveBeenCalledWith('category-123');
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should call next with error when delete fails', async () => {
      mockRequest.params = { id: 'category-123' };

      const error = new Error('Delete failed');
      mockDeleteCategoryUseCase.execute.mockRejectedValue(error);

      await categoryController.delete(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
