import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {Product, ProductRelations, AttributeValue, Brand, Supplier, Category, User} from '../models';
import {PsqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {AttributeValueRepository} from './attribute-value.repository';
import {BrandRepository} from './brand.repository';
import {SupplierRepository} from './supplier.repository';
import {CategoryRepository} from './category.repository';
import {UserRepository} from './user.repository';

export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.id,
  ProductRelations
> {

  public readonly attributeValues: HasManyRepositoryFactory<AttributeValue, typeof Product.prototype.id>;

  public readonly brand: BelongsToAccessor<Brand, typeof Product.prototype.id>;

  public readonly supplier: BelongsToAccessor<Supplier, typeof Product.prototype.id>;

  public readonly category: BelongsToAccessor<Category, typeof Product.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof Product.prototype.id>;

  constructor(
    @inject('datasources.psql') dataSource: PsqlDataSource, @repository.getter('AttributeValueRepository') protected attributeValueRepositoryGetter: Getter<AttributeValueRepository>, @repository.getter('BrandRepository') protected brandRepositoryGetter: Getter<BrandRepository>, @repository.getter('SupplierRepository') protected supplierRepositoryGetter: Getter<SupplierRepository>, @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Product, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter,);
    this.registerInclusionResolver('category', this.category.inclusionResolver);
    this.supplier = this.createBelongsToAccessorFor('supplier', supplierRepositoryGetter,);
    this.registerInclusionResolver('supplier', this.supplier.inclusionResolver);
    this.brand = this.createBelongsToAccessorFor('brand', brandRepositoryGetter,);
    this.registerInclusionResolver('brand', this.brand.inclusionResolver);
    this.attributeValues = this.createHasManyRepositoryFactoryFor('attributeValues', attributeValueRepositoryGetter,);
    this.registerInclusionResolver('attributeValues', this.attributeValues.inclusionResolver);
 }
}
