const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const level = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
]

const tiles = [
    {}
]

function step(delta) {
    console.log(level[0][0])
    requestAnimationFrame(step)
}
requestAnimationFrame(step)