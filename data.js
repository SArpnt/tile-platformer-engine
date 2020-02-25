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
	[2, 1, 1, 1, 2, 2, 2, 2, 2, 6, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0, 0, 0, 0, 0]
]

const tile = [
	{
		name: 'empty',
		collide: {
			up: false,
			down: false,
			left: false,
			right: false
		}
	},
	{
		name: 'dirt',
		collide: {
			up: false,
			down: false,
			left: false,
			right: false
		}
	},
	{
		name: 'floor',
		collide: {
			up: true,
			down: false,
			left: false,
			right: false
		}
	},
	{
		name: 'ceiling',
		collide: {
			up: false,
			down: true,
			left: false,
			right: false
		}
	},
	{
		name: 'Rwall',
		collide: {
			up: false,
			down: false,
			left: false,
			right: true
		}
	},
	{
		name: 'Lwall',
		collide: {
			up: false,
			down: false,
			left: true,
			right: false
		}
	},
	{
		name: 'RUcorner',
		collide: {
			up: true,
			down: false,
			left: false,
			right: true
		}
	},
	{
		name: 'LUcorner',
		collide: {
			up: true,
			down: false,
			left: true,
			right: false
		}
	},
	{
		name: 'RDcorner',
		collide: {
			up: false,
			down: true,
			left: false,
			right: true
		}
	},
	{
		name: 'LDcorner',
		collide: {
			up: false,
			down: true,
			left: true,
			right: false
		}
	}
]

const sprite = {
	player: class {
		constructor(x, y) {
			this.pos = {
				x: x,
				y: y,
				xv: 0,
				yv: 0
			}
			this.scrollState = 0 //1 is right
			this.img = getImg('sprite', 'player')
		}

		update() {
			this.pos.last = Object.assign({}, this.pos)
			delete this.pos.last.last
			this.pos = this.move(this.pos)
			this.pos = this.collide(this.pos)

			{
				if ((() => {
					switch (this.scrollState) { //reset scrolling when changing direction partly
						case 1:
							return this.pos.xv < 0
						case -1:
							return this.pos.xv > 0
						default:
							return false
					}
				})()) this.scrollState = 0

				let i = this.pos.x + scrollX //player relative to camera

				if (i > ((this.scrollState == 1) ? 120 : 232)) //past scroll border
					this.scroll(1, 120)
				else if (i < ((this.scrollState == -1) ? 184 : 72))
					this.scroll(-1, 184)
			}
			return [['spawn', sprite.test, this.pos.x, this.pos.y + 8]]
		}

		move(pos) {
			pos.yv += 0.1 - (keyInput.up * Math.max(-1 - pos.yv, 0) / 30) //gravity (reduced on ascent while holding up for higher jumps)

			if (keyInput.left) // walk/run
				pos.xv -= 0.1 + keyInput.sprint * 0.05
			if (keyInput.right)
				pos.xv += 0.1 + keyInput.sprint * 0.05

			pos.y += pos.yv
			pos.x += pos.xv
			pos.xv /= 1.1

			return pos
		}

		scroll(state, a) {
			this.scrollState = state

			scrollX += (//scroll camera to final position based on movement
				(a - this.pos.x - scrollX) //final camera position
					> 0 ? Math.max : Math.min)(this.pos.xv * -2.5, 0)

			if (//jitter fix
				state == 1 ?
					this.pos.x + scrollX < a :
					this.pos.x + scrollX > a
			)
				scrollX = a - this.pos.x
		}

		collide(pos) {
			var push = {
				up: function (pos) {
					let i = Math.floor(pos.y / 16) * 16
					if (pos.last.y <= i) {
						if (pos.y >= i) {
							pos.y = i
							if (keyInput.up)
								pos.yv = -3 //jump
							else
								pos.yv = 0
						}
					}
					return pos
				},
				down: function (pos) {
					let i = Math.ceil(pos.y / 16) * 16
					if (pos.last.y >= i) {
						if (pos.y <= i) {
							pos.y = i
							pos.yv = 0
						}
					}
					return pos
				},
				left: function (pos) {
					let i = Math.floor(pos.x / 16) * 16
					if (pos.last.x <= i) {
						if (pos.x >= i) {
							pos.x = i
							pos.xv = 0
						}
					}
					return pos
				},
				right: function (pos) {
					let i = Math.ceil(pos.x / 16) * 16
					if (pos.last.x >= i) {
						if (pos.x <= i) {
							pos.x = i
							pos.xv = 0
						}
					}
					return pos
				}
			}

			var cTile

			cTile = getTile(pos.x, pos.y).collide
			if (cTile.up)
				pos = push.up(pos)
			cTile = getTile(pos.x, pos.y - 16).collide
			if (cTile.down)
				pos = push.down(pos)

			pos.x -= 16

			cTile = getTile(pos.x, pos.y).collide
			if (cTile.up)
				pos = push.up(pos)
			cTile = getTile(pos.x, pos.y - 16).collide
			if (cTile.down)
				pos = push.down(pos)

			pos.x += 16

			cTile = getTile(pos.x - 16, pos.y).collide
			if (cTile.right)
				pos = push.right(pos)
			cTile = getTile(pos.x, pos.yv).collide
			if (cTile.left)
				pos = push.left(pos)

			pos.y -= 16

			cTile = getTile(pos.x - 16, pos.y).collide
			if (cTile.right)
				pos = push.right(pos)
			cTile = getTile(pos.x, pos.y).collide
			if (cTile.left)
				pos = push.left(pos)

			pos.y += 16
			
			function getTile(x, y) {
				try {
					if (x <= -16 || y <= -16) throw TypeError
					return tile[level
					[Math.ceil(y / 16)]
					[Math.ceil(x / 16)]]
				}
				catch (TypeError) {
					return tile[0]
				}
			}
			return pos
		}

	},
	test: class {
		constructor(x, y) {
			this.pos = {
				x: x,
				y: y
			}
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