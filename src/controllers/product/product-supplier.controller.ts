import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Product,
  Supplier,
} from '../../models';
import {ProductRepository} from '../../repositories';

export class ProductSupplierController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) { }

  @get('/products/{id}/supplier', {
    responses: {
      '200': {
        description: 'Supplier belonging to Product',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Supplier)},
          },
        },
      },
    },
  })
  async getSupplier(
    @param.path.number('id') id: typeof Product.prototype.id,
  ): Promise<Supplier> {
    return this.productRepository.supplier(id);
  }
}
