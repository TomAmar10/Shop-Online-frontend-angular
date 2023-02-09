export interface Order {
  _id: string;
  userId: string;
  cartId: string;
  price: number;
  city: string;
  street: string;
  delivery: Date;
  order_date: Date;
  digits: number;
}
