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

const sprite = {
	player: class {
		constructor(x, y) {
			this.x = x
			this.y = y
			this.xv = 0
			this.yv = 0
			this.scrollState = 0 //1 is right
			this.img = getImg('sprite', 'player')
		}

		update() {
			this.yv += 0.1 - (keyInput.up * Math.max(-1 - this.yv, 0) / 30) //gravity (reduced on ascent while holding up for higher jumps)

			if (keyInput.left) // walk/run
				this.xv -= 0.1 + keyInput.sprint * 0.05
			if (keyInput.right)
				this.xv += 0.1 + keyInput.sprint * 0.05

			this.y += this.yv
			this.x += this.xv
			this.xv /= 1.1

			this.collide()

			{
				if ((() => {
					switch (this.scrollState) { //reset scrolling when changing direction partly
						case 1:
							return this.xv < 0
						case -1:
							return this.xv > 0
						default:
							return false
					}
				})()) this.scrollState = 0

				let i = this.x + scrollX //player relative to camera

				if (i > ((this.scrollState == 1) ? 120 : 232)) //past scroll border
					this.scroll(1, 120)
				else if (i < ((this.scrollState == -1) ? 184 : 72))
					this.scroll(-1, 184)
			}
			return [['spawn', sprite.test, this.x, this.y + 8]]
		}

		scroll(state, a) {
			this.scrollState = state

			scrollX += (//scroll camera to final position based on movement
				(a - this.x - scrollX) //final camera position
					> 0 ? Math.max : Math.min)(this.xv * -2.5, 0)

			if (//jitter fix
				state == 1 ?
					this.x + scrollX < a :
					this.x + scrollX > a
			)
				scrollX = a - this.x
		}

		collide() {
			console.log(
				tile[
					level
					[Math.trunc(this.y / 16)]
					[Math.trunc(this.x / 16)]
				]
					.name //change this
			)

			if (this.y >= 176) { //fake collision
				this.y = 176
				if (keyInput.up)
					this.yv = -3 //jump
				else
					this.yv = 0
			}
		}

	},
	test: class {
		constructor(x, y) {
			this.x = x
			this.y = y
			this.timer = 0
			this.img = getImg('sprite', 'test')
		}
		update() {
			if (this.timer >= 5)
				return [['kill']]
			//this.img.style = "opacity:" + (1 - (this.timer / 10))
			this.timer++
		}
	}
}

function getImg(type, img) {
	let i = document.createElement('img')
	i.src = "assets/" + type + "/" + img + '.png'
	return i
}

for (let x in tile) {
	tile[x].img = getImg('tile', tile[x].name)
}