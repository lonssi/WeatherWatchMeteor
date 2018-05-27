import {Meteor} from 'meteor/meteor';
import {DDPRateLimiter} from 'meteor/ddp-rate-limiter';

Meteor.users.deny({
	update() {
		return true;
	},
});

const LISTS_METHODS = [
	'getWeatherInformation'
];

DDPRateLimiter.addRule({
	name(name) {
		return _.contains(LISTS_METHODS, name);
	},

	// Rate limit per connection ID
	connectionId() { return true; },
}, 4, 1000);
