export const NotificationService = {
    // VAPID Public Key - typically from env var
    // publicVapidKey: import.meta.env.VITE_VAPID_PUBLIC_KEY, 
    // Hardcoding for now/demo as env setup needs restart
    // REPLACE WITH YOUR GENERATED PUBLIC KEY
    getPublicVapidKey: () => 'BLkyJcogbscHo0w3MxmT2p6PJTDLw7XqYas3vyo1-3DLuae0x-rCgMOpSq_a55jjCjI0ujjafOBUqaCGgBPRH-Y',

    urlBase64ToUint8Array: (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    },

    subscribeToPush: async () => {
        if (!('serviceWorker' in navigator)) return;

        try {
            const register = await navigator.serviceWorker.ready;

            // Get VAPID key (Task 2: Replace with actual key)
            const publicVapidKey = 'BLkyJcogbscHo0w3MxmT2p6PJTDLw7XqYas3vyo1-3DLuae0x-rCgMOpSq_a55jjCjI0ujjafOBUqaCGgBPRH-Y';

            const subscription = await register.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: NotificationService.urlBase64ToUint8Array(publicVapidKey)
            });

            // Send subscription to backend
            await fetch('/api/push/subscribe', {
                method: 'POST',
                body: JSON.stringify(subscription),
                headers: {
                    'content-type': 'application/json'
                }
            });

            console.log('Push subscription successful');
            return true;
        } catch (error) {
            console.error('Push subscription failed:', error);
            return false;
        }
    },

    requestPermission: async () => {
        if (!('Notification' in window)) return false;

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            // Also attempt to subscribe to push
            // NotificationService.subscribeToPush(); // Call explicitly or here
            return true;
        }
        return false;
    },

    showNotification: (title, body) => {
        // Fallback for local notifications if push not used
        if (Notification.permission === 'granted') {
            new Notification(title, { body, icon: '/pwa-192x192.png' });
        }
    },

    triggerHaptic: (pattern = [50]) => {
        if ('vibrate' in navigator) navigator.vibrate(pattern);
    }
};
