import React, {Component} from 'react';
import './App.css';

import {AppContent, AppHeader, AppNavigation} from '../components';

class App extends Component {
    render() {
        return (
            <div className="mdm">
                <AppHeader/>
                <AppNavigation/>
                <AppContent/>
            </div>
        );
    }
}

export default App;
