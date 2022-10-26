import { getTasks, schedule, validate } from "node-cron";
import type * as Types from "./types";

export default abstract class Scheduler {
	public static options?: Types.Options;

	public static setGlobalOptions(options: Types.Options) {
		this.options = options;
	}

	public static setTasks(tasks: Types.setTasks) {
		for (const task of tasks) {
			this.setTask(task);
		}
	}

	public static setTask({
		id,
		cron: {
			seconds,
			minutes = "*",
			hours = "*",
			dayOfMonth = "*",
			months = "*",
			dayOfWeek = "*",
		},
		task,
		options,
	}: Types.setTask) {
		this.getTask(id)?.stop();

		const cronExpression = [seconds, minutes, hours, dayOfMonth, months, dayOfWeek]
			.filter((x) => x !== undefined)
			.join(" ");

		if (!validate(cronExpression)) {
			throw new Error(`Task ${id} has an invalid cron expression: ${cronExpression}`);
		}

		return schedule(cronExpression, task, {
			name: id,
			...this.options,
			...options,
		});
	}

	public static getTasks = () => getTasks();

	public static getTask = (id: string) => this.getTasks().get(id);
}
