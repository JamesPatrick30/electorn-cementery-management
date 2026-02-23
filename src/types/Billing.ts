export interface Bill {
  plotId: string;
  totalPrice: number;
  downPayment: number;
  monthsTerm: number;
  remainingBalance: number;
  status: 'active' | 'paid';
}