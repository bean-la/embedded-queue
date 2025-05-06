export const Event = {
    Enqueue: "enqueue",
    Start: "start",
    Failure: "failure",
    Complete: "complete",
    Remove: "remove",
    Error: "error",
    Progress: "progress",
    Log: "log",
    Priority: "priority",
} as const

export type Event = typeof Event[keyof typeof Event]