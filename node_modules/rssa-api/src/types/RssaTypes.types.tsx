export type Study = {
	id: string;
	name: string;
	description: string;
	date_created: string;
}

export type StudyCondition = {
	id: string;
	name: string;
	description: string;
	date_created: string;
}

export interface OrderedComponent {
	id: string;
	order_position: number;
}

export interface StudyStep extends OrderedComponent {
	study_id: string;
	name: string;
	description: string;
	pages: Page[];
	date_created: string;
}

export interface Page extends OrderedComponent {
	study_id: string;
	step_id: string;
	name: string;
	description: string;
	date_created: string;
}

export type ParticipantType = {
	id: string;
	type: string;
}

export type NewParticipant = {
	study_id: string;
	participant_type: string;
	external_id: string;
	current_step: string;
	current_page: string | null;
}

export type Participant = {
	id: string;
	study_id: string;
	participant_type: string;
	external_id: string;
	condition_id: string;
	current_step: string;
	current_page: string | null;
	date_created: string;
}

export const emptyParticipantType: ParticipantType = {
	id: '',
	type: ''
}

export const emptyParticipant: Participant = {
	id: '',
	study_id: '',
	participant_type: '',
	external_id: '',
	condition_id: '',
	current_step: '',
	current_page: '',
	date_created: ''
}

export function isEmptyParticipant(participant: Participant): boolean {
	return participant.id === emptyParticipant.id;
}


export const emptyStep: StudyStep = {
	id: '',
	study_id: '',
	name: '',
	description: '',
	pages: [],
	date_created: '',
	order_position: 0
}

export function isEmptyStep(step: StudyStep): boolean {
	return step.id === emptyStep.id;
}


export type CurrentStep = {
	current_step_id: string;
}

export type ScaleLevel = {
	level: number;
	label: string;
	scale_id: string;
}


export type ConstructItem = {
	id: string;
	construct_id: string;
	text: string;
	order_position: number;
	item_type: string;
}

export type SurveyPage = {
	step_id: string,
	page_id: string,
	order_position: number,
	construct_id: string,
	construct_items: ConstructItem[],
	construct_scale: ScaleLevel[]
}

export type SurveyItemResponse = {
	item_id: string;
	response: string;
}

export type SurveyResponse = {
	participant_id: string;
	page_id: string;
	responses: SurveyItemResponse[];
}

export type SurveyConstruct = {
	construct_id: string;
	construct_items: ConstructItem[];
}

export type TextConstruct = {
	id: string;
	items: ConstructItem;
}


export type PageContent = {
	page_id: string;
	constructs: TextConstruct[];
}


export type Demographic = {
	age_range: string,
	gender: string,
	gender_other: string,
	race: string[],
	race_other: string,
	education: string,
	country: string,
	state_region: string
}


export type Feedback = {
	participant_id: string,
	feedback: string
	feedback_type: string
	feedback_category: string
}

export type TextItemResponse = {
	construct_id: string;
	item_id: string;
	response: string;
}

export type GroupedTextResponse = {
	participant_id: string;
	page_id: string;
	responses: TextItemResponse[];
}

export type MovieRating = {
	item_id: number,
	rating: number
}

export type PrefVizRequestObject = {
	user_id: string
	user_condition: string
	ratings: MovieRating[]
}