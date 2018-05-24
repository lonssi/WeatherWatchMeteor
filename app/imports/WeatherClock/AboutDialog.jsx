import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {Controller} from '../domains/controller.js';
import {Constants} from '../../lib/constants.js';


export const AboutDialog = React.createClass({

	mixins: [ReactMeteorData],
	getMeteorData: function() {
		return {
			open: Controller.aboutDialogOpen(),
			colorTheme: Controller.getColorTheme()
		};
	},

	handleDialogClose() {
		Dispatcher.dispatch({
			actionType: "ABOUT_DIALOG_CLOSE_BUTTON_CLICKED"
		});
	},

	render() {

		const dialogStyle = {
			maxWidth: Constants.dialogWidth
		};

		const actions = [
			<FlatButton
				label="close"
				onClick={this.handleDialogClose}
			/>
		];

		const link = (
			<a href="https://github.com/lonssi/WeatherWatch">
				GitHub
			</a>
		);

		return (
			<Dialog
				title="About"
				actions={actions}
				modal={false}
				onRequestClose={this.handleDialogClose}
				open={!!this.data.open}
				contentStyle={dialogStyle}
				autoScrollBodyContent={true}
			>
				<p>
					Weather data provided by the Finnish Meteorological Institute.
					<br/>
					<br/>
					WeatherWatch is open source: {link}
				</p>
			</Dialog>
		);
	}

});
