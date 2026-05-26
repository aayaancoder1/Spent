import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import { useAuth } from '@/hooks/useAuth';
import { Transaction } from '@/types/transaction';

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const txCollection = collection(db, 'users', user.uid, 'transactions');
    const q = query(txCollection, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs: Transaction[] = [];
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        txs.push({
          id: docSnapshot.id,
          amount: data.amount,
          description: data.description,
          tag: data.tag,
          timestamp: data.timestamp ? data.timestamp.toDate() : new Date(),
          source: data.source,
          deleted: data.deleted ?? false,
        });
      });
      setTransactions(txs);
      setLoading(false);
    }, (error) => {
      console.error('Firestore snapshot subscription failed:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const activeTransactions = transactions.filter((t) => !t.deleted);
  const deletedTransactions = transactions.filter((t) => t.deleted);

  const addTransaction = async (
    amount: number,
    description: string,
    tag: 'Necessity' | 'Personal' | 'Pleasure'
  ): Promise<void> => {
    if (!user) return;
    setLoading(true);
    try {
      const txCollection = collection(db, 'users', user.uid, 'transactions');
      await addDoc(txCollection, {
        amount,
        description: description || 'Untitled Entry',
        tag,
        timestamp: new Date(),
        source: 'manual',
        deleted: false,
      });
    } catch (e) {
      console.error('Failed to add transaction to Firestore:', e);
      alert('Error saving transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string): Promise<void> => {
    if (!user) return;
    setLoading(true);
    try {
      const txDocRef = doc(db, 'users', user.uid, 'transactions', id);
      await updateDoc(txDocRef, { deleted: true });
    } catch (e) {
      console.error('Failed to soft delete transaction:', e);
    } finally {
      setLoading(false);
    }
  };

  const restoreTransaction = async (id: string): Promise<void> => {
    if (!user) return;
    setLoading(true);
    try {
      const txDocRef = doc(db, 'users', user.uid, 'transactions', id);
      await updateDoc(txDocRef, { deleted: false });
    } catch (e) {
      console.error('Failed to restore transaction:', e);
    } finally {
      setLoading(false);
    }
  };

  const permanentlyDeleteTransaction = async (id: string): Promise<void> => {
    if (!user) return;
    setLoading(true);
    try {
      const txDocRef = doc(db, 'users', user.uid, 'transactions', id);
      await deleteDoc(txDocRef);
    } catch (e) {
      console.error('Failed to delete transaction permanently:', e);
    } finally {
      setLoading(false);
    }
  };

  const emptyBin = async (): Promise<void> => {
    if (!user || deletedTransactions.length === 0) return;
    setLoading(true);
    try {
      const batch = writeBatch(db);
      deletedTransactions.forEach((t) => {
        const txDocRef = doc(db, 'users', user.uid, 'transactions', t.id);
        batch.delete(txDocRef);
      });
      await batch.commit();
    } catch (e) {
      console.error('Failed to empty bin:', e);
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
