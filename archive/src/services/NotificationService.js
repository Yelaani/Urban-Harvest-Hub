export const NotificationService = {
    requestPermission: async () => {
        if (!('Notification' in window)) {
            console.log('This browser does not support desktop notification');
            return false;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    },

    showNotification: (title, body) => {
        if (Notification.permission === 'granted') {
            try {
                new Notification(title, {
                    body,
                    icon: '/pwa-192x192.png',
                    vibrate: [200, 100, 200]
                });
            } catch (e) {
                console.error('Notification failed:', e);
            }
        }
    },

    triggerHaptic: (pattern = [50]) => {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }
};
