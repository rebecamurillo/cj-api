import {Entity, model, property} from '@loopback/repository';

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

  constructor(data?: Partial<Attribute>) {
    super(data);
  }
}

export interface AttributeRelations {
  // describe navigational properties here
}

export type AttributeWithRelations = Attribute & AttributeRelations;
