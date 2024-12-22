import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useLocation, useNavigate } from "react-router-dom";
import { getNextStudyStep } from "../utils/api-middleware";
import HeaderJumbotron from "../widgets/headerJumbotron";
import Image from "react-bootstrap/Image";
import { sendLog } from "../utils/api-middleware";

export default function StudyMap(props) {

	const userdata = useLocation().state.user;
	const stepid = useLocation().state.studyStep;
	const navigate = useNavigate();

	const [studyStep, setStudyStep] = useState({});

	const [starttime, setStarttime] = useState(new Date());


	const rspref = require("../res/rate-prefs.png");
	const presurvey = require("../res/pre-survey.png");
	const rsinteract = require("../res/interact.png");
	const postsurvey = require("../res/post-survey.png")

	useEffect(() => {
		getNextStudyStep(userdata.study_id, stepid)
			.then((value) => { setStudyStep(value) });
		setStarttime(new Date());
	}, []);

	const navigateToNext = () => {
		sendLog(userdata, studyStep.id, null, starttime - Date.now(), 'passive',
			'study overview', null, null).then(() => {
				navigate(props.next, {
					state: {
						user: userdata,
						studyStep: studyStep.id
					}
				})
			})
	}

	return (
		<Container>
			<Row>
				<HeaderJumbotron title={studyStep.step_name} content={studyStep.step_description} />
			</Row>

			<Row>
				<Col>
					<Card className="overviewCard">
						<Card.Body>
							<Card.Title>
								Pre-survey
							</Card.Title>
							<Image src={presurvey} fluid />
						</Card.Body>
					</Card>
				</Col>
				<Col>
					<Card className="overviewCard">
						<Card.Body>
							<Card.Title>
								Indicate your preference
							</Card.Title>
							<Image src={rspref} fluid />
						</Card.Body>
					</Card>
				</Col>
				<Col>
					<Card className="overviewCard">
						<Card.Body>
							<Card.Title>
								Interact with the system
							</Card.Title>
							<Image src={rsinteract} fluid />
						</Card.Body>
					</Card>
				</Col>
				<Col>
					<Card className="overviewCard">
						<Card.Body>
							<Card.Title>
								Post-survey
							</Card.Title>
							<Image src={postsurvey} fluid />
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<div className="jumbotron jumbotron-footer">
					<Button variant="ers" size="lg" className="footer-btn"
						onClick={navigateToNext}>
						Next
					</Button>
				</div>
			</Row>
		</Container>
	)
}