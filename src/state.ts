export const State = {
    INACTIVE: "INACTIVE",
    ACTIVE: "ACTIVE",
    COMPLETE: "COMPLETE",
    FAILURE: "FAILURE",
} as const;

export type State = typeof State[keyof typeof State];
