import React from 'react';
import Row from 'react-bootstrap/Row';
import WheelOfEmotions from './WheelOfEmotions'; // Import the WheelOfEmotions component

export default function EmotionStats(props) {
  const { movie } = props;

  const emotions = [
    { emo: 'Joy', max: 0.318181818181818, min: 0.0382546323968918 },
    { emo: 'Trust', max: 0.253994490358127, min: 0.0817610062893082 },
    { emo: 'Fear', max: 0.209126984126984, min: 0.0273270708795901 },
    { emo: 'Surprise', max: 0.166202984427503, min: 0.0256678889470927 },
    { emo: 'Sadness', max: 0.188492063492063, min: 0.025706940874036 },
    { emo: 'Disgust', max: 0.157538659793814, min: 0.00886524822695036 },
    { emo: 'Anger', max: 0.182929272690844, min: 0.0161596958174905 },
    { emo: 'Anticipation', max: 0.251623376623377, min: 0.0645546921697549 }
  ];

  // Normalization function with clamping
  const normalizeData = (value, min, max) => {
    const normalized = (value - min) / (max - min);
    return Math.max(0, Math.min(1, normalized)); // Ensure values stay between 0 and 1
  };

  // Prepare data for the WheelOfEmotions component
  const prepareEmotionData = (emotions, movieEmotions) => {
    return emotions.map(emotion => {
      const rawValue = movieEmotions[emotion.emo.toLowerCase()];
      const normalizedValue = normalizeData(rawValue, emotion.min, emotion.max); // Normalize the value
      
      return {
        emotion: emotion.emo,
        value: normalizedValue, // Use the normalized value here
        color: getEmotionColor(emotion.emo)
      };
    });
  };

  // Function to assign colors based on the emotion
  const getEmotionColor = (emotion) => {
    switch (emotion) {
      case 'Joy':
        return 'rgba(255, 255, 102, 0.7)'; // Adjust alpha to make it more visible
      case 'Trust':
        return 'rgba(102, 204, 102, 0.7)';
      case 'Fear':
        return 'rgba(102, 204, 102, 0.7)';
      case 'Surprise':
        return 'rgba(102, 153, 255, 0.7)';
      case 'Sadness':
        return 'rgba(153, 102, 255, 0.7)';
      case 'Disgust':
        return 'rgba(255, 102, 255, 0.7)';
      case 'Anger':
        return 'rgba(255, 102, 102, 0.7)';
      case 'Anticipation':
        return 'rgba(255, 153, 102, 0.7)';
      default:
        return 'rgba(200, 200, 200, 0.7)'; // Default grey
    }
  };

  // Apply the normalization to movie.emotions data
  const emotionData = prepareEmotionData(emotions, movie.emotions);

  return (
    <div>
      <Row>
        {/* Render the WheelOfEmotions with normalized data */}
        <WheelOfEmotions data={emotionData} size={200} /> {/* Adjust the size as needed */}
      </Row>
    </div>
  );
}
