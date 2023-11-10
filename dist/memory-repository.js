"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryJobRepository = void 0;
const state_1 = require("./state");
class InMemoryJobRepository {
    constructor(o) {
        this.jobs = new Map();
    }
    init() {
        return Promise.resolve(void 0);
    }
    listJobs(state) {
        return new Promise((resolve, reject) => {
            const jobs = Array.from(this.jobs.values());
            resolve(jobs.filter(job => {
                if (state === undefined) {
                    return true;
                }
                return job.state === state;
            }));
        });
    }
    findJob(id) {
        return new Promise((resolve, reject) => {
            const job = this.jobs.get(id);
            resolve(job || null);
        });
    }
    findInactiveJobByType(type) {
        return new Promise((resolve, reject) => {
            const jobs = Array.from(this.jobs.values());
            const job = jobs.find(job => job.type === type && job.state === state_1.State.INACTIVE);
            resolve(job || null);
        });
    }
    isExistJob(id) {
        return new Promise((resolve, reject) => {
            resolve(this.jobs.has(id));
        });
    }
    addJob(job) {
        return new Promise((resolve, reject) => {
            const dbJob = {
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
    updateJob(job) {
        return new Promise((resolve, reject) => {
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
    removeJob(id) {
        return new Promise((resolve, reject) => {
            this.jobs.delete(id);
            resolve();
        });
    }
}
exports.InMemoryJobRepository = InMemoryJobRepository;
