import React, {Component} from 'react';
import './App.css';

import {AppHeader, AppNavigation} from '../components';

class App extends Component {
    render() {
        return (
            <div className="mdm">
                <AppHeader/>
                <AppNavigation/>
            </div>
        );
    }
}

export default App;
