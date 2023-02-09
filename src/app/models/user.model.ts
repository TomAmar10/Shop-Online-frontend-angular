export enum Role {
  ADMIN = 1,
  COSTUMER = 2,
  GUEST = 3,
}

export interface User {
  _id: string; // ???? maybe cancel this field
  id_number: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  city:string;
  street:string;
  role: Role;
}
