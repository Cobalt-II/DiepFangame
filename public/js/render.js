import {
    entities,
    player,
    dead,
    size
} from "/js/entity.js";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

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
    for (let count = 0; count < size; count+=200) {
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
            for (let cou in entities[count].barrels) {
                ctx.fillStyle = "#C9C9C9";
                ctx.save();
                ctx.translate(xval, yval);
                ctx.rotate(entities[count].facing + Math.PI / 2 + entities[count].barrels[cou][0]);
                ctx.translate(-xval, -yval);
                ctx.fillRect(xval - entities[count].size * 0.25, yval, entities[count].size * 0.5, entities[count].barrels[cou][1]);
                ctx.restore();
            }
        }
        switch (entities[count].team) {
        case 0:
        ctx.fillStyle = "#FF0000";
        break;
        case 1:
        ctx.fillStyle = "#00FF00";
        break;
        case 2:
        ctx.fillStyle = "#0000FF";
        break;
        case 3:
        ctx.fillStyle = "#FFFF00";
        break;
        } 
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
    ctx.fillStyle = "#000000";
    ctx.font = `20px arial`;
    ctx.textAlign = "start";
    ctx.fillText(`Pos: (${Math.round(player.x)},${Math.round(player.y)})`, 0, 20);
    let o = getEntType('player');
    let k = o.sort((a, b) => b.score - a.score);
    k.splice(11, entities.length - 11);
    for (let c = 0; c < k.length; c++) {
        ctx.fillText(`${k[c].name} - ${k[c].score}`, window.innerWidth - 200, 20 * (c + 1));
    }
    if (dead) {
        ctx.textAlign = "center";
        ctx.fillText(`You died`, window.innerWidth / 2, 220);
        ctx.fillText(
            `Score: ${player.score}`,
            window.innerWidth / 2,
            260
        );
        ctx.fillText(
            `Press enter to return to menu`,
            window.innerWidth / 2,
            300
        );
        document.addEventListener("keydown", function(event) {
            if (event.code === "Enter") {
                this.location.href = "/";
            }
        });
    }
    requestAnimationFrame(draw);
});

