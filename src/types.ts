import type { ScheduleOptions } from "node-cron";

export interface Cron {
	seconds?: string | number;
	minutes?: string | number;
	hours?: string | number;
	dayOfMonth?: string | number;
	months?: string | number;
	dayOfWeek?: string | number;
}

export type Task = (now: Date | "manual") => void;

export type Options = Omit<ScheduleOptions, "name"> & { immediate?: boolean };

export interface setTask {
	id: string;
	cron: Cron;
	task: Task;
	options?: Options;
}
