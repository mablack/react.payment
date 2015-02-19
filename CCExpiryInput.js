var React = require('react');
var Util = require('./Util');
var utils = new Util();

var CCExpiryInput = React.createClass({
  getInitialState: function() {
    return {
      value: ''
    };
  },

  getFormattedExpiry: function(expiry) {

    var parts = expiry.match(/^\D*(\d{1,2})(\D+)?(\d{1,4})?/);

    if(!parts) return '';

    var mon = parts[1] || '',
        sep = parts[2] || '',
        year = parts[3] || '';

    if (year.length > 0) {
      sep = ' / ';
    } else if (sep == ' /') {
      mon = mon.substring(0, 1);
      sep = '';
    } else if (mon.length == 2 || sep.length > 0) {
      sep = ' / ';
    } else if (mon.length == 1 &&
                (mon != '0' && mon != '1')) {
      mon = '0' + mon;
      sep = ' / ';
    }

    return mon + sep + year;
  },
  formatExpiry: function (e) {
    // # Only format if input is a number
    var digit = String.fromCharCode(e.which);
    if(!/^\d+$/.test(digit)) return;


    var target = e.target,
        value  = target.value + digit;

    console.log('formatExpiry', value);

    if (/^\d$/.test(value) &&
          (value != '0' && value != '1')) {
      e.preventDefault();
      console.log('1', value);
      // setTimeout -> $target.val("0#{val} / ")
      this.setState({value: '0' + value + ' / '});

    } else if (/^\d\d$/.test(value)) {
      e.preventDefault();
      console.log('2', value);
      // setTimeout -> $target.val("#{val} / ")
      this.setState({value: value + ' / '});
    }
  },

  restrictExpiry: function(e) {
    var target = e.target,
        digit  = String.fromCharCode(e.which);

    if(!/^\d+$/.test(digit)) return true;

    if(utils.hasTextSelected(target)) return true;

    var value = target.value + digit;
    value = value.replace(/\D/g, '');

    console.log('restrictExpiry', value);

    if (value.length > 6) {
      e.preventDefault();
      return false;
    }
  },

  formatForwardSlashAndSpace: function(e) {
    var which = String.fromCharCode(e.which);
    if(which != '/' && which != ' ') return;

    console.log('formatForwardSlashAndSpace : which', which);

    var target = e.target,
        value  = target.value;

    if (/^\d$/.test(value) && value != '0') {
      // $target.val("0#{val} / ")
      console.log('formatForwardSlashAndSpace', '0' + value + ' / ');
      this.setState({value: '0' + value + ' / '});
    }
  },

  formatForwardExpiry: function(e) {
    var digit = String.fromCharCode(e.which);
    if(!/^\d+$/.test(digit)) return true;

    var target = e.target,
        value  = target.value;

    if (/^\d\d$/.test(value)) {
      // $target.val("#{val} / ")
      this.setState({value: value + ' / '});
    }
  },

  onKeyPress: function(e) {
    utils.restrictNumeric(e);
    this.restrictExpiry(e);
    this.formatExpiry(e);
    this.formatForwardSlashAndSpace(e);
    this.formatForwardExpiry(e);
  },

  formatBackExpiry: function(e) {
    var target = e.target,
        value  = target.value;

    // # Return unless backspacing
    if (e.which != 8) return;

    // # Return if focus isn't at the end of the text
    if (target.selectionStart != null && target.selectionStart != value.length) {
      // console.log('formatBackCardNumber: focus not at end of text');
      return;
    }

    // # Remove the trailing space + last digit
    if (/\d\s\/\s$/.test(value)) {
      e.preventDefault();
      this.setState({value: value.replace(/\d\s\/\s$/, '') });
      // setTimeout -> $target.val(value.replace(/\d\s\/\s$/, ''))
    }
  },

  onKeyDown: function(e) {
    // formatBackExpiry
    this.formatBackExpiry(e);
  },

  reFormatExpiry: function (e) {
  // setTimeout ->
    var target = e.target,
        value  = target.value;

    value = this.getFormattedExpiry(value);
    this.setState({value: value });
    // $target.val(value)
  },
  onInput: function(e) {
    // @on('input', reFormatExpiry)
    this.reFormatExpiry(e);
  },

  cardExpiryVal: function() {
    var value     = this.state.value.replace(/\s/g, ''),
        monthYear = value.split('/', 2);

    // # Allow for year shortcut
    if (monthYear.length == 2) {
      var month = monthYear[0],
          year  = monthYear[1];

      if (year.length == 2 && /^\d+$/.test(year)){
        var prefix = (new Date()).getFullYear();
        prefix = prefix.toString().slice(0,2);
        year   = prefix + year;
      }
      month = parseInt(month, 10);
      year  = parseInt(year, 10);

      return { month: month, year: year };
    }

  },

  validate: function() {
    var expiryVal = this.cardExpiryVal();

    // # Allow passing an object
    if (typeof expiryVal != 'object' || !expiryVal['month']  || !expiryVal['year']) {
      return false;
    }

    var month = expiryVal['month'],
        year  = expiryVal['year'];

    if (!month && !year) return false;

      month = month.toString();
      year  = year.toString();

      if (!/^\d+$/.test(month)) return false;
      if (!/^\d+$/.test(year)) return false;
      if (!(1 <= month <= 12)) return false;

      if (year.length == 2) {
        if (year < 70) {
          year = "20#{year}"
        } else {
          year = "19#{year}"
        }
      }

      if (year.length != 4) return false;

      var expiry      = new Date(year, month),
          currentTime = new Date();

      // # Months start from 0 in JavaScript
      expiry.setMonth(expiry.getMonth() - 1)

      // # The cc expires at the end of the month,
      // # so we need to make the expiry the first day
      // # of the month after
      expiry.setMonth(expiry.getMonth() + 1, 1);

      return expiry > currentTime;
  },

  componentDidUpdate: function() {
    console.log('componentDidUpdate : valid?');
    console.log(this.validate());
  },

  render: function() {
    var value = this.state.value;

    return (
      <input className="cc-expiry" ref="ccExpiryInput" type="tel" autoComplete="cc-exp" placeholder="•• / ••"
        value={value}
        onKeyPress={this.onKeyPress}
        onKeyDown={this.onKeyDown}
        onInput={this.onInput} />
    );
  }
});

module.exports = CCExpiryInput;
