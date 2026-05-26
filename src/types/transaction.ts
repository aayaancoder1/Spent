export interface Transaction {
  id: string;
  amount: number;
  description: string;
  tag: 'Necessity' | 'Personal' | 'Pleasure';
  timestamp: Date;
  source: 'auto' | 'manual';
  deleted: boolean;
}
