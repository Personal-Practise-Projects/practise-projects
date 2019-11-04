const eventListener = clickedChoice => {
	if (!this.selectedData.includes(clickedChoice.id)) {
		this.selectedData.push(clickedChoice.id);
	} else {
		this.selectedData = this.selectedData.filter(
			choiceId => choiceId !== clickedChoice.id,
		);
	}
	this.count = this.selectedData.length;
	this.refreshFilter();
};

const onEventListener = choice => {
	choice.checked = !choice.checked;
	this.reRender();
	this.props.controller.eventListener(choice);
};


const getSelectedData = () => {
	const hasValue = this.selectedData.length;
	return hasValue
		? {
			[this.filterConfig.uid]: {
				[this.filterConfig.data_key]: this.selectedData,
			},
		}
		: {};
};


const eventListener = (type, filterConfig) => {
	let selectedFilterConfig = {};
	switch (type) {
		case APPLY:
			Object.keys(this.filterControllers).forEach(key => {
				const controller = this.filterControllers[key];
				selectedFilterConfig = Object.assign(
					selectedFilterConfig,
					controller.getSelectedData(),
				);
			});
			if (this.callbackListener) {
				this.callbackListener(APPLY, selectedFilterConfig);
			}
			break;
		case CANCEL:
			if (this.callbackListener) {
				this.callbackListener(CANCEL);
			}
			break;
		case CLEAR:
			this.filterControllers[filterConfig.uid].clearFilter();
			break;
		default:
			break;
	}
};

const applyFilters = (state, activeScreen, payload) => {
	state = Object.assign({}, state);
	state[activeScreen].filterData = {...state[activeScreen].filterData};
	state[activeScreen].selectedFilters = payload;
	// Build appliedFilter data
	const appliedFilters = {};
	const filtersKeys = Object.keys(state[activeScreen].selectedFilters);
	state[activeScreen].appliedFilters = filtersKeys.forEach(key => {
		Object.assign(appliedFilters, payload[key]);
	});
	// Store appliedFilter data
	state[activeScreen].appliedFilters = appliedFilters;
	state[activeScreen].count = filtersKeys.length;
	state.isOpen = false;
	return state;
};


const first = {
	dueDate: {
		start_due_date: '',
		end_due_date: ''
	},
	'#status': {
		status: [
			{id: 0, name: "Captured", checked: true, title: "Captured"},
			{id: 1, name: "Photoshoot", checked: true, title: "Photoshoot"}
		],
		type: 'multipleCheckBoxSelect'
	},
	'#brands': {
		brands: [
			{id: 0, name: "Captured", checked: true, title: "Captured"},
			{id: 1, name: "Photoshoot", checked: true, title: "Photoshoot"}
		],
		type: 'multipleCheckBoxSelect'
	}
};

const second = ['#dueDate', '#status', '#brands'];

const third = {
	start_due_date: '',
	end_due_date: '',
	status: [
		{id: 0, name: "Captured", checked: true, title: "Captured"},
		{id: 1, name: "Photoshoot", checked: true, title: "Photoshoot"}
	],
	brands: [
		{id: 0, name: "Captured", checked: true, title: "Captured"},
		{id: 1, name: "Photoshoot", checked: true, title: "Photoshoot"}
	]
};

Array.isArray([]) == true
Array.isArray({}) == false

if (Array.isArray(payload[key])) {
	appliedFilters[key] = payload[key].map(obj => obj.id);
} else {
	Object.assign(appliedFilters, payload[key]);
}

const getExistingData = () => {
	const hasValue = this.selectedData.length;
	if (hasValue) {
		this.selectedData.forEach(id => {
			this.choices.forEach(choice => {
				if (choice.id === id) {
					choice.checked = true;
				}
			});
		});
	}
};

const setData = (d, callback) => {
	this.choices = Array.from(d);
	this.choices[0].checked = true;
	console.log('Org', d[0].checked);
	console.log('Copied', this.choices[0].checked);
	this.refreshMultiSelectCheckbox = callback;
};

// TODO: 1.) Status Filter on Production View - IN REVIEW
// TODO: 2.) Visual Improvements in Production View - DONE
// TODO: 3.) Update Camera Angle Images - DONE
// TODO: 4.) Display the full image in the thumbnail for reference images in the production view - DONE
// TODO: 5.) Delete icon in Shotlist page - DONE
// TODO: 6.) Days counter Improvement (add logic for 1 day and n days) - DONE
// TODO: 7.) Hide counter from Weekly view card - DONE






// TODO: 8.) Side drawer scroll issue - IN PROGRESS

{this.parsedProductList.length !== 0 && (
	<Slider
		title="Products"
		slidesData={this.parsedProductList}
		noOfSlides={1}
		{...smallSlideConfig}
	/>
)}


<ItemsRepeat items={slidesData}>
	{(item, index) => (
		<ImageWithText slide={item} width={width} height={height} />
	)}
</ItemsRepeat>


	.slider-component .slider .slide .default-image {
	background: #e3dee6;
	height: 100%;
	-o-object-fit: cover;
	object-fit: cover;
	-o-object-position: center;
	object-position: center;
	border-radius: 5px;
}

display: block;
width: 100%;
