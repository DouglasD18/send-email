import { User } from "../../domain/models"

export interface Queue {
  add(jobName: string, data: { user: User }): Promise<void>
}
