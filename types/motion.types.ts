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
	dueDate: Date;
	deadlineType: string;
	parentRecurringTaskId: string | null;
	completed: boolean;
	completedTime: null;
	startOn: Date;
	creator: Creator;
	workspace: Workspace;
	project: Project | null;
	status: Status;
	priority: string;
	labels: any[];
	assignees: Creator[];
	scheduledStart: Date | null;
	createdTime: Date;
	scheduledEnd: Date | null;
	schedulingIssue: boolean;
	lastInteractedTime: Date;
};

export type Creator = {
	id: string;
	name: string;
	email: string;
};

export type Project = {
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
