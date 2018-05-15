import moment from 'moment';
import {Constants} from './constants.js';


var clamp = function(num, min, max) {
	return num <= min ? min : num >= max ? max : num;
}

export const Helpers = {

	clamp,

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

	toBoolean: function(value) {
		try {
			value = JSON.parse(value);
			if (_.isBoolean(value)) {
				return value;
			} else {
				throw "Not boolean";
			}
		} catch (e) {
			return null;
		}
	},

	toFloat: function(value) {
		try {
			value = JSON.parse(value);
			if (_.isNumber(value)) {
				return value;
			} else {
				throw "Not number";
			}
		} catch (e) {
			return null;
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
	}

}
