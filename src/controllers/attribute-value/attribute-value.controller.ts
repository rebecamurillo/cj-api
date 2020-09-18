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
import {AttributeValue} from '../../models';
import {AttributeValueRepository} from '../../repositories';

export class AttributeValueController {
  constructor(
    @repository(AttributeValueRepository)
    public attributeValueRepository : AttributeValueRepository,
  ) {}

  @post('/attribute-values', {
    responses: {
      '200': {
        description: 'AttributeValue model instance',
        content: {'application/json': {schema: getModelSchemaRef(AttributeValue)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AttributeValue, {
            title: 'NewAttributeValue',
            exclude: ['id'],
          }),
        },
      },
    })
    attributeValue: Omit<AttributeValue, 'id'>,
  ): Promise<AttributeValue> {
    return this.attributeValueRepository.create(attributeValue);
  }

  @get('/attribute-values/count', {
    responses: {
      '200': {
        description: 'AttributeValue model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(AttributeValue) where?: Where<AttributeValue>,
  ): Promise<Count> {
    return this.attributeValueRepository.count(where);
  }

  @get('/attribute-values', {
    responses: {
      '200': {
        description: 'Array of AttributeValue model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(AttributeValue, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(AttributeValue) filter?: Filter<AttributeValue>,
  ): Promise<AttributeValue[]> {
    return this.attributeValueRepository.find(filter);
  }

  @patch('/attribute-values', {
    responses: {
      '200': {
        description: 'AttributeValue PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AttributeValue, {partial: true}),
        },
      },
    })
    attributeValue: AttributeValue,
    @param.where(AttributeValue) where?: Where<AttributeValue>,
  ): Promise<Count> {
    return this.attributeValueRepository.updateAll(attributeValue, where);
  }

  @get('/attribute-values/{id}', {
    responses: {
      '200': {
        description: 'AttributeValue model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(AttributeValue, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(AttributeValue, {exclude: 'where'}) filter?: FilterExcludingWhere<AttributeValue>
  ): Promise<AttributeValue> {
    return this.attributeValueRepository.findById(id, filter);
  }

  @patch('/attribute-values/{id}', {
    responses: {
      '204': {
        description: 'AttributeValue PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AttributeValue, {partial: true}),
        },
      },
    })
    attributeValue: AttributeValue,
  ): Promise<void> {
    await this.attributeValueRepository.updateById(id, attributeValue);
  }

  @put('/attribute-values/{id}', {
    responses: {
      '204': {
        description: 'AttributeValue PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() attributeValue: AttributeValue,
  ): Promise<void> {
    await this.attributeValueRepository.replaceById(id, attributeValue);
  }

  @del('/attribute-values/{id}', {
    responses: {
      '204': {
        description: 'AttributeValue DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.attributeValueRepository.deleteById(id);
  }
}
