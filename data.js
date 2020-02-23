var scrollX = 0
var scrollY = 0

const level = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 2, 2, 2, 2, 2, 6, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0, 0, 0, 0, 0]
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
		scrollState: 0, //1 is right
		code: {
			init: (tS, spriteNum) => { //tS means thisSprite
				return tS
			},
			update: (tS, spriteNum) => {
				tS.yv += 0.1 - (keyInput.up * Math.max(-1 - tS.yv, 0) / 30) //gravity (reduced on ascent while holding up for higher jumps)

				if (keyInput.left) // walk/run
					tS.xv -= 0.1 + keyInput.sprint * 0.05
				if (keyInput.right)
					tS.xv += 0.1 + keyInput.sprint * 0.05

				tS.y += tS.yv
				tS.x += tS.xv
				tS.xv /= 1.1

				if (tS.y >= 176) { //fake collision
					tS.y = 176
					if (keyInput.up)
						tS.yv = -3 //jump
					else
						tS.yv = 0
				}

				{
					if ((() => {
						switch (tS.scrollState) { //reset scrolling when changing direction partly
							case 1:
								return tS.xv < 0
							case -1:
								return tS.xv > 0
							default:
								return false
						}
					})()) tS.scrollState = 0

					var i = tS.x + scrollX //player relative to camera

					if (i > ((tS.scrollState == 1) ? 120 : 232)) //past scroll border
						scroll(1, 120)
					else if (i < ((tS.scrollState == -1) ? 184 : 72))
						scroll(-1, 184)

					function scroll(state, a) {
						tS.scrollState = state

						scrollX += (//scroll camera to final position based on movement
							(a - tS.x - scrollX) //final camera position
								> 0 ? Math.max : Math.min)(tS.xv * -2.5, 0)
						var i = tS.x + scrollX //player relative to camera
						if (state == 1 ? i < a : i > a)//jitter fix
							scrollX = a - tS.x
					}
				}
				return tS
			}
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
