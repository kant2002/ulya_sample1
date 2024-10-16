/// <reference types="howler" />

var c = document.getElementsByTagName('canvas')[0];
let ctx = c.getContext("2d");
if (ctx === null) {
    throw new Error("Cannot obtain 2D context");
}

const controls = document.getElementById("controls")!;
controls.getElementsByTagName("button")[0].onclick = нажатьВверх;
controls.getElementsByTagName("button")[1].onclick = нажатьВниз;
controls.getElementsByTagName("button")[2].onclick = нажатьВправо;
controls.getElementsByTagName("button")[3].onclick = нажатьВлево;
const fullscreen = document.getElementById("fullscreen")!;
fullscreen.addEventListener("click", function() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      }    
}, false);
const body = document.body;
function нажатьВверх() {
    статусДвижения.вверх = true;
}
function нажатьВниз() {
    статусДвижения.вниз = true;
}
function нажатьВправо() {
    статусДвижения.право = true;
}
function нажатьВлево() {
    статусДвижения.лево = true; 
}
body.addEventListener("keydown", function(ev) {
    if (ev.code == "ArrowLeft") {
        нажатьВлево()
    }
    if (ev.code == "ArrowRight") {
        нажатьВправо()
    }
    if (ev.code == "ArrowUp") {
        нажатьВверх()
    }
    if (ev.code == "ArrowDown") {
        нажатьВниз()
    }
    //console.log(статусДвижения);
}, false)
const размерУровня = {ширина: 15, высота: 15}
let текущаяПозиция = {x:0,y:0}
let позицияВыхода = {x:размерУровня.ширина - 1,y:размерУровня.высота - 1}
let пустойСтатусДвижения = {
    лево: false,
    право: false,
    вверх: false,
    вниз: false,
}
let статусДвижения = {...пустойСтатусДвижения}
let победа = new Howl({
    // https://freesound.org/people/jop9798/sounds/142000/
    src: ['./assets/18312__incarnadine__fanfare.wav'],
    volume: 1.0
});

let звук = new Howl({
    // https://freesound.org/people/jop9798/sounds/142000/
    src: ['./assets/142000__jop9798__steps-on-a-wooden-floor.wav'],
    sprite: {
      шаги: [0, 1147, false /* looping */],
    },
    volume: 1.0
});
let шаги = звук.play('шаги');
звук.pause(шаги)    


setInterval(function () {
    if (ctx === null) {
        throw new Error("Cannot obtain 2D context");
    }
     
    //звук.pause(шаги)
    let offsetX = 0;
    let offsetY = 0;
    if (статусДвижения.вниз) {
        if (текущаяПозиция.y < размерУровня.высота - 1) {
            offsetY += 1;
        }
    }
    if (статусДвижения.вверх) {
        if (текущаяПозиция.y > 0) {
            offsetY -= 1;
        }
    }
    if (статусДвижения.право) {
        if (текущаяПозиция.x < размерУровня.ширина - 1) {
            offsetX += 1;
        }
    }
    if (статусДвижения.лево) {
        if (текущаяПозиция.x > 0) {
            offsetX -= 1;
        }
    }

    if (offsetX !== 0 || offsetY !== 0) {
        if (!maze[offsetY + текущаяПозиция.y][offsetX + текущаяПозиция.x].block) {
            текущаяПозиция.x += offsetX;
            текущаяПозиция.y += offsetY;
            шаги = звук.play(шаги);
            draw(ctx);
        }
    }

    if (текущаяПозиция.x == позицияВыхода.x && текущаяПозиция.y == позицияВыхода.y) {
        текущаяПозиция = {x:0, y:0};
        победа.play();
        maze = grid(размерУровня.ширина, размерУровня.высота);
        
        // starting values, top left
        start_x = 0;
        start_y = 0;
        
        frontierList = new Array();
        
        startGame(ctx);
    }

    статусДвижения = {...пустойСтатусДвижения}
}, 100);

var w = c.width;
var h = c.height;
var BLOCK_W = Math.floor(w / (размерУровня.ширина + 2));
var BLOCK_H = Math.floor(h / (размерУровня.высота + 2));

var tickInterval : number | undefined;
var drawInterval : number | undefined;

// *note: t1 & t2 used to determine passage node
class MazeNode {
    t1: any;
    t2: any;
    block: boolean; // This is wall indicator. True - wall, False - passage
    constructor (public x: number, public y: number) {
        this.block = true;
        this.t1; // t1 = x val of the node between itself and it's frontier
        this.t2; // t2 = y val of the node between itself and it's frontier'
    }
}

// create 2D grid of of nxn where n = size
function grid(ширина: number, высота: number) {

    // create array 
    const grid : MazeNode[][] = new Array(высота);
    for (let i = 0; i < высота; i++) {
        grid[i] = new Array(ширина);
    }

    // associate each element with a node object
    for (let i = 0; i < высота; i++) {
        for (let j = 0; j < ширина; j++) {
            grid[i][j] = new MazeNode(j, i);
        }
    }

    return grid;
}

// get the frontiers of the given location in array
function getFrontier(x: number, y: number) {
    if (inBoundsCheck(maze[y][x], 0, -2)) {
        maze[y][x - 2].t1 = x - 1;
        maze[y][x - 2].t2 = y;
        frontierList.push(maze[y][x - 2]);
    }
    if (inBoundsCheck(maze[y][x], 0, 2)) {
        maze[y][x + 2].t1 = x + 1;
        maze[y][x + 2].t2 = y;
        frontierList.push(maze[y][x + 2]);
    }
    if (inBoundsCheck(maze[y][x], -2, 0)) {
        maze[y - 2][x].t1 = x;
        maze[y - 2][x].t2 = y - 1;
        frontierList.push(maze[y - 2][x]);
    }
    if (inBoundsCheck(maze[y][x], 2, 0)) {
        maze[y + 2][x].t1 = x;
        maze[y + 2][x].t2 = y + 1;
        frontierList.push(maze[y + 2][x]);
    }
}

// checks to see if the currentNode should be looked at
function inBoundsCheck(currentNode: MazeNode, i: number, j: number) {

    // out of bounds
    if (((currentNode.x + j) < 0) || ((currentNode.x + j) > размерУровня.ширина - 1) 
        || ((currentNode.y + i) < 0) || ((currentNode.y + i) > размерУровня.высота - 1)) {
        return false;
    }


    // check to see if block is within the grid
    if (!(maze[currentNode.y + i][currentNode.x + j].block)) {
        return false;
    }

    // if it passed all possible checks
    return true;
}

// draws the board and the moving shape
function draw(ctx: CanvasRenderingContext2D) {
    for (let x = 0; x < размерУровня.ширина + 2; ++x) {
        for (let y = 0; y < размерУровня.высота + 2; ++y) {
            if (y === 0 || x === 0 || y === размерУровня.высота + 1 || x === размерУровня.ширина + 1 || maze[y - 1][x - 1].block) {
                ctx.fillStyle = "black";
                
            } else {
                ctx.fillStyle = "white";
            }
            ctx.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W, BLOCK_H);
        }
    }

    ctx.fillStyle = "red";
    ctx.fillRect(BLOCK_W * (текущаяПозиция.x + 1), BLOCK_H * (текущаяПозиция.y + 1), BLOCK_W, BLOCK_H);

    ctx.fillStyle = "green";    
    ctx.fillRect(BLOCK_W * (позицияВыхода.x + 1), BLOCK_H * (позицияВыхода.y + 1), BLOCK_W, BLOCK_H);
}
  
function tick() {
    // while the frontierList is not empty
    if (frontierList.length > 0) {

        // get random value from frontierList (since their weights are all the same)
        let rand = Math.floor((Math.random() * (frontierList.length-1)));
        let randFrontier = frontierList[rand];

        if (maze[randFrontier.y][randFrontier.x].block) {

            maze[randFrontier.y][randFrontier.x].block = false;
            maze[randFrontier.t2][randFrontier.t1].block = false;

            // insert frontiers of the current frontier
            getFrontier(randFrontier.x, randFrontier.y);
        }

        // remove the current frontier from the list
        frontierList.splice(frontierList.indexOf(randFrontier), 1);
        tick();
    } else {
        // stop running the program
        //clearInterval(tickInterval);
        //clearInterval(drawInterval);
        draw(ctx!);
    }    
}


function startGame(ctx: CanvasRenderingContext2D) {

    // initialize first node - top left
    maze[start_y][start_x].t1 = start_x;
    maze[start_y][start_x].t2 = start_y;
    frontierList.push(maze[start_y][start_x]);

    draw(ctx);

    //tickInterval = setInterval(tick, 1);
    tick();
    //drawInterval = setInterval(function () { draw(ctx) }, 50);

}

// initialize grid of size 49
var maze = grid(размерУровня.ширина, размерУровня.высота);

// starting values, top left
var start_x = 0;
var start_y = 0;

var frontierList = new Array();

startGame(ctx);