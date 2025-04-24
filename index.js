// Game constant and variables
let inputDir = { x: 0, y: 0 };
let inputDir2 = { x: 0, y: 0 };
let lastPaintTime = 0;
let collide = false;
var myspeed;
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

let i = Math.floor(Math.random() * (6 - 0 + 1) - 0);
let j = i;
document.documentElement.style.setProperty("--food_color", cl[i]);

function change_color() {
    i = Math.floor(Math.random() * (6 - 0 + 1) - 0);

    document.documentElement.style.setProperty("--food_color", cl[i]);
    // document.documentElement.style.setProperty("--body_color", cl[j]);
    j = i;
}

// Game functions//
function speedup() {
    if (speed < 10) {
        speed += 1;
        bgmusic.playbackRate += 0.05;
        speedsound.play();
        if (speed == 10) {
            document.getElementById("popup_box").innerText = "Reached MAX Speed";
            document.getElementById("popup_box").style.opacity = "1";
        } else {
            document.getElementById("popup_box").innerText = "Speed Up >>>>";
            document.getElementById("popup_box").style.opacity = "1";
        }
        setTimeout(() => {
            document.getElementById("popup_box").style.opacity = "0";
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

function isCollide(snake,snake2) {
    // if snake is eat own body
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    //if snake hit the wall
    if (
        snake[0].x > 30 ||
        snake[0].x <= 0 ||
        snake[0].y > 30 ||
        snake[0].y <= 0
    ) {
        return true;
    }

    //if snake hits the snake2
    for (let i = 0; i < snake2.length; i++) {
        if (snake[0].x === snake2[i].x && snake[0].y === snake2[i].y) {
            return true;
        }
    }
}

let dirChanged = false;
let dirChanged2 = false;

let start_btn = document.getElementById("start_btn");
let result = document.getElementById("result");

result.addEventListener('click',()=>{
    result.style.display = 'none';
})

function gameEngine() {
    dirChanged = false;
    dirChanged2 = false;
    //if the snake1 eaten the food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        let a = 1;
        let b = 30;
        eat.play();
        change_color();
        for (let i = 0; i < snakeArr.length; i++) {
            let foodx = Math.round(a + (b - a) * Math.random());
            let foody = Math.round(a + (b - a) * Math.random());
            if (foodx === snakeArr[i].x && foody === snakeArr[i].y) {
                i = 0;
                continue;
            } else {
                food = { x: foodx, y: foody };
            }
        }
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
        let a = 1;
        let b = 30;
        eat.play();
        change_color();
        for (let i = 0; i < snakeArr2.length; i++) {
            let foodx = Math.round(a + (b - a) * Math.random());
            let foody = Math.round(a + (b - a) * Math.random());
            if (foodx === snakeArr2[i].x && foody === snakeArr2[i].y) {
                i = 0;
                continue;
            } else {
                food = { x: foodx, y: foody };
            }
        }
        score2 += 1;
        scorebox2.innerHTML = "score = " + score2;

        //add a body part of snake
        snakeArr2.unshift({
            x: snakeArr2[0].x + inputDir2.x,
            y: snakeArr2[0].y + inputDir2.y,
        });
    }

    //update the snake array
    //moving the sanake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // for 2nd snake
    for (let i = snakeArr2.length - 2; i >= 0; i--) {
        snakeArr2[i + 1] = { ...snakeArr2[i] };
    }
    snakeArr2[0].x += inputDir2.x;
    snakeArr2[0].y += inputDir2.y;

    if (isCollide(snakeArr, snakeArr2) || isCollide(snakeArr2, snakeArr)) {
        collide = true;
        hit.play();
        bgmusic.pause();
        clearInterval(myspeed);
        inputDir = { x: 0, y: 0 };
        inputDir2 = { x: 0, y: 0 };

        let win_msg = "";
        if(score1 > score2){
            win_msg = "Player 1 Wins";
            result.style.backgroundColor = "#ea371c";
        }
        else if(score1 < score2){
            win_msg = "Player 2 Wins";
            result.style.backgroundColor = "#2590ee";
        }
        else{
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

    // if (score > hiscoreval) {
    //     hiscoreval = score;
    //     localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
    //     hiscorebox.innerHTML = "Hi score = " + hiscoreval;
    // }
}

//main logic is here
//to update the screen for animation
// window.requestAnimationFrame(main);

function start() {
    bgmusic.currentTime = 0;
    bgmusic.playbackRate = 1;
    bgmusic.loop = true;
    bgmusic.play();

    collide = false;

    startclick.play();
    score1 = 0;
    score2 = 0;
    scorebox1.innerHTML = "score = " + score1;
    scorebox2.innerHTML = "score = " + score2;
    // document.documentElement.style.setProperty("--body_color", "white");
    // document.documentElement.style.setProperty("--body_color", "white");

    myspeed = setInterval(speedup, 20000);

    start_btn.style.display = 'none';
    // setTimeout(() => {
        // document.getElementById("start_btn").style.display = "none";
    // }, 400);
    window.requestAnimationFrame(main);

    inputDir = { x: 0, y: -1 };
    inputDir2 = { x: 0, y: 1 };

    window.addEventListener("keydown", (e) => {
        if (!dirChanged) {
            if (e.key === "ArrowUp" && inputDir.y !== 1) {
                inputDir.x = 0;
                inputDir.y = -1;
                click.play();
            }
            if (e.key === "ArrowRight" && inputDir.x !== -1) {
                inputDir.x = 1;
                inputDir.y = 0;
                click.play();
            }
            if (e.key === "ArrowDown" && inputDir.y !== -1) {
                inputDir.x = 0;
                inputDir.y = 1;
                click.play();
            }
            if (e.key === "ArrowLeft" && inputDir.x !== 1) {
                inputDir.x = -1;
                inputDir.y = 0;
                click.play();
            }
        }

        // Player 2 (WASD Keys)
        if (!dirChanged2) {
            if (e.key === "w" || e.key === "W") {
                if (inputDir2.y !== 1) {
                    inputDir2.x = 0;
                    inputDir2.y = -1;
                    click.play();
                }
            }
            if (e.key === "d" || e.key === "D") {
                if (inputDir2.x !== -1) {
                    inputDir2.x = 1;
                    inputDir2.y = 0;
                    click.play();
                }
            }
            if (e.key === "s" || e.key === "S") {
                if (inputDir2.y !== -1) {
                    inputDir2.x = 0;
                    inputDir2.y = 1;
                    click.play();
                }
            }
            if (e.key === "a" || e.key === "A") {
                if (inputDir2.x !== 1) {
                    inputDir2.x = -1;
                    inputDir2.y = 0;
                    click.play();
                }
            }
        }
    });
}




// let hiscore = localStorage.getItem("hiscore");
// if (hiscore === null) {
    // hiscoreval = 0;
    // localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
// } else {
    // hiscoreval = JSON.parse(hiscore);
    // hiscorebox.innerHTML = "Hi score = " + hiscore;
// }

function fun(x,p) {
    if(p=='p1'){
        if (x === "u") {
            if (inputDir.y === 1) {
                return;
            }
            inputDir.x = 0;
            inputDir.y = -1;
            click.play();
        } else if (x === "r") {
            if (inputDir.x === -1) {
                return;
            }
            inputDir.x = 1;
            inputDir.y = 0;
            click.play();
        } else if (x === "d") {
            if (inputDir.y === -1) {
                return;
            }
            inputDir.x = 0;
            inputDir.y = 1;
            click.play();
        } else if (x === "l") {
            if (inputDir.x === 1) {
                return;
            }
            inputDir.x = -1;
            inputDir.y = 0;
            click.play();
        }
    }
    if(p=='p2'){
        if (x === "u") {
            if (inputDir2.y === 1) {
                return;
            }
            inputDir2.x = 0;
            inputDir2.y = -1;
            click.play();
        } else if (x === "r") {
            if (inputDir2.x === -1) {
                return;
            }
            inputDir2.x = 1;
            inputDir2.y = 0;
            click.play();
        } else if (x === "d") {
            if (inputDir2.y === -1) {
                return;
            }
            inputDir2.x = 0;
            inputDir2.y = 1;
            click.play();
        } else if (x === "l") {
            if (inputDir2.x === 1) {
                return;
            }
            inputDir2.x = -1;
            inputDir2.y = 0;
            click.play();
        }
    }
}

// To Register the Service Worker in index.js
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((reg) => console.log("Service Worker registered", reg))
        .catch((err) => console.error("Service Worker registration failed", err));
    });
  }
  

// to force full screen
//   function goFullScreen() {
//     const elem = document.body; // this makes the whole page fullscreen
//     if (elem.requestFullscreen) {
//       elem.requestFullscreen();
//     } else if (elem.webkitRequestFullscreen) { /* Safari */
//       elem.webkitRequestFullscreen();
//     } else if (elem.msRequestFullscreen) { /* IE11 */
//       elem.msRequestFullscreen();
//     }
//   }
  
  // Call this when user taps the start button
//   start_btn.addEventListener("click", () => {
//     goFullScreen();
//     start(); // or whatever function starts your game
//   });
  

  function goFullScreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  
    // Optional: Try to lock landscape mode
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock("landscape").catch((err) => {
        console.warn("Orientation lock failed:", err);
      });
    }
  }
  
  // Attach to your start button
//   const startBtn = document.getElementById("start_btn");
  
  start_btn.addEventListener("click", () => {
    goFullScreen();
    startGame(); // Your game start logic here
  });
  