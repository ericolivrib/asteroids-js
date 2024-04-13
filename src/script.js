/**
 * Frames por segundo
 */
const FPS = 30;

/**
 * Coeficiente de atrito do espaço (0 = sem atrito; 1 = muito atrito)
 */
const FRICTION = 0.7;

/**
 * Irregularidade dos asteróides (0 = sem irregularidade; 1 = muita irregularidade)
 */
const ASTEROIDS_JAG = 0.4;

/**
 * Quantidade inicial de asteróides
 */
const ASTEROIDS_NUMBER = 5;

/**
 * Velocidade máxina inicial dos asteróides em pixels por segudo
 */
const ASTEROIDS_SPEED = 50;

/**
 * Tamanho/volume inicial dos asteróides em pixels
 */
const ASTEROIDS_SIZE = 100;

/**
 * Número médio de vértices em cada asteróide
 */
const ASTEROIDS_VERT = 10;

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

let asteroids = [newAsteroid(0, 0)];
createAsteroidsBelt();

// Configurar manipuladores de eventos
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);


setInterval(update, 1000 / FPS); // Configurar loop do jogo

/**
 * Função que cria o cinturão de asteróides
 * (adiciona novos asteróides ao array de asteróides)
 */
function createAsteroidsBelt() {
	asteroids = [];

	let x, y;

	for (let i = 0; i < ASTEROIDS_NUMBER; i++) {
		do {
			x = Math.floor((Math.random() * canvas.width));
			y = Math.floor((Math.random() * canvas.height));
		} while (distanceBetweenPoints(ship.x, ship.y, x, y) < ASTEROIDS_SIZE * 2 + ship.radius);

		asteroids.push(newAsteroid(x, y));
	}
}

/**
 * Função que calcula a distância entre os pontos (eixos da nave de um asteróide).
 * @param {number} x1 Eixo x da nave
 * @param {number} y1 Eixo y da nave
 * @param {number} x2 Eixo x do asteróide
 * @param {number} y2 Eixo y do asteróide
 * @returns {number} Distância entre os pontos.
 */
function distanceBetweenPoints(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

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
 * Função para criar um asteróide.
 * @param {number} x Eixo x do novo asteróide
 * @param {number} y Eixo y do novo asteróide
 */
function newAsteroid(x, y) {
	let asteroid = {
		x: x,
		y: y,
		xy: Math.random() * ASTEROIDS_SPEED / FPS * (Math.random() < 0.5 ? 1 : -1),
		yx: Math.random() * ASTEROIDS_SPEED / FPS * (Math.random() < 0.5 ? 1 : -1),
		radius: ASTEROIDS_SIZE / 2,
		/**
		 * Ângulo em radianos
		 */
		angle: Math.random() * Math.PI * 2,
		vertex: Math.floor(Math.random() * (ASTEROIDS_VERT + 1) + ASTEROIDS_VERT / 2),
		offset: [0]
	};

	// Criar matriz de deslocamento de vértice

	asteroid.offset = []
	for (let i = 0; i < asteroid.vertex; i++) {
		asteroid.offset.push(Math.random() * ASTEROIDS_JAG * 2 + 1 - ASTEROIDS_JAG);
	}

	return asteroid;
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

	// Renderizar os asteróides
	ctxt.strokeStyle = "#708090"; // Cor cinza
	ctxt.lineWidth = SHIP_SIZE / 20;

	let x, y, radius, angle, vertex, offset;
	for (let i = 0; i < asteroids.length; i++) {

		// Obter propriedades de asteróide
		x = asteroids[i].x;
		y = asteroids[i].y;
		radius = asteroids[i].radius;
		angle = asteroids[i].angle;
		vertex = asteroids[i].vertex;
		offset = asteroids[i].offset;

		// Renderizar "a path"
		ctxt.beginPath();
		ctxt.moveTo(
			x + radius * offset[0] * Math.cos(angle),
			y + radius * offset[0] * Math.sin(angle),
		);

		// Renderizar polígono
		for (let j = 1; j < vertex; j++) {
			ctxt.lineTo(
				x + radius * offset[j] * Math.cos(angle + j * Math.PI * 2 / vertex),
				y + radius * offset[j] * Math.sin(angle + j * Math.PI * 2 / vertex),
			);
		}

		ctxt.closePath();
		ctxt.stroke();


		// Mover o asteróide

		asteroids[i].x += asteroids[i].xy;
		asteroids[i].y += asteroids[i].yx;

		// Manipular borda de tela
		if (asteroids[i].x < 0 - asteroids[i].radius) {
			asteroids[i].x = canvas.width + asteroids[i].radius;
		} else if (asteroids[i].x > canvas.width + asteroids[i].radius) {
			asteroids[i].x = asteroids[i].radius
		}

		if (asteroids[i].y < 0 - asteroids[i].radius) {
			asteroids[i].y = canvas.height + asteroids[i].radius;
		} else if (asteroids[i].y > canvas.height + asteroids[i].radius) {
			asteroids[i].y = asteroids[i].radius
		}
	}



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
