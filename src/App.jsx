import 'bootstrap/dist/css/bootstrap.min.css';
import { Suspense, useEffect, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { WarningDialog } from './widgets/dialogs/warningDialog';
import DemographyPage from './pages/demographyPage';
import EmotionPreferences from './pages/emotionPrefs';
import FeedbackPage from './pages/feedbackPage';
import RateMovies from './pages/rateMovies';
import StudyMap from './pages/studymap';
import Survey from './pages/survey';
import Welcome from './pages/welcome';

function App() {

	const [showWarning, setShowWarning] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 1000) {
				setShowWarning(true);
			} else {
				setShowWarning(false);
			}
		}
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<div className="App">
			{showWarning &&
				<WarningDialog
					show={showWarning}
					title="Warning"
					message={`<p>This study requires your browser to be at least 
					<strong><underline>1000 pixels wide</underline></strong>. Please resize your browser window or use a 
					device with a larger screen.</p>`}
					disableHide={true}
				/>
			}
			<Router basename='/ierss'>
				<Suspense fallback={<h1>Loading</h1>}>
					<Routes>
						<Route path="/" element={<Welcome next="/studyoverview" />} />
						<Route path="/studyoverview" element={<StudyMap next="/presurvey" />} />
						<Route path="/presurvey" element={<Survey next="/ratemovies" />} />
						<Route path="/ratemovies" element={<RateMovies next="/recommendations" />} />
						<Route path="/recommendations" element={<EmotionPreferences next="/feedback" />} />
						<Route path="/feedback" element={<FeedbackPage next="/postsurvey" />} />
						<Route path="/postsurvey" element={<Survey next="/demography" />} />
						<Route path="/demography" element={<DemographyPage next="/quit" />} />
						<Route path="/quit" element={<h1>Thank you for participating!</h1>} />
					</Routes>
				</Suspense>
			</Router>
		</div>
	);
}

export default App;
