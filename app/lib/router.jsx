import React from 'react';
import {mount} from 'react-mounter';
import {AppLayout} from '../imports/AppLayout/AppLayout.jsx';

FlowRouter.route('/main', {
	name: 'default',
	triggersEnter: [function(context, redirect) {
		redirect('/');
	}]
});

FlowRouter.route('/', {
	name: 'main',
	action: function(params, queryParams) {
		mount(AppLayout, {});
	}
});
