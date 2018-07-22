import React, {Component} from 'react';
import './App.css';

import {AppRoutes, AppHeader, AppNavigation} from '../components';

class App extends Component {
    render() {
        return (
            <div className="mdm">
                <AppHeader/>
                <AppNavigation/>
                <AppRoutes/>
            </div>
        );
    }
}

export default App;
