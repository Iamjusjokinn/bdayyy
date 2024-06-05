var countdowndate = new Date("Jun 13, 2024 00:00:00").getTime();
var x = setInterval(function() {
    var now = new Date().getTime();
    var distance = countdowndate - now;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML = hours;
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;

    if (distance < 0) {
        clearInterval(x);
        document.getElementById("days").innerHTML = "00";
        document.getElementById("hours").innerHTML = "00";
        document.getElementById("minutes").innerHTML = "00";
        document.getElementById("seconds").innerHTML = "00";
        document.getElementById("celebrate").style.display = 'block';
        document.getElementById("mainpage").style.display = 'none';
        initFireworks(); 
    }
}, 1000);

function initFireworks() {
    let canvas = document.querySelector("#canvas");
    let ctx = canvas.getContext("2d");
    let w, h;
    let fireworks = [],
        particles = [],
        circles = [];
    let fireworksMax = 50;
    let fireworksChance = 0.2;
    let hue = 0;

    function resizeReset() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        ctx.fillStyle = "#222";
        ctx.fillRect(0, 0, w, h);
    }

    function animationLoop() {
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(0, 0, 0, .1)";
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = "lighter";

        if (fireworks.length < fireworksMax && Math.random() < fireworksChance) {
            fireworks.push(new Firework());
            hue += 10;
        }

        drawScene();
        arrayCleanup();
        requestAnimationFrame(animationLoop);
    }

    function drawScene() {
        fireworks.forEach(firework => firework.update());
        fireworks.forEach(firework => firework.draw());
        particles.forEach(particle => particle.update());
        particles.forEach(particle => particle.draw());
        circles.forEach(circle => circle.update());
        circles.forEach(circle => circle.draw());
    }

    function arrayCleanup() {
        fireworks = fireworks.filter(firework => firework.alpha > 0);
        particles = particles.filter(particle => particle.size > 0);
        circles = circles.filter(circle => circle.size < circle.endSize);
    }

    function createFireworks(x, y, hue) {
        for (let i = 0; i < 10; i++) {
            particles.push(new Particle(x, y, hue, i));
        }
        circles.push(new Circle(x, y, hue));
    }

    function getRandomInt(min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    }

    function easeOutQuart(x) {
        return 1 - Math.pow(1 - x, 4);
    }

    class Firework {
        constructor() {
            this.x = getRandomInt(w * 0.3, w * 0.7);
            this.y = h;
            this.targetY = getRandomInt(h * 0.2, h * 0.4);
            this.hue = hue;
            this.alpha = 1;
            this.tick = 0;
            this.ttl = getRandomInt(120, 180);
        }
        draw() {
            if (this.tick <= this.ttl) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;
                ctx.fill();
                ctx.closePath();
            }
        }
        update() {
            let progress = 1 - (this.ttl - this.tick) / this.ttl;
            this.y = h - (h - this.targetY) * easeOutQuart(progress);
            this.alpha = 1 - easeOutQuart(progress);
            this.tick++;

            if (this.tick > this.ttl) {
                this.alpha = 0;
                createFireworks(this.x, this.y, this.hue);
            }
        }
    }

    class Particle {
        constructor(x, y, hue, i) {
            this.x = x;
            this.y = y;
            this.hue = hue;
            this.size = getRandomInt(2, 3);
            this.speed = getRandomInt(30, 40) / 10;
            this.angle = getRandomInt(0, 36) + 36 * i;
        }
        draw() {
            if (this.size > 0) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, 1)`;
                ctx.fill();
                ctx.closePath();
            }
        }
        update() {
            this.radian = (Math.PI / 180) * this.angle;
            this.x += this.speed * Math.sin(this.radian);
            this.y += this.speed * Math.cos(this.radian);
            this.size -= 0.05;
        }
    }

    class Circle {
        constructor(x, y, hue) {
            this.x = x;
            this.y = y;
            this.hue = hue;
            this.size = 0;
            this.endSize = getRandomInt(100, 130);
        }
        draw() {
            if (this.size < this.endSize) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, .2)`;
                ctx.fill();
                ctx.closePath();
            }
        }
        update() {
            this.size += 15;
        }
    }

    window.addEventListener("resize", resizeReset);
    resizeReset();
    animationLoop();
}
