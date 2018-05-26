import React from 'react';
import {mount} from 'react-mounter';
import AppContainer from '../imports/App/AppContainer.jsx';


FlowRouter.route('/main', {
	name: 'default',
	triggersEnter: [function(context, redirect) {
		redirect('/');
	}]
});

FlowRouter.route('/', {
	name: 'main',
	action: function() {
		mount(AppContainer, {});
	}
});
