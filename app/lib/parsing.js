import moment from 'moment';
import SunCalc from 'suncalc';
import {Constants} from './constants.js';

var findCelestialEvents = function(timestamp, latitude, longitude, moon) {

	const now = timestamp.getTime();

	const rises = [];
	const sets = [];

	var timesFunction = (!moon) ? SunCalc.getTimes : SunCalc.getMoonTimes;

	const riseKey = (!moon) ? "sunrise" : "rise";
	const setKey = (!moon) ? "sunset" : "set";

	const maxIterations = 50;

	for (var i = 0; i < maxIterations; i++) {

		const date = new Date(now + i * 12 * Constants.hourEpochs);
		const times = timesFunction(date, latitude, longitude);
		const riseAttribute = times[riseKey];
		const setAttribute = times[setKey];

		if (riseAttribute) {
			const rise = riseAttribute.getTime();
			if (rise !== 0 && !_.includes(rises, rise)) {
				rises.push(rise);
			}
		}

		if (setAttribute) {
			const set = setAttribute.getTime();
			if (set !== 0 && !_.includes(sets, set)) {
				sets.push(set);
			}
		}

		const nRises = rises.length;
		const nSets = sets.length;

		if (nRises > 1 && nSets > 1) {

			const enoughRiseSpan = rises[nRises - 1] - now >= Constants.dayEpochs;
			const enoughSetSpan = sets[nSets - 1] - now >= Constants.dayEpochs;

			if (enoughRiseSpan && enoughSetSpan) {
				break;
			}
		}
	}

	return {
		rises: rises.map(function(date) { return new Date(date); }),
		sets: sets.map(function(date) { return new Date(date); })
	};
};

var createWeatherObject = function(timestamp, startDate, location,
	latLonString, timeZoneString, headerArray, valueArray) {

	const weatherData = {};

	weatherData.version = Constants.version;

	weatherData.location = location;
	weatherData.time = timestamp;
	weatherData.timeZone = timeZoneString;
	weatherData.timeZoneOffset = moment.tz(timeZoneString).utcOffset() / 60;
	weatherData.values = [];

	const pos = latLonString.trim().split(' ');
	weatherData.latitude = parseFloat(pos[0]);
	weatherData.longitude = parseFloat(pos[1]);

	const sunEvents = findCelestialEvents(
		timestamp,
		weatherData.latitude,
		weatherData.longitude, false
	);

	const moonEvents = findCelestialEvents(
		timestamp,
		weatherData.latitude,
		weatherData.longitude,
		true
	);

	weatherData.sunEvents = {
		rises: sunEvents.rises,
		sets: sunEvents.sets
	};

	weatherData.moonEvents = {
		rises: moonEvents.rises,
		sets: moonEvents.sets
	};

	const nHeaders = headerArray.length;
	const nObjects = valueArray.length / nHeaders;

	for (var i = 0; i < nObjects; i++) {

		const weatherObject = {};

		weatherObject.time = new Date(startDate.getTime() + i * Constants.hourEpochs);

		weatherObject.sunPosition = SunCalc.getPosition(
			weatherObject.time,
			weatherData.latitude,
			weatherData.longitude
		);

		weatherObject.moonPosition = SunCalc.getMoonPosition(
			weatherObject.time,
			weatherData.latitude,
			weatherData.longitude
		);

		weatherObject.moonIllumination = SunCalc.getMoonIllumination(
			weatherObject.time
		);

		for (var j = 0; j < nHeaders; j++) {
			const header = headerArray[j];
			const value = valueArray[i * nHeaders + j];
			weatherObject[header] = parseFloat(value);
		}

		weatherData.values.push(weatherObject);
	}

	return weatherData;
}

var parseXml = function(data) {

	var DOMParser = require('xmldom').DOMParser;
	var parser = new DOMParser();
	var xmlDoc = parser.parseFromString(data, "text/xml");

	const location = xmlDoc.getElementsByTagName("gml:name")[0].firstChild.data;
	const latLonString = xmlDoc.getElementsByTagName("gml:pos")[0].firstChild.data;
	const docAttributes = xmlDoc.getElementsByTagName("wfs:FeatureCollection")[0].attributes;
	const startDate = new Date(xmlDoc.getElementsByTagName("gml:beginPosition")[0].firstChild.data);
	const endDate = new Date(xmlDoc.getElementsByTagName("gml:endPosition")[0].firstChild.data);
	const timeZoneString = xmlDoc.getElementsByTagName("target:timezone")[0].firstChild.data;
	const headerElements = xmlDoc.getElementsByTagName("swe:DataRecord")[0].childNodes;
	const rawValues = xmlDoc.getElementsByTagName("gml:doubleOrNilReasonTupleList")[0].firstChild.data;

	var timestamp;
	for (var i = 0; i < docAttributes.length; i++) {
		if (docAttributes[i].name === "timeStamp") {
			timestamp = new Date(docAttributes[i].nodeValue);
		}
	}

	if (!timestamp) {
		throw "Weather data timestamp missing!";
	}

	const valueArray = rawValues.replace(/[^\x20-\x7E]/gmi, "").split(' ').map(function(item) {
		return item ? item : null;
	}).filter(n => n);

	const headerArray = []
	for (var i = 0; i < headerElements.length; i++) {
		const headerElement = headerElements[i];
		if (headerElement.attributes) {
			const name = headerElement.attributes[0].nodeValue;
			headerArray.push(name);
		}
	}

	return createWeatherObject(
		timestamp, startDate, location, latLonString,
		timeZoneString, headerArray, valueArray
	);
};

export const Parsing = {
	parseXml
};
