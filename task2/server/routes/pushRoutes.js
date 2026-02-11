import express from 'express';
import webpush from 'web-push';

const router = express.Router();

// Store subscriptions in memory for now (Task 2 requirement typically doesn't strict persistent storage for this feature, but DB is better)
// Using an array for simplicity in this demo, but in production use DB
let subscriptions = [];
// Or better: use a simple model if Sequelize is ready, but array is faster for demo.

// Subscribe Route
router.post('/subscribe', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);

    // De-duplicate subscriptions based on endpoint
    subscriptions = subscriptions.filter((sub, index, self) =>
        index === self.findIndex((t) => (
            t.endpoint === sub.endpoint
        ))
    );

    res.status(201).json({ message: 'Subscription added successfully.' });
});

// Send Notification Route
// Send Notification Route
router.post('/send-notification', (req, res) => {
    const { title, body } = req.body;
    sendBroadcast(title, body)
        .then(() => res.json({ message: 'Notifications sent successfully.' }))
        .catch(err => {
            console.error("Error sending notifications", err);
            res.sendStatus(500);
        });
});

export const sendBroadcast = (title, body) => {
    const notificationPayload = JSON.stringify({ title, body });

    const promises = subscriptions.map(sub =>
        webpush.sendNotification(sub, notificationPayload)
            .catch(err => {
                console.error("Error sending notification, removing subscription", err);
                // Remove faulty subscription
                subscriptions = subscriptions.filter(s => s.endpoint !== sub.endpoint);
            })
    );

    return Promise.all(promises);
};

export default router;
