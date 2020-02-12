const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const level = [
    [0,0,0],
    [0,0,0],
    [1,1,1]
]

const tiles = 
{img:imgCreate('test0.png')
    },{img:imgCreate('test1.png')}
]

function imgCreate(src) {
return document.createElement('img').setAttribute('src',src)
}

function step(delta) {
    draw(0,0)
    requestAnimationFrame(step)
}
function draw(ox,oy) {
for(let y in level) {
for(let x in level[y]){
    ctx.drawImage(tiles[level[y][x]].img,x*16+ox,y*16+oy)
}}
}
requestAnimationFrame(step)
