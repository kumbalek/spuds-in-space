/* #####Preload data##### */
window.addEventListener('load',init);
function init() {
        var stage,queue,preloadText,preloadRect;
        stage = new createjs.Stage("preload");
        stage.canvas.height = 35;
        stage.canvas.width = window.innerWidth/2;
        preloadText = new createjs.Text("Loading", "25px Arial", "#000");
        preloadText.textBaseline="middle";
        preloadText.textAlign="center";
        preloadText.x=stage.canvas.width/2;
        preloadText.y=stage.canvas.height/2;
        preload();
    function preload() {

        queue = new createjs.LoadQueue(true);
        queue.installPlugin(createjs.Sound);
        queue.loadManifest(
            [
                {"src": "data/audio/dead.wav", "id":"dead"},
                {"src": "data/audio/jump.wav", "id":"jump"},
                {"src": "data/audio/roll.wav", "id":"roll"},
                {"src": "data/audio/end.mp3", "id":"end"},
                {"src": "data/audio/carrot.wav", "id":"carrot"},
                {"src": "data/audio/msg.mp3", "id":"msg"},
                {"src": "data/audio/theme.mp3", "id":"theme"},
                {"id":"heroSS", "src": "data/animations/hero.json"},
                {"id":"level", "src": "data/levels/level.json"}

            ]
        );
        queue.on('progress', progress);
        queue.on('complete', startGame);
    }

    function progress(e) {
        preloadRect =  new createjs.Shape();
        preloadRect.graphics.f("red").r(0,0,Math.round(stage.canvas.width*e.progress),stage.canvas.height);
        stage.removeAllChildren();
        stage.addChild(preloadRect);
        stage.addChild(preloadText);
        var percent = Math.round(e.progress*100);
        preloadText.text = "Loading: " + percent + " %";
        stage.update(e);
    }

    function startGame() {
       // createjs.Sound.play("theme");
        dataLoaded(queue);
    }
}


/* ##### All data loaded ##### */

function dataLoaded(queue) {

    /* ##### changing preload canvas -> game canvas ##### */
    document.getElementById("preload").style.display = "none";
    document.getElementById("my1").style.display = "block";

    /* ##### Key handling http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/ ##### */
    var Key = {
        _pressed: {},

        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,

        isDown: function(keyCode) {
            return this._pressed[keyCode];
        },

        onKeydown: function(event) {
            this._pressed[event.keyCode] = true;
        },

        onKeyup: function(event) {
            delete this._pressed[event.keyCode];
        }
    };
    window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
    window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);



    var  stage,canvasH,canvasW,gravityConst,jumpConst,timeTock,levelName,level,levelSpeed,hero;

    levelSpeed=0;
    var levelCount = 1;
    timeTock = 0;
    stage = new createjs.Stage("my1");
    canvasW = stage.canvas.width = 1000;
    canvasH = stage.canvas.height = 420;
    gravityConst = 1.2;
    jumpConst = -18;
    startGame();
    hero = buildHero();
    stage.addChild(hero);
    level = buildLevel(levelCount);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick",tock);
    console.log(queue.getResult("theme"));
    createjs.Sound.play("theme");
    function tock(e) {
        timeTock++;
        moveLevel();
        gravity(hero);
        hero.update();
        stage.update(e);

    }

    function restartGame (currentLevel) {
        stage.removeAllChildren();
        hero = buildHero();
        stage.addChild(hero);
        level = buildLevel(currentLevel);

    }
    
    function endGame() {
        var dim = new createjs.Shape();
        dim.graphics.f("black").dr(0,0,canvasW,canvasH);
        dim.alpha = 0;
        stage.addChild(dim);
        var goText = new createjs.Text("Game Over","30px Arial","white");
        goText.textAlign = "center";
        goText.x = 500;
        goText.y = 200;
        goText.alpha = 0;
        stage.addChild(goText);
        var restartText = new createjs.Text("Play again?","20px Arial","white");
        restartText.textAlign = "center";
        restartText.x = 500;
        restartText.y = 250;
        restartText.alpha = 0;
        var hit = new createjs.Shape();
        hit.graphics.beginFill("#000").drawRect(-(restartText.getMeasuredWidth()/2), 0, restartText.getMeasuredWidth(), restartText.getMeasuredHeight());
        restartText.hitArea = hit;
        restartText.addEventListener("click", function () {
            restartGame(levelCount)
        });
        stage.addChild(restartText);
       createjs.Tween.get(dim).to({
            alpha: 1
        }, 750, createjs.Ease.cubicOut).call(function () {
           createjs.Tween.get(goText).to({
               alpha: 1}, 200, createjs.Ease.cubicIn).call(function () {
               createjs.Tween.get(restartText).to({
                   alpha: 1}, 200, createjs.Ease.cubicIn)
           });
       });
    }

    function startGame() {
        var startText = new createjs.Text("Spuds in space","40px Arial","black");
        startText.textAlign = "center";
        startText.x = 500;
        startText.y = 30;
        startText.alpha = 0;
        stage.addChild(startText);
        var info = new createjs.Text("Controls: 🡩 = jump, 🡩 🡩 = double jump, 🡪 = kick, 🡫 = roll. Try it!","20px Arial","black");
        info.textAlign = "center";
        info.x = 500;
        info.y = 100;
        info.alpha = 0;
        stage.addChild(info);
        var info2 = new createjs.Text("You must get to the space ship! Jump over boxes, roll in pipes ,kick Carrots asses and dont fall!","20px Arial","black");
        info2.textAlign = "center";
        info2.x = 500;
        info2.y = 150;
        info2.alpha = 0;
        stage.addChild(info2);
        var restartText = new createjs.Text("Start game!","30px Arial","black");
        restartText.textAlign = "center";
        restartText.x = 500;
        restartText.y = 200;
        restartText.alpha = 0;
        var hit = new createjs.Shape();
        hit.graphics.beginFill("#000").drawRect(-(restartText.getMeasuredWidth()/2), 0, restartText.getMeasuredWidth(), restartText.getMeasuredHeight());
        restartText.hitArea = hit;
        restartText.addEventListener("click", function () {
            levelSpeed=5;
            restartGame(levelCount)
        });
        stage.addChild(restartText);
            createjs.Tween.get(startText).to({
                alpha: 1}, 200, createjs.Ease.cubicIn).call(function () {
                createjs.Tween.get(restartText).to({
                    alpha: 1}, 200, createjs.Ease.cubicIn);
                createjs.Tween.get(info).to({
                    alpha: 1}, 200, createjs.Ease.cubicIn);
                createjs.Tween.get(info2).to({
                    alpha: 1}, 200, createjs.Ease.cubicIn)
            });
    }
    
    function nextLevel() {
        var dim = new createjs.Shape();
        dim.graphics.f("black").dr(0,0,canvasW,canvasH);
        dim.alpha = 0;
        stage.addChild(dim);
        var goText = new createjs.Text("Level complete","30px Arial","white");
        goText.textAlign = "center";
        goText.x = 500;
        goText.y = 200;
        goText.alpha = 0;
        stage.addChild(goText);
        var restartText = new createjs.Text("Next level","20px Arial","white");
        restartText.textAlign = "center";
        restartText.x = 500;
        restartText.y = 250;
        restartText.alpha = 0;
        var hit = new createjs.Shape();
        hit.graphics.beginFill("#000").drawRect(-(restartText.getMeasuredWidth()/2), 0, restartText.getMeasuredWidth(), restartText.getMeasuredHeight());
        restartText.hitArea = hit;
        restartText.addEventListener("click", function () {
            levelCount++;
            restartGame(levelCount);
            levelSpeed=5;
        });
        stage.addChild(restartText);
        createjs.Tween.get(dim).to({
            alpha: 1
        }, 750, createjs.Ease.cubicOut).call(function () {
            createjs.Tween.get(goText).to({
                alpha: 1}, 200, createjs.Ease.cubicIn).call(function () {
                createjs.Tween.get(restartText).to({
                    alpha: 1}, 200, createjs.Ease.cubicIn)
            });
        });
        
    }

    function dead (el) {

        createjs.Tween.get(el).to({
            x: el.x,
            y: el.y-250}, 150, createjs.Ease.cubicOut).call(function () {
            createjs.Tween.get(el).to({
                x: el.x,
                y: el.y+600}, 200, createjs.Ease.cubicIn)
        });
        if (el==hero) {
            createjs.Sound.play("end");
            endGame();
        } else {
            createjs.Sound.play("carrot");
        }

    }

    function buildHero() {
        /* ##### Hero definition ##### */
        var heroSS = new createjs.SpriteSheet(queue.getResult("heroSS"));
        var hero = new createjs.Sprite(heroSS,"right");
        hero.bounds = {width:54, height:72};
        hero.x = 100;
        hero.jumpConst = jumpConst;
        hero.doubleJump = false;
        hero.doubleJumpCounter = 1;
        hero.velocityY=0;
        hero.animating = false;
        hero.rolling = false;
        hero.kicking = false;
        hero.jumping = false;

        hero.grounded = false;



        hero.jump = function () {

            if (!hero.jumping) {
                createjs.Sound.play("jump");
                hero.jumping = true;
                hero.gotoAndStop(13);
                }

            if (hero.grounded) {

                hero.velocityY += hero.jumpConst;
                //hero.jumpConst = -1;
            } /*   ##### jumps depending on button time #####
             else if (hero.jumpConst>jumpConst) {
             hero.velocityY += hero.jumpConst;
             hero.jumpConst += -(hero.jumpConst/20);
             if (hero.jumpConst>0.001) {
             hero.jumpConst=jumpConst;
             }
             }*/
            else if (hero.doubleJump) {

                if (hero.doubleJumpCounter == 0) {
                    hero.gotoAndPlay("roll");
                    createjs.Sound.play("roll");
                    setTimeout(function () {
                        hero.gotoAndStop(13);
                    },250);
                }
                hero.doubleJump = false;
                hero.velocityY = 0;
                hero.velocityY += jumpConst;
            }
        };
        hero.roll = function () {
            if (!hero.animating) {
                createjs.Sound.play("dead");
                hero.animating=true;
                hero.rolling=true;
                hero.gotoAndPlay("roll");
                setTimeout(function () {
                    hero.gotoAndPlay("right");
                    hero.animating=false;
                    hero.rolling=false;
                },800);
            }

        };
        hero.kick = function () {
            if (!hero.animating) {
                createjs.Sound.play("roll");
                hero.animating=true;
                hero.kicking=true;
                hero.gotoAndPlay("kick");
                setTimeout(function () {
                    hero.gotoAndPlay("right");
                    hero.animating=false;
                    hero.kicking=false;
                },200);
            }

        };

        hero.update = function() {

            if (hero.y>420 && hero.y<450) {
                endGame();
            }
            function collisionEvent(obstacle) {

                var colLeft,colTop,colBot;
                var colX = hero.x+hero.bounds.width-obstacle.x;
                var colY = hero.y+hero.bounds.height-obstacle.y;
                var colVel = hero.velocityY;
                if (colX<levelSpeed){
                    colLeft = true;

                }
                if (colVel>colY) {
                    colTop = true;

                } else {
                    colBot = true;

                }
                switch(obstacle.colType) {
                    case "jump":
                        if (colLeft) {
                            dead(hero);
                            obstacle.colided = true;
                        } else {
                            if (hero.jumping) {
                                hero.gotoAndPlay("right");
                                hero.jumping=false;
                            }
                            hero.grounded=true;
                            hero.velocityY=0;
                            hero.doubleJumpCounter = 1;
                            hero.jumpConst=jumpConst;
                            hero.y=obstacle.y-hero.bounds.height;
                        }

                        break;
                    case "kick":

                        obstacle.colided = true;
                        if (!hero.kicking) {
                            dead(hero);
                        } else {
                            dead(obstacle);
                        }


                        break;
                    case "roll":

                        obstacle.colided = true;
                        if (!hero.rolling) {
                            dead(hero);
                        }

                        break;
                    case "ship":

                        nextLevel();
                        obstacle.colided = true;
                        levelSpeed = 0;

                        break;
                    case "ground":

                        if (colTop) {
                            if (hero.jumping) {
                                hero.gotoAndPlay("right");
                                hero.jumping=false;
                            }
                            hero.grounded=true;
                            hero.velocityY=0;
                            hero.doubleJumpCounter = 1;
                            hero.jumpConst=jumpConst;
                            hero.y=obstacle.y-hero.bounds.height;
                        }
                        break;
                    default:
                    console.log(obstacle);
                }
            }

            /*(function collisionGround() {
                if (hero.y+hero.bounds.height>=ground.y){
                    hero.grounded=true;
                    hero.velocityY=0;
                    hero.doubleJumpCounter = 1;
                    hero.jumpConst=jumpConst;
                    hero.y=ground.y-hero.bounds.height;
                }else {
                    hero.grounded=false;
                }
            })();*/
            (function collision() {
                hero.grounded=false;
                for (var key in level) {
                    if (!level.hasOwnProperty(key)) continue;

                    for (var i = 0; i<level[key].length;i++) {

                        if (
                            (
                                (level[key][i].x<=hero.x+hero.bounds.width && level[key][i].x+level[key][i].width >=hero.x+hero.bounds.width) ||
                                (level[key][i].x+level[key][i].width>=hero.x && hero.x+hero.bounds.width >= level[key][i].x)
                            )

                            &&
                            (
                                (level[key][i].y<=hero.y+hero.bounds.height && level[key][i].y+level[key][i].height >=hero.y+hero.bounds.height) ||
                                (level[key][i].y+level[key][i].height>=hero.y && hero.y+hero.bounds.height >= level[key][i].y)
                            )
                            && !level[key][i].colided
                        ) {

                            collisionEvent(level[key][i]);

                        }

                    }

                    /*
                    ##### collision counters for better performance #####
                    var collisionCounter = key + "Counter";
                    if (hero[collisionCounter]){

                        if (
                            (
                                (level[key][hero[collisionCounter]].x<=hero.x+hero.bounds.width && level[key][hero[collisionCounter]].x+level[key][hero[collisionCounter]].width >=hero.x+hero.bounds.width) ||
                                (level[key][hero[collisionCounter]].x+level[key][hero[collisionCounter]].width>=hero.x && hero.x+hero.bounds.width >= level[key][hero[collisionCounter]].x)
                            )

                            &&
                            (
                                (level[key][hero[collisionCounter]].y<=hero.y+hero.bounds.height && level[key][hero[collisionCounter]].y+level[key][hero[collisionCounter]].height >=hero.y+hero.bounds.height) ||
                                (level[key][hero[collisionCounter]].y+level[key][hero[collisionCounter]].height>=hero.y && hero.y+hero.bounds.height >= level[key][hero[collisionCounter]].y)
                            )

                            && !level[key][hero[collisionCounter]].colided
                        ) {

                            collisionEvent(key,level[key][hero[collisionCounter]]);
                            console.log(level[key][hero[collisionCounter]].x+level[key][hero[collisionCounter]].width);
                        }

                         ##### Adding counter in case of missing obstacle ####
                        if (level[key][hero[collisionCounter]].x+level[key][hero[collisionCounter]].width<hero.x+hero.bounds.width  && hero[collisionCounter]<level[key].length-1) {
                            console.log("next one");
                            hero[collisionCounter]++;
                        }
                    }*/
                }
            })();
            if (Key.isDown(Key.UP) && !hero.animating) {
                hero.jump()
            } else {
                hero.jumpConst=jumpConst;
                if (!hero.grounded && hero.doubleJumpCounter>0) {
                    hero.doubleJump= true;
                    hero.doubleJumpCounter--;
                }
            }

             //if (Key.isDown(Key.LEFT) && !hero.animating) ;
             if (Key.isDown(Key.DOWN) && !hero.animating) hero.roll();
             if (Key.isDown(Key.RIGHT) && !hero.animating) hero.kick();
        };
        return hero;
    }

    function buildLevel(levelCount) {
        levelName = "level_"+levelCount;
        var level = {};
        var myJson = queue.getResult("level")[levelName];
        /* ####Object loop from: http://stackoverflow.com/questions/921789/how-to-loop-through-plain-javascript-object-with-objects-as-members #####*/
        for (var key in myJson) {
            // skip loop if the property is from prototype
            if (!myJson.hasOwnProperty(key)) continue;
            var obj = myJson[key];
            level[key] = [];
            if (obj.length>1) {
            }
            for (var prop in obj) {
                // skip loop if the property is from prototype
                if(!obj.hasOwnProperty(prop) || prop == 0) continue;

                // prop = index
                // bitmap path,width and height are in first one only
                level[key][prop-1]= new createjs.Bitmap(myJson[key][0][2]);
                level[key][prop-1].width = myJson[key][0][3];
                level[key][prop-1].height = myJson[key][0][4];
                level[key][prop-1].colType = myJson[key][0][5];
                level[key][prop-1].colided = false;
                level[key][prop-1].x = myJson[key][prop][0];
                level[key][prop-1].y = myJson[key][prop][1];

                //exclude first one (prototype)
                stage.addChild(level[key][prop-1]);
            }
        }

        return level;
    }

    function moveLevel() {
        for (var key in level) {
            if (!level.hasOwnProperty(key)) continue;
            var levelArr = level[key];
            levelArr.forEach(move);
            function move(item) {
                item.x-=levelSpeed;
            }
            }



    }

    function gravity(el) {
        if (!el.grounded) {
            el.velocityY += gravityConst;
            el.y += el.velocityY;
        } else if (el.velocityY<0) {
        el.velocityY += gravityConst;
        el.y += el.velocityY;}
    }

}
