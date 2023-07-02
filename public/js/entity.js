export let entities = [];
export let id = 1;
export let font = {
    size: 20,
    type: "Arial"
};
let dead = 0;
let upgradetree = {
    basic: ['tripleshot', 'smasher', 'skimmer', 'flankguard'],
    tripleshot: ['pentashot'],
    skimmer: ['twister', 'homer'],
    smasher: ['armor'],
    flankguard: ['quadtank']
};
export let upgrades = upgradetree['basic'];
export let playertype = 'basic';
let playerdefs = {
    basic: [100, 10, 4, 0.1, 15, [
        [0, 2 * playersize],
    ], {
        bdamage: 5,
        bspeed: 12,
        bhealth: 15
    }],
    
    smasher: [300, 20, 6, 0.3, Infinity, [], {}],
    
    armor: [400, 20, 5, 0.3, Infinity, [
        [0, 1.1 * playersize],
        [Math.PI / 4, 1.1 * playersize, false],
        [-Math.PI / 4, 1.1 * playersize, false],
        [Math.PI / 2, 1.1 * playersize, false],
        [-Math.PI / 2, 1.1 * playersize, false],
        [Math.PI, 1.1 * playersize, false],
        [-Math.PI * 3 / 4, 1.1 * playersize, false],
        [Math.PI * 3 / 4, 1.1 * playersize, false],
        [-Math.PI / 2, 1.1 * playersize, false]
    ], {
        1: 'turn',
        turnspeed: 0.01
    }],

    pentashot: [100, 10, 4, 0.1, 15, [
        [0, 2 * playersize],
        [Math.PI / 4, 1.5 * playersize],
        [-Math.PI / 4, 1.5 * playersize],
        [Math.PI / 8, 1.75 * playersize],
        [-Math.PI / 8, 1.75 * playersize],
    ], {
        bdamage: 3,
        bspeed: 10,
        bhealth: 15
    }],

    flankguard: [100, 10, 4, 0.1, 20, [
        [0, 2 * playersize],
        [Math.PI, 1.5 * playersize]
    ], {
        bdamage: 3,
        bspeed: 10,
        bhealth: 15
    }],

    quadtank: [100, 10, 4, 0.1, 20, [
        [0, 2 * playersize],
        [Math.PI / 2, 2 * playersize],
        [2 * Math.PI / 2, 2 * playersize],
        [3 * Math.PI / 2, 2 * playersize]
    ], {
        bdamage: 3,
        bspeed: 10,
        bhealth: 15
    }],

    tripleshot: [100, 10, 4, 0.1, 12, [
        [0, 2 * playersize],
        [Math.PI / 8, 1.75 * playersize],
        [-Math.PI / 8, 1.75 * playersize],
    ], {
        bdamage: 3,
        bspeed: 10,
        bhealth: 15
    }],
    
    twister: [100, 10, 4, 0.1, 35, [
        [0, 1.5 * playersize, 'twist'],
        [Math.PI / 16, 1.1 * playersize, false],
        [-Math.PI / 16, 1.1 * playersize, false]
    ], {}],
    
    skimmer: [100, 10, 4, 0.1, 35, [
        [0, 1.5 * playersize, 'flank'],
    ], {}],
    
    homer: [100, 10, 4, 0.1, 70, [
        [0, 1.5 * playersize, 'missile'],
        [Math.PI / 16, 1.3 * playersize, false],
        [-Math.PI / 16, 1.3 * playersize, false]
    ], {}],
}
export let mode = "domination";
export let managegame = {
    score: [0, 0],
    killcount: 1500,
    tick: 0
};
let team = Math.random() > 0.5 ? 1 : 0;
let matchEnded = 0;
let bulletLife = 90;
export let size = 2000;
export let player = {
    team: team
};
let spawn = getPos();
let spawnref = getPos;

import {
    bodies,
    playersize
} from "/js/storedentities.js";
import {
    pushNote
} from "/js/notifications.js";

pushNote('Welcome to the game!', 3);

class ent {
    constructor(type, team, x, y, name, size, health, damage, speed, regen, reloads, barrels, behaviors, angle, parent) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.size = size;
        this.health = health;
        this.damage = damage;
        this.speed = speed;
        this.maxhealth = health;
        this.id = id;
        this.regen = regen;
        this.tick = 0;
        this.angle = angle;
        this.parent = parent ? parent : id;
        this.score = 0;
        this.name = name;
        this.reloads = reloads;
        this.facing = 0;
        this.barrels = barrels;
        this.behaviors = behaviors;
        this.team = team;
        this.reloading = 0;
    }
};

function pushEnt(type, team, x, y, name, size, health, damage, speed, regen, reloads, barrels, behaviors, angle, parent) {
    entities.push(new ent(type, team, x, y, name, size, health, damage, speed, regen, reloads, barrels, behaviors, angle, parent));
    id++;
    return entities[entities.length - 1];
};

function getPos() {
    return [Math.random() * size, Math.random() * size];
};

function getPos2tdm(team) {
    return [Math.random() * size / 2 + size / 2 * team, Math.random() * size];
}

function pushbody(a, x, y, t, face, id) {
    for (let count in bodies) {
        if (bodies[count][1] === a) {
            a = bodies[count];
        }
    }
    if (a[0] !== 'bullet') {
        return pushEnt(a[0], t, x, y, a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9]);
    } else {
        return pushEnt(a[0], t, x, y, a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], face, id);
    }
};

function endMatch() {
    setTimeout(() => {
        location.href = '/';
    }, 5000);
    matchEnded = 1;
};

function collision(x1, x2, y1, y2, r1, r2) {
    if (Math.hypot(x1 - x2, y1 - y2) < r1 + r2) {
        return true;
    }
    return false;
};

function getEnts(target, teamType, wantBullets) {
    let targets = [];
    for (let con in entities) {
        if (teamType.indexOf(entities[con].team) > -1 && entities[con].id !== target.id) {
            if (wantBullets || !(entities[con].type === 'bullet')) {
                let k = Math.hypot(
                    entities[con].x - target.x,
                    entities[con].y - target.y
                );
                targets.push([
                    entities[con],
                    k,
                ]);
            }
        }
    }
    return targets;
};

function findTeams(nottoinclude) {
    let teams = [];
    for (let count in entities) {
        if (teams.indexOf(entities[count].team) === -1 && nottoinclude.indexOf(entities[count].team) === -1) {
            teams.push(entities[count].team)
        };
    }
    return teams;
};

function search(data, canplayer) {
    for (let count in entities) {
        let upscore = 1;
        if (canplayer) {
            if (entities[count].type === "bullet") upscore = 0;
        }
        if (entities[count].id === data && upscore) {
            return entities[count];
        }
    }
};

function setbasetdm(onsize) {
    setInterval(() => {
        for (let cou = 0; cou < 2; cou++) {
            let o = Math.random() * size / 2 + size / 2 * cou;
            if (getEnts({
                    x: 0,
                    y: 0,
                    id: -1
                }, findTeams([Number(!cou)]), 0).length <= onsize) pushbody('bot', o, Math.random() * size, cou);
        }
    });
}

function shoot(entity, damage, speed, health) {
    for (let count in entity.barrels) {
        let k = [-Math.cos(entity.facing + entity.barrels[count][0]), -Math.sin(entity.facing + entity.barrels[count][0])]
        if (!entity.barrels[count][3]) {
            if (!entity.barrels[count][2]) {
                pushEnt('bullet', entity.team, entity.x, entity.y, '', entity.size / 2, health, damage, speed, 0, 0, [], {}, k, entity.parent);
            } else {
                if (typeof entity.barrels[count][2] === "string") {
                    pushbody(entity.barrels[count][2], entity.x, entity.y, entity.team, [Math.cos(entity.facing + Math.PI), Math.sin(entity.facing + Math.PI)], entity.parent);
                    entities[entities.length - 1].facing = entity.facing;
                }
            }
        }
    }
    entity.reloading = 0;
};

function filter(targets, fov) {
    let targ = Infinity;
    let choice;
    for (let c in targets) {
        if (targets[c][1] < targ) {
            targ = targets[c][1];
            choice = targets[c][0];
        }
    }
    if (targ > fov) return false;
    return choice;
};
let bosses = ['Mega-Flank', 'Mega-Quad'];
switch (mode) {
    case 'sandboxbosses':
        let max = 5;
        setInterval(() => {
            if (getEnts({
                    x: 0,
                    y: 0,
                    id: -1
                }, findTeams([0]), 0).length <= max) pushbody(bosses[Math.floor(Math.random() * bosses.length)], size / 2, size / 2, 0);
        }, 5000);
        break;
    case 'domination':
        pushNote(`Destroy the enemy team's dominator to win.`, 4);
        pushbody('dom', size / 4, size / 2, 0);
        pushbody('dom', size / 4 * 3, size / 2, 1);
        setbasetdm(10);
        spawn = getPos2tdm(player.team);
        spawnref = getPos2tdm;
        break;
    case 'vanquish':
        pushNote(`Defeat enemy tanks to win.`, 4);
        setbasetdm(30);
        setInterval(() => {
            for (let count = 0; count < 2; count++) {
                if (Math.random() > 0.95) {
                    pushNote(`The ${count ? 'green' : 'red'} team has a surperior ally on the field!`, 3);
                    pushbody(bosses[Math.floor(Math.random() * bosses.length)], Math.random() * size / 2 + size / 2 * count, Math.random() * size, count);
                }
            }
        }, 500);
        spawn = getPos2tdm(player.team);
        spawnref = getPos2tdm;
        break;
};

player = pushEnt('player', team, spawn[0], spawn[1], localStorage.name, playersize, playerdefs[playertype][0], playerdefs[playertype][1], playerdefs[playertype][2], playerdefs[playertype][3], playerdefs[playertype][4], playerdefs[playertype][5], playerdefs[playertype][6]);

export function setTank(type) {
    player.health = playerdefs[type][0];
    player.damage = playerdefs[type][1];
    player.speed = playerdefs[type][2];
    player.regen = playerdefs[type][3];
    player.reloads = playerdefs[type][4];
    player.barrels = playerdefs[type][5];
    player.behaviors = playerdefs[type][6];
    playertype = type;
    upgrades = [];
    if (upgradetree[`${playertype}`]) {
        upgrades = upgradetree[`${playertype}`];
    } else {
        upgrades = []
    };
    pushNote(`You have upgraded to ${type}.`, 3);
}

let Keys = {
    values: [0, 'KeyW', 'KeyS', 'KeyA', 'KeyD'],
    values1: [0, false, false, false, false]
};

requestAnimationFrame(function run() {
    managegame.tick++;
    if (mode === 'vanquish' && !matchEnded) {
        if (managegame.score[1] >= managegame.killcount) {
            pushNote(`The red team has won the game!`, 3);
            endMatch();
        }
        if (managegame.score[0] >= managegame.killcount) {
            pushNote(`The green team has won the game!`, 3);
            endMatch();
        }
    }
    for (let co = 0; co < Keys.values1.length; co++) {
        if (Keys.values1[co]) {
            switch (Keys.values[co]) {
                case 'KeyW':
                    player.y -= player.speed;
                    break;
                case 'KeyS':
                    player.y += player.speed;
                    break;
                case 'KeyD':
                    player.x += player.speed;
                    break;
                case 'KeyA':
                    player.x -= player.speed;
            }
        }
    }
    if (player.health <= 0 && !dead) {
        dead = 1;
        pushNote('You have been killed. You may respawn when this message expires.', 3);
        Keys = {
            values: [],
            values1: []
        };
        let o = function(e) {
            if (e.code === 'Enter') {
                dead = 0;
                playertype = 'basic';
                spawn = spawnref(player.team);
                player = pushEnt('player', team, spawn[0], spawn[1], localStorage.name, playersize, playerdefs[playertype][0], playerdefs[playertype][1], playerdefs[playertype][2], playerdefs[playertype][3], playerdefs[playertype][4], playerdefs[playertype][5], playerdefs[playertype][6]);
                Keys = {
                    values: [0, 'KeyW', 'KeyS', 'KeyA', 'KeyD'],
                    values1: [0, false, false, false, false]
                };
                upgrades = upgradetree[`basic`];
                document.removeEventListener('keypress', o)
            }
        }
        setTimeout(() => {
            document.addEventListener('keypress', o);
        }, 3000);

    }
    for (let count in entities) {
        entities[count].tick++;
        entities[count].reloading++;
        entities[count].facing = entities[count].facing % 6.28318530718;
        let targett = getEnts(entities[count], findTeams([entities[count].team]), 0);
        let o = filter(targett, entities[count].behaviors.fov)
        if (entities[count].reloading > entities[count].reloads && targett.length && o) shoot(entities[count], entities[count].behaviors.bdamage, entities[count].behaviors.bspeed, entities[count].behaviors.bhealth);
        for (let cou in entities[count].behaviors) {
            switch (entities[count].behaviors[cou]) {
                case 'turn':
                    entities[count].facing += entities[count].behaviors.turnspeed * Math.PI;
                    break;
                case 'face':
                    let targett = getEnts(entities[count], findTeams([entities[count].team]), 0);
                    if (targett.length) {
                        let choice = filter(targett, entities[count].behaviors.fov);
                        if (choice) {
                            let k = Math.atan2(entities[count].y - choice.y, entities[count].x - choice.x);
                            if (k < 0) k = Math.PI + (Math.PI + k);
                            let o = entities[count].facing;
                            if (o < 0) o = Math.PI + (Math.PI + o);
                            if (k < o + Math.PI / 64 && k < o - Math.PI / 64) {
                                if (o - k <= Math.PI) {
                                    entities[count].facing -= entities[count].behaviors.turnspeed * Math.PI;
                                }
                                if (o - k > Math.PI) {
                                    entities[count].facing += entities[count].behaviors.turnspeed * Math.PI;
                                }
                            }
                            if (k + Math.PI / 64 > o && k - Math.PI / 64 > o) {
                                if (k - o <= Math.PI) {
                                    entities[count].facing += entities[count].behaviors.turnspeed * Math.PI;
                                }
                                if (k - o > Math.PI) {
                                    entities[count].facing -= entities[count].behaviors.turnspeed * Math.PI;
                                }
                            }
                        }
                    }
                    break;
                case 'instaface':
                    let targettt = getEnts(entities[count], findTeams([entities[count].team]), 0);
                    if (targettt.length) {
                        let choice = filter(targettt, entities[count].behaviors.fov);
                        if (choice) {
                            let k = Math.atan2(entities[count].y - choice.y, entities[count].x - choice.x);
                            entities[count].facing = k;
                        }
                    }
                    break;
                case 'chase':
                    let targets = getEnts(entities[count], findTeams([entities[count].team]), 0);
                    if (targets.length) {
                        let choice = filter(targets, entities[count].behaviors.fov);
                        if (choice) {
                            if (entities[count].x > choice.x + choice.size) {
                                entities[count].x -= entities[count].speed;
                            }
                            if (entities[count].x < choice.x - choice.size) {
                                entities[count].x += entities[count].speed;
                            }
                            if (entities[count].y > choice.y + choice.size) {
                                entities[count].y -= entities[count].speed;
                            }
                            if (entities[count].y < choice.y - choice.size) {
                                entities[count].y += entities[count].speed;
                            }
                        }
                    }
                    break;
            }
        }
        if (entities[count].type !== "bullet") {
            if (entities[count].health < entities[count].maxhealth) entities[count].health += entities[count].regen;
            if (entities[count].x - entities[count].size < 0) {
                entities[count].x = entities[count].size;
            }
            if (entities[count].x + entities[count].size > size - 200) {
                entities[count].x = size - entities[count].size - 200;
            }
            if (entities[count].y + entities[count].size > size - 200) {
                entities[count].y = size - entities[count].size - 200;
            }
            if (entities[count].y - entities[count].size < 0) {
                entities[count].y = entities[count].size;
            }
        }
        for (let coun in entities) {
            if (
                count !== coun &&
                collision(
                    entities[count].x,
                    entities[coun].x,
                    entities[count].y,
                    entities[coun].y,
                    entities[count].size,
                    entities[coun].size
                )
            ) {
                if (entities[count].team !== entities[coun].team) {
                    entities[count].health -= entities[coun].damage;
                    entities[coun].health -= entities[count].damage;
                    entities[count].lastHit = entities[coun].id;
                    entities[coun].lastHit = entities[count].id;
                }
                if (entities[count].type !== "bullet" && entities[coun].type !== "bullet") {
                    let angle = Math.abs(
                        Math.atan2(
                            entities[count].y - entities[coun].y,
                            entities[count].x - entities[coun].x
                        )
                    );
                    let scale = entities[count].size / entities[coun].size;
                    if (entities[count].x < entities[coun].x) {
                        if (!entities[count].behaviors.immovable) entities[count].x -= Math.cos(angle) * entities[count].speed / scale;
                        if (!entities[coun].behaviors.immovable) entities[coun].x += Math.cos(angle) * entities[coun].speed / scale;
                    } else {
                        if (!entities[count].behaviors.immovable) entities[count].x += Math.cos(angle) * entities[count].speed / scale;
                        if (!entities[coun].behaviors.immovable) entities[coun].x -= Math.cos(angle) * entities[coun].speed / scale;
                    }
                    if (entities[count].y < entities[coun].y) {
                        if (!entities[count].behaviors.immovable) entities[count].y -= Math.sin(angle) * entities[count].speed / scale;
                        if (!entities[coun].behaviors.immovable) entities[coun].y += Math.sin(angle) * entities[coun].speed / scale;
                    } else {
                        if (!entities[count].behaviors.immovable) entities[count].y += Math.sin(angle) * entities[count].speed / scale;
                        if (!entities[coun].behaviors.immovable) entities[coun].y -= Math.sin(angle) * entities[coun].speed / scale;
                    }
                }
            }
        }
        if (entities[count].type === 'bullet' && entities[count].name !== "missile") {
            entities[count].x += entities[count].angle[0] * entities[count].speed;
            entities[count].y += entities[count].angle[1] * entities[count].speed;
            if (entities[count].tick > bulletLife) {
                entities.splice(count, 1);
                continue;
            }
        }
        if (entities[count].health <= 0) {
            if (entities[count].type === 'player') {
                if (search(entities[count].lastHit)) {
                    if (search(entities[count].lastHit).type !== "bullet") {
                        search(entities[count].lastHit).score++;
                    } else {
                        if (search(search(entities[count].lastHit).parent, true)) {
                            if (entities[count].score) {
                                search(search(entities[count].lastHit).parent, true).score += entities[count].score;
                            } else {
                                search(search(entities[count].lastHit).parent, true).score++;
                            }
                        }
                    }
                }
            }
            switch (mode) {
                case 'domination':
                    if (entities[count].name === 'dom' && entities[count].id !== player.id) {
                        let o = !entities[count].team ? 'green' : 'red';
                        pushNote(`The ${o} team has won the game!`, 3);
                        endMatch();
                    }
                    break;
                case 'vanquish':
                    if (entities[count].type === 'player') {
                        if (entities[count].team) {
                            managegame.score[1]++;
                        } else {
                            managegame.score[0]++;
                        }
                    }
            }
            entities.splice(count, 1);
            continue;
        }
    }
    requestAnimationFrame(run);
});

document.addEventListener("keydown", function(event) {
    if (Keys.values.indexOf(event.code) && !dead) Keys.values1[Keys.values.indexOf(event.code)] = true;
});

document.addEventListener("keyup", function(event) {
    if (Keys.values.indexOf(event.code)) Keys.values1[Keys.values.indexOf(event.code)] = false;
});

document.addEventListener("mousedown", function(event) {
    for (let count = 0; count < upgrades.length; count++) {
        if (event.clientX < 170 && event.clientY > font.size * (6 + count) && event.clientY < font.size * (6 + count) + 20 && !dead) {
            setTank(upgrades[count]);
        }
    }
});

let x = 0;
let y = 0;

document.addEventListener("mousemove", function(event) {
    if (!playerdefs[playertype][6].turnspeed) {
        x = event.clientX;
        y = event.clientY;
        player.facing = Math.atan2(window.innerHeight / 2 - y, window.innerWidth / 2 - x);
    }
});



