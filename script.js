const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 480;


const k = kaboom({
  width: 800,
  height: 600,
  background: [0, 0, 0],
  root: document.querySelector(".game-container"),
});



console.log("Привет, Кабум!");


loadSprite("bean", "sprites/bean.png");




scene("game", () => {
    setGravity(2400);


    let score = 0;


    const scoreLabel = add([
        text(score),
        pos(12, 12),
    ])

    onUpdate(() => {
    score++;
    scoreLabel.text = score;
    });


        // add platform
    add([
        rect(width(), 20),
        pos(0, height() - 20),
        outline(4),
        area(),
        body({
            isStatic: true, 
        }),
        color(0, 0, 255),
        ]) 


    const bean = add([
    sprite("bean"),
    pos(400, height() - 100),
    body(),
    area(),
    ]);

    function jump() {
        if (bean.isGrounded()) {
            bean.jump(JUMP_FORCE);
        }
    }

    function spawnTree() {
        add([
            rect(64, 64),
            area(),
            outline(4),
            pos(width(), height() - 10),
            anchor("botleft"),
            color(255, 180, 255),
            move(LEFT, 240),
            'tree',
        ]);
        wait(rand(1, 2), spawnTree);
    }


    spawnTree();
    onKeyPress("space", jump);
    onClick(jump);
     


    bean.onCollide("tree", () => {
        addKaboom(bean.pos);
        shake();
        go("lose")
    });  



    // loop(1,() => {



    //     wait(rand(0.5, 1.5), () => {
    //         console.log("Спавним дерево");
    //         spawnTree();
    //     });

    // });




});


scene("lose", () => {
    add([
        text("Game Over"),
        pos(center()),
        anchor("center"),
    ])

    onClick(() => {
        go("game");
    });
})

go("game")
