import Queue from "bull";
import { QueueInterface } from "../../data/protocols";
import { User } from "../../domain/models";
import * as jobs from "../../utils/jobs";

interface JobInterface {
  key: string
  handle(data?: { user: User }): Promise<void>
  data: any
}

export class QueueAdapter implements QueueInterface {
  queues() {
    return Object.values(jobs).map((job: JobInterface) => ({
      bull: new Queue(job.key,),
      name: job.key,
      handle: () => {
        return job.handle()
      }
    }))
  }

  async add(jobName: string, data: { user: User; }): Promise<void> {
    const queues = this.queues();
    const queue = queues.find(queue => queue.name === jobName);

    await  queue.bull.add(data);
  }

  process() {
    const queues = this.queues();
    queues.forEach(queue => {
      queue.bull.process(queue.handle);

      queue.bull.on("failed", (job: JobInterface, err) => {
        console.log("Job failed", queue.name, job.data);
        console.log(err);
      })
    })
  }
}