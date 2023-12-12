import kaboom from "kaboom"

//make each b in the map spawn zombies at a almost random intervals and have each cycle through a list that adds more harder zombies as the time increases.
//set 3 spawn functions for the 3 zombies, give each zombie health
//difficulty variable lessons with each second and increases the rate at which zombies spawn(this will be our high score and game ender)
//if the player survives long enough add a second turret



// initialize context
kaboom({
  width: 368,
  height: 254,
  scale: 2,
  canvas: document.querySelector("#mycanvas"),
  background: [ 0, 0, 255, ],
});

const zom1_speed = randi(40,50)
const zom2_speed = randi(60,70)
const zom3_speed = randi(10,20)
const BULLET_SPEED = 200
const TILE_SIZE = 32

//var Difficulty = 2 - score * 0.001

// load assets
loadRoot('sounds/')
loadSound("groan", "Groan.mp3")
loadSound("115", "115.mp3")
loadSound("hit", "hit.mp3")
loadRoot('images/')
loadSprite("turret", "turret.jpg")
loadSprite("railing", "railing.png")
loadSprite("barbed wire", "Barbed Wire.png")
loadSprite("floor", "wall.png")
loadSprite("wall", "wall.png")
loadSprite("e", "E.png")
loadSprite("t", "T.png")
loadSprite("a", "A.png")
loadSprite("gate", "gate.png")
loadSprite("zom1", "zom1.png")
loadSprite("background", "background.png")



scene("gameover", (score) => {
  add([
    text("Final Score:" + score , {
      size: 30,
      width: 390,
    }),
    pos(50, 32),
  ])
  add([
    text("Press space to play again", {
      size: 10,
      width: 390,
    }),
    pos(50, 70),
  ])
  onKeyPress("space", () => {
    go("main");
  });
});

scene("main", () => {
const map = addLevel([
  'rrrrr@rrrrr',
  'wwwwwwwwwww',
  'g         b',
  '          b',
  '          b',
  '          b',
  'fffffffffff',
],{
    width: 32,
    height: 32,
  
    "g": () => [ sprite("gate"), area(), solid(), "gate"],
    //"a": () => [ sprite("a"), area(), solid(), "gate"],
    //"t": () => [ sprite("t"), area(), solid(), "gate"],
    //"e": () => [ sprite("e"), area(), solid(), "gate"],
    "f": () => [ sprite("floor"), area(), solid(), ],
    "b": () => [ sprite("barbed wire"), area(), ],
    "w": () => [ sprite("wall"), area(), solid(), ],
    "r": () => [ sprite("railing"), area(), solid(), ],
    "@": () => [ sprite("turret"), area(), solid(), ],
    "&": () => [ sprite("background")],
  })

  const health = add([
    text("Gate Health: 10", {
      size: 15,
      width: 390,
    }),
    pos(150, 229),
    {
      value: 10,
    },
  ])
  let score = 0;
  const scoreLabel = add([
    text("Score:" + score, {
       size: 15,
       width: 390,
    }),
    pos(10, 229),
  ])
  Difficulty = 2
  // const score = add([
  //   text("Score: 0", {
  //     size: 15,
  //     width: 390,
  //   }),
  //   pos(10, 229),
  //   {
  //     value: 0,
  //   },
  // ])

  const music = play("115", {
      volume: 0.3,
      loop: true
  })

  music.pause()
  music.play()
  
  function spawnZombies() {
    zombie = add([sprite('zom1'),
    pos(320, randi( 64 , 160 )),
    area(),
    'zombie',
    move(180,zom1_speed)
    ])
    
    wait(Difficulty, spawnZombies);
    //play("groan");
  }
  spawnZombies();

  onUpdate(() => {
    score++;
    scoreLabel.text = "Score:" + score;
    if (Difficulty >= 0.2) {
      Difficulty -= 0.001
    }
  });
  
  onClick(() => {
    spawn_bullets(mousePos());

  onCollide( "bullet" , "zombie" , (b,z) => {
    play("hit"),
    destroy(b)
    destroy(z)
    //score.value += 1
    //score.text = "Score:" + score.value
  });
  onCollide( "gate" , "zombie" , (g,z) => {
    play("hit"),
    destroy(z)
    health.value --;
    health.text = "Gate Health:" + health.value
    if (health.value <= 0) {
      go("gameover", (score));
    }
  });
  });
});

//start('main', { level: 0, score: 0 })
go("main");

function vector(v) {
  x = ( v.x - 173.5 );
  y = ( v.y - 32 );
  return (180/3.14) * Math.atan2( y , x );
}

// shooting
function spawn_bullets(mousepos){
  v = mousepos;
  console.log(v);
  add([
    rect(5, 5),
    pos(173.5,32),
    color(0,0,0),
    area(),
    "bullet",
    move(vector(mousePos()),BULLET_SPEED),
    cleanup()
  ]);
}