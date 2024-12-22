import React, { useEffect } from 'react';
import StarRatings from 'react-star-ratings';
import { imgurl } from '../utils/api-middleware';


export default function MovieGridItem(props) {

	const [movieItem, setMovieItem] = React.useState(props.movieItem);
	useEffect(() => { setMovieItem(props.movieItem) }, [props.movieItem]);

	const poster_identifier = movieItem.poster_identifier;

	const rated = movieItem.rating !== undefined;

	return (
		<div id={"TN_" + movieItem.movie_id}
			className={"grid-item"} style={{
				backgroundImage: "url(" + imgurl(poster_identifier) + "), url(" + imgurl(null) + ")",
			backgroundColor: "rgb(249, 176, 92, 0.6)"
			}}>
			<div className={rated ? "rated overlay" : "overlay"}>
				<div className={movieItem.rating > 0 ? 'star-div-rated' : 'star-div'}>
					<StarRatings
						rating={movieItem.rating}
						starRatedColor="rgb(252,229,65)"
						starHoverColor="rgb(252,229,65)"
						starDimension="18px"
						starSpacing="1px"
						changeRating={props.handleRating}
						numberOfStars={5}
						name={movieItem.movie_id.toString()} />
				</div>
			</div>
			<div className="grid-item-label" style={{ position: "absolute" }}>
				{movieItem.title + " (" + movieItem.year + ")"}
			</div>
		</div>
	);
}