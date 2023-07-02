export let playersize = 30;

export let bodies = [
    ['player', 'Mega-Quad', playersize * 2, 1000, 10, 1, 0.1, 20, [
        [0, 4 * playersize],
        [Math.PI / 2, 4 * playersize],
        [2 * Math.PI / 2, 4 * playersize],
        [3 * Math.PI / 2, 4 * playersize]
    ], {
        1: 'turn',
        turnspeed: 0.005,
        2: 'chase',
        bdamage: 3,
        bspeed: 15,
        bhealth: 30,
        fov: 750
    }],

    ['player', 'Mega-Turret', playersize * 2, 1000, 10, 1, 0, 15, [
        [0, 4 * playersize]
    ], {
        1: 'face',
        turnspeed: 0.01,
        bdamage: 10,
        bspeed: 15,
        bhealth: 30,
        immovable: 1,
        fov: 750
    }],

    ['player', 'Mega-Flank', playersize * 2, 1000, 10, 2, 0.1, 20, [
        [0, 4 * playersize],
        [Math.PI, 3.5 * playersize]
    ], {
        1: 'face',
        turnspeed: 0.01,
        bdamage: 3,
        bspeed: 15,
        bhealth: 30,
        2: 'chase',
        fov: 750
    }],

    ['player', 'Sorcerer', playersize * 2, 1000, 10, 2, 0.1, 150, [
        [0, 2.5 * playersize, 'bot'],
        [Math.PI, 2.5 * playersize, 'bot']
    ], {
        1: 'turn',
        turnspeed: 0.01,
        2: 'chase',
        fov: 750
    }],

    ['player', 'Turret Minion', playersize, 100, 10, 1, 0, 20, [
        [0, 2 * playersize]
    ], {
        1: 'face',
        turnspeed: 0.01,
        bdamage: 5,
        bspeed: 15,
        bhealth: 30,
        2: 'chase',
        fov: 750
    }],

    ['player', 'dom', playersize * 2, 1000, 10, 1, 0, 15, [
        [0, 4 * playersize]
    ], {
        1: 'instaface',
        turnspeed: 0.01,
        bdamage: 10,
        bspeed: 15,
        bhealth: 30,
        immovable: 1,
        fov: 750
    }],

    ['bullet', 'twist', 0.5 * playersize, 30, 10, 5, 0, 20, [
        [0, playersize * 0.75],
        [Math.PI / 2, playersize * 0.75],
        [2 * Math.PI / 2, playersize * 0.75],
        [3 * Math.PI / 2, playersize * 0.75]
    ], {
        1: 'turn',
        turnspeed: 0.01,
        bdamage: 10,
        bspeed: 15,
        bhealth: 30
    }],

    ['bullet', 'flank', 0.5 * playersize, 30, 10, 5, 0, 20, [
        [0, playersize * 0.75],
        [Math.PI, playersize * 0.75],
    ], {
        1: 'turn',
        turnspeed: 0.01,
        bdamage: 10,
        bspeed: 15,
        bhealth: 30
    }],

    ['bullet', 'missile', 0.5 * playersize, 30, 10, 5, 0, 20, [
        [0, playersize * 0.75]
    ], {
        1: 'face',
        2: 'chase',
        turnspeed: 0.01,
        bdamage: 10,
        bspeed: 15,
        bhealth: 10
    }],

    ['player', 'bot', playersize, 100, 10, 3, 0.1, 20, [
        [0, 2 * playersize]
    ], {
        1: 'instaface',
        turnspeed: 0.01,
        bdamage: 5,
        bspeed: 15,
        bhealth: 30,
        2: 'chase',
        fov: 2000
    }],
];
