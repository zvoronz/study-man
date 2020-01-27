import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';

function initApp() {
    ReactDOM.render(<App />, document.getElementById('root'));
}

if(window.hasOwnProperty("cordova")) {
    document.addEventListener("deviceready", () => {
        initApp();
    }, false);
}
else {
    initApp();
}