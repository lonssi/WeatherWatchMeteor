import {Meteor} from 'meteor/meteor';
import {Constants} from '/lib/constants.js';
import {Helpers} from '/lib/helpers.js';


var currentLocation = new ReactiveVar(null);
var weatherData = new ReactiveVar(null);
var weatherStatus = new ReactiveVar(null);
var weatherLoading = new ReactiveVar(false);

var weatherUpdateInterval = null;

var checkVersion = function(data) {
	if (data.version !== Constants.version) {
		location.reload();
	}
};

var clearWeatherData = function() {
	weatherData.set(null);
};

var resetWeather = function(reset) {
	if (reset) {
		clearWeatherData();
	}
	queryWeatherInformation(currentLocation.get());
};

var updateWeatherData = function(data) {

	if (!data) {
		return;
	}

	weatherData.set(data);
	currentLocation.set(data.location);
	localStorage.location = data.location;
};

var startWeatherPolling = function() {
	stopWeatherPolling();
	weatherUpdateInterval = setInterval(function() {
		if (Helpers.dataIsOutdated(weatherData.get(), true)) {
			resetWeather(false);
		}
	}, 5000);
};

var stopWeatherPolling = function() {
	if (weatherUpdateInterval) {
		clearInterval(weatherUpdateInterval);
	}
};

var queryWeatherInformation = function(location) {

	if (_.isString(location) && location.length == 0) {
		weatherStatus.set('Empty location name');
		return;
	}

	stopWeatherPolling();
	weatherLoading.set(true);

	Meteor.call("getWeatherInformation", location, function(error, result) {
		weatherLoading.set(false);
		if (error) {
			weatherStatus.set(error.error);
			if (Helpers.dataIsOutdated(weatherData.get(), true)) {
				clearWeatherData();
			}
		}
		if (result) {
			checkVersion(result);
			updateWeatherData(result);
			startWeatherPolling();
		}
	});
};

var locationQuery = function() {
	weatherLoading.set(true);
	navigator.geolocation.getCurrentPosition(locationReceived, locationFailed);
};

var locationReceived = function(position) {
	const location = {
		"latitude": position.coords.latitude,
		"longitude": position.coords.longitude
	};
	queryWeatherInformation(location);
};

var locationFailed = function(error) {
	weatherLoading.set(false);
	var errorMessage;
	switch (error.code) {
		case error.PERMISSION_DENIED:
			errorMessage = "Location request denied"
			break;
		case error.POSITION_UNAVAILABLE:
			errorMessage = "Location information unavailable"
			break;
		case error.TIMEOUT:
			errorMessage = "Location request timed out"
			break;
		case error.UNKNOWN_ERROR:
			errorMessage = "Unknown error occurred"
			break;
	}
	weatherStatus.set(errorMessage);
};

export const WeatherController = {
	getStatus: function() { return weatherStatus.get(); },
	getLoading: function() { return weatherLoading.get(); },
	getLocation: function() { return currentLocation.get() },
	queryWeatherInformation,
	locationQuery,
	resetWeather,
	getWeatherData: function() { return weatherData.get(); },
	resetStatus: function() { weatherStatus.set(null); }
};
