// @ts-check
'use strict';



/**
 * Creates the blue "blob" on the header
 */
class BlobElement {
	points = [];

	constructor () {
		let anchor_points = [];
		
		let anchor_point_count = 7;
		for (let p = -1; p <= anchor_point_count + 1; p ++) {
			let dx = p / anchor_point_count;
			let dy = 175 + Math.random() * 50;
		
			anchor_points.push(new V(dx, dy));
		}
		
		for (let q = 1; q < anchor_points.length - 2; q ++) {
			for (let T = 0; T < 20; T ++) {
				let t = T / 20;
		
				let a = S1(t);
				let b = S2(t);
				let c = S3(t);
				let d = S4(t);
		
				let px = anchor_points[q - 1].x * a + anchor_points[q].x * b + anchor_points[q + 1].x * c + anchor_points[q + 2].x * d;
				let py = anchor_points[q - 1].y * a + anchor_points[q].y * b + anchor_points[q + 1].y * c + anchor_points[q + 2].y * d;
		
				this.points.push(new V(px, py));
			}
		}
		
		this.points.push(anchor_points[anchor_points.length - 2]);
	}

	update() {

	}

	/**
	 * @param {HTMLCanvasElement} canvas
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw(canvas, ctx) {
		ctx.fillStyle = `hsl(${215}, ${70}%, ${60}%)`;
	
		ctx.beginPath();
		ctx.moveTo(0, 0);
	
		for (let point of this.points) {
			ctx.lineTo(point.x * canvas.width, point.y);
		}
	
		ctx.lineTo(canvas.width, 0);
	
		ctx.fill();
	}
}



/**
 * Creates the squiggle line around the navigation and title
 */
class SquiggleElement {
	options = {
		border: 4,
		width: 700,
		radius: 35,
		sub_radius: 25
	};

	/** @type {V[]} */
	points = [];

	constructor () {
		for (let p = 0; p < 10; p ++) {
			this.points[p] = new V(0, 0);
		}
	}

	/**
	 * @param {Number} max_width
	 */
	update(max_width) {
		let dx = 0.5 * max_width - 0.5 * this.options.width;
		let dy = 44;

		this.points[0].set(dx + this.options.width, dy + this.options.radius);
		this.points[1].set(dx + this.options.width - this.options.radius, dy);
		this.points[2].set(dx + this.options.radius, dy);
		this.points[3].set(dx, dy + this.options.radius);
		this.points[4].set(dx + this.options.radius, dy + 2 * this.options.radius);
		this.points[5].set(dx + this.options.width - 3 * this.options.radius, dy + 2 * this.options.radius);
		this.points[6].set(dx + this.options.width - 3 * this.options.radius + this.options.sub_radius, dy + 2 * this.options.radius + this.options.sub_radius);
		this.points[7].set(dx + this.options.width - 3 * this.options.radius, dy + 2 * this.options.radius + 2 * this.options.sub_radius);
		this.points[8].set(dx + 6 * this.options.radius, dy + 2 * this.options.radius + 2 * this.options.sub_radius);
		this.points[9].set(dx + 6 * this.options.radius - this.options.sub_radius, dy + 2 * this.options.radius + 3 * this.options.sub_radius);
	}

	/**
	 * @param {HTMLCanvasElement} canvas
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw(canvas, ctx) {
		ctx.lineWidth = this.options.border;
		ctx.lineCap = "round";
		ctx.strokeStyle = "#101010";

		let [A, B, C, D, E, F, G, H, I, J] = this.points;

		ctx.beginPath();
		
		ctx.moveTo(... A.get());
		ctx.arcTo(A.x, B.y, ... B.get(), this.options.radius);
		ctx.lineTo(... B.get());
		ctx.lineTo(... C.get());
		ctx.arcTo(D.x, C.y, ... D.get(), this.options.radius);
		ctx.lineTo(... D.get());
		ctx.arcTo(D.x, E.y, ... E.get(), this.options.radius);
		ctx.lineTo(... E.get());
		ctx.lineTo(... F.get());
		
		ctx.arcTo(G.x, F.y, ... G.get(), this.options.sub_radius);
		ctx.lineTo(... G.get());
		ctx.arcTo(G.x, H.y, ... H.get(), this.options.sub_radius);
		ctx.lineTo(... H.get());
		ctx.lineTo(... I.get());
		ctx.arcTo(J.x, I.y, ... J.get(), this.options.sub_radius);
		ctx.lineTo(... J.get());
		
		ctx.stroke();
	}
}



class Cloud extends V {
	points = [];
	vel = new V(0, 0);

	constructor (x, y) {
		super(x, y);

		this.r = 0.75 * Math.random() + 0.25;

		this.vel.x = this.r * 0.0002;

		for (let p = 0; p < 20; p ++) {
			let x = 2 * Math.random() - 1;
			let y = -Math.random() * (1 - x**4) * (1 - x**2);
			let r = this.r;

			this.points.push(new Circle(x, y, r));
		}
	}
}

class CloudElement {
	clouds = [];

	constructor () {
		for (let c = 0; c < 10; c ++) {
			this.clouds[c] = new Cloud(Math.random() * 1.2 - 0.1, Math.random());
		}
	}

	update() {
		for (let c = this.clouds.length - 1; c >= 0; c --) {
			this.clouds[c].x += this.clouds[c].vel.x;
			this.clouds[c].y += this.clouds[c].vel.y;
	
			if (this.clouds[c].x >= 1.1) {
				this.clouds.splice(c, 1);
				this.clouds.push(new Cloud(-0.1, Math.random()));
			}
		}
	}

	/**
	 * @param {HTMLCanvasElement} canvas
	 * @param {CanvasRenderingContext2D} ctx
	 */
	draw(canvas, ctx) {
		for (let cloud of this.clouds) {
			let [x, y] = cloud.get();
	
			let cx = x * canvas.width;
			let cy = y * canvas.height * 0.5;
	
			ctx.fillStyle = `hsl(${215}, ${70}%, ${65}%)`;
	
			for (let point of cloud.points) {
				let px = cx + point.x * 30 * point.r;
				let py = cy + point.y * 15 * point.r;
				let pr = point.r * 10;
	
				ctx.beginPath();
				ctx.arc(px, py, pr, 0, 2 * Math.PI);
				ctx.fill();
			}
		}
	}
}



/**
 * Container for all app elements
 */
class App {
	canvas;
	ctx;

	elements = {
		blob: new BlobElement(),
		squiggle: new SquiggleElement(),
		cloud: new CloudElement()
	};

	constructor (canvas) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");

		this.init();
		this.animate();
	}

	init() {

	}

	update() {
		this.elements.squiggle.update(this.canvas.width);
		this.elements.cloud.update();
	}

	draw() {
		this.canvas.width = this.canvas.parentNode.clientWidth;
		this.canvas.height = 300;
	
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
		this.elements.blob.draw(this.canvas, this.ctx);
		this.elements.cloud.draw(this.canvas, this.ctx);
		this.elements.squiggle.draw(this.canvas, this.ctx);
	}

	animate() {
		this.update();
		this.draw();

		window.requestAnimationFrame(this.animate.bind(this));
	}
}

const MAIN = (() => {
	let app = new App(document.getElementById("canvas"));
})();


///

let mouse = new V(0, 0);

window.addEventListener("mousemove", (event) => {
	mouse.x = event.pageX;
	mouse.y = event.pageY;
});