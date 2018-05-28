import {Meteor} from 'meteor/meteor';
import {renderRoutes} from './routes.jsx';
import {Controller} from '/imports/api/domains/controller.js';
import {render} from 'react-dom';

// Pre-load weather canvas images
Controller.loadImages();

Meteor.startup(() => {
	render(renderRoutes(), document.getElementById('app'));
});
