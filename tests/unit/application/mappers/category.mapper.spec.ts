import Category from '../../../../src/domain/entities/Category.entity';
import CategoryMapper from '../../../../src/application/mappers/category.mapper';

describe('CategoryMapper', () => {
  it('toPersistence, toDomain and toResponse should work consistently', () => {
    const category = Category.create('Action', 'Action description here');

    const persistence = CategoryMapper.toPersistence(category as any);

    expect(persistence._id).toBe(category.id.value);
    expect(persistence.name).toBe(category.name.value);
    expect(persistence.description).toBe(category.description.value);

    const domainFromDoc = CategoryMapper.toDomain({
      _id: persistence._id,
      name: persistence.name,
      description: persistence.description,
      createdAt: persistence.createdAt,
      updatedAt: persistence.updatedAt,
    });

    expect(domainFromDoc.id.value).toBe(category.id.value);
    expect(domainFromDoc.name.value).toBe(category.name.value);

    const response = CategoryMapper.toResponse(category as any);

    expect(response.id).toBe(category.id.value);
    expect(response.name).toBe(category.name.value);
  });
});
