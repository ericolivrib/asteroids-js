/**
 * Frames por segundo
 */
const FPS = 30;

/**
 * Coeficiente de atrito do espaço (0 = sem atrito; 1 = muito atrito)
 */
const FRICTION = 0.7;

/**
 * Largura da nave em pixels
 */
const SHIP_SIZE = 30;

/**
 * Velocidade da nave em 0.5 pixels por segundo
 */
const SHIP_THRUST = 5;

/**
 * Velocidade da rotação em graus por segundo
 */
const TURN_SPEED = 360;

/**
 * @type {HTMLCanvasElement}
 */
let canvas = document.getElementById("game");

let ctxt = canvas.getContext('2d');

let ship = {
	x: canvas.width / 2,
	y: canvas.height / 2,
	radius: SHIP_SIZE / 2,
	angle: 90 / 180 * Math.PI, // Converter para radianos
	rotation: 0,
	thrusting: false,
	thrust: {
		x: 0,
		y: 0
	}
};

// Configurar manipuladores de eventos
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);


setInterval(update, 1000 / FPS); // Configurar loop do jogo


/**
 * Função de rotação da nave.
 * @param {KeyboardEvent} $event Evento de tecla
 */
function keyDown($event) {
	switch ($event.code) {
		case "ArrowLeft": // Seta esquerda (girar a nave para esquerda)
			ship.rotation = TURN_SPEED / 180 * Math.PI / FPS;
			break;
		case "ArrowUp": // Seta pra cima (mover a nave para frente)
			ship.thrusting = true;
			break;
		case "ArrowRight": // Seta right (girar a nave para direita)
			ship.rotation = -TURN_SPEED / 180 * Math.PI / FPS;
			break;
	}
}

/**
 * Função para pausar rotação da nave.
 * @param {KeyboardEvent} $event Evento de tecla
 */
function keyUp($event) {
	switch ($event.code) {
		case "ArrowLeft": // Seta esquerda (parar rotação da nave para esquerda)
			ship.rotation = 0;
			break;
		case "ArrowUp": // Seta pra cima (parar de mover a nave)
			ship.thrusting = false;
			break;
		case "ArrowRight": // Seta right (para rotação da nave para direita)
			ship.rotation = 0;
			break;
	}
}

/**
 * Função que atualiza os frames do jogo.
 */
function update() {
	// Desenhar espaço
	ctxt.fillStyle = "#000000"; // Cor preta
	ctxt.fillRect(0, 0, canvas.width, canvas.height);


	// Empurrar a nave
	if (ship.thrusting) {
		ship.thrust.x += SHIP_THRUST * Math.cos(ship.angle) / FPS;
		ship.thrust.y -= SHIP_THRUST * Math.sin(ship.angle) / FPS;

		// Desenhar o propulsor (Um caprichozinho =P)
		ctxt.fillStyle = "#FF0000"; // Cor vermelha
		ctxt.strokeStyle = "#FFFF00"; // Cor amarela
		ctxt.lineWidth = SHIP_SIZE / 20;
		ctxt.beginPath();

		ctxt.moveTo( // Traseira esquerda
			ship.x - ship.radius * (2 / 3 * Math.cos(ship.angle) + 0.5 * Math.sin(ship.angle)),
			ship.y + ship.radius * (2 / 3 * Math.sin(ship.angle) - 0.5 * Math.cos(ship.angle))
		);

		ctxt.lineTo( // Traseira central de trás da nave
			ship.x - ship.radius * 4 / 3 * Math.cos(ship.angle),
			ship.y + ship.radius * 4 / 3 * Math.sin(ship.angle)
		);

		ctxt.lineTo( // Traseira direita
			ship.x - ship.radius * (2 / 3 * Math.cos(ship.angle) - 0.5 * Math.sin(ship.angle)),
			ship.y + ship.radius * (2 / 3 * Math.sin(ship.angle) + 0.5 * Math.cos(ship.angle))
		);

		ctxt.closePath();
		ctxt.fill();
		ctxt.stroke();
	} else {
		ship.thrust.x -= FRICTION * ship.thrust.x / FPS;
		ship.thrust.y -= FRICTION * ship.thrust.y / FPS;
	}



	// Desenhar nave triangular
	ctxt.strokeStyle = "#FFFFFF"; // Cor branca
	ctxt.lineWidth = SHIP_SIZE / 20;
	ctxt.beginPath();

	ctxt.moveTo( // Nariz na nave
		ship.x + 4 / 3 * ship.radius * Math.cos(ship.angle),
		ship.y - 4 / 3 * ship.radius * Math.sin(ship.angle)
	);

	ctxt.lineTo( // Traseira esquerda
		ship.x - ship.radius * (2 / 3 * Math.cos(ship.angle) + Math.sin(ship.angle)),
		ship.y + ship.radius * (2 / 3 * Math.sin(ship.angle) - Math.cos(ship.angle))
	);

	ctxt.lineTo( // Traseira direita
		ship.x - ship.radius * (2 / 3 * Math.cos(ship.angle) - Math.sin(ship.angle)),
		ship.y + ship.radius * (2 / 3 * Math.sin(ship.angle) + Math.cos(ship.angle))
	);

	ctxt.closePath();
	ctxt.stroke();

	// Girar nave
	ship.angle += ship.rotation;

	// Mover a nave 
	ship.x += ship.thrust.x;
	ship.y += ship.thrust.y;


	// Lidar com borda de tela
	if (ship.x < 0 - ship.radius) {
		ship.x = canvas.width + ship.radius;
	} else if (ship.x > canvas.width + ship.radius) {
		ship.x = 0 - ship.radius;
	}

	if (ship.y < 0 - ship.radius) {
		ship.y = canvas.height + ship.radius;
	} else if (ship.y > canvas.height + ship.radius) {
		ship.y = 0 - ship.radius;
	}

	// Ponto central
	// ctxt.fillStyle = "#FF0000";
	// ctxt.fillRect(ship.x - 1, ship.y - 1, 2, 2);
}
