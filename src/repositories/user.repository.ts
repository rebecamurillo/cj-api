import {DefaultCrudRepository} from '@loopback/repository';
import {User, UserRelations} from '../models';
import {PsqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  constructor(
    @inject('datasources.psql') dataSource: PsqlDataSource,
  ) {
    super(User, dataSource);
  }
}
