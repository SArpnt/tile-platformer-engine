sScript = {
	collide(pos, jump = false) {
		var collisions = {
			up: false,
			down: false,
			left: false,
			right: false
		}

		var push = {
			gen: function (xy, rev, dir, canJump = false) { //rev stands for reverse
				return function (pos, tile) {
					let i = Math[rev ? 'ceil' : 'floor'](pos[xy] / 16) * 16
					if (
						(rev ? pos : pos.last)[xy] <= i &&
						(rev ? pos.last : pos)[xy] >= i
					) {
						pos[xy] = i
						pos[xy + 'v'] = (canJump ? (jump ? -3 : 0) : 0) //jump
						collisions[dir] = true
						if (tile.onCollide) tile.onCollide(dir,tile.pos,null)
					}
					return pos
				}
			}
		}
		push.up = push.gen('y', false, 'up', true)
		push.down = push.gen('y', true, 'down')
		push.left = push.gen('x', false, 'left')
		push.right = push.gen('x', true, 'right')

		function pushif(dir, xo, yo) {
			let tI = sScript.getTile(pos.x + xo, pos.y + yo)
			if (tI.collide[dir]) {
				pos = push[dir](pos, tI)
			}
		}

		var pushlist = [
			['up', 16, 16],
			['up', 0, 16],
			['down', 16, 0],
			['down', 0, 0],
			['left', 16, 16],
			['left', 16, 0],
			['right', 0, 16],
			['right', 0, 0]
		]

		for (let i in pushlist)
			pushif(...pushlist[i])

		return [pos, collisions]
	},

	move(pos, dir) {
		pos.yv += 0.1 - (dir.up * Math.max(-1 - pos.yv, 0) / 30) //gravity (reduced on ascent while holding up for higher jumps)

		if (dir.left) // walk/run
			pos.xv -= 0.1 + keyInput.sprint * 0.05
		if (dir.right)
			pos.xv += 0.1 + keyInput.sprint * 0.05

		pos.y += pos.yv
		pos.x += pos.xv
		pos.xv /= 1.1

		return pos
	},

	getTile(x, y) {
		try {
			if (x <= 0 || y <= 0) throw TypeError
			let tPos = [Math.floor(x / 16), Math.floor(y / 16)]
			let i = tile[level
			[tPos[1]]
			[tPos[0]]]
			if (!i) throw TypeError
			i.pos = tPos
			return i
		}
		catch (TypeError) {
			return tile[0]
		}
	}
}