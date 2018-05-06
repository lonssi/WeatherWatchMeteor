/**
 * Original source code from https://jsfiddle.net/uLbyxLms/
 */

/**
 * @description Options used when calling CanvasRenderingContext2D.strokeArcGradient() and
 *			  CanvasRenderingContext2D.fillArcGradient().
 * @property {Boolean} useDegrees Whether the specified angles should be interpreted as degrees rather than radians.
 *								(default: false)
 * @property {Number} resolutionFactor The number of lines to render per pixel along the arc.  A higher number produces
 *									 a cleaner gradient, but has worse performance for large radii.  Must be greater
 *									 than 0. (default: 8)
 */
class ArcGradientOptions {
	constructor(options) {
		function validateParam(test, errorMessage, fatal = false) {
			if (!test) {
				if (fatal) {
					throw new Error(errorMessage);
				} else {
					console.assert(false, errorMessage);
				}
			}
		}

		options = Object.assign({
			useDegrees: false,
			resolutionFactor: 8,
		}, options);

		validateParam(
			(options.resolutionFactor instanceof Number | typeof options.resolutionFactor === 'number') &&
				options.resolutionFactor > 0,
			`ArcGradientOptions.resolutionFactor must be a Number greater than 0.  Given: ${options.resolutionFactor}`,
			true);

		Object.assign(this, options);
	}
};

const newCanvas = {};

var generateGradientImgData = function generateGradientImgData(width, colorStops) {
	let canvas = document.createElement('canvas');
	canvas.setAttribute('width', width);
	canvas.setAttribute('height', 1);
	let ctx = canvas.getContext('2d'),
		gradient = ctx.createLinearGradient(0, 0, width, 0);

	for (let i = 0; i < colorStops.length; i++) {
		gradient.addColorStop(colorStops[i].offset, colorStops[i].color);
	}

	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, width, 1);
	return ctx.getImageData(0, 0, width, 1);
}

/**
 * @description Strokes an arc using a linear gradient.
 * @param {number} x The x-component of origin of the arc.
 * @param {number} y The y-component of the origin of the arc.
 * @param {number} radius The radius of the arc.
 * @param {number} startAngle Where in the circle to begin the stroke.
 * @param {number} endAngle Where in the circle to end the stroke.
 * @param {ArcGradientOptions} options Additional options.
 */
newCanvas.strokeArcGradient = function(x, y, radius, startAngle, endAngle, colorStops, options) {
	options = new ArcGradientOptions(options);
	let lineWidth = this.lineWidth;
	this.fillArcGradient(x, y, startAngle, endAngle, colorStops, radius + lineWidth / 2, radius - lineWidth / 2,
		options);
}

/**
 * @description Fills a sector or a portion of a ring with a linear gradient.
 * @param {number} x The x-component of origin of the arc
 * @param {number} y The y-component of the origin of the arc
 * @param {number} startAngle Where in the circle to begin the fill.
 * @param {number} endAngle Where in the circle to end the fill.
 * @param {number} outerRadius The radius of the arc.
 * @param {number} innerRadius The radius of the arc that won't be filled.  An innerRadius = 0 will fill the whole
 *							 arc. (default: 0)
 * @param {ArcGradientOptions} options Additional options.
 */
newCanvas.fillArcGradient = function (x, y, startAngle, endAngle, colorStops, outerRadius, innerRadius = 0, options) {

	options = new ArcGradientOptions(options);

	let oldLineWidth = this.lineWidth,
		oldStrokeStyle = this.strokeStyle;

	if (options.useDegrees) {
		startAngle = startAngle * Math.PI / 180;
		endAngle = endAngle * Math.PI / 180;
	}

	let deltaArcAngle = endAngle - startAngle;
		gradientWidth = Math.floor(outerRadius * Math.abs(deltaArcAngle) * options.resolutionFactor),
		gData = generateGradientImgData(gradientWidth, colorStops).data;

	this.lineWidth = Math.min(4 / options.resolutionFactor, 1);

	for (let i = 0; i < gradientWidth; i++) {
		let gradi = i * 4,
			theta = startAngle + deltaArcAngle * i / gradientWidth;

		this.strokeStyle = `rgba(${gData[gradi]}, ${gData[gradi + 1]}, ${gData[gradi + 2]}, ${gData[gradi + 3]})`;

		this.beginPath();
		this.moveTo(x + Math.cos(theta) * innerRadius, y + Math.sin(theta) * innerRadius);
		this.lineTo(x + Math.cos(theta) * outerRadius, y + Math.sin(theta) * outerRadius);
		this.stroke();
		this.closePath();
	}

	this.lineWidth = oldLineWidth;
	this.strokeStyle = oldStrokeStyle;
}

var addProperties = function(original, extension) {

	for (var key in extension) {
		if (original.hasOwnProperty(key)) {
			continue;
		}
		Object.defineProperty(original, key, {
			value: extension[key],
			writable: true,
		});
	}
};

if (Meteor.isClient) {
	addProperties(CanvasRenderingContext2D.prototype, newCanvas);
}
