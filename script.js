kaboom({
  global: true,
  debug: true,
  fullscreen: true,
  scale: 1,
  clearColor: [0, 0, 0, 1],
});

loadRoot("/dino/");
loadSprite('dino1', "sheets/tard.png", {
  sliceX: 24, // Number of cols
  sliceY: 1, // Number of rows
  anims: {
    main: {
      from: 0, // Range of frames for main animation
      to: 23,
    },
    running: {
      from: 24, // Range of frames for running animation
      to: 47,
    }
  }
});
loadSprite("bg", "grass.png");
loadSprite("pipe", "pipe.png");

scene("main", () => {
  
  const PIPE_MARGIN = 40;
  const PIPE_OPEN = 140;
  const PIPE_WIDTH = 200;
  const SPEED = 150;
  const JUMP_FORCE = 320;
  
  gravity(1200);
  
  // define layers and the default layer
  layers([
    "main",
    "ui",
    ]), "main"
  
  // background
  add([
    sprite("bg"),
    scale(35),
  ]);

  //player 
  const player = add([
    sprite('dino1'),
    pos(80, 80),
    scale(2),
    area(vec2(3, 4), vec2(21, 20)),
    body(),
    'player',
  ]);
  
  let score = 0;
  
  const scoreLabel = add([
    text(score, 32),
    pos(12, 12),
    layer("ui"),
  ]);

  // pipes
  loop(2, () => {
    const center = rand(
      PIPE_MARGIN + PIPE_OPEN / 2,
      height() - PIPE_MARGIN - PIPE_OPEN / 2
      );
    
    add([
      sprite("pipe", { flipY: true }),
      pos(width(), center - PIPE_OPEN / 2 ),
      origin("botleft"),
      area(vec2(20, -300), vec2(75, 0)),
      "pipe",
    ]);
    
    add([
      sprite("pipe"),
      pos(width(), center + PIPE_OPEN / 2 ),
      area(vec2(20, 300), vec2(75, 0)),
      "pipe",
      { passed: false },
      ]);
    
  });

    keyPress('space', () => {
    player.jump(JUMP_FORCE);
  });

  action("pipe", (pipe) => {
    pipe.move(-SPEED, 0);
    
    // increment score if pipe move pass the player
    if (pipe.passed === false && (pipe.pos.x + 20) < player.pos.x) {
        pipe.passed = true;
        score += 1;
        scoreLabel.text = score;
        debug.log("pipe pos " + pipe.pos.x);
        debug.log("player pos " + player.pos.x);
    }
    
    // destroy it it's out of view
    if (pipe.pos.x < -pipe.width) {
      destroy(pipe);
    }
  });

  player.collides("pipe", () => {
    go("lose", score);
    debug.log("oh  ho!");
  });

  player.action(() => {
    if (player.pos.y > height()) {
      go("lose", score);
    }
  });

}); // end of main scene

scene("lose", (score) => {
  
  add([
    text(score, 64),
    pos(250, 150),
    origin("center"),
  ]);

  keyPress("space", () => {
    go("main");
  });

})

start("main");
