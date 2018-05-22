import {Helpers} from '../../lib/helpers.js';
import {Colors} from '../../lib/colors.js';
import {Constants} from '../../lib/constants.js';
import {Controller} from '../domains/controller.js';
import {MoonPainter} from './MoonPainter.js';
import './ArcGradient.js';
import chroma from 'chroma-js';


export class WeatherClockCanvas {

	constructor(canvas, images, weatherData, clockSettings, container, colorTheme) {

		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');

		this.canvasBg = document.createElement('canvas');
		this.ctxBg = this.canvasBg.getContext('2d');

		this.canvasData = document.createElement('canvas');
		this.ctxData = this.canvasData.getContext('2d');

		this.fontFamily = "roboto";

		this.images = images;
		this.weatherData = weatherData;
		this.settings = clockSettings;
		this.container = container;
		this.colorTheme = colorTheme;

		this.datePrev = new Date();
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

	updateColorTheme(data) {
		this.colorTheme = data;
	}

	update(updateAll) {

		if (!this.weatherData) {
			return;
		}

		this.date = new Date();

		if (!updateAll) {
			// Draw all elements if the starting hour has changed
			updateAll = this.date.getHours() !== this.datePrev.getHours();
		}

		if (!updateAll) {
			const diff = this.date - this.datePrev;
			const threshold = (this.settings.secondHand) ? 1000 : 5000;
			if (diff < threshold) {
				return;
			}
		}

		if (updateAll) {
			this.resize();
		} else {
			this.clear();
		}

		if (this.settings.forecastTimezone) {
			this.tzOffset = (this.date.getTimezoneOffset() / 60) + this.weatherData.timeZoneOffset;
		} else {
			this.tzOffset = 0;
		}

		if (updateAll) {
			this.drawStaticElementsToCache();
		}

		this.drawStaticElementsFromCache();

		// Draw dynamic elements
		this.drawClockHands();

		this.datePrev = this.date;
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

		this.canvasData.width = this.canvas.width;
		this.canvasData.height = this.canvas.height;
		this.canvasData.style.width = this.canvas.style.width;
		this.canvasData.style.height = this.canvas.style.height;

		this.center = { x: this.canvas.width / 2, y: this.canvas.height / 2 }

		this.bound = this.canvas.height;
		this.unit = this.bound / 33;
		this.arcWidth = this.settings.clockSize.size * this.unit;
		this.arcWidthInner = this.arcWidth - 2 * this.unit;
		this.rimCenterRadius = this.bound / 2 - this.arcWidth / 2;
		this.innerRadius = this.bound / 2 - this.arcWidth;
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
			this.colorTheme.accent.dark,
			this.clockRadius * 0.04,
			(hours + minutes/60 + seconds/3600) * 30,
			[0, hourIndicatorLength]
		);

		this.drawIndicator(
			this.ctx,
			this.colorTheme.accent.light,
			this.clockRadius * 0.022,
			(minutes + seconds/60) * 6,
			[0, minuteIndicatorLength]
		);

		if (this.settings.secondHand) {
			this.drawIndicator(
				this.ctx,
				this.colorTheme.accent.light,
				this.clockRadius * 0.014,
				seconds * 6,
				[0, minuteIndicatorLength]
			);
		}

		this.ctx.beginPath();
		this.ctx.arc(this.center.x, this.center.y, this.clockRadius * 0.055, 0, 2*Math.PI);
		this.ctx.fillStyle = this.colorTheme.accent.light;
		this.ctx.fill();
		this.ctx.closePath();

		this.ctx.beginPath();
		this.ctx.arc(this.center.x, this.center.y, this.clockRadius * 0.0225, 0, 2*Math.PI);
		this.ctx.fillStyle = this.colorTheme.accent.dark;
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

	drawStaticElementsToCache() {

		this.ctxBg.textBaseline = "middle";
		this.ctxBg.textAlign = "center";

		this.drawWeatherBackground();
		this.drawClockFace();
		this.drawCelestialObjectIndicators();
		this.drawDataModeContent();
	}

	drawClockFace() {

		// Draw background
		this.ctxBg.beginPath();
		this.ctxBg.arc(this.center.x, this.center.y, this.clockRadius, 0, 2*Math.PI);
		this.ctxBg.fillStyle = this.colorTheme.bg.clock;
		this.ctxBg.fill();
		this.ctxBg.closePath();

		// Text settings
		this.ctxBg.font = this.unit * 1.25 + "px " + this.fontFamily;
		this.ctxBg.fillStyle = this.colorTheme.text.dark;

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
			this.ctxBg.strokeStyle = this.colorTheme.misc.clock;
			this.ctxBg.lineCap = 'round';
			this.ctxBg.stroke();
			this.ctxBg.closePath();

			this.ctxBg.restore();
		}
	}

	drawWeatherBackground() {

		const location = this.rimCenterRadius;
		const width = this.arcWidth / 2;

		const lightness = (this.colorTheme.id === 'dark') ? 0.0275 : 0.0325;
		const color1 = this.colorTheme.bg.dark;
		const color2 = chroma(color1).set('hsl.l', '+' + lightness).css();
		colors = [color2, color1];

		const hours = this.date.getHours() + this.tzOffset;
		const value = hours % 12;
		const valueDeg = value / 12 * 360;
		const span = 30 / 180 * Math.PI;
		const startAngle = valueDeg * Math.PI / 180 - Math.PI / 2 - span / 2;
		const endAngle = startAngle + 2 * Math.PI;

		this.drawArcGradient(this.ctxBg, location, width, startAngle, endAngle, colors);
	}

	drawCelestialObjectIndicators() {

		const thickness = this.unit;
		const location = this.clockRadius + this.unit / 2;

		const upColor = (this.settings.dataMode.id === 'moon') ? '#A1B1B3' : '#FABA25';

		this.ctxBg.lineWidth = thickness;

		var now = new Date(Helpers.getClosestStartingHourDate(this.date));

		if (this.settings.futureMode) {
			now = new Date(now.getTime() + 12 * Constants.hourEpochs);
		}

		const dataMode = this.settings.dataMode.id;
		const rawEvents = (dataMode !== 'moon') ? this.weatherData.sunEvents : this.weatherData.moonEvents;
		const events = this.getCelestialEvents(now, rawEvents);
		const n = events.length;

		for (var i = 0; i < n; i++) {

			if (!((i !== 0) ^ (i !== n - 1))) {
				continue;
			}

			const event = events[i];
			const up = (i === 0) ? event.up : !events[n - 1].up;
			const color = (up) ? upColor : this.colorTheme.misc.down;
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
			const color = (interval.up) ? upColor : this.colorTheme.misc.down;

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

	getCelestialEvents(start, initEvents) {

		const end = new Date(start.getTime() + 11 * Constants.hourEpochs);

		const eventsAll = [];

		for (var i = 0; i < initEvents.rises.length; i++) {
			eventsAll.push({
				up: true,
				time: initEvents.rises[i]
			});
		}

		for (var i = 0; i < initEvents.sets.length; i++) {
			eventsAll.push({
				up: false,
				time: initEvents.sets[i]
			});
		}

		eventsAll.sort(function(a, b) { return (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0); } );

		// Check which events are within time interval
		const events = [];
		var overEvent = null;
		for (var i = 0; i < eventsAll.length; i++) {
			const event = eventsAll[i];
			if (start <= event.time && event.time <= end) {
				events.push(event);
			}
			// Store the first event that exceeds time scope
			if (event.time > end) {
				overEvent = event;
				break;
			}
		}

		var n = events.length;

		var startUp, endUp;
		if (n > 0) {
			startUp = !events[0].up;
			endUp = !events[n - 1].up;
		} else {
			startUp = !overEvent.up;
			endUp = !startUp;
		}

		// Add the beginning of time scope as an event
		events.unshift({
			up: startUp,
			time: start
		});

		// Add the end of time scope as an event
		events.push({
			up: endUp,
			time: end
		});

		return events;
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

		this.ctxData.textBaseline = "middle";
		this.ctxData.textAlign = "center";

		const weatherDataArray = this.getWeatherDataArray();
		const dataMode = this.settings.dataMode;
		const dataType = _.find(Controller.getDataTypes(), { id: dataMode.id })

		const colors = [];
		if (dataType) {
			for (var index in weatherDataArray) {
				const weatherObject = weatherDataArray[index];
				const measure = weatherObject[dataType.key];
				const color = dataType.colorFunction(measure);
				const colorFinal = (color) ? color : this.colorTheme.bg.empty;
				colors.push(colorFinal);
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

		// Draw the data content to the background canvas
		this.ctxBg.drawImage(this.canvasData, 0, 0);
	}

	drawWeatherData(weatherDataArray) {

		this.ctxData.fillStyle = this.colorTheme.text.dark;
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
			const tempRoundedStr = Helpers.floatToString(tempShow, 0);
			const weatherCode = parseInt(weatherObject.WeatherSymbol3);
			const imageKey = (weatherObject.sunPosition.altitude > 0) ? "day" : "night";
			const image = this.images[weatherCode][imageKey];
			const angle = ((i + hours) * 30) * Math.PI/180;

			if (Helpers.numberLength(tempRoundedStr) > 2) {
				this.ctxData.font = this.arcWidth * 0.18 + "px " + this.fontFamily;
			} else {
				this.ctxData.font = this.arcWidth * 0.2 + "px " + this.fontFamily;
			}

			this.ctxData.save();

			this.ctxData.translate(this.center.x, this.center.y);
			this.ctxData.rotate(angle);
			this.ctxData.translate(0, -this.rimCenterRadius);

			this.ctxData.translate(0, -this.arcWidth * 0.265);
			this.ctxData.rotate(-angle);
			this.ctxData.fillText(tempRoundedStr + "°", textOffset, 0);
			this.ctxData.rotate(angle);

			this.ctxData.translate(0, this.arcWidth * 0.434);
			this.ctxData.rotate(-angle);
			this.ctxData.drawImage(image, -width / 2, -height / 2, width, height);

			this.ctxData.restore();
		}
	}

	drawTemperatureData(weatherDataArray, colors) {

		const hours = this.date.getHours() + this.tzOffset;

		const textOffset = this.arcWidth * 0.005;

		this.drawDataCircles(colors, hours);

		if (this.settings.gradientMode) {
			this.drawDataArcGradient(colors, hours);
		}

		this.ctxData.font = this.arcWidthInner * 0.245 + "px " + this.fontFamily;

		for (var i = 0; i < 12; i++) {

			const weatherObject = weatherDataArray[i];
			const temperature = weatherObject.Temperature;
			const unitMode = this.settings.unitMode.id;
			const tempShow = (unitMode === "si") ? temperature : temperature * (9/5) + 32;
			const angle = ((i + hours) * 30) * Math.PI/180;

			this.ctxData.save();

			this.ctxData.translate(this.center.x, this.center.y);
			this.ctxData.rotate(angle);
			this.ctxData.translate(0, -this.rimCenterRadius);
			this.ctxData.rotate(-angle);
			this.ctxData.fillStyle = (temperature >= 0) ? this.colorTheme.text.data : '#FFF';
			this.ctxData.fillText(Helpers.floatToString(tempShow, 0) + "°", textOffset, 0);

			this.ctxData.restore();
		}
	}

	drawRainData(weatherDataArray, colors) {

		this.ctxData.fillStyle = this.colorTheme.text.data;
		this.ctxData.font = this.arcWidthInner * 0.245 + "px " + this.fontFamily

		const hours = this.date.getHours() + this.tzOffset;

		this.drawDataCircles(colors, hours);

		if (this.settings.gradientMode) {
			this.drawDataArcGradient(colors, hours);
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

			this.ctxData.save();

			this.ctxData.translate(this.center.x, this.center.y);
			this.ctxData.rotate(angle);
			this.ctxData.translate(0, -this.rimCenterRadius);
			this.ctxData.rotate(-angle);
			this.ctxData.fillText(Helpers.floatToString(precipShow, precision), 0, -this.arcWidthInner * offset1);
			this.ctxData.fillText(symbol, 0, this.arcWidthInner * offset2);

			this.ctxData.restore();
		}
	}

	drawWindData(weatherDataArray, colors) {

		this.ctxData.fillStyle = this.colorTheme.text.data;

		const fontSize = this.arcWidthInner * 0.235;
		const fontSizeSmall = fontSize * 0.85;

		const hours = this.date.getHours() + this.tzOffset;

		this.drawDataCircles(colors, hours);

		if (this.settings.gradientMode) {
			this.drawDataArcGradient(colors, hours);
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

			this.ctxData.save();

			this.ctxData.translate(this.center.x, this.center.y);
			this.ctxData.rotate(angle);
			this.ctxData.translate(0, -this.rimCenterRadius);
			this.ctxData.translate(0, -this.arcWidthInner / 6);

			this.ctxData.rotate(-angle);
			this.ctxData.font = fontSize + "px " + this.fontFamily;
			this.ctxData.fillText(Helpers.floatToString(windSpeedShow, 0), 0, -this.arcWidthInner * 0.11);
			this.ctxData.font = fontSizeSmall + "px " + this.fontFamily;
			this.ctxData.fillText(symbol, 0, this.arcWidthInner * 0.11);

			this.ctxData.rotate(angle);
			this.ctxData.translate(0, this.arcWidthInner * 0.45);
			this.ctxData.rotate(-angle);
			this.ctxData.rotate((windDegree) / 180 * Math.PI);

			if (windSpeed >= 0.5) {
				this.ctxData.beginPath();
				this.ctxData.moveTo(0, h + o);
				this.ctxData.lineTo(l, o);
				this.ctxData.lineTo(-l, o);
				this.ctxData.fill();
			} else {
				this.ctxData.beginPath();
				this.ctxData.arc(0, 0, l, 0, 2*Math.PI);
				this.ctxData.fill();
				this.ctxData.closePath();
			}

			this.ctxData.restore();
		}
	}

	drawHumidityData(weatherDataArray, colors) {

		this.ctxData.fillStyle = this.colorTheme.text.data;
		this.ctxData.font = this.arcWidthInner * 0.245 + "px " + this.fontFamily;

		const hours = this.date.getHours() + this.tzOffset;

		this.drawDataCircles(colors, hours);

		if (this.settings.gradientMode) {
			this.drawDataArcGradient(colors, hours);
		}

		for (var i = 0; i < 12; i++) {

			const weatherObject = weatherDataArray[i];
			const humidity = weatherObject.Humidity;
			const angle = ((i + hours) * 30) * Math.PI/180;

			this.ctxData.save();

			this.ctxData.translate(this.center.x, this.center.y);
			this.ctxData.rotate(angle);
			this.ctxData.translate(0, -this.rimCenterRadius);
			this.ctxData.rotate(-angle);
			this.ctxData.fillText(Helpers.floatToString(humidity, 0) + "%", 0, 0);

			this.ctxData.restore();
		}
	}

	drawCloudData(weatherDataArray, colors) {

		this.ctxData.fillStyle = this.colorTheme.text.data;
		this.ctxData.font = this.arcWidthInner * 0.245 + "px " + this.fontFamily;

		const hours = this.date.getHours() + this.tzOffset;

		this.drawDataCircles(colors, hours);

		if (this.settings.gradientMode) {
			this.drawDataArcGradient(colors, hours);
		}

		for (var i = 0; i < 12; i++) {

			const weatherObject = weatherDataArray[i];
			const cloudCover = weatherObject.TotalCloudCover;
			const angle = ((i + hours) * 30) * Math.PI/180;

			this.ctxData.save();

			this.ctxData.translate(this.center.x, this.center.y);
			this.ctxData.rotate(angle);
			this.ctxData.translate(0, -this.rimCenterRadius);
			this.ctxData.rotate(-angle);
			this.ctxData.fillText(Helpers.floatToString(cloudCover, 0) + "%", 0, 0);

			this.ctxData.restore();
		}
	}

	drawMoonData(weatherDataArray) {

		this.ctxData.fillStyle = 'white';
		this.ctxData.font = this.arcWidthInner * 0.245 + "px " + this.fontFamily;

		const hours = this.date.getHours() + this.tzOffset;

		const targetSize = this.arcWidthInner;
		const size = Math.ceil(targetSize / 100) * 100;

		var moonCanvas = document.createElement('canvas');
		var moonPainter = new MoonPainter(moonCanvas, size);

		const brightUp = this.colorTheme.static.moon_bright_up;
		const brightDown = this.colorTheme.static.moon_bright_down;
		const dark = this.colorTheme.static.moon_dark;

		for (var i = 0; i < 12; i++) {

			const weatherObject = weatherDataArray[i];
			const fraction = weatherObject.moonIllumination.fraction;
			const phase = weatherObject.moonIllumination.phase;
			const tilt = weatherObject.moonPosition.parallacticAngle;
			const limbAngle = weatherObject.moonIllumination.angle;
			const zenith = limbAngle - tilt;
			const altitude = weatherObject.moonPosition.altitude;
			const upColor = (altitude > 0) ? brightUp : brightDown;
			const angle = ((i + hours) * 30) * Math.PI/180;

			this.ctxData.save();

			this.ctxData.translate(this.center.x, this.center.y);
			this.ctxData.rotate(angle);
			this.ctxData.translate(0, -this.rimCenterRadius);
			this.ctxData.rotate(-angle);

			moonPainter.setColors(upColor, dark);
			moonPainter.paint(phase);

			this.ctxData.rotate(zenith);
			this.ctxData.drawImage(moonCanvas, -targetSize / 2, -targetSize / 2, targetSize, targetSize);
			this.ctxData.rotate(-zenith);

			this.ctxData.fillText(Helpers.floatToString(fraction * 100, 0) + "%", 0, 0);

			this.ctxData.restore();
		}
	}

	drawDataCircles(colors, hours) {

		for (var i = 0; i < 12; i++) {

			if (this.settings.gradientMode && !((i !== 0) ^ (i !== 11))) {
				continue;
			}

			const angle = ((i + hours) * 30) * Math.PI/180;

			this.ctxData.save();

			this.ctxData.translate(this.center.x, this.center.y);
			this.ctxData.rotate(angle);
			this.ctxData.translate(0, -this.rimCenterRadius);
			this.ctxData.beginPath();
			this.ctxData.arc(0, 0, this.arcWidthInner / 2, 0, 2*Math.PI);
			this.ctxData.fillStyle = colors[i];
			this.ctxData.fill();
			this.ctxData.closePath();

			this.ctxData.restore();
		}
	}

	drawDataArcGradient(colors, hours) {
		const location = this.rimCenterRadius;
		const width = this.arcWidthInner / 2;
		const value = hours % 12;
		const valueDeg = value / 12 * 360;
		const startAngle = valueDeg * Math.PI / 180 - Math.PI / 2;
		const endAngle = startAngle + 330 * Math.PI / 180;
		this.drawArcGradient(this.ctxData, location, width, startAngle, endAngle, colors);
	}

	drawArcGradient(ctx, location, width, startAngle, endAngle, colors) {

		const widthExtra = 0.25 * this.unit;

		const colorStops = [];
		for (let i = 0; i < colors.length; i++) {
			colorStops.push({ offset: i / (colors.length - 1), color: colors[i]});
		}

		ctx.fillArcGradient(
			this.center.x,
			this.center.y,
			startAngle,
			endAngle,
			colorStops,
			location + (width + widthExtra),
			location - (width + widthExtra),
			{ resolutionFactor: 3 }
		);

		ctx.save();

		ctx.lineWidth = 2 * widthExtra;
		ctx.strokeStyle = this.colorTheme.bg.dark;

		const o = 0.05;

		ctx.globalCompositeOperation = "destination-out";

		ctx.beginPath();
		ctx.arc(this.center.x, this.center.y, location + (width + widthExtra), startAngle - o, endAngle + o);
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(this.center.x, this.center.y, location - (width + widthExtra), startAngle - o, endAngle + o);
		ctx.stroke();

		ctx.restore();
	}
}
