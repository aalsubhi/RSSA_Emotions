import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import { FcAbout } from "react-icons/fc";
import { emotionsDict } from '../utils/constants';


export default function EmotionToggle(props) {
	const emotions = ['Joy', 'Trust', 'Fear', 'Surprise', 'Sadness', 'Disgust', 'Anger', 'Anticipation'];

	const [emotionValues, setEmotionValues] = useState(props.emotions);
	const [isDone, setIsDone] = useState(props.isDone);

	useEffect(() => {
		setIsDone(props.isDone);
	}, [props.isDone]);

	const handleToggle = (emotion, value) => {
		setEmotionValues(prevState => {
			return {
				...prevState,
				[emotion]: value
			}
		});
		props.onToggle(emotion, value);
	}

	const handleReset = () => {
		setEmotionValues(emotionsDict);
		props.onReset();
	}

	return (
		<Container>
			<Row>
				<div style={{ marginBottom: "3px", display: "inline-flex", marginTop: "27px" }}>
					<h5>Adjust your emotion preferences</h5>
					<FcAbout size={24} className="infoIcon"
						style={{ marginTop: "-13px", marginLeft: "9px" }}
						onClick={props.infoCallback} />
				</div>
			</Row>
			<Row>
				<p style={{ textAlign: "left" }}>
					Indicate whether you want the recommended movies to evoke
					less or more of a certain emotion, or to
					{props.defaultLabel === "Ignore" ?
						<span style={{ marginLeft: "0.5ex" }}>
							ignore the emotion in weighing the recommendations.
						</span>
						:
						<span style={{ marginLeft: "0.5ex" }}>
							diversify the recommendations along that emotional dimension.
						</span>
					}
				</p>
			</Row>
			<Row className="emoToggleInputs">
				<div className="emoToggleInputsOverlay" style={{ position: "absolute", width: "410px", height: "320px", zIndex: "999", display: "None" }}></div>
				{
					emotions.map((emotion, i) =>
						<Row key={emotion + '_' + i} md={2} style={{ margin: "3px 0" }}>
							<Col className="d-flex" md={{ span: 2 }} style={{ height: "27px" }}>
								<p style={{ marginTop: "3px" }}>{emotion}</p>
							</Col>
							<Col md={{ span: 3, offset: 1 }}>
								<ToggleButtonGroup type="radio" name={emotion + "_Toggle"} value={emotionValues[emotion]}
									onChange={(evt) => handleToggle(emotion, evt)}>
									<ToggleButton id={emotion + "_low"} value={"low"} disabled={isDone}
										className={emotionValues[emotion] === 'low' ? 'ersToggleBtnChecked' : 'ersToggleBtn'}>
										Less
									</ToggleButton>
									<ToggleButton id={emotion + "_high"} value={"high"} disabled={isDone}
										className={emotionValues[emotion] === 'high' ? 'ersToggleBtnChecked' : 'ersToggleBtn'}>
										More
									</ToggleButton>
									<ToggleButton id={emotion + "_ignore"} value={"ignore"} disabled={isDone}
										className={emotionValues[emotion] === 'ignore' ? 'ersToggleBtnChecked' : 'ersToggleBtn'}>
										{props.defaultLabel}
									</ToggleButton>
								</ToggleButtonGroup>
							</Col>
						</Row>
					)
				}
			</Row>
			<Row style={{ marginTop: "2em" }}>
				<Button className="emoToggleResetBtn" style={{ margin: "auto", width: "300px" }} variant="ersCancel" onClick={() => handleReset()} disabled={isDone}>
					Reset
				</Button>
			</Row>
		</Container>
	)
}