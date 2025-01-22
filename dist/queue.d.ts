/// <reference types="node" />
import { EventEmitter } from "events";
import Semaphore from "semaphore-async-await";
import { Job } from "./job";
import { Priority } from "./priority";
import { State } from "./state";
import { Worker } from "./worker";
import { DBJob, IJobRepository } from "./types";
export interface CreateJobData {
    type: string;
    priority?: Priority;
    data?: unknown;
}
export declare type Processor = (job: Job) => Promise<unknown>;
interface WaitingWorkerRequest {
    resolve: (value: Job) => void;
    reject: (error: Error) => void;
    stillRequest: () => boolean;
}
export declare class Queue extends EventEmitter {
    static createQueue(repository: IJobRepository): Promise<Queue>;
    protected static sanitizePriority(priority: number): Priority;
    protected readonly repository: IJobRepository;
    protected _workers: Worker[];
    protected waitingRequests: {
        [type: string]: WaitingWorkerRequest[];
    };
    protected lock: Semaphore;
    get workers(): Worker[];
    protected constructor(repository: IJobRepository);
    createJob(data: CreateJobData): Promise<Job>;
    process(type: string, processor: Processor, concurrency: number): void;
    shutdown(timeoutMilliseconds: number, type?: string | undefined): Promise<void>;
    findJob(id: string): Promise<Job | null>;
    listJobs(state?: State): Promise<Job[]>;
    removeJobById(id: string): Promise<void>;
    removeJobsByCallback(callback: (job: Job) => boolean): Promise<Job[]>;
    /** @package */
    requestJobForProcessing(type: string, stillRequest: () => boolean): Promise<Job | null>;
    /** @package */
    isExistJob(job: Job): Promise<boolean>;
    /** @package */
    addJob(job: Job): Promise<void>;
    /** @package */
    updateJob(job: Job): Promise<void>;
    /** @package */
    removeJob(job: Job): Promise<void>;
    protected cleanupAfterUnexpectedlyTermination(): Promise<void>;
    protected convertNeDbJobToJob(neDbJob: DBJob): Job;
}
export {};
