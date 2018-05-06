import moment from 'moment';
import {Constants} from './constants.js';


var clamp = function(num, min, max) {
	return num <= min ? min : num >= max ? max : num;
}

export const Helpers = {

	floatToString: function(value, precision) {
		const str = value.toFixed(precision);
		if (Object.is(parseInt(str), -0)) {
			return str.substring(1);
		} else {
			return str;
		}
	},

	hideVirtualKeyboard: function() {
		if (
			document &&
			document.activeElement &&
			document.activeElement.blur &&
			typeof document.activeElement.blur === 'function'
		) {
			document.activeElement.blur()
		}
	},

	getClosestStartingHourDate: function(date) {
		return date.getTime() - date.getMinutes() * Constants.minuteEpochs -
			date.getSeconds() * Constants.secondEpochs - date.getMilliseconds();
	},

	remapValue: function(value, srcRange, trgRange) {
		value = clamp(value, srcRange[0], srcRange[1]);
		return (value - srcRange[0]) / (srcRange[1] - srcRange[0]) *
			(trgRange[1] - trgRange[0]) + trgRange[0];
	},

	getCelestialEvents: function(start, initEvents) {

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
			if (event.time > end && !overEvent) {
				overEvent = event;
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

		events.unshift({
			up: startUp,
			time: start
		});

		events.push({
			up: endUp,
			time: end
		});

		return events;
	},

	clamp
}
