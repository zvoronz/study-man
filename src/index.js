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
        ReactDOM.render(<App />, document.getElementById('root'));
        console.log('onDeviceReady');
    },

    onPause: function() {

    },

    onResume: function(event) {

    }
}

if (isAndroid) {
    console.log('isAndroid');
    app.initialize();
}
else {
    app.onDeviceReady();
}