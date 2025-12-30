export class Event {
  title: string;
  description: string;
  date: Date;
  location: string;
  category: string;
  capacity: number;

  constructor(title: string, description: string, date: string | Date, location: string, category: string, capacity: number) {
    this.title = title;
    this.description = description;
    this.date = (date instanceof Date) ? date : new Date(date);
    this.location = location;
    this.category = category;
    this.capacity = capacity;
  }
}
