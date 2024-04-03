import { Link } from "./link";

export interface TaskInterface {
  kind: string;
  id: string;
  etag: string;
  title: string;
  updated: string;
  selfLink: string;
  parent: string;
  position: string;
  notes: string;
  status: string;
  due: string;
  completed: string;
  deleted: boolean;
  hidden: boolean;
  links: Link[];
  webViewLink: string;
}

export class Task {
  kind: string;
  id: string;
  etag: string;
  title: string;
  updated: string;
  selfLink: string;
  parent: string;
  position: string;
  notes: string;
  status: string;
  due: string;
  completed: string;
  deleted: boolean;
  hidden: boolean;
  links: Link[];
  webViewLink: string;

  constructor() {
    this.kind = '';
    this.id = '';
    this.etag = '';
    this.title = '';
    this.updated = '';
    this.selfLink = '';
    this.parent = '';
    this.position = '';
    this.notes = '';
    this.status = '';
    this.due = '';
    this.completed = '';
    this.deleted = false;
    this.hidden = false;
    this.links = [];
    this.webViewLink = '';
  }
}