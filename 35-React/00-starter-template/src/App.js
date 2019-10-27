import React, {useState, useRef} from 'react';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import Overlay from 'react-bootstrap/Overlay';

import './App.css';

export default function App() {
	return (
		<div className="App">
			<Example/>
		</div>
	);
}


export function Example() {
	const [show, setShow] = useState(false);
	const target = useRef(null);

	return (
		<React.Fragment>
			<Button ref={target}
			        onClick={() => setShow(!show)}
			>
				Click me!
			</Button>
			<Overlay target={target.current} show={show} placement="auto">
				{props => (
					<Tooltip id="overlay-example" {...props}>
						My Tooltip
					</Tooltip>
				)}
			</Overlay>
		</React.Fragment>
	);
}

// onMouseEnter={() => setShow(!show)}
// onMouseLeave={() => setShow(!show)}


