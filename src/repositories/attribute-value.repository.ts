import {DefaultCrudRepository} from '@loopback/repository';
import {AttributeValue, AttributeValueRelations} from '../models';
import {PsqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class AttributeValueRepository extends DefaultCrudRepository<
  AttributeValue,
  typeof AttributeValue.prototype.id,
  AttributeValueRelations
> {
  constructor(
    @inject('datasources.psql') dataSource: PsqlDataSource,
  ) {
    super(AttributeValue, dataSource);
  }
}
