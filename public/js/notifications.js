let id = 0;

class notification {
    constructor(message, duration, id) {
        this.message = message;
        this.duration = duration;
        this.id = id;
    }
};

export let notifications = [];

export function pushNote(message, duration) {
    notifications.push(new notification(message, duration, id));
    let o = id;
    id++;
    setTimeout(() => {
        for (let count in notifications) {
            if (notifications[count].id === o) {
                notifications.splice(count, 1)
            }
        }
    }, duration * 1000);
};
