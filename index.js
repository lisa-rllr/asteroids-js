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
	}

	draw() {
		// ** center of the canvas **
		// context.arc(this.position.x, this.position.y, 5, 0, Math.PI*2, false);
		// context.fillStyle = "pink";
		// context.fill();
		context.beginPath();
		context.moveTo(this.position.x + 30, this.position.y);
		context.lineTo(this.position.x - 10, this.position.y - 10);
		context.lineTo(this.position.x - 10, this.position.y + 10);
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
};

function animate() {
	window.requestAnimationFrame(animate);
	cleanCanvas();
	player.update();
	if (keys.w.pressed) player.velocity.x = 1;
}

animate();

window.addEventListener("keydown", (event) => {
	switch (event.code) {
		case "KeyW": // Z azerty
			console.log("z key was pressed");
			keys.w.pressed = true;
			break;
		case "KeyA": // Q azerty
			console.log("q key was pressed");
			break;
		case "KeyS":
			console.log("s key was pressed");
			break;
		case "KeyD":
			console.log("d key was pressed");
			break;
	}
});
