import {WeatherController} from './weather.js';
import {Colors} from '../../lib/colors.js';
import {Helpers} from '../../lib/helpers.js';
import xss from 'xss';
import chroma from 'chroma-js';


var settingsOpen = ReactiveVar(false);

const colorThemeDark = {
	id: 'dark',
	name: 'Dark',
	bg: {
		light: '#475663',
		dark: '#3E4B57',
		darker: '#37434C',
		clock: '#FFFFFF'
	},
	accent: {
		light: '#E6944C',
		dark: '#BA5E20'
	},
	text: {
		light: '#A1B1B3',
		dark: '#76898C',
		data: '#212121'
	},
	misc: {
		menu: '#3E4B57',
		clock: '#3E4B57',
		border: '#323838',
		hint: '#76898C',
		down: '#37434C'
	},
	static: {
		moon_bright_up: '#A1B1B3',
		moon_bright_down: '#475663',
		moon_dark: '#37434C'
	}
};

const colorThemeLight = {
	id: 'light',
	name: 'Light',
	bg: {
		light: '#FFFFFF',
		dark: '#EEEEEE',
		darker: '#CBCBCB',
		clock: '#FFFFFF'
	},
	accent: {
		light: '#6A859A',
		dark: '#54697A'
	},
	text: {
		light: '#363636',
		dark: '#777777',
		data: '#212121'
	},
	misc: {
		menu: '#FFFFFF',
		clock: '#3E4B57',
		border: '#DFDFDF',
		hint: '#B2B2B2',
		down: '#54697A',
	},
	static: {
		moon_bright_up: '#A1B1B3',
		moon_bright_down: '#4D5D6B',
		moon_dark: '#3E4C56'
	}
};

const colorThemes = [
	colorThemeDark,
	colorThemeLight
];

var colorTheme = new ReactiveVar(null);
var hue = new ReactiveVar(0);

const availableUnitModes = [
	{ id: 'si', text: 'SI' },
	{ id: 'imperial', text: 'Imperial' }
];

const dataTypes = [
	{
		id: 'temperature',
		key: 'Temperature',
		range: [-40, 40],
		colorFunction: Colors.getTemperatureColor
	},
	{
		id: 'rain',
		key: 'Precipitation1h',
		range: [0, 12],
		colorFunction: Colors.getPrecipitationColor
	},
	{
		id: 'wind',
		key: 'WindSpeedMS',
		range: [0, 27],
		colorFunction: Colors.getWindColor
	},
	{
		id: 'humidity',
		key: 'Humidity',
		range: [0, 100],
		colorFunction: Colors.getHumidityColor
	},
	{
		id: 'cloud',
		key: 'TotalCloudCover',
		range: [0, 100],
		colorFunction: Colors.getCloudColor
	}
];

const availableDataModes = [
	{
		id: 'weather',
		text: 'Weather',
		icon: 'fa-sun-o'
	},
	{
		id: 'temperature',
		text: 'Temperature',
		icon: 'fa-thermometer-half'
	},
	{
		id: 'rain',
		text: 'Rain',
		icon: 'fa-tint'
	},
	{
		id: 'wind',
		text: 'Wind',
		icon: 'fa-superpowers'
	},
	{
		id: 'humidity',
		text: 'Humidity',
		icon: 'fa-bullseye'
	},
	{
		id: 'cloud',
		text: 'Cloud cover',
		icon: 'fa-cloud'
	},
	{
		id: 'moon',
		text: 'Moon phase',
		icon: 'fa-moon-o'
	}
];

const availableClockSizes = [
	{
		id: 'small',
		text: 'Small',
		size: 7
	},
	{
		id: 'medium',
		text: 'Medium',
		size: 6.2
	},
	{
		id: 'large',
		text: 'Large',
		size: 5.5
	},
];

var clockSettings = new ReactiveDict();
clockSettings.set('futureMode', false);
clockSettings.set('unitMode', availableUnitModes[0]);
clockSettings.set('dataMode', availableDataModes[0]);
clockSettings.set('forecastTimezone', true);
clockSettings.set('gradientMode', true);
clockSettings.set('clockSize', availableClockSizes[1]);
clockSettings.set('secondHand', false);

var setUnitMode = function(value, cache) {
	if (_.isString(value)) {
		const unitMode = _.find(availableUnitModes, { id: value });
		if (unitMode) {
			clockSettings.set('unitMode', unitMode);
			localStorage.unitMode = value;
		}
	} else {
		if (cache) {
			localStorage.removeItem('unitMode');
		}
	}
};

var setDataMode = function(value, cache) {
	if (_.isString(value)) {
		const dataMode = _.find(availableDataModes, { id: value });
		if (dataMode) {
			clockSettings.set('dataMode', dataMode);
			localStorage.dataMode = value;
		}
	} else {
		if (cache) {
			localStorage.removeItem('dataMode');
		}
	}
};

var setForecastTimezoneMode = function(value) {
	if (_.isNull(value)) {
		clockSettings.set('forecastTimezone', !clockSettings.get('forecastTimezone'));
		localStorage.forecastTimezone = clockSettings.get('forecastTimezone');
	} else {
		value = Helpers.toBoolean(value);
		if (value) {
			clockSettings.set('forecastTimezone', value);
			localStorage.forecastTimezone = value;
		} else {
			localStorage.removeItem('forecastTimezone');
		}
	}
};

var setGradientMode = function(value) {
	if (_.isNull(value)) {
		clockSettings.set('gradientMode', !clockSettings.get('gradientMode'));
		localStorage.gradientMode = clockSettings.get('gradientMode');
	} else {
		value = Helpers.toBoolean(value);
		if (value) {
			clockSettings.set('gradientMode', value);
			localStorage.gradientMode = value;
		} else {
			localStorage.removeItem('gradientMode');
		}
	}
};

var setClockSize = function(value, cache) {
	if (_.isString(value)) {
		const clockSize = _.find(availableClockSizes, { id: value });
		if (clockSize) {
			clockSettings.set('clockSize', clockSize);
			localStorage.clockSize = value;
		}
	} else {
		if (cache) {
			localStorage.removeItem('clockSize');
		}
	}
};

var setSecondHand = function(value) {
	if (_.isNull(value)) {
		clockSettings.set('secondHand', !clockSettings.get('secondHand'));
		localStorage.secondHand = clockSettings.get('secondHand');
	} else {
		value = Helpers.toBoolean(value);
		if (value) {
			clockSettings.set('secondHand', value);
			localStorage.secondHand = value;
		} else {
			localStorage.removeItem('secondHand');
		}
	}
};

var setHue = function(value, cache) {
	value = Helpers.toFloat(value);
	if (_.isNumber(value) && value >= 0 && value <= 1) {
		hue.set(value);
		localStorage.hue = value;
	} else {
		if (cache) {
			localStorage.removeItem('hue');
		}
	}
};

var setColorTheme = function(value, cache) {
	if (_.isString(value)) {
		const ct = _.find(colorThemes, { id: value });
		if (ct) {
			const ctNew = Colors.getColorTheme(ct, hue.get());
			colorTheme.set(ctNew);
			localStorage.colorTheme = value;
		}
	} else {
		if (cache) {
			localStorage.removeItem('colorTheme');
		}
	}
};

var initialize = function() {

	// If we are on a mobile device use the light
	// color theme by default because of better
	// visibility in outdoor lighting conditions
	if ($(window).width() < 480) {
		colorTheme.set(colorThemes[1]);
	} else {
		colorTheme.set(colorThemes[0]);
	}

	getCachedData();
};

var getCachedData = function() {

	var value;

	// Check for cached unit mode
	value = xss(localStorage.unitMode);
	if (value) {
		setUnitMode(value, true);
	}

	// Check for cached data mode
	value = xss(localStorage.dataMode);
	if (value) {
		setDataMode(value, true);
	}

	// Check for cached timezone mode
	value = xss(localStorage.forecastTimezone);
	if (value) {
		setForecastTimezoneMode(value);
	}

	// Check for cached gradient mode
	value = xss(localStorage.gradientMode);
	if (value) {
		setGradientMode(value);
	}

	// Check for cached clock size
	value = xss(localStorage.clockSize);
	if (value) {
		setClockSize(value, true);
	}

	// Check for cached clock second hand
	value = xss(localStorage.secondHand);
	if (value) {
		setSecondHand(value);
	}

	// Check for cached color theme hue
	value = xss(localStorage.hue);
	if (value) {
		setHue(value, true);
	}

	// Check for cached color theme
	value = xss(localStorage.colorTheme);
	if (value) {
		setColorTheme(value, true);
	}

	// Check for cached location
	value = xss(localStorage.location);
	if (value && _.isString(value)) {
		setTimeout(function() {
				Dispatcher.dispatch({
				actionType: "SEARCH_BUTTON_CLICKED",
				data: value
			});
		}, 1);
	}
}

var images = {};
var imagesReady = ReactiveVar(false);

var imagesLoaded = function() {
    for (const key in images) {
    	const imgObj = images[key];
    	for (const imageKey in imgObj) {
    		const img = imgObj[imageKey];
    		if (!img.complete) {
    		    return false;
    		}
    	}
    }
    return true;
};

var loadImages = function() {

	const codes = [
		1, 22, 2, 32, 3, 42, 51, 53, 62, 64, 72,
		81, 83, 92, 21, 23, 31, 33, 41, 43, 52,
		61, 63, 71, 73, 82, 91
	];

	var handleImageChange = function() {
		if (imagesLoaded()) {
			imagesReady.set(true);
		}
	};

	images = {};
	for (var i = 0; i < codes.length; i++) {

		const code = codes[i];

		const baseUrl = "images/symbols/" + code;

		const urlDay = baseUrl + ".svg";
		var imageDay = new Image();
		imageDay.onload = handleImageChange;
		imageDay.onerror = handleImageChange;
		imageDay.src = urlDay;

		const urlNight = baseUrl + "_n.svg";
		var imageNight = new Image();
		imageNight.onload = handleImageChange;
		imageNight.onerror = handleImageChange;
		imageNight.src = urlNight;

		images[code] = {
			day: imageDay,
			night: imageNight
		};
	}
};

if (Meteor.isClient) {
	Dispatcher.register(function(payload) {
		switch (payload.actionType) {
			case "CLIENT_INITIALIZED":
				initialize();
				break;
			case "SEARCH_BUTTON_CLICKED":
				WeatherController.queryWeatherInformation(payload.data);
				break;
			case "FUTURE_BUTTON_CLICKED":
				clockSettings.set('futureMode', !clockSettings.get('futureMode'));
				break;
			case "DATA_MODE_BUTTON_CLICKED":
				setDataMode(payload.data);
				break;
			case "COLOR_THEME_SELECTED":
				setColorTheme(payload.data);
				break;
			case "HUE_CHANGED":
				setHue(payload.data);
				setColorTheme(colorTheme.get().id);
				break;
			case "UNIT_MODE_SELECTED":
				setUnitMode(payload.data);
				break;
			case "FORECAST_TIMEZONE_TOGGLED":
				setForecastTimezoneMode(null);
				break;
			case "CLOCK_SECOND_HAND_TOGGLED":
				setSecondHand(null);
				break;
			case "GRADIENT_MODE_TOGGLED":
				setGradientMode(null);
				break;
			case "CLOCK_SIZE_SELECTED":
				setClockSize(payload.data);
				break;
			case "GET_LOCATION_BUTTON_CLICKED":
				WeatherController.locationQuery();
				break;
			case "DOT_MENU_OPEN_BUTTON_CLICKED":
				settingsOpen.set(true);
				break;
			case "DOT_MENU_CLOSE_BUTTON_CLICKED":
				settingsOpen.set(false);
				break;
		}
	});
}

export const Controller = {
	loadImages,
	getColorTheme: function() { return colorTheme.get(); },
	getColorThemes: function() { return colorThemes; },
	getHue: function() { return hue.get(); },
	getDataTypes: function() { return dataTypes; },
	getClockSettings: function() { return clockSettings.all(); },
	getAvailableUnitModes: function() { return availableUnitModes; },
	getAvailableDataModes: function() { return availableDataModes; },
	getAvailableClockSizes: function() { return availableClockSizes; },
	getImages: function() { return images; },
	imagesReady: function() { return imagesReady.get(); },
	settingsOpen: function() { return settingsOpen.get() }
}
