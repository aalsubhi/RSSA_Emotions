import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShepherdTour } from 'react-shepherd';
import "shepherd.js/dist/css/shepherd.css";
import { RateMoviesLayout } from '../layouts/rateMoviesLayout';
import { get, getNextStudyStep, sendLog, updateSeen } from '../utils/api-middleware';
import { LoadingScreen } from '../utils/loadingScreen';
import { useStudy } from 'rssa-api'; // Add this import


export const RateMovies = (props) => {

	const userdata = useLocation().state.user;
	const stepid = useLocation().state.studyStep;

	const navigate = useNavigate();
	const [studyStep, setStudyStep] = useState(undefined);
	const [movieids, setMovieIds] = useState([]);
	const [pageNum, setPageNum] = useState(1);

	const [starttime, setStarttime] = useState(new Date());

	 // Get studyApi from useStudy hook
    const { studyApi } = useStudy();

	useEffect(() => {
		getNextStudyStep(userdata.study_id, stepid)
			.then((value) => {
				setStudyStep(value)
			});
	}, [userdata, stepid]);

	useEffect(() => {
		const getAllMovieIds = async () => {
			get('ers/movies/ids/')
				.then((response): Promise<movie[]> => response.json())
				.then((newmovies: movie[]) => {
					setMovieIds(newmovies);
				})
				.catch((error) => console.log(error));
		}

		if (studyStep !== undefined && Object.keys(studyStep).length > 0) {
			getAllMovieIds();
		}
	}, [studyStep]);

	const pickRandomMovies = (limit) => {
		let randomMovies = [];
		let moviearr = [...movieids];
		for (let i = 0; i < limit; i++) {
			let randomMovie = moviearr.splice(Math.floor(Math.random() * moviearr.length), 1);
			randomMovies.push(...randomMovie);
		}
		setMovieIds(moviearr);
		updateSeenItems(randomMovies);
		return randomMovies;
	}

	const updateSeenItems = async (items) => {
		updateSeen(userdata, studyStep, pageNum, items)
			.then((response): Promise<success> => response.json())
			.then((success: success) => { setPageNum(pageNum + 1) })
			.catch((error) => console.log(error));
	}

	function handleNavigate(recommendedMovies,
		ratedMoviesData) {
		sendLog(userdata, studyStep.id, null, new Date() - starttime,
			'navigation', 'next', null, null)
		navigate(props.next,
			{
				state: {
					recommendations: recommendedMovies,
					ratings: ratedMoviesData,
					user: userdata,
					studyStep: studyStep.id
				}
			});
	}

	return (
		<div>
			{
				(studyStep === undefined || movieids.length <= 0) ?
					<LoadingScreen loading={!studyStep} />
					:
					<ShepherdTour steps={[]}>
						<RateMoviesLayout navigationCallback={handleNavigate}
							stepName={studyStep.step_name}
							studyStep={studyStep}
							getMoviesCallback={pickRandomMovies} />
					</ShepherdTour>
			}
		</div>
	);
}

export default RateMovies;