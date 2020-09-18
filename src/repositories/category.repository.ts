import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Category, CategoryRelations} from '../models';
import {PsqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';

export class CategoryRepository extends DefaultCrudRepository<
  Category,
  typeof Category.prototype.id,
  CategoryRelations
> {

  public readonly children: HasManyRepositoryFactory<Category, typeof Category.prototype.id>;

  constructor(
    @inject('datasources.psql') dataSource: PsqlDataSource, @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {
    super(Category, dataSource);
    this.children = this.createHasManyRepositoryFactoryFor('children', categoryRepositoryGetter,);
    this.registerInclusionResolver('children', this.children.inclusionResolver);
  }
}
