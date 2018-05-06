import _ from 'lodash';
global._ = _;

// ddp-rate-limiter version 1.0.7 uses lodash contains which has been renamed
_.contains = _.includes;

import moment from 'moment';
import 'moment-timezone';
import {Controller} from '../imports/domains/controller.js';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {DDPRateLimiter} from 'meteor/ddp-rate-limiter';

Meteor.startup(function() {

	if (Meteor.isClient) {

		// Needed for onTouchTap
		// http://stackoverflow.com/a/34015469/988941
		injectTapEventPlugin();

		// Pre-load weather canvas images
		Controller.loadImages();
	}

	if (Meteor.isServer) {

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
	}

});
