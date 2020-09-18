import {Entity, model, property, hasMany} from '@loopback/repository';

@model()
export class Category extends Entity {
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
  })
  parentId?: number;  
  
  @hasMany(() => Category, {keyTo: 'parentId'})
  children: Category[];

  @property({
    type: 'string'
  })
  level?: string;

  @property({
    type: 'string'
  })
  levelSorted?: string;

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

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  // describe navigational properties here
}

export type CategoryWithRelations = Category & CategoryRelations;
