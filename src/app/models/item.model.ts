export interface Item {
  _id: string;
  name: string;
  categoryId: string;
  price: number;
  image: string;
  amount?: number;
}
