import {Helpers} from '../../lib/helpers.js';
import {Colors} from '../../lib/colors.js';
import {Constants} from '../../lib/constants.js';
import {Controller} from '../domains/controller.js';
import {MoonPainter} from './MoonPainter.js';
import './ArcGradient.js';


export class WeatherClockCanvas {

	constructor(canvas, images, weatherData, clockSettings, container, colorTheme) {

		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");

		this.canvasBg = document.createElement('canvas');
		this.ctxBg = this.canvasBg.getContext("2d");

		this.fontFamily = "roboto";

		this.images = images;
		this.weatherData = weatherData;
		this.settings = clockSettings;
		this.container = container;
		this.colorTheme = colorTheme;
	}

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	updateWeatherData(data) {
		this.weatherData = data;
	}

	setSettings(value) {
		this.settings = value;
	}

	update(updateAll) {

		this.date = new Date();

		if (this.settings.forecastTimezone) {
			this.tzOffset = (this.date.getTimezoneOffset() / 60) + this.weatherData.timeZoneOffset;
		} else {
			this.tzOffset = 0;
		}

		if (!updateAll) {
			// Draw all elements if the starting hour has changed
			updateAll = this.date.getHours() !== this.prevHour;
		}

		if (updateAll) {
			this.resize();
		} else {
			this.clear();
		}

		if (updateAll) {
			this.drawStaticElementsToCache();
		}

		this.drawStaticElementsFromCache();

		// Draw dynamic elements
		this.drawClockHands();
		this.drawHighlighter();

		this.prevHour = this.date.getHours();
	}

	resize() {

		this.ratio = (function () {
			var ctx = document.createElement("canvas").getContext("2d"),
				dpr = window.devicePixelRatio || 1,
				bsr = ctx.webkitBackingStorePixelRatio ||
					ctx.mozBackingStorePixelRatio ||
					ctx.msBackingStorePixelRatio ||
					ctx.oBackingStorePixelRatio ||
					ctx.backingStorePixelRatio || 1;
			return dpr / bsr;
		})();

		const w = this.container.clientWidth;
		const h = this.container.clientHeight;
		const size = (w > h) ? h : w;

		this.canvas.width = size * this.ratio;
		this.canvas.height = size * this.ratio;
		this.canvas.style.width = size + 'px';
		this.canvas.style.height = size + 'px';

		this.canvasBg.width = this.canvas.width;
		this.canvasBg.height = this.canvas.height;
		this.canvasBg.style.width = this.canvas.style.width;
		this.canvasBg.style.height = this.canvas.style.height;

		this.center = { x: this.canvas.width / 2, y: this.canvas.height / 2 }

		this.unit = this.canvas.height / 33;
		this.arcWidth = this.settings.clockSize.size * this.unit;
		this.arcWidthInner = this.arcWidth - 2 * this.unit;
		this.rimCenterRadius = this.canvas.height / 2 - this.arcWidth / 2;
		this.innerRadius = this.canvas.height / 2 - this.arcWidth;
		this.clockRadius = this.innerRadius - this.unit;
	}

	drawStaticElementsFromCache() {
		this.ctx.drawImage(this.canvasBg, 0, 0);
	}

	drawClockHands() {

		const hours = this.date.getHours() + this.tzOffset;
		const minutes = this.date.getMinutes();
		const seconds = this.date.getSeconds();

		const hourIndicatorLength = this.clockRadius * 0.475;
		const minuteIndicatorLength = hourIndicatorLength * 1.618;

		this.drawIndicator(
			this.ctx,
			this.colorTheme.accent_dark,
			this.clockRadius * 0.04,
			(hours + minutes/60 + seconds/3600) * 30,
			[0, hourIndicatorLength]
		);

		this.drawIndicator(
			this.ctx,
			this.colorTheme.accent_light,
			this.clockRadius * 0.022,
			(minutes + seconds/60) * 6,
			[0, minuteIndicatorLength]
		);

		if (this.settings.secondHand) {
			this.drawIndicator(
				this.ctx,
				this.colorTheme.accent_light,
				this.clockRadius * 0.014,
				seconds * 6,
				[0, minuteIndicatorLength]
			);
		}

		this.ctx.beginPath();
		this.ctx.arc(this.center.x, this.center.y, this.clockRadius * 0.055, 0, 2*Math.PI);
		this.ctx.fillStyle = this.colorTheme.accent_light;
		this.ctx.fill();
		this.ctx.closePath();

		this.ctx.beginPath();
		this.ctx.arc(this.center.x, this.center.y, this.clockRadius * 0.0225, 0, 2*Math.PI);
		this.ctx.fillStyle = this.colorTheme.accent_dark;
		this.ctx.fill();
		this.ctx.closePath();
	}

	drawIndicator(ctx, color, width, angle, range) {

		ctx.strokeStyle = color;
		ctx.lineWidth = width;
		ctx.lineCap = 'round';

		ctx.save();
		ctx.beginPath();
		ctx.translate(this.center.x, this.center.y);
		ctx.rotate(-180 * Math.PI/180);
		ctx.rotate(angle * Math.PI/180);
		ctx.moveTo(0, range[0]);
		ctx.lineTo(0, range[1]);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	}

	drawHighlighter() {

		const hours = this.date.getHours() + this.tzOffset;
		const minutes = this.date.getMinutes();
		const seconds = this.date.getSeconds();

		const value = (hours + minutes / 60 + seconds / 3600 + 3) % 12;
		const valueDeg = value / 12 * 360;
		const angle = valueDeg * Math.PI / 180 - Math.PI / 2;

		const dataMode = this.settings.dataMode.id;
		const ringColor = (dataMode === 'moon') ? this.colorTheme.text_light : this.colorTheme.accent_2;

		this.ctx.save();

		this.ctx.translate(this.center.x, this.center.y);
		this.ctx.rotate(angle);
		this.ctx.translate(0, -(this.clockRadius + 0.5 * this.unit));

		this.ctx.beginPath();
		this.ctx.arc(0, 0, this.unit * 0.35, 0, 2*Math.PI);
		this.ctx.fillStyle = ringColor;
		this.ctx.fill();
		this.ctx.closePath();

		this.ctx.beginPath();
		this.ctx.arc(0, 0, this.unit * 0.25, 0, 2*Math.PI);
		this.ctx.fillStyle = this.colorTheme.background_darker;
		this.ctx.fill();
		this.ctx.closePath();

		this.ctx.restore();
	}

	drawStaticElementsToCache() {

		this.ctxBg.textBaseline = "middle";
		this.ctxBg.textAlign = "center";

		this.drawClockFace();
		this.drawWeatherBackground();
		this.drawCelestialObjectIndicators();
		this.drawDataModeContent();

		this.drawIndicator(
			this.ctxBg,
			this.colorTheme.accent_light,
			this.canvas.height * 0.0061525,
			(this.date.getHours() + this.tzOffset - 0.5) * 30,
			[
				this.rimCenterRadius + this.arcWidthInner * 0.45,
				this.rimCenterRadius - this.arcWidthInner * 0.45
			]
		);
	}

	drawClockFace() {

		// Draw background
		this.ctxBg.beginPath();
		this.ctxBg.arc(this.center.x, this.center.y, this.clockRadius, 0, 2*Math.PI);
		this.ctxBg.fillStyle = "white";
		this.ctxBg.fill();

		// Text settings
		this.ctxBg.font = this.unit * 1.25 + "px " + this.fontFamily;
		this.ctxBg.fillStyle = this.colorTheme.text_dark;

		var dateHour = Helpers.getClosestStartingHourDate(this.date) +
			this.tzOffset * Constants.hourEpochs;

		if (this.settings.futureMode) {
			dateHour += 12 * Constants.hourEpochs;
		}

		const hour = new Date(dateHour).getHours();

		for (var i = hour; i < hour + 12; i++) {

			const angle = (i * 30) * Math.PI/180;
			const newHour = (i > 24) ? i - 24 : i;

			this.ctxBg.save();

			this.ctxBg.beginPath();
			this.ctxBg.translate(this.center.x, this.center.y);
			this.ctxBg.rotate(angle);
			this.ctxBg.translate(0, -this.clockRadius * 0.925);

			if (i % 3 === 0) {
				this.ctxBg.save();
				this.ctxBg.translate(0, this.clockRadius * 0.2);
				this.ctxBg.rotate(-angle);
				this.ctxBg.fillText(newHour, 0, 0);
				this.ctxBg.restore();
			}

			this.ctxBg.moveTo(0, 0);
			this.ctxBg.lineTo(0, this.clockRadius / 14);
			this.ctxBg.lineWidth = this.clockRadius / 54;
			this.ctxBg.strokeStyle = this.colorTheme.background_dark;
			this.ctxBg.lineCap = 'round';
			this.ctxBg.stroke();
			this.ctxBg.closePath();

			this.ctxBg.restore();
		}
	}

	drawWeatherBackground() {
		this.ctxBg.fillStyle = this.colorTheme.background_dark;
		this.ctxBg.beginPath()
		this.ctxBg.arc(this.center.x, this.center.y, this.canvas.height / 2, 0, Math.PI * 2, false);
		this.ctxBg.arc(this.center.x, this.center.y, this.innerRadius, 0, Math.PI * 2, true);
		this.ctxBg.fill();
	}

	drawCelestialObjectIndicators() {

		const thickness = this.unit;
		const location = this.clockRadius + this.unit / 2;

		const upColor = (this.settings.dataMode.id === 'moon') ? this.colorTheme.text_light : this.colorTheme.accent_2;

		this.ctxBg.lineWidth = thickness;

		var now = new Date(Helpers.getClosestStartingHourDate(this.date));

		if (this.settings.futureMode) {
			now = new Date(now.getTime() + 12 * Constants.hourEpochs);
		}

		const dataMode = this.settings.dataMode.id;
		const rawEvents = (dataMode !== 'moon') ? this.weatherData.sunEvents : this.weatherData.moonEvents;
		const events = Helpers.getCelestialEvents(now, rawEvents);
		const n = events.length;

		for (var i = 0; i < n; i++) {

			if (!((i !== 0) ^ (i !== n - 1))) {
				continue;
			}

			const event = events[i];
			const up = (i === 0) ? event.up : !events[n - 1].up;
			const color = (up) ? upColor : this.colorTheme.background_darker;
			const date = event.time;
			const hour = date.getHours() + date.getMinutes() / 60 + this.tzOffset;
			const angle = (hour % 12) / 12 * 2 * Math.PI - (Math.PI / 2);

			this.ctxBg.save();

			this.ctxBg.translate(this.center.x, this.center.y);
			this.ctxBg.rotate(angle + Math.PI / 2);
			this.ctxBg.translate(0, -location);
			this.ctxBg.beginPath();
			this.ctxBg.arc(0, 0, thickness / 2, 0, 2 * Math.PI);
			this.ctxBg.fillStyle = color;
			this.ctxBg.fill();
			this.ctxBg.closePath();

			this.ctxBg.restore();
		}

		const intervals = [];
		for (var i = 1; i < n; i++) {
			intervals.push({
				start: events[i - 1].time,
				end: events[i].time,
				up: !events[i].up
			});
		}

		for (var i = 0; i < intervals.length; i++) {

			const interval = intervals[i];
			const color = (interval.up) ? upColor : this.colorTheme.background_darker;

			const startDate = interval.start;
			const endDate = interval.end;

			const startHour = startDate.getHours() + startDate.getMinutes() / 60 + this.tzOffset;
			const endHour = endDate.getHours() + endDate.getMinutes() / 60 + this.tzOffset;

			const startAngle = (startHour % 12) / 12 * 2 * Math.PI - (Math.PI / 2);
			const endAngle = (endHour % 12) / 12 * 2 * Math.PI - (Math.PI / 2);

			this.ctxBg.strokeStyle = color;
			this.ctxBg.beginPath();
			this.ctxBg.arc(this.center.x, this.center.y, location, startAngle, endAngle);
			this.ctxBg.stroke();
		}
	}

	getWeatherDataArray() {

		var dateHour = Helpers.getClosestStartingHourDate(this.date);

		if (this.settings.futureMode) {
			dateHour += 12 * Constants.hourEpochs;
		}

		const weatherDataArray = [];

		for (var i = 0; i < 12; i++) {

			const date = dateHour + i * Constants.hourEpochs;

			var found = false;
			for (var j in this.weatherData.values) {
				if (date === this.weatherData.values[j].time.getTime()) {
					found = true;
					weatherDataArray.push(this.weatherData.values[j]);
					break;
				}
			}

			if (!found) {
				throw "Weather data not found!";
			}
		}

		return weatherDataArray;
	}

	drawDataModeContent() {

		const weatherDataArray = this.getWeatherDataArray();
		const dataMode = this.settings.dataMode;
		const dataType = _.find(Controller.getDataTypes(), { id: dataMode.id })

		const colors = [];
		if (dataType) {
			for (var index in weatherDataArray) {
				const weatherObject = weatherDataArray[index];
				const measure = weatherObject[dataType.key];
				const color = dataType.colorFunction(measure);
				colors.push(color);
			}
		}

		switch (dataMode.id) {
			case "weather":
				this.drawWeatherData(weatherDataArray);
				break;
			case "temperature":
				this.drawTemperatureData(weatherDataArray, colors);
				break;
			case "rain":
				this.drawRainData(weatherDataArray, colors);
				break;
			case "humidity":
				this.drawHumidityData(weatherDataArray, colors);
				break;
			case "wind":
				this.drawWindData(weatherDataArray, colors);
				break;
			case "cloud":
				this.drawCloudData(weatherDataArray, colors);
				break;
			case "moon":
				this.drawMoonData(weatherDataArray);
				break;
		}
	}

	drawWeatherData(weatherDataArray) {

		// Font settings
		this.ctxBg.font = this.arcWidth * 0.2 + "px " + this.fontFamily;
		this.ctxBg.fillStyle = this.colorTheme.text_dark;
		const textOffset = this.arcWidth * 0.02;

		// Weather icon scaling
		const width = this.arcWidth * 0.625;
		const height = this.arcWidth * 0.625;

		const hours = this.date.getHours() + this.tzOffset;

		for (var i = 0; i < 12; i++) {

			const weatherObject = weatherDataArray[i];
			const temperature = weatherObject.Temperature;
			const unitMode = this.settings.unitMode.id;
			const tempShow = (unitMode === "si") ? temperature : temperature * (9/5) + 32;
			const weatherCode = parseInt(weatherObject.WeatherSymbol3);
			const imageKey = (weatherObject.sunPosition.altitude > 0) ? "day" : "night";
			const image = this.images[weatherCode][imageKey];
			const angle = ((i + hours) * 30) * Math.PI/180;

			this.ctxBg.save();

			this.ctxBg.translate(this.center.x, this.center.y);
			this.ctxBg.rotate(angle);
			this.ctxBg.translate(0, -this.rimCenterRadius);

			this.ctxBg.translate(0, -this.arcWidth * 0.265);
			this.ctxBg.rotate(-angle);
			this.ctxBg.fillText(Helpers.floatToString(tempShow, 0) + "°", textOffset, 0);
			this.ctxBg.rotate(angle);

			this.ctxBg.translate(0, this.arcWidth * 0.434);
			this.ctxBg.rotate(-angle);
			this.ctxBg.drawImage(image, -width / 2, -height / 2, width, height);

			this.ctxBg.restore();
		}
	}

	drawTemperatureData(weatherDataArray, colors) {

		const hours = this.date.getHours() + this.tzOffset;

		const textOffset = this.arcWidth * 0.005;

		this.drawDataCircles(colors, hours);

		if (this.settings.gradientMode) {
			this.drawArcGradient(colors, hours);
		}

		for (var i = 0; i < 12; i++) {

			const weatherObject = weatherDataArray[i];
			const temperature = weatherObject.Temperature;
			const unitMode = this.settings.unitMode.id;
			const tempShow = (unitMode === "si") ? temperature : temperature * (9/5) + 32;
			const angle = ((i + hours) * 30) * Math.PI/180;

			this.ctxBg.save();

			this.ctxBg.translate(this.center.x, this.center.y);
			this.ctxBg.rotate(angle);
			this.ctxBg.translate(0, -this.rimCenterRadius);
			this.ctxBg.rotate(-angle);
			this.ctxBg.fillStyle = 'white';
			this.ctxBg.font = this.arcWidthInner * 0.245 + "px " + this.fontFamily
			this.ctxBg.fillText(Helpers.floatToString(tempShow, 0) + "°", textOffset, 0);

			this.ctxBg.restore();
		}
	}

	drawRainData(weatherDataArray, colors) {

		const hours = this.date.getHours() + this.tzOffset;

		this.drawDataCircles(colors, hours);

		if (this.settings.gradientMode) {
			this.drawArcGradient(colors, hours);
		}

		for (var i = 0; i < 12; i++) {

			const weatherObject = weatherDataArray[i];
			const precip = weatherObject.Precipitation1h;
			const precipShow = (this.settings.unitMode.id === 'si') ? precip : precip * 0.0393701;
			const precision = (this.settings.unitMode.id === 'si') ? 1 : 2;
			const symbol = (this.settings.unitMode.id === 'si') ? "mm" : "\"";
			const offset1 = (this.settings.unitMode.id === 'si') ? 0.11 : 0.07;
			const offset2 = (this.settings.unitMode.id === 'si') ? 0.11 : 0.21;
			const angle = ((i + hours) * 30) * Math.PI/180;

			this.ctxBg.save();

			this.ctxBg.translate(this.center.x, this.center.y);
			this.ctxBg.rotate(angle);
			this.ctxBg.translate(0, -this.rimCenterRadius);
			this.ctxBg.rotate(-angle);
			this.ctxBg.fillStyle = 'white';
			this.ctxBg.font = this.arcWidthInner * 0.245 + "px " + this.fontFamily
			this.ctxBg.fillText(Helpers.floatToString(precipShow, precision), 0, -this.arcWidthInner * offset1);
			this.ctxBg.fillText(symbol, 0, this.arcWidthInner * offset2);

			this.ctxBg.restore();
		}
	}

	drawWindData(weatherDataArray, colors) {

		const fontSize = this.arcWidthInner * 0.235;
		const fontSizeSmall = fontSize * 0.85;

		const hours = this.date.getHours() + this.tzOffset;

		this.drawDataCircles(colors, hours);

		if (this.settings.gradientMode) {
			this.drawArcGradient(colors, hours);
		}

		for (var i = 0; i < 12; i++) {

			const weatherObject = weatherDataArray[i];
			const windDegree = weatherObject.WindDirection;
			const windSpeed = weatherObject.WindSpeedMS;
			const windSpeedShow = (this.settings.unitMode.id === 'si') ? windSpeed : windSpeed * 2.23694;
			const symbol = (this.settings.unitMode.id === 'si') ? "m/s" : "mph";
			const angle = ((i + hours) * 30) * Math.PI/180;

			const l = this.arcWidthInner * 0.075;
			const g = 1.618;
			const h = l + g * l;
			const o = -0.87 * l;

			this.ctxBg.save();

			this.ctxBg.translate(this.center.x, this.center.y);
			this.ctxBg.rotate(angle);
			this.ctxBg.translate(0, -this.rimCenterRadius);
			this.ctxBg.translate(0, -this.arcWidthInner / 6);

			this.ctxBg.rotate(-angle);
			this.ctxBg.fillStyle = 'white';
			this.ctxBg.font = fontSize + "px " + this.fontFamily;
			this.ctxBg.fillText(Helpers.floatToString(windSpeedShow, 0), 0, -this.arcWidthInner * 0.11);
			this.ctxBg.font = fontSizeSmall + "px " + this.fontFamily;
			this.ctxBg.fillText(symbol, 0, this.arcWidthInner * 0.11);

			this.ctxBg.rotate(angle);
			this.ctxBg.translate(0, this.arcWidthInner * 0.45);
			this.ctxBg.rotate(-angle);
			this.ctxBg.rotate((windDegree) / 180 * Math.PI);

			this.ctxBg.fillStyle = this.colorTheme.background_dark;

			if (windSpeed >= 0.5) {
				this.ctxBg.beginPath();
				this.ctxBg.moveTo(0, h + o);
				this.ctxBg.lineTo(l, o);
				this.ctxBg.lineTo(-l, o);
				this.ctxBg.fill();
			} else {
				this.ctxBg.beginPath();
				this.ctxBg.arc(0, 0, l, 0, 2*Math.PI);
				this.ctxBg.fill();
				this.ctxBg.closePath();
			}

			this.ctxBg.restore();
		}
	}

	drawHumidityData(weatherDataArray, colors) {

		const hours = this.date.getHours() + this.tzOffset;

		this.drawDataCircles(colors, hours);

		if (this.settings.gradientMode) {
			this.drawArcGradient(colors, hours);
		}

		for (var i = 0; i < 12; i++) {

			const weatherObject = weatherDataArray[i];
			const humidity = weatherObject.Humidity;
			const angle = ((i + hours) * 30) * Math.PI/180;

			this.ctxBg.save();

			this.ctxBg.translate(this.center.x, this.center.y);
			this.ctxBg.rotate(angle);
			this.ctxBg.translate(0, -this.rimCenterRadius);
			this.ctxBg.rotate(-angle);
			this.ctxBg.fillStyle = 'white';
			this.ctxBg.font = this.arcWidthInner * 0.245 + "px " + this.fontFamily;
			this.ctxBg.fillText(Helpers.floatToString(humidity, 0) + "%", 0, 0);

			this.ctxBg.restore();
		}
	}

	drawCloudData(weatherDataArray, colors) {

		const hours = this.date.getHours() + this.tzOffset;

		this.drawDataCircles(colors, hours);

		if (this.settings.gradientMode) {
			this.drawArcGradient(colors, hours);
		}

		for (var i = 0; i < 12; i++) {

			const weatherObject = weatherDataArray[i];
			const cloudCover = weatherObject.TotalCloudCover;
			const angle = ((i + hours) * 30) * Math.PI/180;

			this.ctxBg.save();

			this.ctxBg.translate(this.center.x, this.center.y);
			this.ctxBg.rotate(angle);
			this.ctxBg.translate(0, -this.rimCenterRadius);
			this.ctxBg.rotate(-angle);
			this.ctxBg.fillStyle = 'white';
			this.ctxBg.font = this.arcWidthInner * 0.245 + "px " + this.fontFamily;
			this.ctxBg.fillText(Helpers.floatToString(cloudCover, 0) + "%", 0, 0);

			this.ctxBg.restore();
		}
	}

	drawMoonData(weatherDataArray) {

		const hours = this.date.getHours() + this.tzOffset;

		const targetSize = this.arcWidthInner;
		const size = Math.ceil(targetSize / 100) * 100;

		var moonCanvas = document.createElement('canvas');
		var moonPainter = new MoonPainter(moonCanvas, size);

		for (var i = 0; i < 12; i++) {

			const weatherObject = weatherDataArray[i];
			const fraction = weatherObject.moonIllumination.fraction;
			const phase = weatherObject.moonIllumination.phase;
			const tilt = weatherObject.moonPosition.parallacticAngle;
			const limbAngle = weatherObject.moonIllumination.angle;
			const zenith = limbAngle - tilt;
			const altitude = weatherObject.moonPosition.altitude;
			const upColor = (altitude > 0) ? this.colorTheme.text_light : this.colorTheme.background_light;
			const angle = ((i + hours) * 30) * Math.PI/180;

			this.ctxBg.save();

			this.ctxBg.translate(this.center.x, this.center.y);
			this.ctxBg.rotate(angle);
			this.ctxBg.translate(0, -this.rimCenterRadius);
			this.ctxBg.rotate(-angle);

			moonPainter.setColors(upColor, this.colorTheme.background_darker);
			moonPainter.paint(phase);
			this.ctxBg.rotate(zenith);
			this.ctxBg.drawImage(moonCanvas, -targetSize / 2, -targetSize / 2, targetSize, targetSize);
			this.ctxBg.rotate(-zenith);

			this.ctxBg.fillStyle = 'white';
			this.ctxBg.font = this.arcWidthInner * 0.245 + "px " + this.fontFamily;
			this.ctxBg.fillText(Helpers.floatToString(fraction * 100, 0) + "%", 0, 0);

			this.ctxBg.restore();
		}
	}

	drawDataCircles(colors, hours) {

		for (var i = 0; i < 12; i++) {

			if (this.settings.gradientMode && !((i !== 0) ^ (i !== 11))) {
				continue;
			}

			const angle = ((i + hours) * 30) * Math.PI/180;

			this.ctxBg.save();

			this.ctxBg.translate(this.center.x, this.center.y);
			this.ctxBg.rotate(angle);
			this.ctxBg.translate(0, -this.rimCenterRadius);
			this.ctxBg.beginPath();
			this.ctxBg.arc(0, 0, this.arcWidthInner / 2, 0, 2*Math.PI);
			this.ctxBg.fillStyle = colors[i];
			this.ctxBg.fill();
			this.ctxBg.closePath();

			this.ctxBg.restore();
		}
	}

	drawArcGradient(colors, hours) {

		const location = this.rimCenterRadius;
		const width = this.arcWidthInner / 2;
		const widthExtra = 0.25 * this.unit;

		const colorStops = [];
		for (let i = 0; i < colors.length; i++) {
			colorStops.push({ offset: i / (colors.length - 1), color: colors[i]});
		}

		const value = hours % 12;
		const valueDeg = value / 12 * 360;
		const startAngle = valueDeg * Math.PI / 180 - Math.PI / 2;
		const endAngle = startAngle + 330 * Math.PI / 180;

		this.ctxBg.fillArcGradient(
			this.center.x,
			this.center.y,
			startAngle,
			endAngle,
			colorStops,
			location + (width + widthExtra),
			location - (width + widthExtra),
			{ resolutionFactor: 3 }
		);

		this.ctxBg.lineWidth = 2 * widthExtra;
		this.ctxBg.strokeStyle = this.colorTheme.background_dark;

		this.ctxBg.beginPath();
		this.ctxBg.arc(this.center.x, this.center.y, location + (width + widthExtra), 0, 2 * Math.PI);
		this.ctxBg.stroke();

		this.ctxBg.beginPath();
		this.ctxBg.arc(this.center.x, this.center.y, location - (width + widthExtra), 0, 2 * Math.PI);
		this.ctxBg.stroke();
	}
}
