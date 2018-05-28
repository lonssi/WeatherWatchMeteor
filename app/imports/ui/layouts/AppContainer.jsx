import React from 'react';
import {Controller} from '/imports/api/domains/controller.js';
import {withTracker} from 'meteor/react-meteor-data';
import App from '../components/App.jsx';

export default AppContainer = withTracker(props => {
	return {
		colorTheme: Controller.getColorTheme()
	};
})(App);
