import { Job } from "./job.js";
import type { StateType } from "./state.js";

export interface DBJob {
    _id: string;
    type: string;
    dedupeKey?: string;
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
    findJobByTypeAndDedupeKey(type: string, dedupeKey: string): Promise<DBJob | null>
    findInactiveJobByType(type: string): Promise<DBJob | null>
    /** Find one inactive job whose type is in the given list (priority desc, createdAt asc). */
    findInactiveJobByTypes(types: string[]): Promise<DBJob | null>
    isExistJob(id: string): Promise<boolean>
    addJob(job: Job): Promise<DBJob>
    updateJob(job: Job): Promise<void>
    removeJob(id: string): Promise<void>
}
