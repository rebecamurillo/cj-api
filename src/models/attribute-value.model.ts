import {Entity, model, property, belongsTo} from '@loopback/repository';
import { Product } from './product.model';
import { Attribute } from './attribute.model';

@model({
  settings: {
    foreignKeys: {
      fk_attribute_attribute_value: {
        name: 'fk_attributevalue_attributeId',
        entity: 'Attribute',
        entityKey: 'id',
        foreignKey: 'attributeid'
      },
      fk_product_attribute_value: {
        name: 'fk_attributevalue_productId',
        entity: 'Product',
        entityKey: 'id',
        foreignKey: 'productid'
      },
    },
  },
})
export class AttributeValue extends Entity {
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
  value: string;

  @property({
    type: 'string',
  })
  description?: string;

  @belongsTo(() => Attribute)
  attributeId: number;

  @belongsTo(() => Product)
  productId: number;

  constructor(data?: Partial<AttributeValue>) {
    super(data);
  }
}

export interface AttributeValueRelations {
  // describe navigational properties here
}

export type AttributeValueWithRelations = AttributeValue & AttributeValueRelations;
