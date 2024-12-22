import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';


export default function EmotionSlider(props) {
	const emotions = ['Joy', 'Trust', 'Fear', 'Surprise', 'Sadness', 'Disgust', 'Anger', 'Anticipation'];

	return (
		<Container>
			<h4>Your taste on movie emotions</h4>
			<div>
				{
					emotions.map((emotion, i) =>
						<Row key={emotion + '_' + i} md={2} style={{ margin: "1px 0", height: "27px" }}>
							<Col className="d-flex" md={{ span: 2, offset: 1 }} style={{ height: "36px", padding: "0" }}>
								<p style={{ margin: "auto 0", textAlign: "left" }}>{emotion}</p>
							</Col>
							<Col md={{ span: 6, offset: 3 }} style={{ margin: "auto 0 0 18px" }}>
								{/* <Button variant="ersToggle">Low</Button> */}
								{/* <Form.Label></Form.Label> */}
								<Form.Range onChange={(evt) => props.onSliderChange(emotion, evt)} />
							</Col>
						</Row>
					)
				}
			</div>
			<div className='d-flex'>
				<Button variant="ersControl" style={{ margin: "2em auto 0" }}>
					Reset
				</Button>
			</div>
		</Container>
	)
}