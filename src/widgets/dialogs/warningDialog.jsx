import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import DOMPurify from "dompurify";
import parse from "html-react-parser";


export const WarningDialog = (props) => {
	/*
		Props:
			show: boolean
			title: string
			message: string
			confirmCallback: function
			confirmText: string
			cancelCallback: function
			disableHide: boolean
	*/

	const [show, setShow] = useState(false);
	const handleClose = () => !props.disableHide && setShow(false);

	const htmlparser = (html) => {
		const clean = DOMPurify.sanitize(props.message);
		const parsed = parse(clean);
		return parsed;
	}


	useEffect(() => {
		setShow(props.show);
	}, [props.show]);

	return (
		<>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header className="warning-header-ers"
					{...!props.disableHide && { closeButton: true }}>
					<Modal.Title>
						{props.title}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{htmlparser(props.message)}
				</Modal.Body>
				{!props.disableHide &&
					<Modal.Footer>
						{props.cancelCallback &&
							<Button variant="ersCancel" onClick={() => props.cancelCallback()}>
								Close
							</Button>
						}
						<Button variant="ers" onClick={
							props.confirmCallback ?
								() => props.confirmCallback()
								: handleClose
						}>
							{props.confirmText || "Confirm"}
						</Button>
					</Modal.Footer>
				}
			</Modal>
		</>
	);
}