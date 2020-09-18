import {Entity, model, property, hasMany, hasOne, belongsTo} from '@loopback/repository';
import { AttributeValue } from './attribute-value.model';
import { Brand } from './brand.model';
import { Supplier } from './supplier.model';
import { Category } from './category.model';
import {User} from './user.model';

@model(
{
  settings: {
    foreignKeys: {
      fk_category_product: {
        name: 'fk_category_product',
        entity: 'Category',
        entityKey: 'id',
        foreignKey: 'categoryid'
      },
      fk_brand_product: {
        name: 'fk_brand_product',
        entity: 'Brand',
        entityKey: 'id',
        foreignKey: 'brandid'
      },
      fk_supplier_product: {
        name: 'fk_supplier_product',
        entity: 'Supplier',
        entityKey: 'id',
        foreignKey: 'supplierid'
      },
      fk_user_product: {
        name: 'fk_user_product',
        entity: 'User',
        entityKey: 'id',
        foreignKey: 'userid'
      }
    },
  },
}
)
export class Product extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  barcode?: string;

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
  priceNet?: number;

  @property({
    type: 'number',
  })
  priceGross?: number;

  @hasMany(() => AttributeValue)
  attributeValues?: AttributeValue[];

  @belongsTo(() => Brand)
  brandId: number;

  @belongsTo(() => Supplier)
  supplierId: number;

  @belongsTo(() => Category)
  categoryId: number;

  @belongsTo(() => User)
  userId: number;

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
