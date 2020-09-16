import {Entity, model, property, hasMany, hasOne} from '@loopback/repository';
import { AttributeValue } from './attribute-value.model';
import { Brand } from './brand.model';
import { Supplier } from './supplier.model';
import { Category } from './category.model';

@model()
export class Product extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @hasOne(() => Category)
  categoryid?: number;

  @property({
    type: 'number',
  })
  barcode?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  description?: string;

  @hasOne(() => Brand)
  brandId?: number;

  @hasOne(() => Supplier)
  supplierId?: number;

  @property({
    type: 'number',
  })
  price_net?: number;

  @property({
    type: 'number',
  })
  price_gross?: number;

  @hasMany(() => AttributeValue)
  attributes?: AttributeValue[];

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
