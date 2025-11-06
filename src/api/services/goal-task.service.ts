import { Repository } from "typeorm";
import { BaseService, CatchServiceError } from "./base.service";
import { GoalTask } from "@src/entity/GoalTask";
import { GoalTaskStaff } from "@src/entity/GoalTaskStaff";
import { ApiResponse } from "@src/types/api.types";


export class GoalTaskService extends BaseService {
  private goalTaskRepository: Repository<GoalTask>
  private goalTaskStaffRepository: Repository<GoalTaskStaff>

  constructor() {
    super()
    this.goalTaskRepository = this.dataSource.getRepository(GoalTask)
    this.goalTaskStaffRepository = this.dataSource.getRepository(GoalTaskStaff)
  }

  @CatchServiceError()
  async create (payload): Promise<ApiResponse> {
    return this.success({})
  }

  @CatchServiceError()
  async update (payload): Promise<ApiResponse> {
    return this.success({})
  }
}