import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {WeatherController} from '/imports/api/domains/weather.js';
import {withTracker} from 'meteor/react-meteor-data';


class NotificationDialog extends React.Component {

	constructor(props) {
		super(props);
		this.lastMessage = "";
	}

	handleDialogClose() {
		Dispatcher.dispatch({
			actionType: "NOTIFICATION_DIALOG_CLOSED"
		});
	}

	render() {

		const message = this.props.weatherStatus;

		if (message) {
			this.lastMessage = message;
		}

		return (

			<Dialog
				open={!!this.props.weatherStatus}
				onClose={this.handleDialogClose}
				maxWidth="sm"
			>
				<DialogTitle>{"Error"}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{this.lastMessage}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleDialogClose} autoFocus>
						CLOSE
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

export default NotificationDialogContainer = withTracker(props => {
	return {
		weatherStatus: WeatherController.getStatus()
	};
})(NotificationDialog);
