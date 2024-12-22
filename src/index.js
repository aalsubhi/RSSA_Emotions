import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { StudyProvider } from 'rssa-api';



// Define the configuration directly
const providerConfig = {
    api_url_base: 'https://rssa.recsys.dev/rssa/api/v2', // Replace with your actual API URL
    study_id: '5a98b767-d9fd-46d6-b5f8-e0f1db561ed4' // Replace with your actual study ID
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <StudyProvider config={providerConfig}>
    <App />
  </StudyProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
