import React from 'react';
import {Router, Route, Switch} from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import AppContainer from '/imports/ui/layouts/AppContainer.jsx';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
	<Router history={browserHistory}>
		<Switch>
			<Route component={AppContainer}/>
		</Switch>
	</Router>
);
