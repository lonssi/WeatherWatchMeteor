import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Controller} from '../domains/controller.js';
import NotificationDialogContainer from '../WeatherClock/NotificationDialog.jsx';
import AboutDialogContainer from '../WeatherClock/AboutDialog.jsx';
import SettingsContainer from '../WeatherClock/Settings.jsx';
import TopElementContainer from '../WeatherClock/TopElement.jsx';
import WeatherClockContainer from '../WeatherClock/WeatherClock.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import chroma from 'chroma-js';

var firstLoad = true;

export default class App extends React.Component {

	componentDidMount() {
		Dispatcher.dispatch({
			actionType: "CLIENT_INITIALIZED"
		});
	}

	setBodyStyles(colorTheme) {

		document.body.style.setProperty('--text-color', colorTheme.text.light);
		document.body.style.setProperty('--background-color', colorTheme.bg.light);
		document.body.style.setProperty('--link-color', colorTheme.accent.light);
		const linkHoverColor = chroma(colorTheme.accent.light).brighten(1).css();
		document.body.style.setProperty('--link-hover-color', linkHoverColor);

		// Add the transition effects after the page has loaded
		if (firstLoad) {
			firstLoad = false;
			setTimeout(function () {
				document.body.style["-webkit-transition"] = "color 0.5s ease-out";
				document.body.style["-moz-transition"] = "color 0.5s ease-out";
				document.body.style["-o-transition"] = "color 0.5s ease-out";
				document.body.style["transition"] = "color 0.5s ease-out";
				document.body.style["-webkit-transition"] = "background-color 0.5s ease-out";
				document.body.style["-moz-transition"] = "background-color 0.5s ease-out";
				document.body.style["-o-transition"] = "background-color 0.5s ease-out";
				document.body.style["transition"] = "background-color 0.5s ease-out";
			}, 500);
		}
	}

	render() {

		const colorTheme = this.props.colorTheme;

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
					<NotificationDialogContainer/>
					<AboutDialogContainer/>
					<SettingsContainer/>
					<TopElementContainer/>
					<div className="bottom-container">
						<WeatherClockContainer/>
					</div>
				</div>
			</MuiThemeProvider>
		);
	}
}
