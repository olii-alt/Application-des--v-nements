
import { User } from "./User.js";
import { Event } from "./Event.js";

export class Registration {
  constructor(
    public user: User,
    public event: Event
  ) {}
}
