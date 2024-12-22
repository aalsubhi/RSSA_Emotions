import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import MovieGridItem from './movieGridItem';


export default function MovieGrid(props) {
	const [currentPage, setCurrentPage] = useState(1);
	const [movies, setMovies] = useState(props.movies);
	useEffect(() => { setMovies(props.movies) }, [props.movies]);

	const renderPrev = () => {
		if (currentPage > 1) {
			if (props.pagingCallback) {
				props.pagingCallback(currentPage - 1);
			}
			setCurrentPage(currentPage - 1);
		}
	}

	const renderNext = () => {
		if (currentPage * props.itemsPerPage < props.movies.length) {
			props.dataCallback();
		}
		if (props.pagingCallback) {
			props.pagingCallback(currentPage + 1);
		}
		setCurrentPage(currentPage + 1);
	}

	return (
		<Container className="gallery">
			<Row>
				{/* <Col md={12}> */}
				<div className="grid-container">
					{(currentPage * props.itemsPerPage <= movies.length) ?
						<>
							{movies.slice((currentPage - 1) * props.itemsPerPage, currentPage * props.itemsPerPage).map(currentMovie => (
								<MovieGridItem key={"TN_" + currentMovie.id} movieItem={currentMovie}
									handleRating={props.ratingCallback} />
							))}
						</>
						: <div style={{ minWidth: "918px", minHeight: "fit-parent" }}>
							<Spinner animation="border" role="status" style={{ margin: "18% 50%", width: "54px", height: "54px" }} />
						</div>
					}
				</div>
				{/* </Col> */}
			</Row>
			<Row className="galleryFooter">
				<Col>
					<div className="btnDiv">
						<Button id="gallery-left-btn" disabled={currentPage === 1} variant="ers" onClick={renderPrev}>
							&lt;
						</Button>
					</div>
				</Col>
				<Col>
					<div className="btnDiv">
						<Button id="gallery-right-btn" disabled={currentPage * props.itemsPerPage === props.maxlength} variant="ers" onClick={renderNext}>
							&gt;
						</Button>
					</div>
				</Col>
			</Row>
		</Container>
	);
}