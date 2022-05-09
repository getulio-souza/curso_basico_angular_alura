export class OrderEvent {
  context: string;
  eventType: string;
  eventSubtype: string;
  source: string;
  subject: string;
  producer: string;
  tags: string[];
  labels?: Map<string, string>;
  location: string;
  item: string;
  itemId?: string;
  category: string;
  quantity: string;
  date: string;
  timestamp?: number;
  eventDate?: Date;
  createdAt?: Date;
}
