import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShepherdTour } from 'react-shepherd';
import "shepherd.js/dist/css/shepherd.css";
import { get, getNextStudyStep, sendLog } from '../utils/api-middleware';
import { studyConditions } from '../utils/constants';
import { LoadingScreen } from '../utils/loadingScreen';
import EmoPrefsLayout from '../layouts/emoPrefsLayout';


const EmotionPreferences = (props) => {

	const userdata = useLocation().state.user;
	const stepid = useLocation().state.studyStep;

	const navigate = useNavigate();
	const [studyStep, setStudyStep] = useState(undefined);
	const [pageData, setPageData] = useState(undefined);

	const [starttime, setStarttime] = useState(new Date());

	useEffect(() => {
		getNextStudyStep(userdata.study_id, stepid)
			.then((value) => {
				setStudyStep(value);
			});
	}, [userdata, stepid]);

	useEffect(() => {
		const getStepPage = (studyid, stepid) => {
			const emoTogglesEnabled = studyConditions[userdata.condition].emoTogglesEnabled;
			let path = 'study/' + studyid + '/step/' + stepid + '/page/';
			path += emoTogglesEnabled ? 'first/' : 'last/';
			get(path)
				.then((response): Promise<page> => response.json())
				.then((page: page) => {
					setPageData(page);
				})
				.catch((error) => console.log(error));
		}
		if (studyStep !== undefined && Object.keys(studyStep).length > 0) {
			getStepPage(studyStep.study_id, studyStep.id);
		}
	}, [studyStep, userdata]);

	function navigateHandler() {
		sendLog(userdata, studyStep.id, null, new Date() - starttime, 'navigate',
			'next', null, null);
		navigate(props.next, {
			state: {
				user: userdata,
				studyStep: studyStep.id
			}
		});
	}

	return (
		<>
			{
				(studyStep === undefined || pageData === undefined) ?
					<LoadingScreen loading={!studyStep} />
					:
					<ShepherdTour steps={[]}>
						<EmoPrefsLayout nagivationCallback={navigateHandler}
							studyStep={studyStep} user={userdata}
							pageData={pageData} />
					</ShepherdTour>
			}
		</>
	)
}

export default EmotionPreferences;