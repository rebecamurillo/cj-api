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
import {Category, CategoryRelations} from '../../models';
import {CategoryRepository} from '../../repositories';
import { isNullOrUndefined } from 'util';

export class CategoryController {
  constructor(
    @repository(CategoryRepository)
    public CategoryRepository : CategoryRepository,
  ) {}

  @post('/Categorys', {
    responses: {
      '200': {
        description: 'Category model instance',
        content: {'application/json': {schema: getModelSchemaRef(Category)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {
            title: 'NewCategory',
            exclude: ['id','level'],
          }),
        },
      },
    })
    Category: Omit<Category, 'id'>,
  ): Promise<Category> {

    const CategoryCreated = await this.CategoryRepository.create(Category);

    if (Category.parentId == 0 || isNullOrUndefined(Category.parentId)){
      CategoryCreated.level = ''+CategoryCreated.id;
      CategoryCreated.levelSorted = CategoryCreated.name+'_'+CategoryCreated.id;
   }else {
      const parent = await this.CategoryRepository.findById(Category.parentId);
      CategoryCreated.level = parent.level+'-'+CategoryCreated.id;
      CategoryCreated.levelSorted = parent.levelSorted+'-'+CategoryCreated.name+'_'+CategoryCreated.id;
    }
    await this.CategoryRepository.updateById(CategoryCreated.id, CategoryCreated);

    return CategoryCreated;
  }

  @get('/Categorys/count', {
    responses: {
      '200': {
        description: 'Category model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Category) where?: Where<Category>,
  ): Promise<Count> {
    return this.CategoryRepository.count(where);
  }

  @get('/Categorys', {
    responses: {
      '200': {
        description: 'Array of Category model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Category, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Category) filter?: Filter<Category>,
  ): Promise<Category[]> {
    return this.CategoryRepository.find(filter);
  }

  @get('/Categorys/order', {
    responses: {
      '200': {
        description: 'Array of Category model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Category, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async findWithOrder(): Promise<Category[]> {
    const query = 'select c2.*, concat(repeat(\'> \', (char_length(level)-char_length(replace(level,\'-\',\'\'))) ),c2.name)  as namewithspaces from Category c2 order by levelsorted asc ';
    return await this.CategoryRepository.dataSource.execute(query);
  }

  @patch('/Categorys', {
    responses: {
      '200': {
        description: 'Category PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {partial: true}),
        },
      },
    })
    Category: Category,
    @param.where(Category) where?: Where<Category>,
  ): Promise<Count> {
    return this.CategoryRepository.updateAll(Category, where);
  }

  @get('/Categorys/{id}', {
    responses: {
      '200': {
        description: 'Category model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Category, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Category, {exclude: 'where'}) filter?: FilterExcludingWhere<Category>
  ): Promise<Category> {
    return this.CategoryRepository.findById(id, filter);
  }

  @patch('/Categorys/{id}', {
    responses: {
      '204': {
        description: 'Category PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {partial: true}),
        },
      },
    })
    Category: Category,
  ): Promise<void> {
    const toUpdate = await this.CategoryRepository.findById(id);

    if (toUpdate.name != Category.name){
      let children: Category[] = []

      if (toUpdate.parentId == 0){
        children = await this.CategoryRepository.find({where: {level:{like:'%'+id+'-%'}}})
      }else {
        children = await this.CategoryRepository.find({where: {level:{like:'%-'+id+'-%'}}})
      }

      children.forEach(function(child,index) {
        if (toUpdate.parentId == 0){
          children[index].levelSorted = child.levelSorted?child.levelSorted.replace(toUpdate.name+'_'+id+'-',Category.name+'_'+id+'-'):child.levelSorted;
        }else  {
          children[index].levelSorted = child.levelSorted?child.levelSorted.replace('-'+toUpdate.name+'_'+id+'-','-'+Category.name+'_'+id+'-'):child.levelSorted;
        }
      });

      for (let i = 0; i < children.length; i++) {
        await this.CategoryRepository.update(children[i]);
      }
    }

    await this.CategoryRepository.updateById(id, Category);
  }

  @del('/Categorys/{id}', {
    responses: {
      '204': {
        description: 'Category DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    const toDelete = await this.CategoryRepository.findById(id);
    let children: Category[] = []

    if (toDelete.parentId == 0){
      children = await this.CategoryRepository.find({where: {level:{like:'%'+id+'-%'}}})
    }else {
      children = await this.CategoryRepository.find({where: {level:{like:'%-'+id+'-%'}}})
    }

    children.forEach(function(child,index) {
      if (toDelete.parentId == 0){
        children[index].level = child.level?child.level.replace(id+'-',''):child.level;
        children[index].levelSorted = child.levelSorted?child.levelSorted.replace(toDelete.name+'_'+id+'-',''):child.levelSorted;
        children[index].parentId = child.parentId&&child.parentId==toDelete.id?0:child.parentId;
      }else  {
        children[index].level = child.level?child.level.replace('-'+id+'-','-'):child.level;
        children[index].levelSorted = child.levelSorted?child.levelSorted.replace('-'+toDelete.name+'_'+id+'-','-'):child.levelSorted;
        children[index].parentId = child.parentId&&child.parentId==toDelete.id?toDelete.parentId:child.parentId;
      }
    });

    for (let i = 0; i < children.length; i++) {
      await this.CategoryRepository.update(children[i]);
    }
    await this.CategoryRepository.deleteById(id);
  }
}
