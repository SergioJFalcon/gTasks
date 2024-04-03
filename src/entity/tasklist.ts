export interface TaskListInterface {
  kind: string;
  id: string;
  etag: string;
  title: string;
  updated: string;
  selfLink: string;
}

export class TaskList {
  kind: string;
  id: string;
  etag: string;
  title: string;
  updated: string;
  selfLink: string;

  constructor() {
    this.kind = '';
    this.id = '';
    this.etag = '';
    this.title = '';
    this.updated = '';
    this.selfLink = '';
  }
}