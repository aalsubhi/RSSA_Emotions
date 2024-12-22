import React, { ReactNode, useContext, useMemo, useState } from 'react';
import RssaClient from './RssaClient';

interface StudyContextType {
	studyApi: RssaClient;
}

interface StudyProviderProps {
	config: {
		api_url_base: string;
		study_id: string;
	};
	children: ReactNode;
}

const StudyContext = React.createContext<StudyContextType | null>(null);

const StudyProvider: React.FC<StudyProviderProps> = ({
	config,
	children
}) => {

	const { api_url_base, study_id } = config;

	const [studyApi] = useState<RssaClient>(new RssaClient(api_url_base, study_id));

	const value = useMemo(() => ({ studyApi }), [studyApi]);

	return (
		<StudyContext.Provider value={value}>
			{children}
		</StudyContext.Provider>
	);
}

const useStudy = () => {
	const context = useContext(StudyContext);
	console.log("useStudy", context);
	if (!context) {
		throw new Error('useStudy must be used within a StudyProvider');
	}
	return context;
}

export { StudyProvider, useStudy };
