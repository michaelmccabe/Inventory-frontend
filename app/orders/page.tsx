'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Item, Order, OrderItem, OrderRequest, OrderStatus } from '@/types/api';
import { apiClient } from '@/lib/api-client';
import {
  Plus,
  Trash2,
  ShoppingCart,
  Check,
  RefreshCw,
  Edit2,
  Loader2,
} from 'lucide-react';

export default function OrdersPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true);
  const [isLoadingOrderDetails, setIsLoadingOrderDetails] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadItems();
    loadOrders();
  }, []);

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const showSuccessMessage = (message: string) => {
    setSuccess(message);
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }
    successTimeoutRef.current = setTimeout(() => {
      setSuccess(null);
      successTimeoutRef.current = null;
    }, 3500);
  };

  const loadItems = async () => {
    try {
      const data = await apiClient.getAllItems();
      setItems(data);
    } catch (err) {
      setError('Failed to load items. Make sure the backend API is running.');
      console.error('Error loading items:', err);
    }
  };

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const data = await apiClient.getAllOrders();
      setOrders(data);

      if (selectedOrderId) {
        const existing = data.find((order) => order.id === selectedOrderId);
        if (existing) {
          setSelectedOrder(existing);
        } else {
          setSelectedOrderId(null);
          setSelectedOrder(null);
        }
      }
    } catch (err) {
      setError('Failed to load orders. Make sure the backend API is running.');
      console.error('Error loading orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const itemNameLookup = useMemo(() => {
    const map = new Map<number, string>();
    items.forEach((item) => {
      if (item.id != null) {
        map.set(item.id, item.name);
      }
    });
    return map;
  }, [items]);

  const getItemName = (itemId: number) => {
    return itemNameLookup.get(itemId) ?? `Item #${itemId}`;
  };

  const addItemToOrder = (itemId: number) => {
    setCurrentOrder((prev) => {
      const existingItem = prev.find((oi) => oi.itemId === itemId);
      if (existingItem) {
        return prev.map((oi) =>
          oi.itemId === itemId ? { ...oi, quantity: oi.quantity + 1 } : oi
        );
      }
      return [...prev, { itemId, quantity: 1 }];
    });
  };

  const removeItemFromOrder = (itemId: number) => {
    setCurrentOrder((prev) => prev.filter((oi) => oi.itemId !== itemId));
  };

  const updateOrderItemQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromOrder(itemId);
      return;
    }

    setCurrentOrder((prev) =>
      prev.map((oi) => (oi.itemId === itemId ? { ...oi, quantity } : oi))
    );
  };

  const handleResetBuilder = () => {
    setEditingOrderId(null);
    setCurrentOrder([]);
    setDeliveryAddress('');
  };

  const prefillBuilderFromOrder = (order: Order) => {
    setEditingOrderId(order.id ?? null);
    setCurrentOrder(order.items.map((item) => ({ ...item })));
    setDeliveryAddress(order.deliveryAddress);
  };

  const handleSelectOrder = async (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsLoadingOrderDetails(true);
    setError(null);

    try {
      const order = await apiClient.getOrderById(orderId);
      setSelectedOrder(order);
    } catch (err) {
      setError('Failed to load order details.');
      console.error('Error loading order details:', err);
    } finally {
      setIsLoadingOrderDetails(false);
    }
  };

  const handleBeginEditSelectedOrder = () => {
    if (selectedOrder && selectedOrder.id != null) {
      prefillBuilderFromOrder(selectedOrder);
    }
  };

  const handleSaveOrder = async () => {
    if (currentOrder.length === 0) {
      setError('Please add at least one item to the order.');
      return;
    }

    if (!deliveryAddress.trim()) {
      setError('Please enter a delivery address.');
      return;
    }

    const orderRequest: OrderRequest = {
      items: currentOrder,
      deliveryAddress: deliveryAddress.trim(),
    };

    try {
      setIsSubmitting(true);
      setError(null);

      let response: Order;
      if (editingOrderId) {
        response = await apiClient.updateOrder(editingOrderId, orderRequest);
        showSuccessMessage(`Order #${editingOrderId} updated successfully!`);
      } else {
        response = await apiClient.createOrder(orderRequest);
        showSuccessMessage(`Order #${response.id} created successfully!`);
      }

      await loadOrders();

      if (response.id != null) {
        setSelectedOrderId(response.id);
        setSelectedOrder(response);
      }

      if (editingOrderId) {
        prefillBuilderFromOrder(response);
      } else {
        handleResetBuilder();
      }
    } catch (err) {
      setError('Failed to save order.');
      console.error('Error saving order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePurchaseOrder = async (orderId: number) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await apiClient.purchaseOrder(orderId);
      showSuccessMessage(`Order #${orderId} purchased successfully!`);

      await loadOrders();
      const refreshedOrder = await apiClient.getOrderById(orderId);
      setSelectedOrder(refreshedOrder);

      if (editingOrderId === orderId) {
        prefillBuilderFromOrder(refreshedOrder);
      }
    } catch (err) {
      setError('Failed to purchase order.');
      console.error('Error purchasing order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOrderTotal = (orderItems: OrderItem[]) => {
    return orderItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const renderStatusBadge = (status: OrderStatus) => {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';

    switch (status) {
      case OrderStatus.PURCHASED:
        return `${baseClasses} bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300`;
      case OrderStatus.HELD:
        return `${baseClasses} bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300`;
      default:
        return `${baseClasses} bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300`;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Orders</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Create new orders, review existing orders from the backend, and manage their lifecycle.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingOrderId ? `Edit Order #${editingOrderId}` : 'Create New Order'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Assemble the order by selecting inventory items and providing delivery details.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {editingOrderId && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200">
                    Editing existing order
                  </span>
                )}
                <button
                  onClick={handleResetBuilder}
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Reset Builder
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Available Items</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary-500 dark:hover:border-primary-400 transition-colors bg-white dark:bg-gray-900"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Stock: {item.quantity}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => item.id != null && addItemToOrder(item.id)}
                      className="w-full mt-2 flex items-center justify-center px-3 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Order
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Order Items</h3>
              {currentOrder.length === 0 ? (
                <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center text-gray-500 dark:text-gray-400">
                  No items added yet. Choose items from the inventory list above.
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
                  {currentOrder.map((orderItem) => (
                    <div
                      key={orderItem.itemId}
                      className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg"
                    >
                      <span className="font-medium text-gray-900 dark:text-white">
                        {getItemName(orderItem.itemId)}
                      </span>
                      <div className="flex items-center space-x-3">
                        <input
                          type="number"
                          value={orderItem.quantity}
                          onChange={(e) =>
                            updateOrderItemQuantity(orderItem.itemId, parseInt(e.target.value, 10) || 0)
                          }
                          className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center"
                          min="1"
                        />
                        <button
                          onClick={() => removeItemFromOrder(orderItem.itemId)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="text-right font-semibold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                    Total Items: {getOrderTotal(currentOrder)}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="deliveryAddress"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Delivery Address
              </label>
              <textarea
                id="deliveryAddress"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter delivery address..."
              />
            </div>

            <button
              onClick={handleSaveOrder}
              disabled={isSubmitting || currentOrder.length === 0}
              className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {isSubmitting && editingOrderId ? 'Updating...' : isSubmitting ? 'Saving...' : editingOrderId ? 'Update Order' : 'Create Order'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Orders Overview</h2>
              <button
                onClick={loadOrders}
                className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${ordersLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-10 text-gray-500 dark:text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No orders found. Create a new order to get started.
              </p>
            ) : (
              <div className="space-y-2">
                {orders.map((order, index) => {
                  const isSelected = order.id != null && order.id === selectedOrderId;
                  return (
                    <button
                      key={order.id ?? index}
                      onClick={() => order.id != null && handleSelectOrder(order.id)}
                      className={`w-full text-left border rounded-lg px-4 py-3 transition-colors ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            Order #{order.id}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {order.items.length} item{order.items.length === 1 ? '' : 's'} · Delivery: {order.deliveryAddress}
                          </p>
                        </div>
                        <span className={renderStatusBadge(order.status)}>{order.status}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Order Details</h2>
              {selectedOrder?.status === OrderStatus.SAVED && (
                <button
                  onClick={handleBeginEditSelectedOrder}
                  className="inline-flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Order
                </button>
              )}
            </div>

            {isLoadingOrderDetails ? (
              <div className="flex items-center justify-center py-10 text-gray-500 dark:text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading order details...
              </div>
            ) : !selectedOrder ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select an order from the list to review its details and take action.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Order #{selectedOrder.id}
                  </p>
                  <span className={renderStatusBadge(selectedOrder.status)}>{selectedOrder.status}</span>
                </div>

                <div>
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wide mb-1">
                    Delivery Address
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line">
                    {selectedOrder.deliveryAddress}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wide mb-1">
                    Items
                  </p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((orderItem, index) => (
                      <div
                        key={`${orderItem.itemId}-${index}`}
                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded"
                      >
                        <span className="text-sm text-gray-800 dark:text-gray-200">
                          {getItemName(orderItem.itemId)}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Qty: {orderItem.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {selectedOrder.status === OrderStatus.SAVED ? (
                    <button
                      onClick={() => selectedOrder.id != null && handlePurchaseOrder(selectedOrder.id)}
                      disabled={isSubmitting}
                      className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                    >
                      <Check className="w-4 h-4 mr-2" /> Purchase Order
                    </button>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This order has already been purchased.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
