import { User } from "./User.js";

export class Event {
  constructor(
    public title: string,
    public description: string,
    public date: Date,
    public location: string,
    public category: string,
    public capacity: number,
    public participants: User[] = []   // ⚠️ tableau d'objets User
  ) {}
}
