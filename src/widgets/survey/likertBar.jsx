import {  useState } from "react";
import FormLabel from "react-bootstrap/FormLabel";

export default function LikertBar(props) {

	const likert = [
		{ id: 1, label: 'Strongly Disagree' },
		{ id: 2, label: 'Disagree' },
		{ id: 3, label: 'Neutral' },
		{ id: 4, label: 'Agree' },
		{ id: 5, label: 'Strongly Agree' }];

	const qgroup = props.surveyquestiongroup;
	const qid = props.qid
	const [selectedValue, setSelectedValue] = useState(undefined);

	const handleRadioChange = (val) => {
		setSelectedValue(val);
		props.changeCallback(qid, val);
	}

	return (
		<div className="checkboxGroup">
			{likert.map((likertval) => {
				return (
					<FormLabel htmlFor={qgroup + "_" + qid + "_" + likertval.id}
						key={qgroup + "_" + qid + "_" + likertval.id}
						className={selectedValue === likertval.id ? "checkboxBtn checkboxBtnChecked" : "checkboxBtn"}>

						<p className="checkboxLbl">{likertval.label}</p>

						<input className="radio-margin" type="radio"
							name={qgroup + "_" + qid + "_" + likertval.id}
							value={likertval.id}
							id={qgroup + "_" + qid + "_" + likertval.id}
							checked={selectedValue === likertval.id}
							onChange={(evt) => handleRadioChange(parseInt(evt.target.value))}
						/>
					</FormLabel>
				);
			}
			)}
		</div>
	)
}