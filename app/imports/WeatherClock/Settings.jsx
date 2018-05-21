import React from 'react';
import {Controller} from '../domains/controller.js';
import {Colors} from '../../lib/colors.js';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import Slider from 'material-ui/Slider';


export const SettingsMenu = React.createClass({

	mixins: [ReactMeteorData],
	getMeteorData: function() {
		return {
			open: Controller.settingsOpen(),
			clockSettings: Controller.getClockSettings(),
			availableUnitModes: Controller.getAvailableUnitModes(),
			availableClockSizes: Controller.getAvailableClockSizes(),
			colorTheme: Controller.getColorTheme(),
			colorThemes: Colors.getColorThemes(),
			hue: Controller.getHue()
		};
	},

	handleDialogClose() {
		Dispatcher.dispatch({
			actionType: "DOT_MENU_CLOSE_BUTTON_CLICKED"
		});
	},

	tzModeToggled() {
		Dispatcher.dispatch({
			actionType: "FORECAST_TIMEZONE_TOGGLED"
		});
	},

	gradientModeToggled() {
		Dispatcher.dispatch({
			actionType: "GRADIENT_MODE_TOGGLED"
		});
	},

	secondHandToggled() {
		Dispatcher.dispatch({
			actionType: "CLOCK_SECOND_HAND_TOGGLED"
		});
	},

	colorThemeChange(event, index, value) {
		Dispatcher.dispatch({
			actionType: "COLOR_THEME_SELECTED",
			data: value
		});
	},

	hueChange(event, value) {
		Dispatcher.dispatch({
			actionType: "HUE_CHANGED",
			data: value
		});
	},

	unitModeChange(event, index, value) {
		Dispatcher.dispatch({
			actionType: "UNIT_MODE_SELECTED",
			data: value
		});
	},

	clockSizeChange(event, index, value) {
		Dispatcher.dispatch({
			actionType: "CLOCK_SIZE_SELECTED",
			data: value
		});
	},

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

		const colorThemeItems = this.data.colorThemes.map(function(item) {
			return (
				<MenuItem
					primaryText={item.name}
					key={item.id}
					value={item.id}
				/>
			);
		});

		const unitModeItems = this.data.availableUnitModes.map(function(item) {
			return (
				<MenuItem
					primaryText={item.text}
					key={item.id}
					value={item.id}
				/>
			);
		});

		const clockSizeItems = this.data.availableClockSizes.map(function(item) {
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
						checked={this.data.clockSettings.gradientMode}
						onCheck={this.gradientModeToggled}
					/>
					<Checkbox
						label="Forecast timezone"
						checked={this.data.clockSettings.forecastTimezone}
						onCheck={this.tzModeToggled}
					/>
					<Checkbox
						label="Second hand"
						checked={this.data.clockSettings.secondHand}
						onCheck={this.secondHandToggled}
					/>
				</div>
				<div className="settings-select-fields">
					<SelectField
						floatingLabelText="Color theme"
						value={this.data.colorTheme.id}
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
							value={this.data.hue}
							onChange={this.hueChange}
						/>
					</div>
					<SelectField
						floatingLabelText="Units"
						value={this.data.clockSettings.unitMode.id}
						onChange={this.unitModeChange}
						style={selectFieldStyle}
					>
						{unitModeItems}
					</SelectField>
					<br />
					<SelectField
						floatingLabelText="Clock size"
						value={this.data.clockSettings.clockSize.id}
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
					open={this.data.open}
					contentStyle={dialogStyle}
					autoScrollBodyContent={true}
				>
					{settings}
				</Dialog>
			</div>
		);
	}
});