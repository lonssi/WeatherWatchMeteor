import React from 'react';
import {Controller} from '../domains/controller.js';
import {NotificationDialog} from '../WeatherClock/NotificationDialog.jsx';
import {SettingsMenu} from '../WeatherClock/Settings.jsx';
import {TopElement} from '../WeatherClock/TopElement.jsx';
import {WeatherClock} from '../WeatherClock/WeatherClock.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


export const AppLayout = React.createClass({

	mixins: [ReactMeteorData],
	getMeteorData: function() {
		return {
			colorTheme: Controller.getColorTheme()
		};
	},

	componentDidMount() {
		Dispatcher.dispatch({
			actionType: "CLIENT_INITIALIZED"
		});
	},

	setBodyStyles(colorTheme) {
		document.body.style.color = colorTheme.text.light;
		document.body.style.backgroundColor = colorTheme.bg.light;
	},

	render() {

		const colorTheme = this.data.colorTheme;

		if (!colorTheme) {
			return null;
		}

		const muiTheme = getMuiTheme({
			palette: {
				primary1Color: colorTheme.accent.light,
				textColor: colorTheme.text.light,
				borderColor: colorTheme.misc.border,
				disabledColor: colorTheme.misc.hint,
				canvasColor: colorTheme.misc.menu,
				alternateTextColor: colorTheme.bg.dark,
				accent1Color: colorTheme.accent.light
			}
		});

		this.setBodyStyles(colorTheme);

		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<div className="content-container">
					<NotificationDialog />
					<SettingsMenu />
					<TopElement />
					<div className="bottom-container">
						<WeatherClock />
					</div>
				</div>
			</MuiThemeProvider>
		);
	}
});
