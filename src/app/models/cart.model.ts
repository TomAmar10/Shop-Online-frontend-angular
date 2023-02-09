import { Item } from './item.model';

export interface Cart {
  _id: string;
  userId: string;
  created: Date;
  items: Item[];
  isOrdered?: boolean;
}
