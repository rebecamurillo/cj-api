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
  Attribute,
} from '../../models';
import {AttributeValueRepository} from '../../repositories';

export class AttributeValueAttributeController {
  constructor(
    @repository(AttributeValueRepository)
    public attributeValueRepository: AttributeValueRepository,
  ) { }

  @get('/attribute-values/{id}/attribute', {
    responses: {
      '200': {
        description: 'Attribute belonging to AttributeValue',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Attribute)},
          },
        },
      },
    },
  })
  async getAttribute(
    @param.path.number('id') id: typeof AttributeValue.prototype.id,
  ): Promise<Attribute> {
    return this.attributeValueRepository.attribute(id);
  }
}
