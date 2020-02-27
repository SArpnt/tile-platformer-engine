var scrollX = 0
var scrollY = 0

const level = [
	[1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 2, 2, 2, 2, 2, 2, 2, 6, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0],
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
	},
	{
		name: 'bumpBox',
		collide: {
			up: true,
			down: true,
			left: true,
			right: true
		},
		onCollide: function (pos,sprite,side) {
			console.log('collided!')
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
			this.pos = sScript.move(this.pos, keyInput)
			this.pos = sScript.collide(this.pos, keyInput.up)[0]

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

	},
	enemy: class {
		constructor(x, y) {
			this.pos = {
				x: x,
				y: y,
				xv: 0,
				yv: 0
			}
			this.dir = true //true = right
			this.img = getImg('sprite', 'enemy')
		}

		update() {
			this.pos.last = Object.assign({}, this.pos)
			delete this.pos.last.last
			this.pos = sScript.move(this.pos,
				{ up: false, down: false, left: !this.dir, right: this.dir }
			)

			let i = sScript.collide(this.pos)
			this.pos = i[0]
			if (i[1].right || i[1].left)
				this.dir = !this.dir
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