import { Time } from '@angular/common';
import { NPSItem } from './nps-item';

export class NPS {
  id;
  npsItems: NPSItem[];
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
