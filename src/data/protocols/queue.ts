import { User } from "../../domain/models"

export interface QueueInterface {
  add(jobName: string, data: { user: User }): Promise<void>
}
