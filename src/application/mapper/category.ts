import Category from "../../domain/entity/Category.js";

class CategoryApplicationMapper {
    static toResponse(category: Category) {
        return {
            id: category.id.value,
            name: category.name.value,
            description: category.description.value,
            targetAudience: category.targetAudience.value,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
        }
    }
}

export default CategoryApplicationMapper;