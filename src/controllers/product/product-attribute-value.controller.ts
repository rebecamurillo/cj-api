import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Product,
  AttributeValue,
} from '../../models';
import {ProductRepository} from '../../repositories';

export class ProductAttributeValueController {
  constructor(
    @repository(ProductRepository) protected productRepository: ProductRepository,
  ) { }

  @get('/products/{id}/attribute-values', {
    responses: {
      '200': {
        description: 'Array of Product has many AttributeValue',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(AttributeValue)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<AttributeValue>,
  ): Promise<AttributeValue[]> {
    return this.productRepository.attributeValues(id).find(filter);
  }

  @post('/products/{id}/attribute-values', {
    responses: {
      '200': {
        description: 'Product model instance',
        content: {'application/json': {schema: getModelSchemaRef(AttributeValue)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Product.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AttributeValue, {
            title: 'NewAttributeValueInProduct',
            exclude: ['id'],
            optional: ['productId']
          }),
        },
      },
    }) attributeValue: Omit<AttributeValue, 'id'>,
  ): Promise<AttributeValue> {
    return this.productRepository.attributeValues(id).create(attributeValue);
  }

  @patch('/products/{id}/attribute-values', {
    responses: {
      '200': {
        description: 'Product.AttributeValue PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AttributeValue, {partial: true}),
        },
      },
    })
    attributeValue: Partial<AttributeValue>,
    @param.query.object('where', getWhereSchemaFor(AttributeValue)) where?: Where<AttributeValue>,
  ): Promise<Count> {
    return this.productRepository.attributeValues(id).patch(attributeValue, where);
  }

  @del('/products/{id}/attribute-values', {
    responses: {
      '200': {
        description: 'Product.AttributeValue DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(AttributeValue)) where?: Where<AttributeValue>,
  ): Promise<Count> {
    return this.productRepository.attributeValues(id).delete(where);
  }
}
