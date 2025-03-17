export type MotionResponse = {
	meta: Meta;
	tasks: MotionTask[];
};

export type Meta = {
	nextCursor: string;
	pageSize: number;
};

export type MotionTask = {
	id: string;
	name: string;
	description: string;
	duration: number;
	dueDate: string; // db column: due_date
	deadlineType: string; // db column: deadline_type
	parentRecurringTaskId: string | null; // db column: parent_recurring_task_id
	completed: boolean;
	completedTime: null; // db column: completed_time
	startOn: string; // db column: start_on
	creator: Creator;
	workspace: Workspace;
	project: MotionProject | null;
	status: Status;
	priority: string;
	labels: any[];
	assignees: Creator[];
	scheduledStart: string | null; // db column: scheduled_start
	createdTime: string; // not in db
	scheduledEnd: string | null; // db column: scheduled_end
	schedulingIssue: boolean; // db column: scheduling_issue
	lastInteractedTime: string; // db column: last_interacted_time
};

export type Creator = {
	id: string;
	name: string;
	email: string;
};

export type MotionProject = {
	id: string;
	name: string;
	description: string;
	workspaceId: string;
	createdTime: Date;
	updatedTime: Date;
};

export type Status = {
	name: StatusName;
	isDefaultStatus: boolean;
	isResolvedStatus: boolean;
};

export enum StatusName {
	Backlog = 'Backlog',
	Blocked = 'Blocked',
	Canceled = 'Canceled',
	Completed = 'Completed',
	InProgress = 'In Progress',
	Todo = 'Todo',
}

export type Workspace = {
	id: string;
	name: string;
	teamId: string;
	statuses: Status[];
	labels: any[];
	type: string;
};
