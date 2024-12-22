import { useState } from "react";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";

export default function MovieListPanel(props) {

	const [selectedid, setSelectedid] = useState(props.selectedid);


	const changeRating = (newRating, movieid) => {
		let panelid = props.id;
		props.ratingHandler(panelid, newRating, movieid);
	}

	const onValueChange = (movieid) => {
		props.selectionHandler(movieid);
		setSelectedid(movieid);
	}

	const onHover = (evt, isShown, activeMovie, action) => {
		let panelid = props.id;
		props.hoverHandler(isShown, activeMovie, action, panelid);
	}

	return (
		<Col id={props.id} className="recommendationsListContainer">
			<div className="align-items-center justify-content-center"
				style={{
					height: "99px", padding: "9px 18px",
					textAlign: "center", borderRadius: "0.3rem 0.3rem 0 0",
					backgroundColor: "#e9ecef"
				}}>
				<h5>{props.panelTitle}</h5>
				{props.panelByline.length > 0 ?
					Object.keys(props.byline)
						.filter(key =>
							!(props.byline[key].length === 0
								|| props.byline[key] === 'ignore'))
						.map((key, i) => {
							return (
								<div className="badge" key={'badge_' + i}>
									<div className="name">
										<span>
											{key}
										</span>
									</div>
									<div
										className={props.byline[key] === 'low'
											? "status ersorange" : "status green"}>
										<span>
											{props.byline[key]}
										</span>
									</div>
								</div>
							)
						})
					: ""
					// <p style={{ padding: "1.8em" }}>No emotion preference selected</p>
				}
			</div>
			<ListGroup as="ul" style={{ minHeight: "504px" }}>
				{props.movieList.map((movie) => (
					props.render({
						key: movie.movie_id,
						movie: movie,
						selectedid: selectedid,
						hoverHandler: onHover,
						ratingsHandler: changeRating,
						selectionHandler: onValueChange
					})
				))}
			</ListGroup>
		</Col>
	)
}