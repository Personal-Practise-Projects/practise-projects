import React, {useState} from 'react';

export default function HookCounter() {

	const [count, setCount] = useState(0);

	return (
		<>
			{console.log(useState(0))}
			<button onClick={() => setCount(count + 1)}>Count: {count}</button>
		</>
	);
}
