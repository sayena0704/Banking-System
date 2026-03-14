
export type TransactionStatus = "PENDING" | "COMPLETED" | "REJECTED";


export interface TransactionEvent {
  transactionId: string;
  accountId: string;
  amount: number;
  location: string;
  country: string;
  ipAddress: string;
  deviceId: string;
  timestamp: number;
  status: TransactionStatus
}
