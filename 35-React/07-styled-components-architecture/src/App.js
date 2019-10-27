import React from 'react';
import './App.css';
import SprintViewPage from "./pages/SprintViewPage/SprintViewPage";
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

function App() {
	return (
		<React.Fragment>
			{/*<SprintViewPage/>*/}
			<Accordion defaultActiveKey="0">
				<Card>
					<Accordion.Toggle as={Card.Header} eventKey="0">
						Click me!
					</Accordion.Toggle>
					<Accordion.Collapse eventKey="0">
						<Card.Body>Hello! I'm the body</Card.Body>
					</Accordion.Collapse>
				</Card>
				<Card>
					<Accordion.Toggle as={Card.Header} eventKey="1">
						Click me!
					</Accordion.Toggle>
					<Accordion.Collapse eventKey="1">
						<Card.Body>Hello! I'm another body</Card.Body>
					</Accordion.Collapse>
				</Card>
			</Accordion>
		</React.Fragment>
	);
}

export default App;
