import FormGroup from "react-bootstrap/FormGroup";
import Row from "react-bootstrap/Row";
import LikertBar from "./likertBar";
import { useEffect, useState, useRef } from "react";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

export default function SurveyTemplate(props) {

	const [surveyAnswers, setSurveyAnswers] = useState({});
	const [resBoolSet, setResBoolSet] = useState(new Set());
	const [showUnanswered, setShowUnanswered] = useState(false);
	const [smallestUnanswered, setSmallestUnanswered] = useState(0);
	const topUnanswered = useRef();

	const scroll = () =>
		topUnanswered?.current?.scrollIntoView({ behavior: "smooth" });

	useEffect(() => {
		setSurveyAnswers({});
		setResBoolSet(new Set());
		setSmallestUnanswered(0);
	}, [props.surveyquestions]);

	useEffect(() => {
		setShowUnanswered(props.showUnanswered);
	}, [props.showUnanswered]);


	const parseHTML = (htmlstr) => {
		const clean = DOMPurify.sanitize(htmlstr);
		const parsed = parse(clean);
		return parsed;
	}

	// FIXME this only works the first time. Since, showUnanswered is not 
	// updated, the useEffect is not called again. Fix this by using a
	// callback function.
	useEffect(() => {
		if (showUnanswered) {
			scroll();
		}
	}, [showUnanswered]);

	useEffect(() => {
		if ((Object.keys(surveyAnswers).length === props.surveyquestions.length)
			&& (Object.values(surveyAnswers).every((x) => x !== undefined))) {
			props.submitCallback(surveyAnswers);
		}
	}, [surveyAnswers, props]);

	const valueSelectHandler = (qid, value) => {
		let newResBoolSet = new Set(resBoolSet);
		newResBoolSet.add(qid);

		if (qid <= smallestUnanswered) {
			for (let i = smallestUnanswered + 1; i < props.surveyquestions.length; i++) {
				if (!newResBoolSet.has(i)) {
					setSmallestUnanswered(i);
					break;
				}
			}
		}

		props.logginCallback(qid, value);
		let newAnswers = { ...surveyAnswers };
		newAnswers[qid] = value;
		setSurveyAnswers(newAnswers);
		setResBoolSet(newResBoolSet);
	}

	return (
		<Row>
			{props.surveyquestions.map((question, i) => {
				return (
					<FormGroup key={props.surveyquestiongroup + '_' + i}
						className={resBoolSet.has(i) ?
							"survey-question-block-responded"
							: showUnanswered ?
								"survey-question-block-unanswered"
								: "survey-question-block"}
						ref={i === smallestUnanswered ? topUnanswered : null}>
						<div>
							<p className="surveyQuestionText">
								{parseHTML(question.question)}
							</p>
						</div>
						<LikertBar surveyquestiongroup={props.surveyquestiongroup}
							qid={question.id} changeCallback={valueSelectHandler} />
					</FormGroup>
				)
			})}
		</Row>

	)
}
