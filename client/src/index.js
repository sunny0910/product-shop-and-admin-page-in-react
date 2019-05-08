import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();
register()

function register() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('serviceworker.js').then((registration) => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, (err)=>{
                console.log("ServiceWorker registration failed with error: ", err);
            });
        });
    }
}
