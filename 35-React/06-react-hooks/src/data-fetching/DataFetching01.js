import React, {useState, useEffect} from 'react';
import axios from 'axios';

function DataFetching01(props) {

	const [post, setPost] = useState({});
	const [id, setId] = useState(1);
	const [idFromButtonClick, setIdFromButtonClick] = useState(1);

	useEffect(() => {

		axios.get(`https://jsonplaceholder.typicode.com/posts/${idFromButtonClick}`)
		.then(res => {
			setPost(res.data);
		})
		.catch(err => {
			console.log(err);
		})

		return () => {

		};
	}, [idFromButtonClick]);


	const handleClick = () => {
		setIdFromButtonClick(id);
	}

	return (
		<div>
			<input type="text"
			       value={id} onChange={e => setId(e.target.value)}
			/>
			<button onClick={handleClick}>Fetch Post</button>
			<p>{post.title}</p>
		</div>
	);
}

export default DataFetching01;
