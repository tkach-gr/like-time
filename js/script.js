function parralax(e, obj) {
    let clientWidth = document.documentElement.clientWidth;
    let clientHeight = document.documentElement.clientHeight;

    if(clientWidth <= 768) { return; }

    let moveX = -((clientWidth / 2) - e.clientX) / 30;
    let moveY = -((clientHeight / 2) - e.clientY) / 30;
    
    obj.style.transform = `translate(${moveX}px, ${moveY}px)`;
}

let knight = document.getElementById("knight");
document.addEventListener("mousemove", e => (parralax(e, knight)));

let background = {
    initialize: function(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.points = [];
        this.spawnSpeed = 180;
        this.counter = 0;
        this.maxPointsAmount = 3;
        this.lineWidth = 1;
        this.lineColor = "white";
        this.point = { x: 30, y: 30 };
    },
    resize: function(width, height) {
        this.width = width;
        this.height = height;
    },
    moveLines: function() {
        let points = this.points;

        for(let y = 0; y < points.length; y++) {
            let lines = points[y].lines;

            for(let i = 0; i < lines.length; i++) {
                let line = lines[i];
                
                if(line.length !== line.maxLength) {
                    let secondX = line.x + line.dx * line.speed;
                    let secondY = line.y + line.dy * line.speed;
                    
                    line.length += Math.sqrt(Math.pow(secondX - line.x, 2) + Math.pow(secondY - line.y, 2));
                    
                    if(line.length > line.maxLength) line.length = line.maxLength;
                }
    
                line.x += line.dx * line.speed;
                line.y += line.dy * line.speed;
            }
        }
    },
    createLine: function(startX, startY, deg, speed, length) {
        return {
            x: startX,
            y: startY,
            dx: Math.sin(deg),
            dy: Math.cos(deg),
            speed,
            length: 0,
            maxLength: length
        }
    },
    createLines() {
        let points = this.points;

        for(let i = 0; i < points.length; i++) {
            let point = points[i];

            if(this.counter % point.spawnSpeed !== 0 || !point.isSpawning) continue;
        
            let x = point.x;
            let y = point.y;
            let deg = Math.floor(Math.random() * 1000) % 360;
            let speed = point.lineSpeed;
            let length = Math.floor(Math.random() * 100) %  point.minLength + point.maxLength - point.minLength;
    
            point.lines.push(this.createLine(x, y, deg, speed, length));
    
            if(point.lines.length > point.maxLinesAmount) { point.lines.shift(); }
        }
    },
    createPoint: function() {
        let bg = this;
        let x = (Math.round(Math.random() * 10000) % (bg.width / 100 * 60)) + bg.width / 100 * 20;
        let y = (Math.round(Math.random() * 10000) % (bg.height / 100 * 60)) + bg.height / 100 * 20;
        return {
            x                : x,
            y                : y,
            lines            : [],
            isSpawning       : true,
            spawnSpeed       : 1,
            lineSpeed        : 5,
            minLength        : 20,
            maxLength        : 50,
            maxLinesAmount   : 50,
        }
    },
    createPoints: function() {
        if(this.counter % this.spawnSpeed !== 0) return;

        this.points.push(this.createPoint());
        
        if(this.points.length === this.maxPointsAmount) { 
            this.points[0].isSpawning = false;
        } else if (this.points.length > this.maxPointsAmount) {
            this.points.shift();
        }
    },
    drawLines: function() {
        ctx.clearRect(0, 0, this.width, this.height);
        
        for(let y = 0; y < this.points.length; y++) {
            let point = this.points[y];

            for(let i = 0; i < point.lines.length; i++) {
                let line = point.lines[i];
    
                ctx.beginPath();
                ctx.moveTo(line.x, line.y);
                ctx.lineTo(line.x + line.dx * line.length, line.y + line.dy * line.length);
                ctx.lineWidth = this.lineWidth;
                ctx.strokeStyle = this.lineColor;
                ctx.lineCap = 'round';
                ctx.stroke();
            }
        }
    },
    run: function() {
        this.moveLines();
        this.createPoints();
        this.createLines();
        this.drawLines();
        this.counter++;
    }
}

let canvas = document.getElementById("bg");
let ctx = canvas.getContext("2d");

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

background.initialize(ctx, canvas.clientWidth, canvas.clientHeight);

setInterval(() => background.run(), 20);
window.addEventListener("resize", e => {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    background.resize(canvas.clientWidth, canvas.clientHeight);

    if(canvas.width < 769) {
        background.maxPointsAmount = 1;
    }
});