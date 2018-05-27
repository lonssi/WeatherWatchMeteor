import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import Slider from 'material-ui/Slider';
import {Controller} from '/imports/api/domains/controller.js';
import {Colors} from '/lib/colors.js';
import {withTracker} from 'meteor/react-meteor-data';


class Settings extends React.Component {

	handleDialogClose() {
		Dispatcher.dispatch({
			actionType: "DOT_MENU_CLOSE_BUTTON_CLICKED"
		});
	}

	tzModeToggled() {
		Dispatcher.dispatch({
			actionType: "FORECAST_TIMEZONE_TOGGLED"
		});
	}

	gradientModeToggled() {
		Dispatcher.dispatch({
			actionType: "GRADIENT_MODE_TOGGLED"
		});
	}

	secondHandToggled() {
		Dispatcher.dispatch({
			actionType: "CLOCK_SECOND_HAND_TOGGLED"
		});
	}

	colorThemeChange(event, index, value) {
		Dispatcher.dispatch({
			actionType: "COLOR_THEME_SELECTED",
			data: value
		});
	}

	hueChange(event, value) {
		Dispatcher.dispatch({
			actionType: "HUE_CHANGED",
			data: value
		});
	}

	unitModeChange(event, index, value) {
		Dispatcher.dispatch({
			actionType: "UNIT_MODE_SELECTED",
			data: value
		});
	}

	clockSizeChange(event, index, value) {
		Dispatcher.dispatch({
			actionType: "CLOCK_SIZE_SELECTED",
			data: value
		});
	}

	render() {

		const dialogStyle = {
			maxWidth: '340px'
		};

		const selectFieldStyle = {
			width: "100%"
		};

		const actions = [
			<FlatButton
				label="close"
				onClick={this.handleDialogClose}
			/>
		];

		const colorThemeItems = this.props.colorThemes.map(function(item) {
			return (
				<MenuItem
					primaryText={item.name}
					key={item.id}
					value={item.id}
				/>
			);
		});

		const unitModeItems = this.props.availableUnitModes.map(function(item) {
			return (
				<MenuItem
					primaryText={item.text}
					key={item.id}
					value={item.id}
				/>
			);
		});

		const clockSizeItems = this.props.availableClockSizes.map(function(item) {
			return (
				<MenuItem
					primaryText={item.text}
					key={item.id}
					value={item.id}
				/>
			);
		});

		const settings = (
			<div className="settings-container">
				<div className="settings-check-boxes">
					<Checkbox
						label="Gradient mode"
						checked={this.props.clockSettings.gradientMode}
						onCheck={this.gradientModeToggled}
					/>
					<Checkbox
						label="Forecast timezone"
						checked={this.props.clockSettings.forecastTimezone}
						onCheck={this.tzModeToggled}
					/>
					<Checkbox
						label="Second hand"
						checked={this.props.clockSettings.secondHand}
						onCheck={this.secondHandToggled}
					/>
				</div>
				<div className="settings-select-fields">
					<SelectField
						floatingLabelText="Color theme"
						value={this.props.colorTheme.id}
						onChange={this.colorThemeChange}
						style={selectFieldStyle}
					>
						{colorThemeItems}
					</SelectField>
					<br />
					<div className="settings-name-field">
						{'Color theme hue'}
					</div>
					<div className="settings-slider-container">
						<Slider
							step={0.05}
							value={this.props.hue}
							onChange={this.hueChange}
						/>
					</div>
					<SelectField
						floatingLabelText="Units"
						value={this.props.clockSettings.unitMode.id}
						onChange={this.unitModeChange}
						style={selectFieldStyle}
					>
						{unitModeItems}
					</SelectField>
					<br />
					<SelectField
						floatingLabelText="Clock size"
						value={this.props.clockSettings.clockSize.id}
						onChange={this.clockSizeChange}
						style={selectFieldStyle}
					>
						{clockSizeItems}
					</SelectField>
				</div>
			</div>
		);

		return (
			<div>
				<Dialog
					title="Settings"
					actions={actions}
					modal={false}
					onRequestClose={this.handleDialogClose}
					open={this.props.open}
					contentStyle={dialogStyle}
					autoScrollBodyContent={true}
				>
					{settings}
				</Dialog>
			</div>
		);
	}
}

export default SettingsContainer = withTracker(props => {
	return {
		open: Controller.settingsOpen(),
		clockSettings: Controller.getClockSettings(),
		availableUnitModes: Controller.getAvailableUnitModes(),
		availableClockSizes: Controller.getAvailableClockSizes(),
		colorTheme: Controller.getColorTheme(),
		colorThemes: Colors.getColorThemes(),
		hue: Controller.getHue()
	};
})(Settings);
