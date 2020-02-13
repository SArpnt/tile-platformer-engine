const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const level = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0],
	[0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0],
	[1, 1, 1, 1, 2, 2, 2, 2, 2, 6, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]

const tiles = [
	{ name: 'empty' },
	{ name: 'dirt' },
	{ name: 'floor' },
	{ name: 'ceiling' },
	{ name: 'Rwall' },
	{ name: 'Lwall' },
	{ name: 'RUcorner' },
	{ name: 'LUcorner' },
	{ name: 'RDcorner' },
	{ name: 'LDcorner' },
]

var sprites = [
	{
		name: 'player',
		x: 0,
		y: 0,
		xv: 0,
		yv: 0,
		code: (thisSprite, spriteNum) => {

			thisSprite.yv += 0.4 - (keyInput.up * Math.max(-150 - thisSprite.yv, 0) / 200)

			if (keyInput.left) //walk
				thisSprite.xv -= 2
			if (keyInput.right)
				thisSprite.xv += 200

			thisSprite.y += thisSprite.yv
			thisSprite.x += thisSprite.xv
			thisSprite.xv /= 1.1

			if (thisSprite.y >= 200) {
				thisSprite.y = 200
				if (keyInput.up)
					thisSprite.yv = -3 //jump
				else
					thisSprite.yv = 0
			}
			return thisSprite
		}
	}
]

{
	function sourceImgs(list) {
		for (let x in eval(list)) {
			let i = document.createElement('img')
			i.setAttribute("src", "assets/" + list + "/" + eval(list)[x].name + '.png')
			eval(list)[x].img = i
		}
	}
	sourceImgs('tiles')
	sourceImgs('sprites')
}

function step(ms) {

	runSprites()

	window.setTimeout(step, 8.333333333333334) //120 tps
}


function runSprites() {
	for (let spriteNum in sprites) {
		sprites[spriteNum] = sprites[spriteNum].code(sprites[spriteNum], spriteNum)
	}
}

function draw() {
	ctx.fillStyle = "magenta"
	ctx.fillRect(0, 0, 640, 480)//temporary sky
	drawTiles(0, 0)
	drawSprites(0, 0)
	requestAnimationFrame(draw)
}

function drawSprites(ox, oy) {
	for (let i in sprites) {
		ctx.drawImage(sprites[i].img, sprites[i].x * 2, sprites[i].y * 2)
	}
}

function drawTiles(ox, oy) {
	for (let y in level) {
		for (let x in level[y]) {
			ctx.drawImage(tiles[level[y][x]].img, (x * 16 + ox) * 2, (y * 16 + oy) * 2)
		}
	}
}
requestAnimationFrame(draw)

addEventListener("keydown", press(true))
addEventListener("keyup", press(false))

var keyInput = {
	up: false,
	down: false,
	left: false,
	right: false
}

function press(v) {
	return function (key) {
		switch (key.code) {
			case "ArrowUp":
				keyInput.up = v; break
			case "ArrowDown":
				keyInput.down = v; break
			case "ArrowLeft":
				keyInput.left = v; break
			case "ArrowRight":
				keyInput.right = v
		}
	}
}

step()