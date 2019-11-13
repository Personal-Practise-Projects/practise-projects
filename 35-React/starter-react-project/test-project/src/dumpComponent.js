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
// TODO: OLD TASKS
// TODO: 1.) Status Filter on Production View - IN REVIEW
// TODO: 2.) Visual Improvements in Production View - DONE
// TODO: 3.) Update Camera Angle Images - DONE
// TODO: 4.) Display the full image in the thumbnail for reference images in the production view - DONE
// TODO: 5.) Delete icon in Shotlist page - DONE
// TODO: 6.) Days counter Improvement (add logic for 1 day and n days) - DONE
// TODO: 7.) Hide counter from Weekly view card - DONE





// TODO: NEW TASKS - 4th Nov 2019
// TODO: 1.) Remove black bar at the bottom of the light box when viewing images by default, only show when hovering - IN REVIEW
// TODO: 2.) Add Delete Icon Hover state - DONE
// TODO: 3.) Check CopyToClipboard placement wherever it is used - DONE
// TODO: 4.) Show shot comments in the production view

// TODO: 5.) Every time I click on a new shot and open to view contents, the sidebar defaults to different areas


const metaInfo = {
	heading:'filename - heading',
	subHeading:'filename - subHeading',
}

const ref = Object.assign(
	{ src: this.props.url, errSrc: this.props.errSrc },
	this.props.reference,
);

// TODO: need to do changes here

{/* // TODO: need to do changes here */}


export const SHOTS_DEFAULT_STATE = function() {
	return {
		shots: {
			data: [],
			brand_id: null,
			title: '',
		},
		shotDict: {},
	};
};

case FETCH_SHOTS:
	state.shots = payload;
state.shots.data = [...payload.data];
state.shotDict = {};
payload.data.map(shot => {
	state.shotDict[shot.id] = shot;
});
return { ...state };

// Ask its working
export function buildPayLoad(payLoad) {
	const deFlattenedObject = {};
	Object.keys(payLoad).map((key, _) => {
		if (key.indexOf('.') === -1) {
			deFlattenedObject[key] = payLoad[key];
		} else {
			const fields = key.split('.');
			const newObject = {};
			deFlattenedObject[fields[0]] = newObject;
			_buildJsonObject(newObject, fields.slice(1), payLoad[key]);
		}
	});
	return deFlattenedObject;
}

eventListener = args => {
	if (args.event === LOADER) {
		this.setState({
			showLoader: args.data,
		});
	}

};

// this.eventListener({ event: REFRESH });

updateShotDetails(value, this.ref, this.eventListener, () => {
	// TODO: 3.) need to do changes here - DONE
	this.resetAndFetchProductionViewCards(
		updateWithData ? updateWithData / 1000 : null,
	);
	callback();
});

// TODO: 1.) expandedState = false && status = CAPTURE | REVIEW | EDITING | DONE

updateShotDetails(value, this.ref, this.eventListener, callback);

let productionView = {
	shots: [{}, {}, {}],
	shotDict: {
		1:{

		}	,
		2:{

		}
  }
};

const payload = {};
shotsDict[payload.id] = payload;


// state.brands = state.brands.map(brand => {
//   if (payload.id === brand.id) {
//     return payload;
//   }
//   return brand;
// });
state.brandsDict[payload.id] = payload;
return { ...state };

this.state = {
	brandId,
	brand: this.props.brandsDict[brandId],
};

static getDerivedStateFromProps(nextProps, prevState) {
	const brandId = getParamForKeyFromUrl('brand');
	const brand = nextProps.brandsDict[brandId];
	if (prevState.brand !== brand) {
		return { brandId, brand };
	}
	return {};
}

getExtraConfig = header => {
	switch (header.uid) {
		case '#move_status':
			const nextStatus = SHOT_STATUS_NEXT_MAP[this.ref.shot_info.status];
			return { readonly: !nextStatus };
		case '#produced_content':
			return {};
		default:
			return {};
	}
};


{`${buildConditionalString(
	'comment',
	this.state.expandedClass,
	this.state.open,
)} ${accordionViewClass}`}

classNames('comment', { this.state.expandedClass: true });


className=classNames('comment', {
	this.state.expandedClass: this.state.open,
	'accordion-view': this.props.isExpandable
});


// TODO: # Catalog's New Website

// TODO: 1) Setup new React Project -  3-4h (DONE)
// TODO: 2) See all the designs and break it down into Components - 10-12h
// TODO: 3) Setup best practises styling architecture - 6h - IN PROGRESS
// TODO: 3.1) Create Global Variables for Colors & Fonts - 4h - IN PROGRESS
// TODO: 3.2) Create Mixins for media queries -  6-8h
// TODO: 3.3) Add Utility Classes - 6-8h

// TODO: HOMEPAGE
// TODO: 4) Create Responsive wireframe for HomePage with Dummy Content - 12-15h
// TODO: 5) Replace Dummy Content with Real Content & Add Styles - 15h

// TODO: Question: Need to ask Jacobo about the devices that we need to target - DONE

// TODO: 1) new website
// TODO: 1.1) share breakpoints with varsha
// TODO: 1.1) create folders and add new files with mixins

// TODO: 2) current stories
// TODO: 2.1) complete my current story

// TODO: 3) backlog gromming meeting
// TODO: 3.1) read all the stories in the next sprint & write down the questions/answers to the problem statements.









/*
	Bootstrap Breakpoints
	Mobile first - 576px, 768px, 992px, 1200px, 1408px, 1920px

	Foundation Breakpoints
	Mobile first - 40em, 64em

	Bulma Breakpoints
	Mobile first - 768px, 769px, 1024px, 1216px, 1408px
 */








































