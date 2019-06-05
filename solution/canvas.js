import { getRocketsData } from './fetch-requests.js';
import { Rocket } from './rocket.js'

const canvas = document.querySelector('canvas')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ctx = canvas.getContext("2d")

const background = new Image()
background.src = "../assets/bg.jpg";

background.onload = function () {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

const clearCanvas = () => {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

const rocketsArray = [];

getRocketsData()
    .then(data => beginDrawing(data));

const beginDrawing = (data) => {

    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";

    ctx.fillText("Rocket Launch", canvas.width / 2, canvas.height / 2)

    data.forEach(rocket => {
        console.log(rocket)
        let createRocket = new Rocket(canvas.width / (data.length + 1), canvas.height, rocket.rocketid, rocket.name, rocket.first_stage.fuel_amount_tons, rocket.second_stage.fuel_amount_tons)
        rocketsArray.push(createRocket)
    });

    let loopInterval;

    const drawIntro = () => {
        let interval;
        let countdown = 3;

        interval = setInterval(() => {
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            rocketsArray.forEach(rocket => {
                rocket.animate(ctx, canvas.height, canvas.width);
            });

            ctx.fillText(`Rocket Launch in ${countdown}`, canvas.width / 2, canvas.height / 2)
            if (countdown < 1) {
                clearInterval(interval);
                rocketsArray.forEach(rocket => {
                    rocket.startFuelConsumption();
                    rocket.animate(ctx, canvas.height, canvas.width);
                });
                loopInterval = setInterval(loop, 1000 / 60);
                ctx.font = "15px Comic Sans MS";
                ctx.fillStyle = "white";

            }
            countdown--;
        }, 1000)
    }

    drawIntro();

    const loop = () => {
        clearCanvas();
        rocketsArray.forEach(rocket => {
            if (rocket.animate(ctx, canvas.height, canvas.width) === 'END') {
                clearInterval(loopInterval);
                ctx.fillStyle = 'white';
                canvas.addEventListener('click', () => location.reload(), true);

                ctx.fillText("Click anywhere to restart", canvas.width / 2, canvas.height / 2)
            };
        });
    }
}