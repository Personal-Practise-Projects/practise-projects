import React, {useEffect} from 'react';
import {TimelineMax, Elastic} from 'gsap';

const boxRef = React.createRef();

const items = [];

const tl1 = new TimelineMax({repeat: -1});
const tl2 = new TimelineMax({repeat: -1});

function GsapStaggering(props) {

	useEffect(() => {
		console.log(boxRef.current.children);

		tl1.staggerFrom(boxRef.current.children, 1, {
			x: 100,
			autoAlpha: 0,
			ease: Elastic.easeOut.config(2, 1)
		}, 0.3);
	}, []);

	useEffect(() => {
		console.log(items);
		tl2.staggerFrom(items, 1, {
			autoAlpha: 0,
			scale: 0.5
		}, 0.3);
	}, []);


	return (
		<React.Fragment>
			<div ref={boxRef} className="grid-container">
				<div className="items"></div>
				<div className="items"></div>
				<div className="items"></div>
				<div className="items"></div>
			</div>
			<div className="grid-container">
				{[1, 2, 3, 4].map((index) => <div className="items" key={index} ref={div => items.push(div)}></div>)}
			</div>
		</React.Fragment>

	);
}

export default GsapStaggering;
