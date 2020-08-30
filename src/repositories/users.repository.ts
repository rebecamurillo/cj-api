import {DefaultCrudRepository} from '@loopback/repository';
import {Users, UserRelations} from '../models';
import {PsqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UsersRepository extends DefaultCrudRepository<
  Users,
  typeof Users.prototype.id,
  UserRelations
> {
  constructor(
    @inject('datasources.psql') dataSource: PsqlDataSource,
  ) {
    super(Users, dataSource);
  }
}
