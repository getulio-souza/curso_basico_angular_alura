import { Time } from '@angular/common';
import { OrderItem } from './order-item';

export class Order {
  id;
  orderItems: OrderItem[];
  locationName: string;
  assignee: string;
  deliveryEstimate: Date;
  createdAt: Date;
  startedAt: Date;
  cancelAt: Date;
  finishedAt: Date;
  status: string;
  duration: Time;
  lastUpdate: Date;

  // delayed: boolean;
  // waitPercent: number;
  // progressPercent: number;
  // cancellingPercent: number;
  // overduePercent: number;
  // remainingPercent: number;

  targetId: string;
  tags:string;
  
}