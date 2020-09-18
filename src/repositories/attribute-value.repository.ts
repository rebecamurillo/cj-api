import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {AttributeValue, AttributeValueRelations, Attribute, Product} from '../models';
import {PsqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {AttributeRepository} from './attribute.repository';
import {ProductRepository} from './product.repository';

export class AttributeValueRepository extends DefaultCrudRepository<
  AttributeValue,
  typeof AttributeValue.prototype.id,
  AttributeValueRelations
> {

  public readonly attribute: BelongsToAccessor<Attribute, typeof AttributeValue.prototype.id>;

  public readonly product: BelongsToAccessor<Product, typeof AttributeValue.prototype.id>;

  constructor(
    @inject('datasources.psql') dataSource: PsqlDataSource, @repository.getter('AttributeRepository') protected attributeRepositoryGetter: Getter<AttributeRepository>, @repository.getter('ProductRepository') protected productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(AttributeValue, dataSource);
    this.product = this.createBelongsToAccessorFor('product', productRepositoryGetter,);
    this.registerInclusionResolver('product', this.product.inclusionResolver);
    this.attribute = this.createBelongsToAccessorFor('attribute', attributeRepositoryGetter,);
    this.registerInclusionResolver('attribute', this.attribute.inclusionResolver);
  }
}
