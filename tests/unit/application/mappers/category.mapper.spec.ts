import Category from '../../../../src/domain/entities/Category.entity';
import CategoryMapper from '../../../../src/application/mappers/category.mapper';

describe('CategoryMapper', () => {
  it('toResponse should map domain to DTO correctly', () => {
    const category = Category.create('Action', 'Action description here');

    const response = CategoryMapper.toResponse(category as any);

    expect(response.id).toBe(category.id.value);
    expect(response.name).toBe(category.name.value);
    expect(response.description).toBe(category.description.value);
  });
});
