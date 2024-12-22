import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import NextButton from "../widgets/nextButton";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getNextStudyStep } from "../utils/api-middleware";
import Form from "react-bootstrap/Form";


export const DemographyPage = (props) => {

	const userdata = useLocation().state.user;
	const stepid = useLocation().state.studyStep;
	const navigate = useNavigate();

	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [studyStep, setStudyStep] = useState({});

	const [age, setAge] = useState(-1);
	const [gender, setGender] = useState(-1);
	const [education, setEducation] = useState(-1);


	const [genderPref, setGenderPref] = useState("hidden");

	useEffect(() => {
		getNextStudyStep(userdata.study_id, stepid)
			.then((value) => { setStudyStep(value) });
	}, []);

	useEffect(() => {
		if (gender === 4) {
			setGenderPref("text");
		} else {
			setGenderPref("hidden");
		}
	}, [gender]);

	useEffect(() => {
		if (age >= 0 && gender >= 0 && education >= 0) {
			setButtonDisabled(false);
		}
	}, [age, gender, education]);

	const submitHandler = () => {
		setLoading(true);
		setButtonDisabled(true);

		// TODO: Send data to backend


		setLoading(false);
		setButtonDisabled(false);
		navigate(props.next, {
			state: {
				user: userdata,
				studyStep: studyStep.id
			}
		});
	}

	return (
		<Container>
			<Row>
				<div className="jumbotron">
					<h1 className="header">Thank you for interacting with the movie recommender system</h1>
					<p>We will now ask you several questions about your experience interacting with the system.
					</p>
				</div>
			</Row>
			<Row className="generalBodyContainer">
				<Form.Group className="mb-3" style={{textAlign: "left"}}>
					<Form.Label>What is your age?</Form.Label>
					<Form.Select variant="outline-secondary" title="Dropdown" id="input-group-dropdown-1"
						style={{width: "400px"}}
						onChange={(evt) => setAge(+evt.target.value)} value={age}>
						<option value="-1">Please choose an option</option>
						<option value="0">18 - 24 years old</option>
						<option value="1">25 - 29 years old</option>
						<option value="2">30 - 34 years old</option>
						<option value="3">35 - 39 years old</option>
						<option value="4">40 - 44 years old</option>
						<option value="5">45 - 49 years old</option>
						<option value="6">50 - 54 years old</option>
						<option value="7">55+</option>
						<option value="8">Prefer not to say</option>
					</Form.Select>
					<br />
					<Form.Label>What is your gender?</Form.Label>
					<Form.Select variant="outline-secondary" title="Dropdown" id="input-group-dropdown-2"
						style={{width: "400px"}}
						onChange={(evt) => setGender(+evt.target.value)} value={gender}>
						<option value="-1">Please choose an option</option>
						<option value="0">Woman</option>
						<option value="1">Man</option>
						<option value="2">Non-binary</option>
						<option value="3">Prefer not to disclose</option>
						<option value="4">Prefer to self-describe</option>
					</Form.Select>
					<Form.Control type={genderPref} style={{ marginTop: "9px" }}
						onChange={(evt) => this.onValueChange(evt, "genText")} />
					<br />
					<Form.Label>What is the highest degree or level of education you have completed?</Form.Label>
					<Form.Select variant="outline-secondary" title="Dropdown" id="input-group-dropdown-4"
						style={{width: "400px"}}
						onChange={(evt) => setEducation(+evt.target.value)} value={education}>
						<option value="-1">Please choose an option</option>
						<option value="0">Some high school</option>
						<option value="1">High school</option>
						<option value="2">Some college</option>
						<option value="3">Trade, technical or vocational training</option>
						<option value="4">Associate's degree</option>
						<option value="5">Bachelor's degree</option>
						<option value="6">Master's degree</option>
						<option value="7">Professional degree</option>
						<option value="8">Doctorate</option>
						<option value="9">Prefer not to say</option>
					</Form.Select>
				</Form.Group>
			</Row>
			<Row>
				<div className="jumbotron jumbotron-footer">
					<NextButton disabled={buttonDisabled && !loading}
						loading={loading} onClick={() => submitHandler()} />
				</div>
			</Row>


		</Container>

	);
}

export default DemographyPage;
