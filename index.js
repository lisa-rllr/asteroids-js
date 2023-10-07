const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function cleanCanvas() {
	context.fillStyle = "black";
	context.fillRect(0, 0, canvas.width, canvas.height);
}

class Player {
	constructor({ position, velocity }) {
		this.position = position;
		this.velocity = velocity;
		this.rotation = 0;
	}

	draw() {
		context.save();
		context.translate(this.position.x, this.position.y);
		context.rotate(this.rotation);
		context.translate(-this.position.x, -this.position.y);
		// ** center of the canvas **
		// context.arc(this.position.x, this.position.y, 5, 0, Math.PI*2, false);
		// context.fillStyle = "pink";
		// context.fill();
		context.beginPath();
		context.moveTo(this.position.x + 30, this.position.y);
		context.lineTo(this.position.x - 10, this.position.y - 10);
		context.lineTo(this.position.x - 10, this.position.y + 10);
		context.fillStyle = "white";
		context.fill();
		context.closePath();

		context.strokeStyle = "white";
		context.stroke();
		context.restore();
	}

	update() {
		this.draw();
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}

class Projectile {
	constructor({ position, velocity }) {
		this.position = position;
		this.velocity = velocity;
		this.radius = 5;
	}

	draw() {
		context.beginPath();
		context.arc(
			this.position.x,
			this.position.y,
			this.radius,
			0,
			Math.PI * 2,
			false
		);
		context.closePath();
		context.fillStyle = "white";
		context.fill();
	}

	update() {
		this.draw();
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}

class Asteroid {
	constructor({ position, velocity, radius }) {
		this.position = position;
		this.velocity = velocity;
		this.radius = radius;
	}

	draw() {
		context.beginPath();
		context.arc(
			this.position.x,
			this.position.y,
			this.radius,
			0,
			Math.PI * 2,
			false
		);
		context.closePath();
		context.strokeStyle = "white";
		context.stroke();
	}

	update() {
		this.draw();
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}

const player = new Player({
	position: { x: canvas.width / 2, y: canvas.height / 2 },
	velocity: { x: 0, y: 0 },
});

const keys = {
	w: {
		pressed: false,
	},
	a: {
		pressed: false,
	},
	d: {
		pressed: false,
	},
};

const SPEED = 3;
const ROTATIONAL_SPEED = 0.05;
const FRICTION = 0.95;
const PROJECTILE_SPEED = 3;

const projectiles = [];
const asteroids = [];

window.setInterval(() => {
	const index = Math.floor(Math.random() * 4);
	let radius = 50 * Math.random() + 10;
	let x, y;
	let vx, vy;
	switch (index) {
		case 0: //left side of the screen
			x = 0 - radius;
			y = Math.random() - canvas.height;
			vx = 1;
			vy = 0;
			break;
		case 1: // bottom side of the screen
			x = Math.random() * canvas.width;
			y = canvas.height + radius;
			vx = 0;
			vy = -1;
			break;
		case 2: // right side of the screen
			x = canvas.width + radius;
			y = Math.random() * canvas.height;
			vx = -1;
			vy = 0;
			break;
		case 3: // top side of the screen
			x = Math.random() * canvas.width;
			y = 0 - radius;
			vx = 0;
			vy = 1;
			break;
	}
	asteroids.push(
		new Asteroid({
			position: {
				x: x,
				y: y,
			},
			velocity: {
				x: vx,
				y: vy,
			},
			radius,
		})
	);
}, 3000);

function animate() {
	window.requestAnimationFrame(animate);
	cleanCanvas();
	player.update();

	//projectile management
	for (let i = projectiles.length - 1; i >= 0; i--) {
		const projectile = projectiles[i];
		projectile.update();
		if (
			projectile.position.x + projectile.radius < 0 ||
			projectile.position.x - projectile.radius > canvas.width ||
			projectile.position.y + projectile.radius < 0 ||
			projectile.position.y - projectile.radius > canvas.height
		) {
			projectiles.splice(i, 1);
		}
	}

	// asteroid managment
	for (let i = asteroids.length - 1; i >= 0; i--) {
		const asteroid = asteroids[i];
		asteroid.update();
		if (
			asteroid.position.x + asteroid.radius < 0 ||
			asteroid.position.x - asteroid.radius > canvas.width ||
			asteroid.position.y + asteroid.radius < 0 ||
			asteroid.position.y - asteroid.radius > canvas.height
		) {
			projectiles.splice(i, 1);
		}
	}

	if (keys.w.pressed) {
		player.velocity.x = Math.cos(player.rotation) * 3;
		player.velocity.y = Math.sin(player.rotation) * 3;
	} else if (!keys.w.pressed) {
		player.velocity.x *= FRICTION;
		player.velocity.y *= FRICTION;
	}
	if (keys.d.pressed) player.rotation += ROTATIONAL_SPEED;
	else if (keys.a.pressed) player.rotation -= ROTATIONAL_SPEED;
}

animate();

window.addEventListener("keydown", (event) => {
	switch (event.code) {
		case "KeyW": // Z azerty
			keys.w.pressed = true;
			break;
		case "KeyA": // Q azerty
			keys.a.pressed = true;
			break;
		case "KeyD":
			keys.d.pressed = true;
			break;
		case "Space":
			projectiles.push(
				new Projectile({
					position: {
						x: player.position.x + Math.cos(player.rotation) * 30,
						y: player.position.y + Math.sin(player.rotation) * 30,
					},
					velocity: {
						x: Math.cos(player.rotation) * PROJECTILE_SPEED,
						y: Math.sin(player.rotation) * PROJECTILE_SPEED,
					},
				})
			);
			console.log(projectiles);
			break;
	}
});

window.addEventListener("keyup", (event) => {
	switch (event.code) {
		case "KeyW": // Z azerty
			keys.w.pressed = false;
			break;
		case "KeyA": // Q azerty
			keys.a.pressed = false;
			break;
		case "KeyD":
			keys.d.pressed = false;
			break;
	}
});
