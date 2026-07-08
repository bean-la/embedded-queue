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

test("createJobWithStatus prefers an active job over older completed jobs with the same dedupe key", async () => {
    const queue = await Queue.createQueue(
        new InMemoryJobRepository({
            inMemoryOnly: true,
        })
    );

    const first = await queue.createJobWithStatus({
        type: "type",
        data: { seq: 1 },
        dedupeKey: "type:hello",
    });
    await first.job.setStateToActive();
    await first.job.setStateToComplete();

    const second = await queue.createJobWithStatus({
        type: "type",
        data: { seq: 2 },
        dedupeKey: "type:hello",
    });
    expect(second.created).toBe(true);
    await second.job.setStateToActive();

    const third = await queue.createJobWithStatus({
        type: "type",
        data: { seq: 3 },
        dedupeKey: "type:hello",
    });

    expect(third.created).toBe(false);
    expect(third.job.id).toBe(second.job.id);
    expect(third.job.state).toBe(State.ACTIVE);
});
