// Game constant and variables
let inputDir = { x: 0, y: 0 };
let inputDir2 = { x: 0, y: 0 };

// let inputQueue1 = [];
// let inputQueue2 = [];

let lastPaintTime = 0;
let collide = false;
let myspeed;
let speed = 3;
let score1 = 0;
let score2 = 0;
let snakeArr = [
    { x: 20, y: 22 },
    { x: 20, y: 23 },
    { x: 20, y: 24 },
    { x: 20, y: 25 },
];
let snakeArr2 = [
    { x: 12, y: 9 },
    { x: 12, y: 8 },
    { x: 12, y: 7 },
    { x: 12, y: 6 },
];
let food = { x: Math.round(1 + (30 - 1) * Math.random()), y: Math.round(1 + (30 - 1) * Math.random()) };

const eat = new Audio("./sound/eat.wav");
const hit = new Audio("./sound/hit.wav");
const click = new Audio("./sound/click.wav");
const startclick = new Audio("./sound/startclick.wav");
const speedsound = new Audio("./sound/speedsound.wav");
const bgmusic = new Audio("./sound/bgmusic.mp3");
click.playbackRate = 3;
speedsound.playbackRate = 0.5;
startclick.playbackRate = 2;

// changing color of food

const cl = [
    "#daae00",
    "#c1da00",
    "#28da00",
    "#00dada",
    "#0062da",
    "#ae00da",
    "#da005b",
];

let i = Math.floor(Math.random() * cl.length);
let j = i;
document.documentElement.style.setProperty("--food_color", cl[i]);

function change_color() {
    i = Math.floor(Math.random() * (6 - 0 + 1) - 0);

    document.documentElement.style.setProperty("--food_color", cl[i]);
    // document.documentElement.style.setProperty("--body_color", cl[j]);
    j = i;
}

// Game functions//
let isPause = false;
function speedup() {
    if (isPause) return;
    if (speed < 10) {
        speed += 1;
        bgmusic.playbackRate += 0.05;
        speedsound.play().catch(err => { if (err.name !== "AbortError") console.error(err); });;
        document.getElementById("board").style.border = "2px solid rgb(0, 199, 0)";
        document.getElementById("board").style.boxShadow = "0 0 6px rgb(0, 199, 0),inset 0 0 6px rgb(0, 199, 0);";
        
        setTimeout(() => {
            document.getElementById("board").style.border = "2px solid rgb(199, 0, 0)";
            document.getElementById("board").style.boxShadow = "0 0 6px rgb(199, 0, 0),inset 0 0 6px rgb(199, 0, 0);";
        }, 1500);
    }
}

function main(cTime) {
    if (collide === false) {
        window.requestAnimationFrame(main);
        if ((cTime - lastPaintTime) / 1000 < 1 / speed) {
            return;
        }
        lastPaintTime = cTime;
        gameEngine();
    }
}


let sn1 = false;
let sn2 = false;
function isCollide(snake, snake2) {
    // if snake1 is eat own body
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) sn1 = true;
    }
    // if snake2 is eat own body
    for (let i = 1; i < snake2.length; i++) {
        if (snake2[i].x === snake2[0].x && snake2[i].y === snake2[0].y) sn2 = true;
    }

    //if snake1 hit the wall
    if (
        snake[0].x > 30 ||
        snake[0].x <= 0 ||
        snake[0].y > 30 ||
        snake[0].y <= 0
    ){
        sn1 = true;
        
    }
    //if snake2 hit the wall
    if (
        snake2[0].x > 30 ||
        snake2[0].x <= 0 ||
        snake2[0].y > 30 ||
        snake2[0].y <= 0
    ) sn2 = true;

    //if snake1 hits the snake2
    for (let i = 0; i < snake2.length; i++) {
        if (snake[0].x === snake2[i].x && snake[0].y === snake2[i].y) sn1 = true;
    }
    //if snake2 hits the snake1
    for (let i = 0; i < snake.length; i++) {
        if (snake2[0].x === snake[i].x && snake2[0].y === snake[i].y) sn2 = true;
    }

}

let dirChanged = false;
let dirChanged2 = false;
let pendingDir1 = null;
let pendingDir2 = null;

let start_btn = document.getElementById("start_btn");
let result = document.getElementById("result");

result.addEventListener('click', () => {
    result.style.display = 'none';
})

function generate_food() {
    let a = 1;
    let b = 30;
    let valid = false;
    let foodx, foody;

    while (!valid) {
        foodx = Math.round(a + (b - a) * Math.random());
        foody = Math.round(a + (b - a) * Math.random());
        valid = true;
        // Check against snake1 body
        for (let i = 0; i < snakeArr.length; i++) {
            if (snakeArr[i].x === foodx && snakeArr[i].y === foody) {
                valid = false;
                break;
            }
        }
        // Check against snake2 body
        if (valid) {
            for (let i = 0; i < snakeArr2.length; i++) {
                if (snakeArr2[i].x === foodx && snakeArr2[i].y === foody) {
                    valid = false;
                    break;
                }
            }
        }
    }

    return { x: foodx, y: foody };
}

function gameEngine() {

    if (pendingDir1 && !dirChanged) {
        inputDir = pendingDir1;
        pendingDir1 = null;
        dirChanged = true;
    }
    if (pendingDir2 && !dirChanged2) {
        inputDir2 = pendingDir2;
        pendingDir2 = null;
        dirChanged2 = true;
    }

    // Process Player 1's Input
    // if (inputQueue1.length > 0 && !dirChanged) {
    //     inputDir = inputQueue1.shift(); // Get the next direction for player 1
    //     dirChanged = true;
    // }
    
    // // Process Player 2's Input
    // if (inputQueue2.length > 0 && !dirChanged2) {
    //     inputDir2 = inputQueue2.shift(); // Get the next direction for player 2
    //     dirChanged2 = true;
    // }
    //if the snake1 eaten the food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {

        eat.play().catch(err => { if (err.name !== "AbortError") console.error(err); });

        change_color();
        food = generate_food();

        score1 += 1;
        scorebox1.innerHTML = "score = " + score1;

        //add a body part of snake
        snakeArr.unshift({
            x: snakeArr[0].x + inputDir.x,
            y: snakeArr[0].y + inputDir.y,
        });
    }
    //if snake2 eaten the food
    if (snakeArr2[0].x === food.x && snakeArr2[0].y === food.y) {
    
        eat.play().catch(err => { if (err.name !== "AbortError") console.error(err); });;
        
        change_color();
        food = generate_food();

        score2 += 1;
        scorebox2.innerHTML = "score = " + score2;

        //add a body part of snake
        snakeArr2.unshift({
            x: snakeArr2[0].x + inputDir2.x,
            y: snakeArr2[0].y + inputDir2.y,
        });
    }

    isCollide(snakeArr,snakeArr2);
    //update the snake array
    //moving the snake
    const nextX1 = snakeArr[0].x + inputDir.x;
    const nextY1 = snakeArr[0].y + inputDir.y;
    const nextX2 = snakeArr2[0].x + inputDir2.x;
    const nextY2 = snakeArr2[0].y + inputDir2.y;

    sn1 = sn1 || (nextX1 <= 0 || nextX1 > 30 || nextY1 <= 0 || nextY1 > 30);
    sn2 = sn2 || (nextX2 <= 0 || nextX2 > 30 || nextY2 <= 0 || nextY2 > 30);

    if(!sn1){
        for (let i = snakeArr.length - 2; i >= 0; i--) {
            snakeArr[i + 1] = { ...snakeArr[i] };
        }
        snakeArr[0].x = nextX1;
        snakeArr[0].y = nextY1;
    }

    // for 2nd snake
    if(!sn2){
        for (let i = snakeArr2.length - 2; i >= 0; i--) {        
            snakeArr2[i + 1] = { ...snakeArr2[i] };
        }
        snakeArr2[0].x = nextX2;
        snakeArr2[0].y = nextY2;
    }

    dirChanged = false;
    dirChanged2 = false;

    if (sn1 && sn2) {
        sn1 = false;
        sn2 = false;
        collide = true;
        hit.play().catch(err => { if (err.name !== "AbortError") console.error(err); });;
        bgmusic.pause();
        clearInterval(myspeed);
        inputDir = { x: 0, y: 0 };
        inputDir2 = { x: 0, y: 0 };

        let win_msg = "";
        if (score1 > score2) {
            win_msg = "Player 1 Wins";
            result.style.backgroundColor = "#ea371c";
        }
        else if (score1 < score2) {
            win_msg = "Player 2 Wins";
            result.style.backgroundColor = "#2590ee";
        }
        else {
            win_msg = "Its a Draw";
            result.style.backgroundColor = "#daae00";
        }

        result.innerText = win_msg;
        start_btn.style.display = "block";
        result.style.display = "block";

        speed = 3;
        snakeArr = [
            { x: 20, y: 22 },
            { x: 20, y: 23 },
            { x: 20, y: 24 },
            { x: 20, y: 25 },
        ];
        snakeArr2 = [
            { x: 13, y: 9 },
            { x: 13, y: 8 },
            { x: 13, y: 7 },
            { x: 13, y: 6 },
        ];

        return;
    }

    //display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add("head");
        }
        if (inputDir.x === 0 && inputDir.y === 1 && index === 0) {
            snakeElement.classList.add("down");
        }
        if (inputDir.x === 1 && inputDir.y === 0 && index === 0) {
            snakeElement.classList.add("right");
        }
        if (inputDir.x === -1 && inputDir.y === 0 && index === 0) {
            snakeElement.classList.add("left");
        } else {
            snakeElement.classList.add("snake");
        }
        board.appendChild(snakeElement);
    });
    snakeArr2.forEach((e, index) => {
        snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add("head2");
        }
        if (inputDir2.x === 0 && inputDir2.y === 1 && index === 0) {
            snakeElement.classList.add("down");
        }
        if (inputDir2.x === 1 && inputDir2.y === 0 && index === 0) {
            snakeElement.classList.add("right");
        }
        if (inputDir2.x === -1 && inputDir2.y === 0 && index === 0) {
            snakeElement.classList.add("left");
        } else {
            snakeElement.classList.add("snake2");
        }
        board.appendChild(snakeElement);
    });

    //display the food
    foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    board.appendChild(foodElement);
}

//main logic is here
//to update the screen for animation
// window.requestAnimationFrame(main);

let scorebox1 = document.getElementById('scorebox1');
let scorebox2 = document.getElementById('scorebox2');

function start() {
    bgmusic.currentTime = 0;
    bgmusic.playbackRate = 1;
    bgmusic.loop = true;
    bgmusic.play().catch(err => { if (err.name !== "AbortError") console.error(err); });;

    collide = false;

    startclick.play().catch(err => { if (err.name !== "AbortError") console.error(err); });;
    score1 = 0;
    score2 = 0;
    scorebox1.innerHTML = "score = " + score1;
    scorebox2.innerHTML = "score = " + score2;

    myspeed = setInterval(speedup, 20000);

    start_btn.style.display = 'none';
   
    window.requestAnimationFrame(main);

    inputDir = { x: 0, y: -1 };
    inputDir2 = { x: 0, y: 1 };

    window.addEventListener("keydown", (e) => {
        // Player 1 Inputs
        if (!dirChanged) {
            if (e.key === "ArrowUp" && inputDir.y !== 1) {
                fun("u", "p1");  // 'u' for up and 'p1' for Player 1
            }
            if (e.key === "ArrowRight" && inputDir.x !== -1) {
                fun("r", "p1");  // 'r' for right and 'p1' for Player 1
            }
            if (e.key === "ArrowDown" && inputDir.y !== -1) {
                fun("d", "p1");  // 'd' for down and 'p1' for Player 1
            }
            if (e.key === "ArrowLeft" && inputDir.x !== 1) {
                fun("l", "p1");  // 'l' for left and 'p1' for Player 1
            }
        }
    
        // Player 2 Inputs
        if (!dirChanged2) {
            if ((e.key === "w" || e.key === "W") && inputDir2.y !== 1) {
                fun("u", "p2");  // 'u' for up and 'p2' for Player 2
            }
            if ((e.key === "d" || e.key === "D") && inputDir2.x !== -1) {
                fun("r", "p2");  // 'r' for right and 'p2' for Player 2
            }
            if ((e.key === "s" || e.key === "S") && inputDir2.y !== -1) {
                fun("d", "p2");  // 'd' for down and 'p2' for Player 2
            }
            if ((e.key === "a" || e.key === "A") && inputDir2.x !== 1) {
                fun("l", "p2");  // 'l' for left and 'p2' for Player 2
            }
        }
    });
    
    
    
}


// for the mobile control
  
function fun(x, p) {
    if (p === 'p1' && !dirChanged) {
        if (x === "u" && inputDir.y !== 1) {
            pendingDir1 = { x: 0, y: -1 };
        } else if (x === "r" && inputDir.x !== -1) {
            pendingDir1 = { x: 1, y: 0 };
        } else if (x === "d" && inputDir.y !== -1) {
            pendingDir1 = { x: 0, y: 1 };
        } else if (x === "l" && inputDir.x !== 1) {
            pendingDir1 = { x: -1, y: 0 };
        }
        click.play().catch(err => { if (err.name !== "AbortError") console.error(err); });
    }

    if (p === 'p2' && !dirChanged2) {
        if (x === "u" && inputDir2.y !== 1) {
            pendingDir2 = { x: 0, y: -1 };
        } else if (x === "r" && inputDir2.x !== -1) {
            pendingDir2 = { x: 1, y: 0 };
        } else if (x === "d" && inputDir2.y !== -1) {
            pendingDir2 = { x: 0, y: 1 };
        } else if (x === "l" && inputDir2.x !== 1) {
            pendingDir2 = { x: -1, y: 0 };
        }
        click.play().catch(err => { if (err.name !== "AbortError") console.error(err); });
    }
}

// document.querySelectorAll('.play_btn').forEach(btn => {
//     btn.addEventListener('touchstart', (e) => {
//     e.preventDefault(); // prevent zoom, scroll, etc.
//     console.log(`Touched button: ${btn.id}`);
//     fun();
//   }, { passive: false });
// });


// to force full screen

// console.log(document.fullscreenElement);
// if (window.innerWidth <= 425) {
    function goFullScreen() {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    }

    const take_full = document.getElementById("take_full");
    take_full.addEventListener("click", () => {
        goFullScreen();
        take_full.style.display = "none";
    });


    let flg = 0;
    document.addEventListener("fullscreenchange", () => {

        if (!flg) flg = 1;
        else {

            if (document.fullscreenElement) {
                if(start_btn.style.display == 'none'){
                    collide = false;
                    isPause = false;
                    bgmusic.play().catch(err => { if (err.name !== "AbortError") console.error(err); });;
                    take_full.innerHTML = "";
                    take_full.style.background = "transparent";
                    requestAnimationFrame(main);
                }
                take_full.style.display = "none";
                // console.log("User Entered the page");
            }
            else {
                if (start_btn.style.display == 'none') {
                    collide = true;
                    isPause = true;
                    take_full.innerHTML = "Resume";
                    take_full.style.background = "rgb(0,0,0,0.8)";
                    bgmusic.pause();
                }
                take_full.style.display = "block";
                // console.log("User left the page");
            }
        }
    });
// }



function handleTouchStartMultitouch(event) {
    for (let touch of event.changedTouches) {
        const targetId = touch.target.id;

        // Player 1 Controls
        if (!dirChanged) {
            if (targetId === "up1" && inputDir.y !== 1) {
                fun("u", "p1");  // 'u' for up and 'p1' for Player 1
            }
            if (targetId === "right1" && inputDir.x !== -1) {
                fun("r", "p1");  // 'r' for right and 'p1' for Player 1
            }
            if (targetId === "down1" && inputDir.y !== -1) {
                fun("d", "p1");  // 'd' for down and 'p1' for Player 1
            }
            if (targetId === "left1" && inputDir.x !== 1) {
                fun("l", "p1");  // 'l' for left and 'p1' for Player 1
            }
        }

        // Player 2 Controls
        if (!dirChanged2) {
            if (targetId === "up2" && inputDir2.y !== 1) {
                fun("u", "p2");  // 'u' for up and 'p2' for Player 2
            }
            if (targetId === "right2" && inputDir2.x !== -1) {
                fun("r", "p2");  // 'r' for right and 'p2' for Player 2
            }
            if (targetId === "down2" && inputDir2.y !== -1) {
                fun("d", "p2");  // 'd' for down and 'p2' for Player 2
            }
            if (targetId === "left2" && inputDir2.x !== 1) {
                fun("l", "p2");  // 'l' for left and 'p2' for Player 2
            }
        }
    }
}

// ✅ Attach touch event to all control buttons
document.querySelectorAll(".play_btn").forEach(button => {
    button.addEventListener("touchstart", handleTouchStartMultitouch, { passive: true });
});
