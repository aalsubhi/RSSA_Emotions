export const emotionsDict = {
	'Joy': 'ignore',
	'Trust': 'ignore',
	'Fear': 'ignore',
	'Surprise': 'ignore',
	'Sadness': 'ignore',
	'Disgust': 'ignore',
	'Anger': 'ignore',
	'Anticipation': 'ignore'
}

export const studyConditions = {
	1: {
		recType: 'topN',
		emoTogglesEnabled: true,
		emoVizEnabled: true,
		defaultEmoWeightLabel: 'Ignore',
	},
	2: {
		recType: 'topN',
		emoTogglesEnabled: true,
		emoVizEnabled: false,
		defaultEmoWeightLabel: 'Ignore',
	},
	3: {
		recType: 'topN',
		emoTogglesEnabled: false,
		emoVizEnabled: true,
		defaultEmoWeightLabel: 'Ignore',
	},
	4: {
		recType: 'topN',
		emoTogglesEnabled: false,
		emoVizEnabled: false,
		defaultEmoWeightLabel: 'Ignore',
	},
	5: {
		recType: 'diverseN',
		emoTogglesEnabled: true,
		emoVizEnabled: true,
		defaultEmoWeightLabel: 'Diversify'
	},
	6: {
		recType: 'diverseN',
		emoTogglesEnabled: true,
		emoVizEnabled: false,
		defaultEmoWeightLabel: 'Diversify'
	},
	7: {
		recType: 'diverseN',
		emoTogglesEnabled: false,
		emoVizEnabled: true,
		defaultEmoWeightLabel: 'Diversify'
	},
	8: {
		recType: 'diverseN',
		emoTogglesEnabled: false,
		emoVizEnabled: false,
		defaultEmoWeightLabel: 'Diversify'
	}
}