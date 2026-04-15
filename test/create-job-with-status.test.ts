import { InMemoryJobRepository, Queue, State } from "../src";

test("createJobWithStatus returns an existing job for the same dedupe key", async () => {
    const queue = await Queue.createQueue(
        new InMemoryJobRepository({
            inMemoryOnly: true,
        })
    );

    const first = await queue.createJobWithStatus({
        type: "type",
        data: { hello: "world" },
        dedupeKey: "type:hello",
    });

    expect(first.created).toBe(true);
    expect(first.job.type).toBe("type");
    expect(first.job.dedupeKey).toBe("type:hello");

    const second = await queue.createJobWithStatus({
        type: "type",
        data: { hello: "world" },
        dedupeKey: "type:hello",
    });

    expect(second.created).toBe(false);
    expect(second.job.id).toBe(first.job.id);
    expect(second.job.dedupeKey).toBe("type:hello");

    const jobs = await queue.listJobs();
    expect(jobs).toHaveLength(1);
    expect(jobs[0]?.state).toBe(State.INACTIVE);
});
