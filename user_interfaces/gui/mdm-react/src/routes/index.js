import React, {Component} from 'react';
import './App.css';

import {AppGraph, AppHeader, AppNavigation, AppRoutes} from '../components';

class App extends Component {
    render() {
        return (
            <div className="mdm">
                <AppHeader/>
                <AppNavigation/>
                <AppGraph/>
                <AppRoutes/>
            </div>
        );
    }
}

export default App;
