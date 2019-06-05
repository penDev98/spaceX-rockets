import { Vector } from './vector.js'

class Rocket {
    constructor(startingX, startingY, id, name, firstStageFuel, secondStageFuel) {
        this.id = id;
        this.name = name;
        this.firstStageFuel = firstStageFuel;
        this.secondStageFuel = secondStageFuel;
        this.maxFuel = firstStageFuel + secondStageFuel;
        this.fuelBar = 100 * (this.firstStageFuel + this.secondStageFuel) / this.maxFuel;
        this.rocketTop = new Image();
        this.rocketTop.src = "../assets/rocket_top.png";
        this.rocketBottom = new Image();
        this.rocketBottom.src = "../assets/rocket_bottom.png"
        this.exhaust = new Image();
        this.exhaust.src = "../assets/thrust.png"
        this.started = false;

        this.height = this.rocketTop.height + this.rocketBottom.height;
        this.width = this.rocketBottom.width;

        this.startingX = (startingX * this.id) - this.width;
        this.startingY = startingY - (this.height > 0 ? this.height : 100);

        this.acceleration = new Vector(0, -.0009);

        this.restart();
    }

    inbounds(x, y, h, w, canvasHeight, canvasWidth) {
        if (x > canvasWidth || (x + w) < 0 || (y + h) < 0 || y > canvasHeight) {
            return false;
        }
        else {
            return true;
        }
    }

    restart() {
        this.position = new Vector(this.startingX, this.startingY);
        this.velocity = new Vector(0, 0);
    }

    animate(ctx, canvasHeight, canvasWidth) {
        let position = this.position;
        this.velocity.add(this.acceleration);
        position.add(this.velocity);

        if (!this.inbounds(position.x, position.y, this.height, this.width, canvasHeight, canvasWidth)) {
            return 'END';
        }

        if (this.secondStageFuel > 1) {
            if (this.started) {
                ctx.fillStyle = 'red';

                let firstStageBarWidth = this.fuelBar * (this.firstStageFuel / this.maxFuel);
                let secondStageBarWidth = this.fuelBar * (this.secondStageFuel / this.maxFuel);

                if (this.fuelBar < 0) {
                    this.fuelBar = 0;
                }
                ctx.fillRect(position.x - 15, position.y - 20, secondStageBarWidth, 10);
                ctx.fillStyle = 'green';
                ctx.fillRect(position.x - 15 + secondStageBarWidth, position.y - 20, firstStageBarWidth, 10);
                ctx.strokeStyle = 'white';
                ctx.strokeRect(position.x - 15, position.y - 20, 100, 10);
            }
            if (this.started && this.firstStageFuel > 1) {
                ctx.drawImage(this.exhaust, position.x + 11.5, position.y + 75)
            }
            else if (this.started) {
                ctx.drawImage(this.exhaust, position.x + 11.5, position.y + 45)
            }
            ctx.drawImage(this.rocketTop, position.x, position.y)
            if (this.firstStageFuel > 1) {
                ctx.globalAlpha = 1 - (1 / (this.firstStageFuel));
                ctx.drawImage(this.rocketBottom, position.x, position.y + this.rocketTop.height)
                ctx.globalAlpha = 1;
            }
        }
        else return;
    }

    startFuelConsumption() {
        this.started = true;
        const interval = setInterval(() => {
            if (this.firstStageFuel > 1) {
                this.firstStageFuel--;
            }
            else if (this.secondStageFuel > 1) {
                this.secondStageFuel--;
            }
            else clearInterval(interval);
            //made it quicker than 1 tone of fuel per second, so that the results are better to see
        }, 30)
    }
}

export { Rocket };