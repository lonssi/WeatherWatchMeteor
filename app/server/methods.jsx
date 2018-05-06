import {weatherCache} from './cache.js';
import {Helpers} from '../lib/helpers.js';
import {Parsing} from '../lib/parsing.js';
import xss from 'xss';

/**
 * Create error message for an error
 * @param  {Object} e - error object
 * @return {String}
 */
var parseAPIError = function(e) {
	if (e.message.match("getaddrinfo")) {
		return "Could not connect to server";
	} else if (e.message.match("No data available for") ||
		e.message.match("No locations found")) {
		return "Weather data unavailable for location";
	} else if (e.message.match("invalid byte sequence")) {
		return "Encoding error";
	} else {
		console.log(e.message);
		console.log(e.stack);
		return "Unknown server error";
	}
}

/**
 * Constructs a request URL from user location
 * @param  {String or Object} location - user location
 * @param  {Date} date - request time instance
 * @param  {String} apikey - Weather service API key
 * @return {String} - request URL
 */
var getAPIRequestURL = function(location, date, apikey) {

	const startDate = new Date(Helpers.getClosestStartingHourDate(date));
	const startDateStr = startDate.toISOString();

	const host = 'https://data.fmi.fi/fmi-apikey/';
	const request = "fmi::forecast::hirlam::surface::point::multipointcoverage";

	var url = host + apikey + "/wfs" + "?request=getFeature" +
		"&storedquery_id=" + request + "&starttime=" + startDateStr;

	if (_.isString(location)) {
		url += "&place=" + encodeURIComponent(location);
	} else if (_.isObject(location)) {
		url += "&latlon=" + location.latitude + "," + location.longitude;
	}

	return url;
}

Meteor.methods({

	/**
	 * Requests weather forecast data from the weather API
	 * @param  {String or Object} location - location string or object
	 * @return {Object} - weather data object
	 */
	getWeatherInformation(location) {

		this.unblock();

		location = JSON.parse(xss(JSON.stringify(location)));

		if (!(_.isString(location) || _.isObject(location))) {
			throw new Meteor.Error("Invalid parameters!");
		}

		const date = new Date();

		// Try to find cached weather data
		if (_.isString(location)) {
			const cacheResult = weatherCache.get(location, date);
			if (cacheResult) {
				return cacheResult;
			}
		}

		const apikey = Meteor.settings.private.apikey;
		const url = getAPIRequestURL(location, date, apikey);

		console.log("API call: " + url);
		console.log("Time: " + date);

		// API request
		var data;
		try {
			data = HTTP.call('GET', url);
		} catch (e) {
			const errorMessage = parseAPIError(e);
			throw new Meteor.Error(errorMessage);
		}

		// Parse the XML data and create a weather data object
		var weatherData;
		try {
			// Remove instances of the apikey in the XML string just in case
			const content = data.content.replace(new RegExp(apikey, 'gi'), '');
			weatherData = Parsing.parseXml(content);
		} catch (e) {
			console.log(e.message);
			console.log(e.stack);
			throw new Meteor.Error("Weather data parsing failed");
		}

		// Cache the weather data
		try {
			if (_.isString(location)) {
				weatherCache.add(weatherData, location);
			}
		} catch (e) {
			console.log(e.message);
			console.log(e.stack);
		}

		return weatherData;
	}
});
