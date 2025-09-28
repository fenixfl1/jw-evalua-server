import { Repository } from 'typeorm'
import { BaseService, CatchServiceError } from './base.service'
import { Competency } from '@src/entity/Competency'
import { ApiResponse } from '@src/types/api.types'

export class CompetencyService extends BaseService {
  private competencyRepository: Repository<Competency>

  constructor() {
    super()
    this.competencyRepository = this.dataSource.getRepository(Competency)
  }

  @CatchServiceError()
  async getAll(): Promise<ApiResponse<Competency[]>> {
    const competencies = await this.competencyRepository.find({
      where: { STATE: 'A' },
      order: { NAME: 'ASC' },
    })

    if (!competencies.length) {
      return this.noContent()
    }

    return this.success({ data: competencies })
  }
}
