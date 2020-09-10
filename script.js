'use strict';
var ctx,
	tilectx,
	scrollX = 0,
	scrollY = 0,
	level,
	assets = {},
	TILE_WIDTH,
	TILE_HEIGHT,
	tile,
	sprite,
	levelData,
	cSprites = [],
	keyInput = {
		up: false,
		down: false,
		left: false,
		right: false,
		sprint: false
	};

let tpsC,
	fpsC,
	ltd = 0,
	lfd = 0,
	tpsElem,
	fpsElem,
	assetElem,
	tileElem,
	spriteElem;

function step() {
	let now = performance.now();
	let deltaTime = (ltd + now - tpsC) / 2;
	ltd = deltaTime;
	tpsC = now;

	runSprites(deltaTime);

	scrollX = Math.max(Math.min(scrollX, 0), (level.width * -TILE_WIDTH) + ctx.canvas.width); // keep scrolling in boundaries
	scrollY = Math.max(Math.min(scrollY, 0), (level.height * -TILE_HEIGHT) + ctx.canvas.height);

	if (tpsElem)
		tpsElem.innerHTML = Math.round(1000 / deltaTime);
};
function draw(request = true) {
	ctx.fillStyle = "magenta"; // temporary bg
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	copyTiles(scrollX, scrollY);
	drawSprites(scrollX, scrollY);

	if (fpsElem) {
		let now = performance.now();
		let deltaTime = (lfd + now - fpsC) / 2;
		lfd = deltaTime;
		fpsElem.innerHTML = Math.round(1000 / deltaTime);
		fpsC = now;
	}
	if (request) requestAnimationFrame(draw);
};

function runSprites(deltaTime) {
	for (let spriteNum in cSprites)
		cSprites[spriteNum].update(deltaTime, spriteNum);
}

function drawSprites(ox, oy) {
	for (let s of cSprites)
		ctx.drawImage(
			assets[s.img[0]],
			s.img[1],
			s.img[2],
			s.img[3],
			s.img[4],
			Math.round(s.pos.x + ox),
			Math.round(s.pos.y + oy),
			s.img[3],
			s.img[4],
		);
}
function copyTiles(ox, oy) {
	ctx.drawImage(
		tilectx.canvas,
		Math.round(ox),
		Math.round(oy),
	);
}
function drawTile(t, x, y) {
	tilectx.clearRect(x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
	tilectx.drawImage(
		assets[t.img[0]],
		t.img[1] * TILE_WIDTH,
		t.img[2] * TILE_HEIGHT,
		TILE_WIDTH,
		TILE_HEIGHT,
		x * TILE_WIDTH,
		y * TILE_HEIGHT,
		TILE_WIDTH,
		TILE_HEIGHT,
	);
}
function updateTileCanvas() {
	for (let y = 0; y < level.height; y++)
		for (let x = 0; x < level.width; x++)
			drawTile(sScript.getTile(x, y, false).tile, x, y);
}

function press(v) {
	return function (key) {
		switch (key.code) {
			case "ArrowUp":
			case "Space":
			case "KeyW":
			case "KeyX":
				keyInput.up = v; break;
			case "ArrowDown":
			case "KeyS":
				keyInput.down = v; break;
			case "ArrowLeft":
			case "KeyA":
				keyInput.left = v; break;
			case "ArrowRight":
			case "KeyD":
				keyInput.right = v; break;
			case "ShiftLeft":
			case "KeyZ":
				keyInput.sprint = v; break;
		}
	};
}

function Level(data) {
	this.data = data;
	this.width = data.width;
	this.height = data.height;
	this.sprites = data.sprites;
	this.assets = data.assets;
	this.tiles = data.tiles;

	for (let s of data.assets)
		if (!assets[s]) {
			let i = document.createElement('img');
			i.src = `assets/${s}.png`;
			if (assetElem) {
				i.style = "image-rendering: pixelated";
				assetElem.appendChild(i);
			}
			assets[s] = i;
		}
};
Level.prototype.onAssetsLoaded = function (callback) {
	let remaining = level.assets.length;
	let rd = () => --remaining || callback(); // decrement remaining and then run callback if 0
	level.assets.forEach(function (e) {
		assets[e].complete ?
			rd() :
			assets[e].addEventListener('load', rd);
	});
};

function start({ step: doStep = true, autoStep = true, draw: doDraw = true, autoDraw = true, zoom, canvas: c, tps, fps, asset, tile: te, sprite: se }) {
	tpsElem = tps;
	fpsElem = fps;
	assetElem = asset;
	tileElem = te;
	spriteElem = se;

	level = new Level(levelData);

	for (let s of level.sprites)
		cSprites.push(new (s[0].split('.').reduce((a, b) => a[b], sprite))(...s.slice(1)));

	if (doStep) {
		addEventListener("keydown", press(true));
		addEventListener("keyup", press(false));
	}
	if (doDraw) {
		if (c) {
			if (zoom) {
				c.style.width = c.width * zoom;
				c.style.height = c.height * zoom;
			}
			ctx = c.getContext('2d', { alpha: false });
		}
		tilectx = (new OffscreenCanvas(level.width * TILE_WIDTH, level.height * TILE_HEIGHT)).getContext('2d', { willReadFrequently: true });
	}

	if (ctx) ctx.canvas.style.cursor = 'progress';
	level.onAssetsLoaded(function () {
		if (ctx) ctx.canvas.style.cursor = '';
		updateTileCanvas();

		if (doStep) tpsC = performance.now();
		if (fpsElem && doDraw) fpsC = performance.now();

		if (doStep && autoStep) setInterval(step, 0);
		if (ctx && autoDraw) requestAnimationFrame(draw);
	});
}