export class Item {
  id?: string;
  labels: Map<string, string>;
  descriptions: Map<string, string>;
  description: string;
  cardinality: number;
  categories: string[];
  photo: string;
  target: number;
}
