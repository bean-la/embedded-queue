import { Job } from "./job";
import { State } from "./state";
import { DBJob, IJobRepository } from "./types";
export declare class InMemoryJobRepository implements IJobRepository {
    private jobs;
    constructor(o: any);
    init(): Promise<void>;
    listJobs(state?: State | undefined): Promise<DBJob[]>;
    findJob(id: string): Promise<DBJob | null>;
    findInactiveJobByType(type: string): Promise<DBJob | null>;
    isExistJob(id: string): Promise<boolean>;
    addJob(job: Job): Promise<DBJob>;
    updateJob(job: Job): Promise<void>;
    removeJob(id: string): Promise<void>;
}
