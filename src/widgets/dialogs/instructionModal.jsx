import { ModalHeader } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";


export const InstructionModal = (props) => {

	return (
		< Modal show={props.show} dialogClassName="modal-80w" style={{ zIndex: "2050" }} >
			<ModalHeader>
				Interacting with the system
			</ModalHeader>
			<Modal.Body>
				<div className="instructionsBlock" >
					<p style={{ fontWeight: "800" }}>
						Please inspect the recommendations and adjust them to your preference.
					</p>
					<ol>
						<li>
							<p>
								We predict that you will like these 7 movies the best
								among the movies in our system based on your ratings
								on the movie rating step earlier.
							</p>
						</li>
						<li>
							<p>
								You can hover over movies to see a preview of the
								poster, a short synopsis, and the movie's emotional
								feature in 8 emotions: joy, trust, fear, surprise,
								sadness, disgust, anger, and anticipation.
							</p>
						</li>
						<li>
							<p>
								Please adjust the emotion strength indicators below
								so we can fine-tune the recommendations.
							</p>
						</li>
					</ol>
					<p style={{ fontWeight: "800" }}>
						Continue adjusting the recommendations until they
						best fit your preferences and click the green Finalize button.
					</p>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<button className="btn btn-primary" onClick={props.onHide}>
					Close
				</button>
			</Modal.Footer>
		</Modal >
	)
}
