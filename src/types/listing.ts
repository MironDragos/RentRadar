export type Listing = {
  id_extern: string;
  offer_type: string;
  title: string;
  price: number;
  currency: string | null;
  zone: string;
  m2: number;
  rooms: number;
  floor: number;
};
