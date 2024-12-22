import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useLocation, useNavigate } from "react-router-dom";
import { get, getNextStudyStep, sendLog, submitResponse } from "../utils/api-middleware";
import HeaderJumbotron from "../widgets/headerJumbotron";
import NextButton from "../widgets/nextButton";
import SurveyTemplate from "../widgets/survey/surveyTemplate";

export default function Survey(props) {


	const userdata = useLocation().state.user;
	const stepid = useLocation().state.studyStep;
	const navigate = useNavigate();

	const [pageData, setPageData] = useState({});
	const [nextButtonDisabled, setNextButtonDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [surveyAnswers, setSurveyAnswers] = useState({});
	const [serverValidation, setServerValidation] = useState({});
	const [studyStep, setStudyStep] = useState({});
	const [showUnanswered, setShowUnanswered] = useState(false);

	const [starttime, setStarttime] = useState(new Date());
	const [pageStarttime, setPageStarttime] = useState(new Date());

	const getsurveypage = (studyid, stepid, pageid) => {
		let path = '';
		if (pageid !== null) {
			path = 'study/' + studyid + '/step/' + stepid + '/page/' + pageid + '/next';
		} else {
			path = 'study/' + studyid + '/step/' + stepid + '/page/first/';
		}
		get(path)
			.then((response): Promise<page> => response.json())
			.then((page: page) => {
				setPageData(page);
				setPageStarttime(new Date());
				setShowUnanswered(false);
				const pagevalidation = {};
				pagevalidation[page.id] = false;
				setServerValidation({ ...serverValidation, ...pagevalidation });
				setNextButtonDisabled(true);
			})
			.catch((error) => console.log(error));
	}

	useEffect(() => {
		getNextStudyStep(userdata.study_id, stepid)
			.then((value) => { setStudyStep(value) });
		setStarttime(new Date());
	}, []);

	useEffect(() => {
		if (Object.keys(surveyAnswers).length === 0 && Object.entries(studyStep).length !== 0) {
			getsurveypage(userdata.study_id, studyStep.id, null);
		}
	}, [studyStep]);

	useEffect(() => {
		if (pageData.id === null) {
			sendLog(userdata, studyStep.id, pageData.id, new Date() - starttime,
				'survey complete', 'submit', null, null);
			navigate(props.next, {
				state: { user: userdata, studyStep: studyStep.id }
			});
		} else { window.scrollTo(0, 0); }
		setLoading(false);
	}, [pageData, navigate, userdata, studyStep, props.next, starttime]);

	const next = () => {
		let timediff = 0;
		let behavior = 'buttonClick';
		let buttonAct = 'something went wrong: React App survey.jsx next()';
		if (nextButtonDisabled) {
			setShowUnanswered(true);
			timediff = new Date() - pageStarttime;
			behavior = 'prematureNext';
			buttonAct = 'next';
		} else {
			setLoading(true);
			if (pageData.id !== null) {
				if (serverValidation[pageData.id] === false) {
					submitAndValidate();
					timediff = new Date() - pageStarttime;
					behavior = 'surveyResponse';
					buttonAct = 'next';
				} else {
					getsurveypage(userdata.study_id, studyStep.id, pageData.id);
				}
			}
		}
		sendLog(userdata, studyStep.id, pageData.id, timediff, behavior, buttonAct,
			null, null);
	}

	const submitHandler = (data) => {
		setSurveyAnswers(data);
		setNextButtonDisabled(false);
	}

	const submitAndValidate = () => {
		const surveyResponse = Object.entries(surveyAnswers)
			.map(([key, value]) => {
				return { 'question_id': key, 'response': value }
			})
		submitResponse('likert', userdata, pageData.id, surveyResponse)
			.then((response): Promise<isvalidated> => response.json())
			.then((isvalidated: isvalidated) => {
				if (isvalidated === true) {
					setServerValidation({ ...serverValidation, [pageData.id]: true });
					getsurveypage(userdata.study_id, studyStep.id, pageData.id);
					setNextButtonDisabled(true);
				} else { setLoading(false); }
			})
			.catch((error) => console.log(error));
	}

	const logHandler = (qid, val) => {
		sendLog(userdata, studyStep.id, pageData.id, new Date() - pageStarttime,
			'surveyResponse', pageData.page_name, qid, val);
	}

	return (
		<Container>
			<Row>
				<HeaderJumbotron title={studyStep.step_name} content={studyStep.step_description} />
			</Row>
			<Row>
				{Object.entries(pageData).length !== 0 ?
					<SurveyTemplate surveyquestions={pageData.questions}
						surveyquestiongroup={pageData.page_name}
						showUnanswered={showUnanswered}
						submitCallback={submitHandler}
						logginCallback={logHandler} />
					: ''
				}
			</Row>
			<Row>
				<div className="jumbotron jumbotron-footer">
					<NextButton disabled={false} variant={nextButtonDisabled ? 'ers-disabled' : 'ers'}
						loading={loading} onClick={() => next()} />
				</div>
			</Row>
		</Container>
	)

}