sScript = {
	collide(pos, jump = false) {
		var collisions = {
			up: false,
			down: false,
			left: false,
			right: false
		}

		var push = {
			gen: function (xy, rev, canJump = false) { //rev stands for reverse
				return function (pos) {
					let i = Math[rev ? 'ceil' : 'floor'](pos[xy] / 16) * 16
					if (
						(rev ? pos : pos.last)[xy] <= i &&
						(rev ? pos.last : pos)[xy] >= i
					) {
						pos[xy] = i
						pos[xy + 'v'] = (canJump ? (jump ? -3 : 0) : 0) //jump
					}
					return pos
				}
			}
		}
		push.up = push.gen('y', false, true)
		push.down = push.gen('y', true)
		push.left = push.gen('x', false)
		push.right = push.gen('x', true)

		function pushif(dir, xo, yo) {
			if (sScript.getTile(pos.x + xo, pos.y + yo).collide[dir]) {
				pos = push[dir](pos)
				collisions[dir] = true
			}
		}

		var pushlist = [
			['up', 0, 0],
			['up', -16, 0],
			['down', 0, -16],
			['down', -16, -16],
			['left', 0, 0],
			['left', 0, -16],
			['right', -16, 0],
			['right', -16, -16]
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
			if (x <= -16 || y <= -16) throw TypeError
			return tile[level
			[Math.ceil(y / 16)]
			[Math.ceil(x / 16)]]
		}
		catch (TypeError) {
			return tile[0]
		}
	}
}