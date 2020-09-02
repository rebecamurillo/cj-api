import {DefaultCrudRepository} from '@loopback/repository';
import {Classification, ClassificationRelations} from '../models';
import {PsqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ClassificationRepository extends DefaultCrudRepository<
  Classification,
  typeof Classification.prototype.id,
  ClassificationRelations
> {
  constructor(
    @inject('datasources.psql') dataSource: PsqlDataSource,
  ) {
    super(Classification, dataSource);
  }
}
