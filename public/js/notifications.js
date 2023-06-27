let id = 0;

class notification {
    constructor(message, duration, id) {
        this.message = message;
        this.duration = duration;
        this.id = id;
    }
};

export let notifications = [];

requestAnimationFrame(function clear() {
    for (let count in notifications) {
        let k = notifications[count].id;
        setTimeout(() => {
            for (let count in notifications) {
                if (notifications[count].id === k) {
                    notifications.splice(count, 1)
                }
            }
        }, notifications[count].duration * 1000);
    }
    requestAnimationFrame(clear);
});

export function pushNote(message, duration) {
    notifications.push(new notification(message, duration, id));
    id++;
};
