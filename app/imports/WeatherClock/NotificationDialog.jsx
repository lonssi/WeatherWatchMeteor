import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {WeatherController} from '../domains/weather.js';
import {Constants} from '../../lib/constants.js';


export const NotificationDialog = React.createClass({

	mixins: [ReactMeteorData],
	getMeteorData: function() {
		return {
			weatherStatus: WeatherController.getStatus()
		};
	},

	handleDialogClose() {
		Dispatcher.dispatch({
			actionType: "NOTIFICATION_DIALOG_CLOSED"
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

		return (
			<Dialog
				title="Error"
				actions={actions}
				modal={false}
				onRequestClose={this.handleDialogClose}
				open={!!this.data.weatherStatus}
				contentStyle={dialogStyle}
				autoScrollBodyContent={true}
			>
				{this.data.weatherStatus}
			</Dialog>
		);
	}

});
