export interface Address {
  name?: string;
  door: string;

  city: string;
  state: string;
  country?: string;
  areaCode: string;
  pretty_address_text?: string;
}
export interface Location {
  lat?: number;
  lon?: number;
  delivery_radius?: number;
}
