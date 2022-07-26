/*
Copyright (C) 2022 Indoc Research

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import React from 'react';
import { StandardLayout } from '../../Components/Layout';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import LandingPageContent from './LandingPageContent/LandingPageContent';
import styles from './LandingPageContent/index.module.scss';

function LandingPageLayout(props) {
  const config = {
    observationVars: [],
    initFunc: () => {},
  };
  return (
    <StandardLayout className={styles.landingPageLayout}>
      <LandingPageContent />
    </StandardLayout>
  );
}

export default connect((state) => ({
  role: state.role,
}))(withRouter(LandingPageLayout));
