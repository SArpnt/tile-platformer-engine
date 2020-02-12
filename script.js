const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const level = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
]

const tiles = [
    {
        img: document.createElement()
    }
]

function step(delta) {
    console.log(level[0][0])
    
    requestAnimationFrame(step)
}
function draw(x,y,) { //fix errors
    ctx.drawImage(level[0][0],x,y)
}
requestAnimationFrame(step)