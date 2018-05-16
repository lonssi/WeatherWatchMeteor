import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import LinearProgress from 'material-ui/LinearProgress';
import {Controller} from '../domains/controller.js';
import {WeatherController} from '../domains/weather.js';
import {Helpers} from '../../lib/helpers.js';


export const TopElement = React.createClass({

	mixins: [ReactMeteorData],
	getMeteorData: function() {
		return {
			weatherLoading: WeatherController.getLoading(),
			colorTheme: Controller.getColorTheme()
		};
	},

	getInitialState() {
		return {
			locationText: ""
		}
	},

	searchButtonClicked() {
		Dispatcher.dispatch({
			actionType: "SEARCH_BUTTON_CLICKED",
			data: this.refs.locationTextfield.input.value
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

		var loader;
		if (this.data.weatherLoading) {
			loader = (
				<LinearProgress
					style={{ backgroundColor: this.data.colorTheme.bg.light, "height": "2px" }}
					mode="indeterminate"
				/>
			);
		} else {
			loader = null;
		}

		return (
			<div className="top-container">
				<div className="top-wrapper">
					<div className="location-input-container">
						<form>
							<div className="location-button-container align-left">
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
							<div className="location-button-container align-right">
								<FlatButton
									icon={<i className={searchBtnClasses} />}
									onTouchTap={this.searchButtonClicked}
									style={buttonStyle}
								/>
							</div>
						</form>
					</div>
					<div className="loader-container">
						{loader}
					</div>
				</div>
			</div>
		);
	}
});
