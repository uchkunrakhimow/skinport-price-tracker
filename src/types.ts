export interface SkinportItem {
  name: string;
  tradeableMinPrice: number;
  nonTradeableMinPrice: number;
  appId: number;
  currency: string;
}

export interface WithdrawRequest {
  userId: string;
  amount: number;
}
