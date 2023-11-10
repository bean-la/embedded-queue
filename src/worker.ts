import { Job } from "./job";
import { Processor, Queue } from "./queue";

interface WorkerConstructorData {
    type: string;
    queue: Queue;
}

interface ShutdownInfo {
    timer: NodeJS.Timeout;
    resolve: () => void;
}

export class Worker {
    public readonly type: string;

    protected readonly queue: Queue;
    protected shutdownInfo: ShutdownInfo | null = null;

    // tslint:disable:variable-name
    protected _isRunning = false;
    protected _currentJob: Job | null = null;
    // tslint:disable:variable-name

    // noinspection JSUnusedGlobalSymbols
    public get isRunning(): boolean {
        return this._isRunning;
    }

    // noinspection JSUnusedGlobalSymbols
    public get currentJob(): Job | null {
        return this._currentJob;
    }

    public constructor(data: WorkerConstructorData) {
        this.type = data.type;
        this.queue = data.queue;
    }

    public start(processor: Processor): void {
        this._isRunning = true;

        this.startInternal(processor);
    }

    public shutdown(timeoutMilliseconds: number): Promise<void> {
        return new Promise((resolve) => {
            // If not running, do nothing and exit
            if (this._isRunning === false) {
                resolve();
                return;
            }

            // Transition to non-execution state
            this._isRunning = false;

            // If there is no job in progress, shutdown is complete
            if (this._currentJob === null) {
                resolve();
                return;
            }

            // If the job in progress does not complete by the timeout, the job will fail
            this.shutdownInfo = {
                timer: setTimeout(async () => {
                    // istanbul ignore if
                    if (this._currentJob === null) {
                        console.warn(`this._currentJob is null`);
                        return;
                    }

                    await this._currentJob.setStateToFailure(new Error("shutdown timeout"));
                    this._currentJob = null;

                    if (this.shutdownInfo !== null) {
                        this.shutdownInfo.resolve();
                        this.shutdownInfo = null;
                    }
                }, timeoutMilliseconds),
                resolve,
            };
        });
    }

    protected startInternal(processor: Processor): void {
        // If not running, shutdown is in progress, so abort processing
        // Note: This processing should be written below, but TypeScript's type recognition is incorrect, so it is written here
        if (this._isRunning === false) {
            if (this.shutdownInfo !== null) {
                clearTimeout(this.shutdownInfo.timer);
                this.shutdownInfo.resolve();
                this.shutdownInfo = null;
            }
            this._currentJob = null;
            return;
        }

        (async (): Promise<void> => {
            this._currentJob = await this.queue.requestJobForProcessing(this.type, () => this._isRunning);

            // If not running, shutdown is in progress, so abort processing
            if (this._isRunning === false) {
                // If this._isRunning is false, this.queue.requestProcessJob should return null
                if (this._currentJob !== null) {
                    console.warn(`this._currentJob is not null`);
                }

                this._currentJob = null;
                return;
            }

            await this.process(processor);

            // Note: The above processing should be written here

            this.startInternal(processor);
        })();
    }

    protected async process(processor: Processor): Promise<void> {
        if (this._currentJob === null) {
            console.warn(`this._currentJob is null`);
            return;
        }

        let result: unknown;

        try {
            result = await processor(this._currentJob);
        }
        catch (error) {
            if (error instanceof Error) {
                await this._currentJob.setStateToFailure(error);
            }
            else {
                await this._currentJob.setStateToFailure(
                    new Error("Processor is failed, and non error object is thrown.")
                );
            }
            this._currentJob = null;
            return;
        }

        if (this._currentJob === null) {
            return;
        }

        if (await this._currentJob.isExist() === false) {
            this._currentJob = null;
            return;
        }

        await this._currentJob.setStateToComplete(result);

        this._currentJob = null;
    }
}
