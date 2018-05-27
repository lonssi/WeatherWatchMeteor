import {Meteor} from 'meteor/meteor';
import {renderRoutes} from './routes.jsx';
import {Controller} from '/imports/api/domains/controller.js';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {render} from 'react-dom';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// Pre-load weather canvas images
Controller.loadImages();

Meteor.startup(() => {
	render(renderRoutes(), document.getElementById('app'));
});
