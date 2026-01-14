/**
 * Lil' Wins - Notification Manager
 * Handles daily reminder notifications via Capacitor (iOS) or Web Notifications
 */

// Check if running in Capacitor
const isCapacitor = typeof Capacitor !== 'undefined';

// Notification settings defaults
const DEFAULT_NOTIFICATION_TIME = '09:00';
const NOTIFICATION_ID = 1;

// Load settings from localStorage
function getNotificationSettings() {
    return {
        enabled: localStorage.getItem('lilWinsNotificationsEnabled') === 'true',
        time: localStorage.getItem('lilWinsNotificationTime') || DEFAULT_NOTIFICATION_TIME
    };
}

// Save settings to localStorage
function saveNotificationSettings(enabled, time) {
    localStorage.setItem('lilWinsNotificationsEnabled', enabled.toString());
    localStorage.setItem('lilWinsNotificationTime', time);
}

// Request notification permissions
async function requestPermissions() {
    if (isCapacitor) {
        try {
            const { LocalNotifications } = Capacitor.Plugins;
            const result = await LocalNotifications.requestPermissions();
            return result.display === 'granted';
        } catch (e) {
            console.error('Failed to request Capacitor notification permissions:', e);
            return false;
        }
    } else {
        // Web fallback
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    }
}

// Check current permission status
async function checkPermissions() {
    if (isCapacitor) {
        try {
            const { LocalNotifications } = Capacitor.Plugins;
            const result = await LocalNotifications.checkPermissions();
            return result.display === 'granted';
        } catch (e) {
            return false;
        }
    } else {
        // Web fallback
        return 'Notification' in window && Notification.permission === 'granted';
    }
}

// Schedule daily reminder
async function scheduleDailyReminder(timeString) {
    if (isCapacitor) {
        try {
            const { LocalNotifications } = Capacitor.Plugins;

            // Cancel existing notification first
            await LocalNotifications.cancel({ notifications: [{ id: NOTIFICATION_ID }] });

            // Parse time string (HH:MM)
            const [hours, minutes] = timeString.split(':').map(Number);

            // Create schedule for daily notification
            const now = new Date();
            const scheduledTime = new Date();
            scheduledTime.setHours(hours, minutes, 0, 0);

            // If time already passed today, schedule for tomorrow
            if (scheduledTime <= now) {
                scheduledTime.setDate(scheduledTime.getDate() + 1);
            }

            await LocalNotifications.schedule({
                notifications: [
                    {
                        id: NOTIFICATION_ID,
                        title: "Time for your habits!",
                        body: "Your kingdom is waiting. Complete a habit to keep your streak going!",
                        schedule: {
                            at: scheduledTime,
                            repeats: true,
                            every: 'day'
                        },
                        sound: 'default',
                        actionTypeId: 'OPEN_APP'
                    }
                ]
            });

            console.log('Daily reminder scheduled for', timeString);
            return true;
        } catch (e) {
            console.error('Failed to schedule notification:', e);
            return false;
        }
    } else {
        // Web fallback - just log (web notifications need service worker for scheduling)
        console.log('Web notification would be scheduled for:', timeString);
        console.log('For actual scheduled notifications, use the iOS app');
        return true;
    }
}

// Cancel all notifications
async function cancelNotifications() {
    if (isCapacitor) {
        try {
            const { LocalNotifications } = Capacitor.Plugins;
            await LocalNotifications.cancel({ notifications: [{ id: NOTIFICATION_ID }] });
            console.log('Notifications cancelled');
        } catch (e) {
            console.error('Failed to cancel notifications:', e);
        }
    }
}

// Initialize notifications based on saved settings
async function initNotifications() {
    const settings = getNotificationSettings();

    if (settings.enabled) {
        const hasPermission = await checkPermissions();
        if (hasPermission) {
            await scheduleDailyReminder(settings.time);
        } else {
            // Permission was revoked, disable notifications
            saveNotificationSettings(false, settings.time);
        }
    }
}

// Toggle notifications on/off
async function toggleNotifications(enabled, time) {
    saveNotificationSettings(enabled, time);

    if (enabled) {
        const granted = await requestPermissions();
        if (granted) {
            await scheduleDailyReminder(time);
            return { success: true, message: `Reminder set for ${formatTime(time)} daily` };
        } else {
            saveNotificationSettings(false, time);
            return { success: false, message: 'Permission denied. Please enable notifications in Settings.' };
        }
    } else {
        await cancelNotifications();
        return { success: true, message: '' };
    }
}

// Format time for display
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Export for use in app.js
window.NotificationManager = {
    getSettings: getNotificationSettings,
    saveSettings: saveNotificationSettings,
    requestPermissions,
    checkPermissions,
    scheduleDailyReminder,
    cancelNotifications,
    init: initNotifications,
    toggle: toggleNotifications,
    formatTime,
    isCapacitor
};
