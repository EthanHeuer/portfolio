class V {
	/**
	 * @param {Number} x
	 * @param {Number} y
	 */
	constructor (x, y) {
		this.x = this.dx = x;
		this.y = this.dy = y;
	}

	/**
	 * @return {[Number, Number]}
	 */
	get() { return [this.x, this.y]; }

	set(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Circle extends V {
	constructor (x, y, r) {
		super(x, y);
		this.r = r;
	}

	get() {
		return [... super.get(), this.r];
	}
}

var S1 = (x) => { return (-(x**3) + 2 * x**2 - x) / 2; };
var S2 = (x) => { return (3 * x**3 - 5 * x**2 +2) / 2; };
var S3 = (x) => { return (-3 * x**3 + 4 * x**2 + x) / 2; };
var S4 = (x) => { return (x**3 - x**2) / 2; };