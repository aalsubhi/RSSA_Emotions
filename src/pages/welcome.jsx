import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import {
	createTestUser, createUser, getFirstStudyStep,
	getStudy, sendLog
} from '../utils/api-middleware';
import InformedConsentModal from '../widgets/dialogs/informedConsent';
import HeaderJumbotron from '../widgets/headerJumbotron';

export default function Welcome(props) {

	const studyID = 1;

	const [show, setShowInformedConsent] = useState(false);
	const [userdata, setUserdata] = useState({});
	const [study, setStudy] = useState({});
	const [studyStep, setStudyStep] = useState({});
	const [starttime, setStarttime] = useState(Date.now());

	const showInformedConsent = () => {
		setShowInformedConsent(!show);
	}

	const navigate = useNavigate();

	useEffect(() => {
		const userProps = ['id', 'condition', 'user_type', 'seen_items'];
		if (userProps.every(item => userdata.hasOwnProperty(item))) {
			sendLog(userdata, studyStep.id, null, starttime - new Date(),
				'user creation', 'study consent', null, null).then(() => {
					navigate(props.next,
						{
							state: {
								user: userdata,
								studyStep: studyStep.id
							}
						});
				})
		}
	}, [userdata, navigate, studyStep, props.next, starttime]);

	useEffect(() => {
		getStudy(studyID).then((studyres: studyres) => { setStudy(studyres) });
		getFirstStudyStep(studyID).then((studyStepRes: studyStepRes) => {
			setStudyStep(studyStepRes);
		});
		setStarttime(new Date());

	}, []);

	const consentCallbackHandler = (consent, condition) => {
		if (consent) {
			if (condition === 0) {
				createUser('ersStudy', study.id)
					.then((response): Promise<user> => response.json())
					.then((user: user) => {
						setUserdata(user);
					})
					.catch((error) => console.log(error));
			} else {
				createTestUser('ersStudy', study.id, condition)
					.then((response): Promise<user> => response.json())
					.then((user: user) => {
						setUserdata(user);
					})
					.catch((error) => console.log(error));
			}
		}
	}

	return (
		<Container>
			<Row>
				<HeaderJumbotron title="Welcome"
					content="Welcome to the study on movie recommendation." />
			</Row>

			<Row>
				<Card bg="light">
					<Card.Body className="instructionblurb">
						<Card.Title>What can you expect?</Card.Title>
						<p>
							In this study you will test a new recommender system
							for movies.
						</p>
						<p>
							There are four steps to the study:
						</p>
						<ol>
							<li>
								Complete a pre-survey.
							</li>
							<li>
								Rate a few movies you are familiar with to let
								recommender system know about your movie
								preferences.
							</li>
							<li>
								Interact with the movie recommender system, then
								pick one movie you would most like to watch.
							</li>
							<li>Complete a post-survey.</li>
						</ol>
						<p>
							Thanks,<br />
							Research Team
						</p>
					</Card.Body>
				</Card>
			</Row>

			<InformedConsentModal show={show}
				consentCallback={consentCallbackHandler} />
			<Row>
				<div className="jumbotron jumbotron-footer">
					<Button variant="ers" size="lg" className="footer-btn"
						onClick={showInformedConsent}>
						Get started
					</Button>
				</div>
			</Row>
		</Container>
	)
}