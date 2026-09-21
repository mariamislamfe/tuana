export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  currency: string;
  timezone: string;
  freeShippingThreshold: number;
  flatShippingRate: number;
  taxRate: number;
  lowStockThreshold: number;
  orderNotifications: boolean;
  lowStockNotifications: boolean;
}

export const defaultSettings = (): StoreSettings => ({
  storeName: "Tuana",
  supportEmail: "support@tuana.example.com",
  currency: "EGP",
  timezone: "Africa/Cairo",
  freeShippingThreshold: 3000,
  flatShippingRate: 60,
  taxRate: 14,
  lowStockThreshold: 10,
  orderNotifications: true,
  lowStockNotifications: true,
});
