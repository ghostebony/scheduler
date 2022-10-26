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
		// else {
		// 	console.log(`Task scheduled: ${id}\t${cronExpression}`);
		// }

		return schedule(cronExpression, task, {
			name: id,
			...this.options,
			...options,
		});
	}

	public static getTasks = () => getTasks();

	public static getTask = (id: string) => this.getTasks().get(id);
}

// export const scheduler = Scheduler.setTasks({
// 	tasks: [
// 		{
// 			id: "database:backup",
// 			task: database.backup,
// 			cron: config.schedule.database.backup.cronExpression.get(),
// 		},
// 		{
// 			id: "imdb:datasets:title:basics",
// 			task: imdb.datasets.titleBasics,
// 			cron: config.schedule.imdb.dataset.cronExpression.get("title.basics"),
// 		},
// 		{
// 			id: "imdb:datasets:title:episode",
// 			task: imdb.datasets.titleEpisode,
// 			cron: config.schedule.imdb.dataset.cronExpression.get("title.episode"),
// 		},
// 		{
// 			id: "imdb:datasets:title:ratings",
// 			task: imdb.datasets.titleRatings,
// 			cron: config.schedule.imdb.dataset.cronExpression.get("title.ratings"),
// 		},
// 		// {
// 		// 	id: "tmdb:exports",
// 		// 	task: tmdb.exports,
// 		// 	cron: config.schedule.tmdb.export.cronExpression.get(),
// 		// },
// 	],
// });

// console.log(scheduler.getTasks());
