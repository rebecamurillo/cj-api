import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Brand} from '../models';
import {BrandRepository} from '../repositories';

export class BrandController {
  constructor(
    @repository(BrandRepository)
    public brandRepository : BrandRepository,
  ) {}

  @post('/brands', {
    responses: {
      '200': {
        description: 'Brand model instance',
        content: {'application/json': {schema: getModelSchemaRef(Brand)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Brand, {
            title: 'NewBrand',
            exclude: ['id'],
          }),
        },
      },
    })
    brand: Omit<Brand, 'id'>,
  ): Promise<Brand> {
    return this.brandRepository.create(brand);
  }

  @get('/brands/count', {
    responses: {
      '200': {
        description: 'Brand model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Brand) where?: Where<Brand>,
  ): Promise<Count> {
    return this.brandRepository.count(where);
  }

  @get('/brands', {
    responses: {
      '200': {
        description: 'Array of Brand model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Brand, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Brand) filter?: Filter<Brand>,
  ): Promise<Brand[]> {
    return this.brandRepository.find(filter);
  }

  @patch('/brands', {
    responses: {
      '200': {
        description: 'Brand PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Brand, {partial: true}),
        },
      },
    })
    brand: Brand,
    @param.where(Brand) where?: Where<Brand>,
  ): Promise<Count> {
    return this.brandRepository.updateAll(brand, where);
  }

  @get('/brands/{id}', {
    responses: {
      '200': {
        description: 'Brand model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Brand, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Brand, {exclude: 'where'}) filter?: FilterExcludingWhere<Brand>
  ): Promise<Brand> {
    return this.brandRepository.findById(id, filter);
  }

  @patch('/brands/{id}', {
    responses: {
      '204': {
        description: 'Brand PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Brand, {partial: true}),
        },
      },
    })
    brand: Brand,
  ): Promise<void> {
    await this.brandRepository.updateById(id, brand);
  }

  @put('/brands/{id}', {
    responses: {
      '204': {
        description: 'Brand PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() brand: Brand,
  ): Promise<void> {
    await this.brandRepository.replaceById(id, brand);
  }

  @del('/brands/{id}', {
    responses: {
      '204': {
        description: 'Brand DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.brandRepository.deleteById(id);
  }
}
