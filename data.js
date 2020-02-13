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

const tile = [
	{ name: 'empty' },
	{ name: 'dirt' },
	{ name: 'floor' },
	{ name: 'ceiling' },
	{ name: 'Rwall' },
	{ name: 'Lwall' },
	{ name: 'RUcorner' },
	{ name: 'LUcorner' },
	{ name: 'RDcorner' },
	{ name: 'LDcorner' }
]

const sprite = [
	{
		name: 'player',
		x: 0,
		y: 0,
		xv: 0,
		yv: 0,
		code: (thisSprite, spriteNum) => {
			console.log(Math.max(-150 - thisSprite.yv, 0) / 20)
			thisSprite.yv += 0.07 - (keyInput.up * Math.max(-150 - thisSprite.yv, 0) / 20)

			if (keyInput.left) //walk
				thisSprite.xv -= keyInput.sprint * 0.05 + 0.1
			if (keyInput.right)
				thisSprite.xv += keyInput.sprint * 0.05 + 0.1

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
	sourceImgs('tile')
	sourceImgs('sprite')
}