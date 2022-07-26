/*
 * Copyright (C) 2022 Indoc Research
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { withSize } from 'react-sizeme';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './dragArea.scss';

class DragArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBreakpoint: 'lg',
      compactType: 'vertical',
      layouts: this.props.layout,
    };
  }

  onBreakpointChange = (breakpoint) => {
    this.setState({
      currentBreakpoint: breakpoint,
    });
  };

  loadLocal = () => {
    this.setState({
      layouts: {
        lg: JSON.parse(localStorage.getItem('layout')),
      },
    });
  };

  render() {
    return (
      <>
        {this.state.layouts ? (
          <ResponsiveGridLayout
            {...this.props}
            width={this.props.size.width}
            layouts={this.state.layouts}
            onBreakpointChange={this.onBreakpointChange}
            draggableHandle={'.dragarea'}
            measureBeforeMount={true}
            compactType={this.state.compactType}
            verticalCompact={true}
            preventCollision={!this.state.compactType}
          >
            {this.props.children}
          </ResponsiveGridLayout>
        ) : null}
      </>
    );
  }
}

DragArea.propTypes = {
  onLayoutChange: PropTypes.func.isRequired,
};

DragArea.defaultProps = {
  rowHeight: 100,
  onLayoutChange: function () {},
  cols: { lg: 24, md: 24, sm: 12, xs: 3, xxs: 3 },
};

export default withSize()(DragArea);
