import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {Constants} from '/lib/constants.js'
import {WeatherController} from '/imports/api/domains/weather.js';
import {withTracker} from 'meteor/react-meteor-data';


class NotificationDialog extends React.Component {

	handleDialogClose() {
		Dispatcher.dispatch({
			actionType: "NOTIFICATION_DIALOG_CLOSED"
		});
	}

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
				open={!!this.props.weatherStatus}
				contentStyle={dialogStyle}
				autoScrollBodyContent={true}
			>
				{this.props.weatherStatus}
			</Dialog>
		);
	}
}

export default NotificationDialogContainer = withTracker(props => {
	return {
		weatherStatus: WeatherController.getStatus()
	};
})(NotificationDialog);
