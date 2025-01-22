import DataStore, { DataStoreOptions } from "nedb";
import { Job } from "./job";
import { State } from "./state";
import { DBJob, IJobRepository } from "./types";
export declare type DbOptions = DataStoreOptions;
export declare class NedbJobRepository implements IJobRepository {
    protected readonly db: DataStore;
    constructor(dbOptions?: DbOptions);
    init(): Promise<void>;
    listJobs(state?: State): Promise<DBJob[]>;
    findJob(id: string): Promise<DBJob | null>;
    findInactiveJobByType(type: string): Promise<DBJob | null>;
    isExistJob(id: string): Promise<boolean>;
    addJob(job: Job): Promise<DBJob>;
    updateJob(job: Job): Promise<void>;
    removeJob(id: string): Promise<void>;
}
