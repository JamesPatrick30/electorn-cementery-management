import { Timestamp } from 'firebase/firestore';

export interface Reservation {
  plotId: string;
  username: string;
  contact: string;
  scheduledDate: string;
  plotType: string;
  created_at: Timestamp;
  plotStatus: 'Reserved' | 'Occupied' | 'Available';
  price: number;
}
export interface ReservationPlotStatus {
  plotId: string;
  plotStatus: 'Reserved' | 'Occupied';
}