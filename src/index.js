const PIXI = require('pixi.js')
const { Spine } = require('pixi-spine')
const app = new PIXI.Application({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    backgroundAlpha: 0,
    resolution: 1
});
document.body.appendChild(app.view);

app.stop();
// load spine data
app.loader.add('spine', './spine/M4A1_530.json').load(onAssetsLoaded);

app.stage.interactive = true;

function onAssetsLoaded(loader, res) {
    // instantiate the spine animation
    const spine = new Spine(res.spine.spineData);

    // create a container for the spine animation and add the animation to it
    const container = new PIXI.Container();
    container.addChild(spine);

    // measure the spine animation and position it inside its container to align it to the origin
    const localRect = spine.getLocalBounds();
    spine.position.set(-localRect.x, -localRect.y);

    // now we can scale, position and rotate the container as any other display object
    spine.scale.scope.pivot.set(0.5, 0.5)
    // container.
    container.position.set(app.screen.width - container.width - 120, app.screen.height - container.height - 80);

    // add the container to the stage
    app.stage.addChild(container);

    // once position and scaled, set the animation to play
    spine.state.setAnimation(0, 'wait', true);

    app.start();

    init(app, container, spine)

    window.app = app
}

let animationName = 'wait'
// 拖拽
function addDragEvent(app, container, auto) {
    const canvas = app.view
    let x, y, l, t, nl, nt
    let isDown = false
    app.stage.on('pointerdown', (e) => {
        e = e.data.originalEvent
        x = e.clientX - canvas.offsetLeft
        y = e.clientY - canvas.offsetTop
        l = container.x
        t = container.y - 100
        // 当鼠标位置在人物身上时
        isDown = true
        container.children[0].state.setAnimation(0, 'pick', true)
        container.position.set(l, t)
    })
    document.onmousemove = function (e) {
        if (!isDown) return
        let nx = e.clientX - canvas.offsetLeft
        let ny = e.clientY - canvas.offsetTop
        nl = nx - (x - l)
        nt = ny - (y - t)
        container.position.set(nl, nt);
    }
    document.onmouseup = function () {
        if (isDown) {
            container.children[0].state.setAnimation(0, 'wait', true)
            container.position.set(nl, nt + 100);
            auto()
        }
        isDown = false;
    }
}

function init(app, container, spine) {
    addDragEvent(app, container, auto)

    let timer = null
    let timer2 = null
    let timer3 = null

    //  角色移动move
    function move() {

        let speed = 5
        clearInterval(timer)
        // 每6秒确定一个方向移动
        timer = setInterval(() => {
            if (animationName !== 'move') {
                spine.state.setAnimation(0, 'move', true);
                animationName = 'move'
            }
            let angle = Math.random() * 2 * Math.PI
            let hr = Math.cos(angle)
            let vt = Math.sin(angle)

            clearInterval(timer2)
            // 随机方向移动   遇到边界返回
            timer2 = setInterval(() => {
                // console.log(container._localBoundsRect.width); // width一直在变化 11x ~ 14x
                // 左右边缘
                if (container.x < 0 || container.x + 144 > app.view.width) {
                    hr = -hr
                }
                // 上下边缘
                else if (container.y < 0 || container.y + container.height > app.view.height) {
                    vt = -vt
                }
                if (hr < 0) {
                    if (spine.scale.x !== -1) {
                        spine.scale.x = -1
                    }
                } else {
                    if (spine.scale.x !== 1) {
                        spine.scale.x = 1
                    }
                }
                container.position.set(container.x + hr * speed, container.y + vt * speed)
            }, 33);

        }, 10000)
    }

    // lie
    function lie(c) {
        clearInterval(timer)
        clearInterval(timer2)
        if (c) {
            clearInterval(timer3)
        }
        if (animationName !== 'lying') {
            spine.state.setAnimation(0, 'lying', true);
            animationName === 'lying'
        }

    }

    // wait
    function wait() {
        clearInterval(timer)
        clearInterval(timer2)
        if (animationName !== 'wait') {
            spine.state.setAnimation(0, 'wait', true);
            animationName === 'wait'
        }
    }

    // 自动随机
    function start() {
        let n = Math.floor(Math.random() * 3)
        switch (n) {
            case 0:
                move()
                break
            case 1:
                lie()
                break
            case 2:
                wait()
                break
        }
    }

    function auto() {
        clearInterval(timer3)
        start()
        timer3 = setInterval(start, 100000);
    }
    auto()

    window.auto = auto
    window.lie = lie
}