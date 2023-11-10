
import { Job } from "./job";
import { State } from "./state";
import { DBJob, IJobRepository } from "./types";

export class InMemoryJobRepository implements IJobRepository {
    private jobs = new Map<string, DBJob>();

    constructor(o: any) {
    }

    init(): Promise<void> {
        return Promise.resolve(void 0);
    }

    listJobs(state?: State | undefined): Promise<DBJob[]> {
        return new Promise<DBJob[]>((resolve, reject) => {
            const jobs = Array.from(this.jobs.values());

            resolve(jobs.filter(job => {
                if (state === undefined) {
                    return true;
                }

                return job.state === state;
            }));
        });
    }

    findJob(id: string): Promise<DBJob | null> {
        return new Promise<DBJob | null>((resolve, reject) => {
            const job = this.jobs.get(id);

            resolve(job || null);
        });
    }

    findInactiveJobByType(type: string): Promise<DBJob | null> {
        return new Promise<DBJob | null>((resolve, reject) => {
            const jobs = Array.from(this.jobs.values());

            const job = jobs.find(job => job.type === type && job.state === State.INACTIVE);

            resolve(job || null);
        });

    }

    isExistJob(id: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            resolve(this.jobs.has(id));
        });
    }

    addJob(job: Job): Promise<DBJob> {
        return new Promise<DBJob>((resolve, reject) => {
            const dbJob: DBJob = {
                _id: job.id,
                type: job.type,
                priority: job.priority,
                data: job.data,
                createdAt: job.createdAt,
                updatedAt: job.updatedAt,
                state: job.state,
                logs: job.logs,
            };

            this.jobs.set(job.id, dbJob);

            resolve(dbJob);
        });
    }

    updateJob(job: Job): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const dbJob = this.jobs.get(job.id);

            if (dbJob === undefined) {
                reject(new Error(`Job not found. id=${job.id}`));
                return;
            }

            dbJob.type = job.type;
            dbJob.priority = job.priority;
            dbJob.data = job.data;
            dbJob.createdAt = job.createdAt;
            dbJob.updatedAt = job.updatedAt;
            dbJob.state = job.state;
            dbJob.logs = job.logs;

            resolve();
        });
    }

    removeJob(id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.jobs.delete(id);

            resolve();
        });
    }
}
