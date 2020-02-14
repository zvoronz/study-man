import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import { isAndroid } from "react-device-detect";

var app = {

    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        // Here we register our callbacks for the lifecycle events we care about
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onResume, false);
    },

    onDeviceReady: function() {
        let androidApp = isAndroid && window.usingCordova;
        ReactDOM.render(<App isAndroid={androidApp} />, document.getElementById('root'));
        console.log('onDeviceReady');
    },

    onPause: function() {

    },

    onResume: function(event) {

    }
}

if (isAndroid && window.usingCordova) {
    console.log('runned on Cordova');
    app.initialize();
}
else {
    console.log('runned on Browser');
    app.onDeviceReady();
}