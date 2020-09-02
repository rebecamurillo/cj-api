import {Entity, model, property, hasMany} from '@loopback/repository';

@model()
export class Classification extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'number',
    default: 0,
  })
  parentId?: number;

  @property({
    type: 'date',
    default: new Date(),
  })
  createdAt?: Date;

  @property({
    type: 'date',
    default: new Date,
  })
  updatedAt?: Date;

  @hasMany(() => Classification, {keyTo: 'parentId'})
  children?: Classification[];

  constructor(data?: Partial<Classification>) {
    super(data);
  }
}

export interface ClassificationRelations {
  // describe navigational properties here
}

export type ClassificationWithRelations = Classification & ClassificationRelations;
