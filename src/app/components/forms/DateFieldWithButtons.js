import React, {Component} from 'react';
import moment from 'moment';

import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton';

const styles = {
  container:{
    width: '100%',
  },
  datepicker:{
    marginRight: '110px',
  },
  button:{
    width: '105px',
    float: 'right',
    marginTop: '29px',
  },
};

class DateFieldWithButtons extends Component{

  constructor(props, context) {
    super(props, context);
    this.state = {
      floatingLabelText: props.floatingLabelText,
      value            : props.value,
      onChange         : props.onChange,
      errorText        : props.errorText,
      autoOk           : props.autoOk,
      tabIndex         : props.tabIndex
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      floatingLabelText: nextProps.floatingLabelText,
      value            : nextProps.value,
      onChange         : nextProps.onChange,
      errorText        : nextProps.errorText,
      autoOk           : nextProps.autoOk,
      tabIndex         : nextProps.tabIndex
    });
  }

  handleYesteday = () => {
    this.setState({
      value: moment().subtract(1, 'days').toDate(),
    });
  };

  render() {
    return (
      <div style={styles.container}>
        <FlatButton
          label="Yesterday"
          style={styles.button}
          tabIndex={this.state.tabIndex}
          onTouchTap={this.handleYesteday}/>
        <DatePicker
          floatingLabelText={this.state.floatingLabelText}
          value={this.state.value}
          onChange={this.state.onChange}
          errorText={this.state.errorText}
          fullWidth={true}
          style={styles.datepicker}
          autoOk={this.state.autoOk}
        />
      </div>
    );
  }
}

export default DateFieldWithButtons;