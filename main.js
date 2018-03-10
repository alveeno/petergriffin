var AM = new AssetManager();
var gameEngine;
var firstDone = false;
var secondDone = false;
var thirdDone = true;
var lastX;

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

function MushroomDude(game, spritesheet, x, y) {
    this.animation = new Animation(spritesheet, 110, 100, 12, 0.15, 12, true, 1);
    this.x = x + 30;
    this.y = y + 30;
    this.speed = 0;
    this.game = game;
    this.ctx = game.ctx;
}

MushroomDude.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

MushroomDude.prototype.update = function () {
    if (this.animation.elapsedTime < this.animation.totalTime * 8 / 14)
        this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = -230;
}

function Cheetah(game, spritesheet, x, y) {
    this.animation = new Animation(spritesheet, 101, 156, 7, 0.10, 7, false, 1);
    this.x = x;
    this.y = y;
    this.speed = 250;
    this.game = game;
    this.ctx = game.ctx;
}

Cheetah.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

Cheetah.prototype.update = function () {
    if (this.animation.elapsedTime < this.animation.totalTime * 8 / 14)
        this.x += this.game.clockTick * this.speed;

    lastX = this.x;
    /*if (this.x > 200) {
        this.animation = new Animation(AM.getAsset("./img/ppp.png"), 110, 100, 12, 0.15, 12, true, 1);
        this.speed = 100;
    }*/
    //if (this.x > 800) this.x = -230;
    if (firstDone === false && this.animation.isDone()) {
      firstDone = true;
      console.log('we her2');
      gameEngine.addEntity(new Guy(gameEngine, AM.getAsset("./img/ppp.png"), this.x, this.y));
      //gameEngine.delete(new Cheetah(gameEngine, AM.getAsset("./img/pp.png"), this.x, this.y));

    }

}

function Guy(game, spritesheet, x, y) {
    this.animation = new Animation(spritesheet, 172, 137, 5, 0.15, 5, false, 1);
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.game = game;
    this.ctx = game.ctx;
}

Guy.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

Guy.prototype.update = function () {
  if (this.animation.elapsedTime < this.animation.totalTime * 8 / 14)
      this.x += this.game.clockTick * this.speed;

  lastX = this.x;

  if (secondDone === false && this.animation.isDone()) {
    secondDone = true;
    console.log('we her3');
    gameEngine.addEntity(new MushroomDude(gameEngine, AM.getAsset("./img/mushroomdude.png"), this.x, this.y));
    //gameEngine.delete(new Guy(gameEngine, AM.getAsset("./img/ppp.png"), this.x, this.y));

  }
}

AM.queueDownload("./img/RobotUnicorn.png");
AM.queueDownload("./img/pp.png");
AM.queueDownload("./img/mushroomdude.png");
AM.queueDownload("./img/ppp.png");
AM.queueDownload("./img/background.jpg");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    //gameEngine.addEntity(new MushroomDude(gameEngine, AM.getAsset("./img/mushroomdude.png")));
    gameEngine.addEntity(new Cheetah(gameEngine, AM.getAsset("./img/pp.png"), 0, 300));
    //gameEngine.addEntity(new Guy(gameEngine, AM.getAsset("./img/ppp.png")));
    console.log("All Done!");
});
