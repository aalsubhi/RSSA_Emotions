import React, { useEffect, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { useLocation } from 'react-router-dom';
import Shepherd from 'shepherd.js';
import "shepherd.js/dist/css/shepherd.css";
import { getPage, post, sendLog, submitSelection, updateEmotionPreference } from '../utils/api-middleware';
import { emotionsDict, studyConditions } from '../utils/constants';
import {
	emoFinalizeStep, emoPrefDone, emoPrefSelectStep, emoPrefSteps,
	emoToggleSteps, emoVizSteps, moviePreviewStep, movieSelectStep,
	recommendationInspectionSteps, resommendationSelectionInspection,
	tourOptions
} from '../utils/onboarding';
import { InstructionModal } from '../widgets/dialogs/instructionModal';
import EmotionToggle from "../widgets/emotionToggle";
import HeaderJumbotron from '../widgets/headerJumbotron';
import MovieEmotionPreviewPanel from '../widgets/movieEmotionPreviewPanel';
import MovieListPanel from "../widgets/movieListPanel";
import MovieListPanelItem from "../widgets/movieListPanelItem";
import NextButton, { FooterButton } from '../widgets/nextButton';

import { WarningDialog } from '../widgets/dialogs/warningDialog';

const EmoPrefsLayout = (props) => {

	const [userData, setUserData] = useState(props.user);
	useEffect(() => { setUserData(props.user) }, [props.user]);

	const condition = userData.condition;
	const emoVizEnabled = studyConditions[condition].emoVizEnabled;
	const emoTogglesEnabled = studyConditions[condition].emoTogglesEnabled;
	const defaultEmoWeightLabel = studyConditions[condition].defaultEmoWeightLabel;
	const ratings = useLocation().state.ratings;
	const recommendations = useLocation().state.recommendations;

	const [movies, setMovies] = useState(recommendations);
	const [isShown, setIsShown] = useState(true);
	const [activeMovie, setActiveMovie] = useState(recommendations[0]);
	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [emotionToggles, setEmotionToggles] = useState(emotionsDict);
	const [isToggleDone, setIsToggleDone] = useState(false);
	const [selectedMovieid, setSelectedMovieid] = useState(null);
	const [hideInstruction, setHideInstruction] = useState(true);
	const [recCriteria, setRecCriteria] = useState('')

	const [showWarning, setShowWarning] = useState(false);

	const [pageData, setPageData] = useState(props.pageData);
	useEffect(() => { setPageData(props.pageData) }, [props.pageData]);

	const [pageStartTime, setPageStartTime] = useState(new Date());

	const tour = useRef();
	tour.current = new Shepherd.Tour(tourOptions);

	function init_emo_tour() {
		tour.current.addStep(emoPrefSteps(tour.current));
		tour.current.addStep(recommendationInspectionSteps(tour.current));
		tour.current.addStep(moviePreviewStep(tour.current));
		if (emoVizEnabled) {
			tour.current.addStep(
				emoVizSteps(tour.current)
			);
		}
		tour.current.addSteps(
			emoToggleSteps(tour.current, defaultEmoWeightLabel === 'Diversify')
		);
		tour.current.addStep(
			emoFinalizeStep(tour.current));
	}

	function init_selection_tour() {
		// FIXME: this is a duplicated code.
		// split this into two parts: inro and the final step

		tour.current.addStep(emoPrefSelectStep(tour.current));
		tour.current.addStep(resommendationSelectionInspection(tour.current));
		tour.current.addStep(moviePreviewStep(tour.current));
		if (emoVizEnabled) {
			tour.current.addStep(
				emoVizSteps(tour.current)
			);
		}
		tour.current.addStep(movieSelectStep(tour.current, recommendations[0].movie_id));
		tour.current.addStep(emoPrefDone(tour.current));
	}

	const handleSelectionOnboarding = (isSelectionStep, movies) => {
		if (isSelectionStep) {
			Shepherd.activeTour && Shepherd.activeTour.cancel();
			tour.current = new Shepherd.Tour(tourOptions);
			tour.current.addStep(emoPrefSelectStep(tour.current));
			tour.current.addStep(resommendationSelectionInspection(tour.current));
			tour.current.addStep(movieSelectStep(tour.current, movies[0].movie_id));
			tour.current.addStep(emoPrefDone(tour.current));
			tour.current.start();
		}
	}

	useEffect(() => {
		if (emoTogglesEnabled) {
			init_emo_tour();
		} else {
			setIsToggleDone(true);
			init_selection_tour();
		}
		tour.current.start();

		return () => {
			Shepherd.activeTour && Shepherd.activeTour.cancel();
		};
	}, []);


	useEffect(() => {
		const updateRecommendations = (emoinput) => {
			setLoading(true);
			post('ers/updaterecommendations/', {
				user_id: userData.id,
				user_condition: userData.condition,
				input_type: "discrete",
				emotion_input: emoinput,
				ratings: ratings,
				num_rec: 20
			})
				.then((response): Promise<movie[]> => response.json())
				.then((movies: movie[]) => {
					setMovies(movies);
					setActiveMovie(movies[0]);
					setLoading(false);
				})
				.catch((error) => {
					console.log(error);
					setLoading(false);
				});
		}

		if (Object.values(emotionToggles).some(item => item.length > 0)) {
			const emoinput = Object.keys(emotionToggles).map(
				(key) => ({
					emotion: key,
					weight: emotionToggles[key].length > 0
						? emotionToggles[key] : 'ignore'
				}));
			const emostr = emoinput.map((item) => {
				if (item.weight !== 'ignore') {
					return item.emotion + ':' + item.weight;
				}
				return undefined;
			}).filter((item) => item !== undefined).join('; ');
			setRecCriteria(emostr);
			updateRecommendations(emoinput);
		}
	}, [emotionToggles, userData, ratings]);

	const handleHover = (isShown, activeMovie, action, panelid) => {
		setIsShown(isShown);
		setActiveMovie(activeMovie);
	}

	const handleToggle = (emotion, value) => {
		sendLog(userData, pageData.step_id, pageData.id,
			new Date() - pageStartTime, 'Set emotion value to ' + value,
			emotion, null, null);
		setEmotionToggles(prevState => {
			return {
				...prevState,
				[emotion]: value
			}
		});
	}

	const handleSelection = (movieid) => {
		sendLog(userData, pageData.step_id, pageData.id,
			new Date() - pageStartTime, 'select movie', 'movie Select',
			movieid, 99)
		setSelectedMovieid(movieid);
		setButtonDisabled(false);
	}

	const resetToggles = () => {
		sendLog(userData, pageData.step_id, pageData.id,
			new Date() - pageStartTime, 'reset emotions', 'emotionToggle',
			null, null)
		setEmotionToggles(emotionsDict);
	}

	const finalizeToggles = () => {
		sendLog(userData, pageData.step_id, pageData.id,
			new Date() - pageStartTime, 'finalize toggles', 'finalize',
			null, null)
		setShowWarning(true);
	}

	const confirmWarning = () => {
		setShowWarning(false);
		finalizeEmotionPrefs();
		sendLog(userData, pageData.step_id, pageData.id,
			new Date() - pageStartTime, 'finalize toggles', 'confirm',
			null, null)
	}

	const cancelWarning = () => {
		sendLog(userData, pageData.step_id, pageData.id,
			new Date() - pageStartTime, 'cancel finalize toggles', 'cancel',
			null, null)
		setShowWarning(false);
	}

	const finalizeEmotionPrefs = () => {
		const emoinput = Object.keys(emotionToggles).map(
			(key) => ({
				emotion: key,
				weight: emotionToggles[key].length > 0
					? emotionToggles[key] : 'ignore'
			}));

		// put('user/' + userData.id + '/emotionprefs/', emoinput)
		updateEmotionPreference(userData, emoinput)
			.then((response) => {
				setIsToggleDone(true);
			})
			.catch((error) => {
				console.log(error);
			});

		const emopanel = document.getElementById('emotionPanel');
		emopanel.style.opacity = '0.5';

		getPage(userData.study_id, props.studyStep.id, 19)
			.then((value) => {
				setPageData(value);
			});
		setPageStartTime(new Date());
		handleSelectionOnboarding(true, movies);
	}

	const handleNext = () => {

		// put('user/' + userData.id + '/itemselect/', {
		// 	'user_id': userData.id,
		// 	study_id: 
		// 	'page_id': pageData.id,
		// 	'selected_item': {
		// 		'item_id': movieid,
		// 		'rating': 99
		// 	}
		// })
		submitSelection(userData, pageData, selectedMovieid)
			.then((response): Promise<value> => response.json())
			.then((selectedItem: value) => {
				if (selectedItem.item_id === parseInt(selectedMovieid) && selectedItem.rating === 99) {
					props.nagivationCallback();
				}
			}).catch((error) => {
				console.log(error);
			});
		setLoading(false);
	}

	const infoHandler = () => {
		Shepherd.activeTour && Shepherd.activeTour.current.cancel();
		init_emo_tour();
		tour.current.start();
	}

	return (
		<Container>
			<Row>
				<HeaderJumbotron title={pageData.page_name} content={pageData.page_instruction} />
			</Row >
			<WarningDialog show={showWarning} title={"Are you sure?"}
				message={`<p>Finalizing will freeze your current emotion settings.</p> 
					<p>This action cannot be undone.</p>`}
				confirmCallback={confirmWarning}
				confirmText={"Confirm"}
				cancelCallback={cancelWarning} />
			<InstructionModal show={!hideInstruction} onHide={() => setHideInstruction(true)} />
			<Row style={{ height: "fit-content" }}>
				<Col id="emotionPanel">
					<div className="emoPrefControlPanel">
						{emoTogglesEnabled &&
							<Row>
								<EmotionToggle onToggle={handleToggle}
									emotions={emotionToggles}
									onReset={resetToggles}
									isDone={isToggleDone}
									onFinalize={finalizeToggles}
									infoCallback={infoHandler}
									defaultLabel={defaultEmoWeightLabel} />
							</Row>
						}
					</div>
				</Col>
				<Col id="moviePanel">
					{loading ?
						<div className="movieListPanelOverlay" style={{
							position: "absolute", width: "415px", marginTop: "99px",
							height: "504px", borderRadius: "5px",
							zIndex: "999", display: "block", backgroundColor: "rgba(72, 72, 72, 0.8)"
						}}>
							<Spinner animation="border" role="status" style={{ margin: "300px auto", color: "white" }}>
								<span className="sr-only">Loading...</span>
							</Spinner>
						</div>
						: ""}
					<MovieListPanel id="leftPanel"
						movieList={movies.slice(0, 7)}
						panelTitle={'Recommendations'}
						panelByline={recCriteria}
						byline={emotionToggles}
						render={(props) => <MovieListPanelItem {...props}
							pick={isToggleDone} />}
						hoverHandler={handleHover}
						selectionHandler={handleSelection}
					/>

				</Col>
				<Col id="moviePosterPreview">
					<div className="d-flex mx-auto moviePreviewPanel">
						{isShown && (activeMovie != null) ? (
							<MovieEmotionPreviewPanel movie={activeMovie}
								emoVizEnabled={emoVizEnabled} />
						) : (<></>)}
					</div>
				</Col>
			</Row >
			<Row>
				<div className="jumbotron jumbotron-footer">
					{emoTogglesEnabled && !isToggleDone ?
						<FooterButton className="toggleFinalizeButton" variant="ersDone"
							onClick={() => finalizeToggles()} text="Finalize" />
						:
						<NextButton className="nextButton" disabled={buttonDisabled && !loading}
							onClick={handleNext} loading={loading} />
					}
				</div>
			</Row>
		</Container >
	)
}

export default EmoPrefsLayout;