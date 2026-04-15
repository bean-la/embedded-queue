
import { Job } from "./job.js";
import { State, type StateType } from "./state.js";
import { DBJob, IJobRepository } from "./types.js";

export class InMemoryJobRepository implements IJobRepository {
    private jobs = new Map<string, DBJob>();

    constructor(_o: any) {
    }

    init(): Promise<void> {
        return Promise.resolve(void 0);
    }

    listJobs(state?: StateType | undefined): Promise<DBJob[]> {
        return new Promise<DBJob[]>((resolve, _reject) => {
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
        return new Promise<DBJob | null>((resolve, _reject) => {
            const job = this.jobs.get(id);

            resolve(job || null);
        });
    }

    findJobByTypeAndDedupeKey(type: string, dedupeKey: string): Promise<DBJob | null> {
        return new Promise<DBJob | null>((resolve, _reject) => {
            const jobs = Array.from(this.jobs.values());
            const job = jobs.find((job) => job.type === type && job.dedupeKey === dedupeKey);
            resolve(job || null);
        });
    }

    findInactiveJobByType(type: string): Promise<DBJob | null> {
        return new Promise<DBJob | null>((resolve, _reject) => {
            const jobs = Array.from(this.jobs.values());

            const job = jobs.find(job => job.type === type && job.state === State.INACTIVE);

            resolve(job || null);
        });
    }

    findInactiveJobByTypes(types: string[]): Promise<DBJob | null> {
        if (types.length === 0) {
            return Promise.resolve(null);
        }
        const set = new Set(types);
        return new Promise<DBJob | null>((resolve, _reject) => {
            const jobs = Array.from(this.jobs.values())
                .filter(job => job.state === State.INACTIVE && set.has(job.type))
                .sort((a, b) => {
                    const p = (b.priority ?? 0) - (a.priority ?? 0);
                    if (p !== 0) return p;
                    return a.createdAt.getTime() - b.createdAt.getTime();
                });
            resolve(jobs[0] ?? null);
        });
    }

    isExistJob(id: string): Promise<boolean> {
        return new Promise<boolean>((resolve, _reject) => {
            resolve(this.jobs.has(id));
        });
    }

    addJob(job: Job): Promise<DBJob> {
        return new Promise<DBJob>((resolve, _reject) => {
            const dbJob: DBJob = {
                _id: job.id,
                type: job.type,
                dedupeKey: job.dedupeKey,
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
            dbJob.dedupeKey = job.dedupeKey;
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
        return new Promise<void>((resolve, _reject) => {
            this.jobs.delete(id);

            resolve();
        });
    }
}
