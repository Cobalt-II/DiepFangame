import {
    entities,
    player,
    size,
    mode,
    managegame,
    upgrades,
    playertype,
    font
} from "/js/entity.js";
import {
    notifications
} from "/js/notifications.js";

let colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"];
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.font = `${font.size}px ${font.type}`;

function getEntType(type) {
    let arr = [];
    for (let count in entities) {
        if (entities[count].type === type) {
            arr.push(entities[count]);
        }
    }
    return arr;
};

canvas.oncontextmenu = function(e) {
    e.preventDefault();
};

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

function update() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

requestAnimationFrame(function draw() {
    if (
        canvas.width !== window.innerWidth ||
        canvas.height !== window.innerHeight
    ) {
        update();
    }
    ctx.fillStyle = "#E2E2E2";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    for (let count = 0; count < size; count += 200) {
        ctx.beginPath();
        ctx.moveTo(0, (window.innerHeight / 2) - (player.y - count));
        ctx.lineTo(size, (window.innerHeight / 2) - (player.y - count));
        ctx.moveTo((window.innerWidth / 2) - (player.x - count), 0);
        ctx.lineTo((window.innerWidth / 2) - (player.x - count), size);
        ctx.stroke();
    };
    for (let count in entities) {
        let xval = (window.innerWidth / 2) - (player.x - entities[count].x);
        let yval = (window.innerHeight / 2) - (player.y - entities[count].y);
        if (entities[count].type === "player") {
            ctx.fillStyle = "#000000";
            ctx.font = `10px arial`;
            ctx.textAlign = "center";
            ctx.fillText(
                `${entities[count].name} - ${entities[count].score}`,
                xval,
                yval - entities[count].size * 2 - 10
            );
        }
        for (let cou in entities[count].barrels) {
            ctx.fillStyle = "#C9C9C9";
            ctx.save();
            ctx.translate(xval, yval);
            ctx.rotate(entities[count].facing + Math.PI / 2 + entities[count].barrels[cou][0]);
            ctx.translate(-xval, -yval);
            ctx.fillRect(xval - entities[count].size * 0.25, yval, entities[count].size * 0.5, entities[count].barrels[cou][1]);
            ctx.restore();
        }
        ctx.fillStyle = colors[entities[count].team];
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(
            xval,
            yval,
            entities[count].size,
            0,
            Math.PI * 2,
            true
        );
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#dbdbdb";
        if (entities[count].health / entities[count].maxhealth < 1) {
            ctx.fillStyle = "#000000";
            ctx.fillRect(
                xval - entities[count].size / 2,
                yval + entities[count].size + 5,
                entities[count].size,
                5
            );
            ctx.fillStyle = "#2AAA8A";
            ctx.fillRect(
                xval - entities[count].size / 2,
                yval + entities[count].size + 5,
                (entities[count].health / entities[count].maxhealth) *
                entities[count].size,
                5
            );
        }
    }
    ctx.font = `20px arial`;
    let o = getEntType('player');
    let k = o.sort((a, b) => b.score - a.score);
    k.splice(11, entities.length - 11);
    for (let c = 0; c < k.length; c++) {
        ctx.fillStyle = colors[k[c].team];
        ctx.fillText(`${k[c].name} - ${k[c].score}`, window.innerWidth - 200, 20 * (c + 1));
    };
    ctx.fillStyle = "#000000";
    ctx.textAlign = "start";
    ctx.fillText(`Pos: (${Math.round(player.x)},${Math.round(player.y)})`, 0, 20);
    ctx.fillText(`Tank: ${playertype}`, 0, 40);
    ctx.textAlign = 'center';
    for (let count in notifications) {
        ctx.fillText(notifications[count].message, window.innerWidth / 2, font.size * 1.5 + count * font.size);
    }
    ctx.textAlign = 'left';
    if (mode === 'vanquish') {
        ctx.fillText(`Green: ${managegame.score[0]}`, 0, font.size * 3);
        ctx.fillText(`Red: ${managegame.score[1]}`, 0, font.size * 4);
    }
    if (upgrades.length) {
        ctx.fillText(`Select an upgrade: `, 0, font.size * 6);
        for (let count = 0; count < upgrades.length; count++) {
            ctx.fillText(`${upgrades[count]}`, 0, font.size * (6 + count + 1));
        }
    };
    requestAnimationFrame(draw);
});
