import React from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { Link } from 'react-router-dom';
import { useState } from 'react';

import InputGroup from "react-bootstrap/InputGroup";


export default function InformedConsentModal(props) {

	const [isConsentGiven, setIsConsentGiven] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [condition, setCondition] = useState(0);

	const handleConsent = (e) => {
		setIsLoading(true);
		props.consentCallback(isConsentGiven, condition);
	}

	return (

		< Modal show={props.show} dialogClassName="modal-80w" style={{ zIndex: "2050" }
		}>
			<Modal.Header>
				<Modal.Title>
					Testing an Interactive Movie Recommender System Using
					Emotions for Diversification
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p className='informedConsent-title'>
					Key Information About the Research Study
				</p>
				<p>
					<span className='informedConsent-bold'>
						Voluntary Consent:&nbsp;
					</span>
					Dr. Bart Knijnenburg is inviting you to volunteer for a
					research study. Dr. Knijnenburg is an associate professor
					at Clemson University. He will conduct the study with Lijie
					and Mehtab (both graduate students at Clemson University).
				</p>

				<p>
					<span className='informedConsent-bold'>
						Alternative to Participation:&nbsp;
					</span>
					Participation is voluntary, and the only alternative is to
					not participate. You will not be punished in any way if you
					decide not to be in the study or to stop taking part in the
					study.
				</p>
				<p>
					If you decide not to take part or to stop taking part in
					this study, it will not affect you in any way.
				</p>

				<p>
					<span className='informedConsent-bold'>
						Study Purpose:&nbsp;
					</span>
					The purpose of this research is to evaluate a movie
					recommender system and better understand your
					experiences with the system through your responses to
					the post-task questionnaire.
				</p>

				<p>
					<span className='informedConsent-bold'>
						Activities and Procedures:&nbsp;
					</span>
					Your part in this study will be viewing some
					recommendations and completing a quick post-task survey.
					It will take you about 10-15 minutes to be in this study,
					but please make yourself available for 20 minutes just in
					case.
				</p>

				<p>
					<span className='informedConsent-bold'>
						Risks and Benefits:&nbsp;
					</span>
					We do not know of any risks or discomforts to you in this
					study. The only benefit to you is the learning experience
					from participating in a research study. The benefit to
					society is the contribution to scientific knowledge.
				</p>

				<p className='informedConsent-title'>Incentives</p>
				<p>
					Participants who complete all tasks will be compensated
					with $2.75. Successful and careful completion of the tasks
					is a prerequisite for payment.
				</p>

				<p className='informedConsent-title'>
					Audio/Video Recording and Photographs
				</p>
				<p>
					This session will not be audio/video recorded.
				</p>

				<p className='informedConsent-title'>
					Protection of Privacy and Confidentiality
				</p>
				<p>
					No identifiable information will be collected during the study.
					The anonymous information collected in this study could be used
					for future research studies or distributed to another
					investigator for future research studies without additional
					informed consent from the participants or legally authorized
					representative.
				</p>
				<p>
					The results of this study may be published in scientific
					journals, professional publications, or educational
					presentations. Published results will not include
					identifiable information.
				</p>

				<p className='informedConsent-title'>
					Contact Information
				</p>
				<p>
					If you have any questions or concerns about your rights in this research study,
					please contact the Clemson University Office of Research Compliance (ORC) at
					864-656-0636 or <a href="mailto:irb@clemson.edu">irb@clemson.edu</a>. If you are
					outside of the Upstate South Carolina area, please use the ORC's toll-free number,
					866-297-3071. The Clemson IRB will not be able to answer some study-specific
					questions. However, you may contact the Clemson IRB if the research staff cannot
					be reached or if you wish to speak with someone other than the research staff.
				</p>
				<p>
					If you have any study related questions or if any problem arise, please contact
					Lijie <a href="mailto:lydiahsu7@gmail.com">lydiahsu7@gmail.com</a>.
				</p>

				<p className='informedConsent-title'>
					Consent
				</p>
				<p className='informedConsent-bold'>
					By participating in the study, you indicate that you have
					read the information written above, been allowed to ask any
					questions, and you are voluntarily choosing to take part in
					this research.
				</p>
				<Form.Check style={{ fontWeight: "500", marginTop: "9px" }}
					label="I have read and understood this consent form and I agree to participate in this
					research study"
					onChange={(evt) => setIsConsentGiven(evt.target.checked)}
					default={false} />

				<InputGroup className="mb-3">
					<InputGroup.Text id="inputGroup-sizing-sm">
						Ranking Strategy
					</InputGroup.Text>
					<Form.Select aria-label="Algo Experiment"
						onChange={(evt) => setCondition(evt.target.value)}
						value={condition}>
						<option value="0" >
							0
						</option>
						<option value="1" >
							1
						</option>
						<option value="2" >
							2
						</option>
						<option value="3" >
							3
						</option>
						<option value="4" >
							4
						</option>
						<option value="5" >
							5
						</option>
						<option value="6" >
							6
						</option>
						<option value="7" >
							7
						</option>
						<option value="8" >
							8
						</option>
					</Form.Select>
				</InputGroup>


			</Modal.Body>
			<Modal.Footer>
				<Link to="/quit">
					<Button variant="ersCancel">
						Exit
					</Button>
				</Link>
				<Button variant="ers" disabled={!isConsentGiven || isLoading}
					onClick={(e) => handleConsent(e)}>
					{!isLoading ? 'Continue'
						:
						<>
							<Spinner
								as="span"
								animation="grow"
								size="sm"
								role="status"
								aria-hidden="true"
							/>
							Loading...
						</>
					}
				</Button>
			</Modal.Footer>
		</Modal >

	)
}