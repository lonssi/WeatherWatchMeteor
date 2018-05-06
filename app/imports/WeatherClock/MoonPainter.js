/**
 * Original source code from https://codepen.io/anon/pen/NMpMEo
 */

export function MoonPainter(canvas, size) {

	this.canvas = canvas;
	this.ctx = canvas.getContext('2d');

	this.size = size;

	this.canvas.width = this.size;
	this.canvas.height = this.size;
	this.canvas.style.width = this.size + 'px';
	this.canvas.style.height = this.size + 'px';

	this.radius = this.canvas.width * 0.5;
}

MoonPainter.prototype = {

	setColors: function(highlight, lowlight) {
		this.highlight = highlight;
		this.lowlight = lowlight;
	},

	_drawDisc: function() {
		this.ctx.translate(0, 0);
		this.ctx.beginPath();
		this.ctx.arc(this.radius, this.radius, this.radius, 0, 2 * Math.PI, true);
		this.ctx.closePath();
		this.ctx.fillStyle = this.highlight;
		this.ctx.fill();
	},

	_drawPhase: function(phase) {
		this.ctx.beginPath();
		this.ctx.arc(this.radius, this.radius, this.radius, -Math.PI/2, Math.PI/2, true);
		this.ctx.closePath();
		this.ctx.fillStyle = this.lowlight;
		this.ctx.fill();

		this.ctx.translate(this.radius, this.radius);
		this.ctx.scale(phase, 1);
		this.ctx.translate(-this.radius, -this.radius);
		this.ctx.beginPath();
		this.ctx.arc(this.radius, this.radius, this.radius, -Math.PI/2, Math.PI/2, true);
		this.ctx.closePath();
		this.ctx.fillStyle = phase > 0 ? this.highlight : this.lowlight;
		this.ctx.fill();
	},

	/**
	 * @param {Number} The phase expressed as a float in [0,1] range .
	 */
	paint(phase) {
		this.ctx.save();
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		if (phase <= 0.5) {
			this._drawDisc();
			this._drawPhase(4 * phase - 1);
		} else {
			this.ctx.translate(this.radius, this.radius);
			this.ctx.rotate(Math.PI);
			this.ctx.translate(-this.radius, -this.radius);
			this._drawDisc();
			this._drawPhase(4 * (1 - phase) - 1);
		}
		this.ctx.restore();
	}
}
