import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import ListGroup from "react-bootstrap/ListGroup";
import React, { useEffect, useState } from "react";
import { imgurl } from "../utils/api-middleware";


export default function MovieListPanelItem(props) {

	const [movie, setMovie] = useState(props.movie);
	useEffect(() => { setMovie(props.movie); }, [props.movie]);

	return (
		<ListGroup.Item as="div"
			className={"d-flex justify-content-between align-items-center"}
			style={{padding: "0.1rem"}}
			onMouseEnter={(evt) => props.hoverHandler(evt, true, movie, "enter")}
		>
			<div>
				<Image className="sidePanelThumbnail" src={imgurl(movie.poster_identifier)} />
			</div>
			<div style={{
				position: "relative", boxSizing: "border-box", width: "87%",
				display: "inline-block", verticalAlign: "middle"
			}}>
				<p style={{ marginBottom: "0", marginTop: "0.25rem", textAlign: "left", marginLeft: "0.5em" }}>
					{movie.title + " (" + movie.year + ")"}
				</p>
			</div>
			{props.pick ?
				<>
					<div id={"selectButton_" + movie.movie_id}>
						{movie.movie_id === props.selectedid ?
							<Button variant="ersDone" className="movielist-btn"> Selected</Button>
							:
							<Button variant="ers" className="movielist-btn" onClick={() => props.selectionHandler(movie.movie_id)}>Select</Button>
						}
					</div>
				</>
				: ''}
		</ListGroup.Item>
	)
}