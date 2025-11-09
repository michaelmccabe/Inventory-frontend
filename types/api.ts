/**
 * TypeScript types generated from OpenAPI specification
 */

export interface Item {
  id?: number;
  name: string;
  quantity: number;
}

export interface OrderItem {
  itemId: number;
  quantity: number;
}

export interface OrderRequest {
  items: OrderItem[];
  deliveryAddress: string;
}

export enum OrderStatus {
  SAVED = 'SAVED',
  PURCHASED = 'PURCHASED',
  HELD = 'HELD'
}

export interface Order {
  id?: number;
  items: OrderItem[];
  deliveryAddress: string;
  status: OrderStatus;
}
