import axios, { AxiosInstance } from 'axios';
import { Item, Order, OrderRequest } from '@/types/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    // Use relative URLs to call Next.js API routes (which proxy to backend)
    this.client = axios.create({
      baseURL: '',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Items API
  async getAllItems(): Promise<Item[]> {
    const response = await this.client.get<Item[]>('/api/items');
    return response.data;
  }

  async getItemById(id: number): Promise<Item> {
    const response = await this.client.get<Item>(`/api/items/${id}`);
    return response.data;
  }

  async createItem(item: Item): Promise<Item> {
    const response = await this.client.post<Item>('/api/items', item);
    return response.data;
  }

  async updateItem(id: number, item: Item): Promise<Item> {
    const response = await this.client.put<Item>(`/api/items/${id}`, item);
    return response.data;
  }

  async deleteItem(id: number): Promise<void> {
    await this.client.delete(`/api/items/${id}`);
  }

  // Orders API
  async getAllOrders(): Promise<Order[]> {
    const response = await this.client.get<Order[]>('/api/orders');
    return response.data;
  }

  async getOrderById(id: number): Promise<Order> {
    const response = await this.client.get<Order>(`/api/orders/${id}`);
    return response.data;
  }

  async createOrder(orderRequest: OrderRequest): Promise<Order> {
    const response = await this.client.post<Order>('/api/orders', orderRequest);
    return response.data;
  }

  async updateOrder(id: number, orderRequest: OrderRequest): Promise<Order> {
    const response = await this.client.put<Order>(`/api/orders/${id}`, orderRequest);
    return response.data;
  }

  async purchaseOrder(id: number, virtual: boolean = true): Promise<Order> {
    const response = await this.client.post<Order>(
      `/api/orders/${id}/purchase`,
      null,
      { params: { virtual } }
    );
    return response.data;
  }
}

export const apiClient = new ApiClient();
