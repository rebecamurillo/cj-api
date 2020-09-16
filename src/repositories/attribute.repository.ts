import {DefaultCrudRepository} from '@loopback/repository';
import {Attribute, AttributeRelations} from '../models';
import {PsqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class AttributeRepository extends DefaultCrudRepository<
  Attribute,
  typeof Attribute.prototype.id,
  AttributeRelations
> {
  constructor(
    @inject('datasources.psql') dataSource: PsqlDataSource,
  ) {
    super(Attribute, dataSource);
  }
}
