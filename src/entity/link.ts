export interface LinkInterface {
  type: string;
  description: string;
  link: string;
}

export class Link {
  type: string;
  description: string;
  link: string;
  
  constructor(data: LinkInterface) {
    this.type = data.type;
    this.description = data.description;
    this.link = data.link;
  }
}