import {Entity, model, property, hasMany} from '@loopback/repository';
import { AttributeValue } from './attribute-value.model';

@model()
export class Attribute extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'string',
  })
  description?: string;

  @hasMany(() => AttributeValue)
  orders?: AttributeValue[];

  constructor(data?: Partial<Attribute>) {
    super(data);
  }
}

export interface AttributeRelations {
  // describe navigational properties here
}

export type AttributeWithRelations = Attribute & AttributeRelations;
