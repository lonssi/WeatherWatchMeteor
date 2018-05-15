import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {Controller} from '../domains/controller.js';
import {WeatherController} from '../domains/weather.js';
import {WeatherClock} from '../WeatherClock/WeatherClock.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Spinner} from '../../lib/react-plugins/spinner/Spinner.jsx';
import {Helpers} from '../../lib/helpers.js';
import {SettingsMenu} from '../WeatherClock/Settings.jsx';
import xss from 'xss';


export const LocationInput = React.createClass({

	mixins: [ReactMeteorData],
	getMeteorData: function() {
		return {
			weatherStatus: WeatherController.getStatus(),
			weatherLoading: WeatherController.getLoading()
		};
	},

	getInitialState() {
		return {
			locationText: ""
		}
	},

	searchButtonClicked() {
		const userInput = xss(this.refs.locationTextfield.input.value);
		Dispatcher.dispatch({
			actionType: "SEARCH_BUTTON_CLICKED",
			data: userInput
		});
		this.clearInput();
		Helpers.hideVirtualKeyboard();
	},

	locationButtonClicked() {
		Dispatcher.dispatch({
			actionType: "GET_LOCATION_BUTTON_CLICKED"
		});
	},

	onKeyPress(event) {
		// On enter key press
		if (event.charCode === 13) {
			event.preventDefault();
			this.searchButtonClicked();
		}
	},

	handleInputChange(event) {
	    this.setState({
	        locationText: event.target.value
	    })
	},

	clearInput() {
	    this.setState({
	        locationText: ""
	    })
	},

	render() {

		const spinner = (this.data.weatherLoading) ? <Spinner /> : null;
		const locationDisabled = !navigator.geolocation;

		const locationBtnClasses = classNames({
			"fa": true,
			"fa-map-marker": true
		});

		const searchBtnClasses = classNames({
			"fa": true,
			"fa-search": true
		});

		const buttonStyle = {
			width: '36px',
			minWidth: '36px'
		};

		return (
			<div className="location-input-container">
				<form>
					<div className="location-button-container">
						<FlatButton
							icon={<i className={locationBtnClasses} />}
							onTouchTap={this.locationButtonClicked}
							style={buttonStyle}
							disabled={locationDisabled}
						/>
					</div>
					<TextField
						className="location-input-field"
						hintText="Location"
						ref='locationTextfield'
						onKeyPress={this.onKeyPress}
						value={this.state.locationText}
						onChange={this.handleInputChange}
					/>
					<div className="location-button-container">
						<FlatButton
							icon={<i className={searchBtnClasses} />}
							onTouchTap={this.searchButtonClicked}
							style={buttonStyle}
						/>
					</div>
				</form>
				<div className="weather-status-container">
					{spinner}
					{this.data.weatherStatus}
				</div>
			</div>
		);
	}
});

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
					<SettingsMenu />
					<div className="top-container">
						<LocationInput />
					</div>
					<div className="bottom-container">
						<WeatherClock />
					</div>
				</div>
			</MuiThemeProvider>
		);
	}
});
