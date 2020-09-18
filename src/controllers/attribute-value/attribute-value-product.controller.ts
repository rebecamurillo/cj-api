import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  AttributeValue,
  Product,
} from '../../models';
import {AttributeValueRepository} from '../../repositories';

export class AttributeValueProductController {
  constructor(
    @repository(AttributeValueRepository)
    public attributeValueRepository: AttributeValueRepository,
  ) { }

  @get('/attribute-values/{id}/product', {
    responses: {
      '200': {
        description: 'Product belonging to AttributeValue',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Product)},
          },
        },
      },
    },
  })
  async getProduct(
    @param.path.number('id') id: typeof AttributeValue.prototype.id,
  ): Promise<Product> {
    return this.attributeValueRepository.product(id);
  }
}
