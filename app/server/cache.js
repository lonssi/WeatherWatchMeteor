import {Constants} from '../lib/constants.js';

/**
 * Stores queried weather information to a cache
 * Weather data older than an hour will not be returned
 */
class WeatherCache {

	constructor() {
		this.weatherCache = {};
		this.nameCache = {};
		this.weatherCacheMaxSize = 1000;
		this.nameCacheMaxSize = 10000;
	}

	/**
	 * Add weather data to cache with the location name as key
	 * Also add the location name to name cache with the user inputted name as key
	 * @param {Object} weatherData - weather data object
	 * @param {String} locationNameUser - user inputted location name
	 */
	add(weatherData, locationNameUser) {

		const trueName = weatherData.location.toUpperCase();
		this.weatherCache[trueName] = weatherData;

		if (locationNameUser) {
			locationNameUser = locationNameUser.toUpperCase();
			this.nameCache[locationNameUser] = { "name": trueName, "time": new Date() };
		}

		// Delete oldest element if cache max size has been exceeded
		if (Object.keys(this.weatherCache).length > this.weatherCacheMaxSize) {
			removeOldest(this.weatherCache);
		}

		// Delete oldest element if cache max size has been exceeded
		if (Object.keys(this.nameCache).length > this.nameCacheMaxSize) {
			removeOldest(this.nameCache);
		}
	}

	/**
	 * Get weather data from the cache
	 * @param  {String} locationNameUser - user inputted location name
	 * @param  {Date} date - current time
	 * @return {Object} - weather data object
	 */
	get(locationNameUser, date) {

		locationNameUser = locationNameUser.toUpperCase();
		var location = locationNameUser;

		// First try to find a matching true name from name cache
		const trueNameObject = this.nameCache[locationNameUser];
		if (trueNameObject) {
			location = trueNameObject.name;
		}

		const weatherData = this.weatherCache[location];
		if (weatherData) {
			const dateDiff = date - weatherData.time;
			if (dateDiff < Constants.hourEpochs) {
				return weatherData;
			} else {
				delete this.weatherCache[location];
			}
		}

		return null;
	}

	/**
	 * Remove the oldest element from a cache
	 * @param  {Object} cache - weather data cache or location name cache
	 */
	removeOldest(cache) {
		var keyOldest = Object.keys(cache)[0];
		var dateOldest = cache[keyOldest].time;
		for (const key in cache) {
			const date = cache[key].time
			if (date < dateOldest) {
				keyOldest = key;
				dateOldest = date;
			}
		}
		delete cache[keyOldest];
	}
}

export const weatherCache = new WeatherCache();
