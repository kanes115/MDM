import React from 'react';
import {NavLink} from 'react-router-dom';

import {MDMLink} from '../../components';

import './app-navigation.css';

const AppNavigation = () => (
    <nav className="mdm-nav">
        <NavLink to="/model">
            <MDMLink label="model"/>
        </NavLink>
        <NavLink to="/deploy">
            <MDMLink label="deploy"/>
        </NavLink>
        <NavLink to="/monitor">
            <MDMLink label="monitor"/>
        </NavLink>
    </nav>
);

AppNavigation.propTypes = {};
AppNavigation.defaultProps = {};

export default AppNavigation;
