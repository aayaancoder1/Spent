// Placeholder service for native Android notification listener integration
// This listener will later intercept banking SMS or push notifications,
// extract raw details, and send them to the app.

export interface NativeNotification {
  id: string;
  packageName: string;
  title: string;
  text: string;
  timestamp: number;
}

export function startNotificationService(): void {
  console.log('[NotificationListener] Initializing native Android notification observer service...');
  // Later: Native module call to register BroadcastReceiver / NotificationListenerService
}

export function stopNotificationService(): void {
  console.log('[NotificationListener] Dismantling notification observer service...');
}

export function onNotificationReceived(callback: (notification: NativeNotification) => void): () => void {
  console.log('[NotificationListener] Subscribing to transaction notification feed...');
  // Dummy subscription returning cleanup handler
  return () => {
    console.log('[NotificationListener] Unsubscribing from transaction notification feed...');
  };
}
