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
import {Classification} from '../../models';
import {ClassificationRepository} from '../../repositories';
import { isNullOrUndefined } from 'util';

export class ClassificationController {
  constructor(
    @repository(ClassificationRepository)
    public classificationRepository : ClassificationRepository,
  ) {}

  @post('/classifications', {
    responses: {
      '200': {
        description: 'Classification model instance',
        content: {'application/json': {schema: getModelSchemaRef(Classification)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Classification, {
            title: 'NewClassification',
            exclude: ['id','level'],
          }),
        },
      },
    })
    classification: Omit<Classification, 'id'>,
  ): Promise<Classification> {

    const classificationCreated = await this.classificationRepository.create(classification);

    if (classification.parentId == 0 || isNullOrUndefined(classification.parentId)){
      classificationCreated.level = 0+'-'+classificationCreated.id;
      classificationCreated.levelSorted = classificationCreated.name+'_'+classificationCreated.id;
   }else {
      const parent = await this.classificationRepository.findById(classification.parentId);
      classificationCreated.level = parent.level+'-'+classificationCreated.id;
      classificationCreated.levelSorted = parent.levelSorted+'-'+classificationCreated.name+'_'+classificationCreated.id;
    }
    await this.classificationRepository.updateById(classificationCreated.id, classificationCreated);

    return classificationCreated;
  }

  @get('/classifications/count', {
    responses: {
      '200': {
        description: 'Classification model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Classification) where?: Where<Classification>,
  ): Promise<Count> {
    return this.classificationRepository.count(where);
  }

  @get('/classifications', {
    responses: {
      '200': {
        description: 'Array of Classification model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Classification, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Classification) filter?: Filter<Classification>,
  ): Promise<Classification[]> {
    return this.classificationRepository.find(filter);
  }

  @get('/classifications/order', {
    responses: {
      '200': {
        description: 'Array of Classification model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Classification, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async findWithOrder(): Promise<Classification[]> {
    const query = 'select c2.*, concat(repeat(\'> \', (char_length(level)-char_length(replace(level,\'-\',\'\')))-1 ),c2.name)  as namewithspaces from classification c2 order by levelsorted asc ';
    return await this.classificationRepository.dataSource.execute(query);
  }

  @patch('/classifications', {
    responses: {
      '200': {
        description: 'Classification PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Classification, {partial: true}),
        },
      },
    })
    classification: Classification,
    @param.where(Classification) where?: Where<Classification>,
  ): Promise<Count> {
    return this.classificationRepository.updateAll(classification, where);
  }

  @get('/classifications/{id}', {
    responses: {
      '200': {
        description: 'Classification model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Classification, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Classification, {exclude: 'where'}) filter?: FilterExcludingWhere<Classification>
  ): Promise<Classification> {
    return this.classificationRepository.findById(id, filter);
  }

  @patch('/classifications/{id}', {
    responses: {
      '204': {
        description: 'Classification PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Classification, {partial: true}),
        },
      },
    })
    classification: Classification,
  ): Promise<void> {
    await this.classificationRepository.updateById(id, classification);
  }

  @put('/classifications/{id}', {
    responses: {
      '204': {
        description: 'Classification PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() classification: Classification,
  ): Promise<void> {
    await this.classificationRepository.replaceById(id, classification);
  }

  @del('/classifications/{id}', {
    responses: {
      '204': {
        description: 'Classification DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.classificationRepository.deleteById(id);
  }
}
