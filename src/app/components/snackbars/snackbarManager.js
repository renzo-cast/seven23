/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';

class SnackbarManager extends Component {

  constructor(props, context) {
    super(props, context);
    this.history = props.history;
    this.state = {
      snackbar: null,
      open: false,
    };
  }

  componentWillReceiveProps(newProps) {

    if (this.props.snackbars.length != newProps.snackbars.length && !this.state.open) {
      this.setState({
        snackbar: newProps.snackbars.pop(),
        open: true
      });
    }
  }

  handleSnackbarRequestClose = () => {
    this.setState({
      open: false
    });
  };

  render() {
    const {  } = this.props;
    const { open, snackbar } = this.state;

    return (
      <Snackbar
        style={{ position: 'absolute' }}
        open={open}
        message={snackbar ? snackbar.message : ''}
        autoHideDuration={3000}
        onClose={this.handleSnackbarRequestClose}
        action={
          <Button color="inherit" size="small" onClick={snackbar ? snackbar.onClick : null}>
            Undo
          </Button>
        }
      />
    );
  }
}

SnackbarManager.propTypes = {
  dispatch: PropTypes.func.isRequired,
  snackbars: PropTypes.array.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    snackbars: state.state.snackbars,
  };
};


export default connect(mapStateToProps)(SnackbarManager);