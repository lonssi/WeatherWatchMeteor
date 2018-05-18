import {Meteor} from 'meteor/meteor';
import {Constants} from '../../lib/constants.js';

var currentLocation = new ReactiveVar(null);
var weatherData = new ReactiveVar(null);
var weatherStatus = new ReactiveVar(null);
var weatherLoading = new ReactiveVar(false);

var weatherUpdateInterval = null;

var checkVersion = function(data) {
	if (data.version !== Constants.version) {
		location.reload();
	}
}

var updateWeatherData = function(data) {

	if (!data) {
		return;
	}

	weatherData.set(data);
	currentLocation.set(data.location);
	localStorage.location = data.location;
}

var startWeatherPolling = function() {
	weatherUpdateInterval = setInterval(function() {
		if (new Date() - weatherData.get().time >= Constants.hourEpochs) {
			queryWeatherInformation(currentLocation.get());
		}
	}, 5000);
}

var stopWeatherPolling = function() {
	if (weatherUpdateInterval) {
		clearInterval(weatherUpdateInterval);
	}
}

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
		}
		if (result) {
			checkVersion(result);
			updateWeatherData(result);
			startWeatherPolling();
		}
	});
}

var locationQuery = function() {
	weatherLoading.set(true);
	navigator.geolocation.getCurrentPosition(locationReceived, locationFailed);
}

var locationReceived = function(position) {
	const location = {
		"latitude": position.coords.latitude,
		"longitude": position.coords.longitude
	};
	queryWeatherInformation(location);
}

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
}

export const WeatherController = {
	getStatus: function() { return weatherStatus.get(); },
	getLoading: function() { return weatherLoading.get(); },
	getLocation: function() { return currentLocation.get() },
	queryWeatherInformation,
	locationQuery,
	getWeatherData: function() { return weatherData.get(); },
	resetStatus: function() { weatherStatus.set(null); }
}
