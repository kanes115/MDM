import React from 'react';
import { NavLink } from 'react-router-dom';

import { AppNavLink } from './representation';

import './app-navigation.css';

const AppNavigation = () => (
  <nav className="mdm-nav">
    <NavLink to="/model" activeClassName="active">
      <AppNavLink icon="build" label="model" />
    </NavLink>
    <NavLink to="/deploy">
      <AppNavLink icon="flight_takeoff" label="deploy" />
    </NavLink>
    <NavLink to="/monitor">
      <AppNavLink icon="show_chart" label="monitor" />
    </NavLink>
  </nav>
);

AppNavigation.propTypes = {};
AppNavigation.defaultProps = {};

export default AppNavigation;
