import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';

// Module-level array to act as a singleton database store for mock data
let mockDatabase: Transaction[] = [
  {
    id: '1',
    amount: 142.30,
    description: 'Whole Foods Market',
    tag: 'Necessity',
    timestamp: new Date(),
    source: 'manual',
    deleted: false,
  },
  {
    id: '2',
    amount: 6.50,
    description: 'Starbucks Coffee',
    tag: 'Personal',
    timestamp: new Date(),
    source: 'manual',
    deleted: false,
  },
  {
    id: '3',
    amount: 16.99,
    description: 'Apple Music Subscription',
    tag: 'Pleasure',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    source: 'auto',
    deleted: false,
  },
  {
    id: '4',
    amount: 48.20,
    description: 'Chevron Gas Station',
    tag: 'Necessity',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    source: 'manual',
    deleted: false,
  },
  {
    id: '5',
    amount: 12.50,
    description: 'Starbucks Coffee',
    tag: 'Personal',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    source: 'manual',
    deleted: true,
  },
  {
    id: '6',
    amount: 142.33,
    description: 'Weekly Groceries',
    tag: 'Necessity',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    source: 'manual',
    deleted: true,
  },
  {
    id: '7',
    amount: 15.99,
    description: 'Netflix Subscription',
    tag: 'Pleasure',
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    source: 'auto',
    deleted: true,
  },
];

// Re-usable pub/sub listener set for route sync
const listeners = new Set<(txs: Transaction[]) => void>();

function updateStore(newTxs: Transaction[]) {
  mockDatabase = newTxs;
  listeners.forEach((listener) => listener(mockDatabase));
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockDatabase);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const listener = (latestTxs: Transaction[]) => setTransactions(latestTxs);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const activeTransactions = transactions.filter((t) => !t.deleted);
  const deletedTransactions = transactions.filter((t) => t.deleted);

  const addTransaction = async (
    amount: number,
    description: string,
    tag: 'Necessity' | 'Personal' | 'Pleasure'
  ): Promise<void> => {
    setLoading(true);
    try {
      const newTx: Transaction = {
        id: Math.random().toString(36).substring(2, 9),
        amount,
        description: description || 'Untitled Entry',
        tag,
        timestamp: new Date(),
        source: 'manual',
        deleted: false,
      };
      updateStore([newTx, ...mockDatabase]);
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      const updated = mockDatabase.map((t) =>
        t.id === id ? { ...t, deleted: true } : t
      );
      updateStore(updated);
    } finally {
      setLoading(false);
    }
  };

  const restoreTransaction = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      const updated = mockDatabase.map((t) =>
        t.id === id ? { ...t, deleted: false } : t
      );
      updateStore(updated);
    } finally {
      setLoading(false);
    }
  };

  const permanentlyDeleteTransaction = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      const updated = mockDatabase.filter((t) => t.id !== id);
      updateStore(updated);
    } finally {
      setLoading(false);
    }
  };

  const emptyBin = async (): Promise<void> => {
    setLoading(true);
    try {
      const updated = mockDatabase.filter((t) => !t.deleted);
      updateStore(updated);
    } finally {
      setLoading(false);
    }
  };

  return {
    transactions,
    activeTransactions,
    deletedTransactions,
    loading,
    addTransaction,
    deleteTransaction,
    restoreTransaction,
    permanentlyDeleteTransaction,
    emptyBin,
  };
}
