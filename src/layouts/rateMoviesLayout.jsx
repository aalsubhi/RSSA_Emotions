import React, { useEffect, useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useLocation } from 'react-router-dom';
import Shepherd from 'shepherd.js';
import "shepherd.js/dist/css/shepherd.css";
import { post, put, sendLog, updateRating } from '../utils/api-middleware';
import { LoadingScreen } from '../utils/loadingScreen';
import { ratingSteps, tourOptions } from '../utils/onboarding';
import HeaderJumbotron from '../widgets/headerJumbotron';
import MovieGrid from '../widgets/movieGrid';
import NextButton from '../widgets/nextButton';

export const RateMoviesLayout = (props) => {
	const itemsPerPage = 24;
	const userdata = useLocation().state.user;

	const [ratedMoviesData, setRatedMoviesData] = useState([]);
	const [ratedMovies, setRatedMovies] = useState([]);
	const [movies, setMovies] = useState([]);

	const [ratedMovieCount, setRatedMovieCount] = useState(0);
	const [buttonDisabled, setButtonDisabled] = useState(true);

	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const [timerStamp, setTimerStamp] = useState(Date.now());

	const [gridPageStarttime, setGridPageStarttime] = useState();

	const [studyStep, setStudyStep] = useState(props.studyStep);
	useEffect(() => { setStudyStep(props.studyStep) }, [props.studyStep]);

	const tour = useRef();
	tour.current = new Shepherd.Tour(tourOptions);

	const rateMoviesHandler = (newRating, idstr) => {
		const movieid = parseInt(idstr);
		const isNew = !ratedMoviesData.some(item =>
			item.item_id === movieid);

		let newrefMovies = [...movies];
		let newrefRatedMovies = [...ratedMovies];
		let newrefRatedMoviesData = [...ratedMoviesData];

		let updatedmovie = newrefMovies.find(item => item.movie_id === movieid);
		updatedmovie.rating = newRating;
		if (isNew) {
			let updatevisited = [...ratedMoviesData, { item_id: movieid, rating: newRating }];
			let updaterated = [...ratedMovies, updatedmovie];
			setRatedMovies(updaterated);
			setRatedMoviesData(updatevisited);
			setRatedMovieCount(updatevisited.length);
			setButtonDisabled(updatevisited.length < 10);
		} else {
			let updatevisited = newrefRatedMoviesData.find(item => item.item_id === movieid);
			updatevisited.rating = newRating;

			let updaterated = newrefRatedMovies.find(item => item.movie_id === movieid);
			updaterated.rating = newRating;
			setRatedMovies(newrefRatedMovies);
			setRatedMoviesData(newrefRatedMoviesData);
		}
		setMovies(newrefMovies);
		sendLog(userdata, studyStep.id, null, new Date() - gridPageStarttime,
			'rate movie', 'gallery page ' + currentPage, movieid, newRating);
	}

	const fetchMovies = async () => {
		const limit = itemsPerPage * 2;
		const nextpageids = props.getMoviesCallback(limit);
		getMoviesByIDs(nextpageids);
	}

	const getMoviesByIDs = async (ids) => {
		post('ers/movies/', ids)
			.then((response): Promise<movie[]> => response.json())
			.then((newmovies: movie[]) => {
				setMovies([...movies, ...newmovies]);
				setGridPageStarttime(new Date());
			})
			.catch((error) => console.log(error));
	}

	useEffect(() => {
		tour.current.addSteps(ratingSteps(tour.current));
		tour.current.start();

		return () => {
			Shepherd.activeTour && Shepherd.activeTour.cancel();
		};
	}, []);

	useEffect(() => {
		fetchMovies();
	}, []);

	const submitHandler = (recType) => {
		setLoading(true);
		setTimerStamp(Date.now());
		if (ratedMovies.length > 0) {
			updateRating(userdata, studyStep, currentPage, ratedMoviesData)
			// updateItemrating()
			.then((isupdateSuccess): Promise<Boolean> => isupdateSuccess)
				.then((isupdateSuccess) => {
					if (isupdateSuccess) {
						post('ers/recommendation/', {
							user_id: userdata.id,
							user_condition: userdata.condition,
							ratings: ratedMoviesData,
							rec_type: recType,
							num_rec: 20
						})
							.then((response): Promise<movie[]> => response.json())
							.then((movies: movie[]) => {
								setTimeout(() => {
									props.navigationCallback([...movies],
										ratedMoviesData);
								}, 10000 - (Date.now() - timerStamp));
							})
							.catch((error) => {
								console.log(error);
								setLoading(false);
							});
					}
				})
				.catch((error) => { console.log(error); setLoading(false); });
		}
	}

	const updateItemrating = async () => {
		return put('user/' + userdata.id + '/itemrating/', {
			'user_id': userdata.id,
			'page_id': studyStep.id,
			'page_level': currentPage,
			'ratings': ratedMoviesData
		})
			.then((response): Promise<ratedItems[]> => response.json())
			.then((ratedItems: ratedItems) => { return ratedItems.length > 0; })
			.catch((error) => { console.log(error); return false });
	}

	const updateCurrentPage = (page) => {
		const currentpage = currentPage;
		let action = 'next';
		if (currentpage > page) {
			action = 'prev';
		}
		sendLog(userdata, studyStep.id, null, new Date() - gridPageStarttime,
			action, 'gallery page ' + currentPage, null, null);
		setCurrentPage(page);
		setGridPageStarttime(new Date());
	}

	return (
		<>
			{loading ?
				<LoadingScreen loading={loading} />
				:
				<Container>
					<Row>
						<HeaderJumbotron title={studyStep.step_name} content={studyStep.step_description} />
					</Row>
					<Row>
						<MovieGrid ratingCallback={rateMoviesHandler} userid={userdata.id} movies={movies}
							pagingCallback={updateCurrentPage} itemsPerPage={itemsPerPage} dataCallback={fetchMovies} />
					</Row>
					<Row>
						<div className="jumbotron jumbotron-footer" style={{ display: "flex" }}>
							<RankHolder count={ratedMovieCount} />
							<NextButton disabled={buttonDisabled && !loading}
								loading={loading} onClick={() => submitHandler(0)} />
						</div>
					</Row>
				</Container>
			}
		</>
	);
}

const RankHolder = (props) => {
	return (
		<div className="rankHolder">
			<span> Ranked Movies: </span>
			<span><i>{props.count}</i></span>
			<span><i>of {10}</i></span>
		</div>
	)
}