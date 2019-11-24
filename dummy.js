if (header.multiSelect) {
	console.log('multiSelect');
} else {
	if (this.ref[header.data_key] && this.getExistingData(header)) {
		this.selectedValue = value;
		this.eventListener(BULK_ACTIONS.TOGGLE_CONFIRM);
	} else {
		this.onUpdate(header, value, () => {
			this.eventListener(BULK_ACTIONS.RELOAD_STATE);
		});
	}
}

getExistingData = header => {
	const selected = Object.keys(this.choices[header.uid]).find(
		key => this.choices[header.uid][key].selected === true,
	);
	return selected ? '' : this.ref[CHOICES[header.uid]];
};


this.choices = {
	[CHOICE_FIELDS.CAMERA_ANGLE]: {
		...
	},
	[CHOICE_FIELDS.LIGHTING]: {},
	[CHOICE_FIELDS.CROPPING]: {},
	[CHOICE_FIELDS.SHADOWS]: {},
};

this.ref = shotDetailsController.ref;

onAction = (header, value) => {
	// TODO: 2.) 9865
	if (this.ref[header.data_key] && this.getExistingData(header)) {
		this.selectedValue = value;
		this.eventListener(BULK_ACTIONS.TOGGLE_CONFIRM);
	} else {
		this.onUpdate(header, value, () => {
			this.eventListener(BULK_ACTIONS.RELOAD_STATE);
		});
	}
};

eventListener = type => {
	switch (type) {
		case COMMON_ACTIONS.TOGGLE_CONFIRM:
			this.props.toggleConfirmDialog(
				new ChoiceChangeConfirmation(this.eventListener),
			);
			break;
		case COMMON_ACTIONS.RELOAD_STATE:
			this.controller.getChoices(this.props.header, result => {
				this.setState({
					choices: result,
					optionalInfo: this.controller.getOptionalInfo(this.props.header),
				});
			});
			break;
		case COMMON_ACTIONS.CONFIRM_OK:
			this.props.toggleConfirmDialog();
			this.controller.onUpdate(
				this.props.header,
				this.controller.selectedValue,
				() => {
					this.eventListener(COMMON_ACTIONS.RELOAD_STATE);
				},
			);
			break;
		case UPDATE_STATUS:
			this.controller.getChoices(this.props.header, result => {
				this.setState({
					choices: result,
					optionalInfo: this.controller.getOptionalInfo(this.props.header),
				});
			});
			break;
	}
};


onUpdate = (header, updateWithData, callback) => {
	this.shotDetailsController.onUpdate(header, updateWithData, callback);
};

onUpdate = (header, updateWithData, callback) => {
	// TODO: 3.) 9865
	const passCallbackResult = (status, response) => {
		this.dataVersion += 1;
		callback && callback(status, response);
	};
	switch (header.uid) {
		case '#image_references':
			this.eventListener({
				event: DETAILS_VIEW_EVENT.OPEN_IMAGE_WIDGET,
				uploadWidget: dataReducersFactory(
					SHOT_REFERENCES_IMAGES,
					this.imageWidgetActions,
					this.ref,
				),
			});
			return '';
		case '#produced_content':
			this.eventListener({
				event: DETAILS_VIEW_EVENT.OPEN_IMAGE_WIDGET,
				uploadWidget: dataReducersFactory(
					SHOT_CONTENT,
					this.imageWidgetActions,
					this.ref,
				),
			});
			return '';
		case '#color_tag':
			this.updateShot(
				{ data: JSON.stringify({ color_tag: updateWithData }) },
				passCallbackResult,
			);
			break;
		case '#next':
			this.updateShot(
				{
					data: JSON.stringify(
						buildDataForObject(header, this.currentState()),
					),
				},
				passCallbackResult,
			);
			break;
		case '#schedule_on':
			const updateWithDataDict = addStatusField(updateWithData);
			this.updateShot(
				{ data: JSON.stringify({ ...updateWithDataDict }) },
				passCallbackResult,
			);
			break;
		default: {
			this.updateShot(
				{ data: JSON.stringify(buildDataForObject(header, updateWithData)) },
				passCallbackResult,
			);
			break;
		}
	}
};

getChoices = (header, callback) => {
	const choice = header.uid.substring(1);
	getChoices(choice, parsedData => {
		parsedData[this.ref[CHOICES[header.uid]]]
			? (parsedData[this.ref[CHOICES[header.uid]]].selected = true)
			: '';
		this.choices[header.uid] = parsedData;
		callback(parsedData);
	});
};



export class ChoiceChangeConfirmation {
	constructor(eventListener) {
		this.eventListener = eventListener;
	}

	getFooterConfig = () => {
		return [
			{
				title: 'Ok',
				isDisabled: false,
				actionType: BULK_ACTIONS.CONFIRM_OK,
			},
		];
	};

	getChildren() {
		return 'You have already added some text, If you switch now, changes will be discarded.';
	}
}

// TODO: 1.) 9865 temporary addition. Remove it later.

// TODO: 2.) 9865 need to do changes here


