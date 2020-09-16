import {Entity, model, property, belongsTo} from '@loopback/repository';
import { Product } from './product.model';
import { Attribute } from './attribute.model';

@model()
export class AttributeValue extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => Attribute)
  attributeId: number;

  @belongsTo(() => Product)
  productId: number;

  @property({
    type: 'string',
    required: true,
  })
  value: string;

  @property({
    type: 'string',
  })
  description?: string;

  constructor(data?: Partial<AttributeValue>) {
    super(data);
  }
}

export interface AttributeValueRelations {
  // describe navigational properties here
}

export type AttributeValueWithRelations = AttributeValue & AttributeValueRelations;
