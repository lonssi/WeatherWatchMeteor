import React from 'react';
import {Controller} from '../domains/controller.js';
import {withTracker} from 'meteor/react-meteor-data';
import App from './App.jsx';

export default AppContainer = withTracker(props => {
	return {
		colorTheme: Controller.getColorTheme()
	};
})(App);
