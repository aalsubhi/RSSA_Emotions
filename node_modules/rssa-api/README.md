# RSSA API integration library

***Disclaimer:***
- *This library is still under development and is subject to change.*
- *This README is a work in progress and may not contain all the information.*

## About

This library provides a simple way to integrate with the RSSA API in a
React application.

## Installation

``` bash
npm install -U git+ssh://git@github.com:ShahanM/react-rssa-api.git

```

or if you are using the https version of the repository

``` bash
npm install -U git+https://github.com/ShahanM/react-rssa-api.git
```

## Usage

On the top level of your application, wrap your application with the
`StudyProvider` component. This will provide the context for the `useStudy`
hook to work in its child components.

``` typescript
import { StudyProvider } from 'rssa-api';
```

``` typescript
<StudyProvider config={providerConfig}>
    <YourAppRoot />
</StudyProvider>
```

The `StudyProvider` component takes a single prop `config`:

``` typescript
config: {
    api_url_base: string;
    study_id: string;
};
```

Note: It is recommended to store the `api_url_base`, `study_id` and other
configuration parameter in a `.env` file and access them using the
`process.env`.

``` typescript
import { useStudy } from 'rssa-api';

function YourComponent() {
    const { studyApi } = useStudy();
}
```

The `useStudy()` currently only exposes the HTTP client for the study API and
allows the `GET`, `POST`, and `PUT` methods to be called on the study API.

``` typescript
const { studyApi } = useStudy();

// The return type of the get method is dependent on the API endpoint
const getResponse = await studyApi.get<ReturnObjectType>('/path/to/endpoint');

// The post method takes an additional parameter for the request body, and the
// type of the request body needs to be specified.
const postResponse = await studyApi.post<RequestObjectType, ReturnObjectType>(
    '/path/to/endpoint',
    requestBody: RequestObjectType);

// The put methods do not have a return type, as the response is always empty.
const putResponse = await studyApi.put<RequestObjectType>(
    'path/to/endpoint',
    requestBody: RequestObjectType);
```

## Types

Currently, the following types are predefined in the library and can be imported
from the library for convenience.

| Meta          | Study              | Participant    | Participant Response |
|---------------|--------------------|----------------|----------------------|
|SurveyConstruct|StudyStep           |Participant     |SurveyResponse        |
|ConstructItem  |CurrentStep         |NewParticipant  |SurveyItemResponse    |
|ScaleLevel     |emptyStep           |emptyParticipant|TextItemResponse      |
|TextConstruct  |SurveyPage          |                |GroupedTextResponse   |
|               |PageContent         |                |Feedback              |
|               |PrefVizRequestObject|                |Demographic           |


## Utility Functions

The library also provides utility functions as placeholders for empty objects,
and to check if an object is empty.
`isEmptyParticipant()`, `isEmptyStep()`

## Example

Here is an example `index.tsx` file:

``` typescript
import React from "react";
import { createRoot } from 'react-dom/client';

// RSSA Study Provider
import { StudyProvider } from 'rssa-api';

// The application's root component
import App from './App';

const REACT_APP_RSSA_API = process.env.REACT_APP_RSSA_API!;
const REACT_APP_RSSA_STUDY_ID = process.env.REACT_APP_RSSA_STUDY_ID!;

const providerConfig = {
    api_url_base: REACT_APP_RSSA_API,
    study_id: REACT_APP_RSSA_STUDY_ID
};

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <StudyProvider config={providerConfig}>
            <App />
        </StudyProvider>,
    </React.StrictMode>
);
```
