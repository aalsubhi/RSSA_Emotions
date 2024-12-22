import DOMPurify from "dompurify";
import parse from "html-react-parser";

export default function HeaderJumbotron(props) {

	const clean = DOMPurify.sanitize(props.content);
	const parsed = parse(clean);

	return (
		<div className="jumbotron">
			<h1 className="header">{props.title}</h1>
			<div style={{ width: "fit-content", margin: "auto", textAlign: "left" }}>
				{parsed}
			</div>
		</div>
	)
}