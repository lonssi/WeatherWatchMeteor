import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Controller} from '/imports/api/domains/controller.js';
import NotificationDialogContainer from './NotificationDialog.jsx';
import AboutDialogContainer from './AboutDialog.jsx';
import SettingsContainer from './Settings.jsx';
import TopElementContainer from './TopElement.jsx';
import WeatherClockContainer from './WeatherClock.jsx';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
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
		document.body.style.setProperty('--line-color', colorTheme.misc.border);
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

		const hover = (colorTheme.id === "dark")
			? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";

		const selected = (colorTheme.id === "dark")
			? "rgba(255, 255, 255, 0.14)" : "rgba(0, 0, 0, 0.14)";

		const muiTheme = createMuiTheme({
			palette: {
				type: colorTheme.id,
				common: {
					white: colorTheme.text.light
				},
				primary: {
					light: colorTheme.accent.light,
					main: colorTheme.accent.light,
					dark: colorTheme.accent.light,
					contrastText: colorTheme.accent.light,
				},
				secondary: {
					light: colorTheme.accent.light,
					main: colorTheme.accent.light,
					dark: colorTheme.accent.light,
					contrastText: colorTheme.accent.light,
				},
				background: {
					paper: colorTheme.misc.menu,
				},
				text: {
					primary: colorTheme.text.light,
					secondary: colorTheme.text.dark,
					disabled: colorTheme.text.darker,
					hint: colorTheme.misc.hint
				},
				action: {
					active: colorTheme.text.light,
					hover: hover,
					selected: selected,
				}
			}
		});

		this.setBodyStyles(colorTheme);

		return (
			<MuiThemeProvider theme={muiTheme}>
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
