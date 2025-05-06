import { Job } from "./job";
import type { StateType } from "./state";

export interface DBJob {
    _id: string;
    type: string;
    priority: number;
    data?: unknown;
    createdAt: Date;
    updatedAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    failedAt?: Date;
    state?: StateType;
    duration?: number;
    progress?: number;
    logs: string[];
}

export interface IJobRepository {
    init(): Promise<void>
    listJobs(state?: StateType): Promise<DBJob[]>
    findJob(id: string): Promise<DBJob | null>
    findInactiveJobByType(type: string): Promise<DBJob | null>
    isExistJob(id: string): Promise<boolean>
    addJob(job: Job): Promise<DBJob>
    updateJob(job: Job): Promise<void>
    removeJob(id: string): Promise<void>
}