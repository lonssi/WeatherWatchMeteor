import {WeatherController} from './weather.js';
import {Colors} from '../../lib/colors.js';
import xss from 'xss';

var settingsOpen = ReactiveVar(false);

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
		text: 'Small'
	},
	{
		id: 'medium',
		text: 'Medium'
	},
	{
		id: 'large',
		text: 'Large'
	},
];

var clockSettings = new ReactiveDict();
clockSettings.set('futureMode', false);
clockSettings.set('unitMode', availableUnitModes[0]);
clockSettings.set('dataMode', availableDataModes[0]);
clockSettings.set('forecastTimezone', true);
clockSettings.set('gradientMode', true);
clockSettings.set('clockSize', availableClockSizes[1]);

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

var setForecastTimezoneMode = function(value, cache) {
	if (_.isNull(value)) {
		clockSettings.set('forecastTimezone', !clockSettings.get('forecastTimezone'));
		localStorage.forecastTimezone = clockSettings.get('forecastTimezone');
	} else {
		if (_.isBoolean(value)) {
			clockSettings.set('forecastTimezone', value);
			localStorage.forecastTimezone = value;
		} else {
			if (cache) {
				localStorage.removeItem('forecastTimezone');
			}
		}
	}
};

var setGradientMode = function(value, cache) {
	if (_.isNull(value)) {
		clockSettings.set('gradientMode', !clockSettings.get('gradientMode'));
		localStorage.gradientMode = clockSettings.get('gradientMode');
	} else {
		if (_.isBoolean(value)) {
			clockSettings.set('gradientMode', value);
			localStorage.gradientMode = value;
		} else {
			if (cache) {
				localStorage.removeItem('gradientMode');
			}
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
		value = JSON.parse(value);
		setForecastTimezoneMode(value, true);
	}

	// Check for cached gradient mode
	value = xss(localStorage.gradientMode);
	if (value) {
		value = JSON.parse(value);
		setGradientMode(value, true);
	}

	// Check for cached clock size
	value = xss(localStorage.clockSize);
	if (value) {
		setClockSize(value, true);
	}

	//Check for cached location
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
		imagesReady.set(imagesLoaded());
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
				getCachedData();
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
			case "UNIT_MODE_SELECTED":
				setUnitMode(payload.data);
				break;
			case "FORECAST_TIMEZONE_TOGGLED":
				setForecastTimezoneMode(null);
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
	getDataTypes: function() { return dataTypes; },
	getClockSettings: function() { return clockSettings.all(); },
	getAvailableUnitModes: function() { return availableUnitModes; },
	getAvailableDataModes: function() { return availableDataModes; },
	getAvailableClockSizes: function() { return availableClockSizes; },
	getImages: function() { return images; },
	imagesReady: function() { return imagesReady.get(); },
	settingsOpen: function() { return settingsOpen.get() }
}
