import React, {useState} from 'react';

export default function HookCounterTwo() {
	const initialState = 0;
	const [count, setCount] = useState(initialState);

	const incrementFive = () => {
		for(let i=0; i<5; i++){
			setCount(prevCount => prevCount + 1);
		}
	}

	return (
		<div>
			<p>Count:  {count}</p>
			<button onClick={() => setCount(initialState)}>Reset</button>
			<button onClick={() => setCount(prevCount => prevCount + 1)}>Increment</button>
			<button onClick={() => setCount(prevCount => prevCount - 1)}>Decrement</button>
			<button onClick={incrementFive}>Increment by 5</button>
		</div>
	);
}
