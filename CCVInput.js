var React = require('react');
var Util = require('./Util');
var utils = new Util();

var CCVInput = React.createClass({
  getInitialState: function() {
    return {
      value: ''
    };
  },

  restrictCVC: function(e) {
    var target = e.target,
        digit  = String.fromCharCode(e.which);

    if(!/^\d+$/.test(digit)) return;

    if(utils.hasTextSelected(target)) return;

    var value = target.value + digit;
    if(value.length > 4) {
      e.preventDefault();
    }
  },

  reFormatCVC: function(e) {
    var target  = e.target,
        value   = target.value;

    value = value.replace(/\D/g, '').slice(0, 4); //[0...4]
    this.setState({value: value});
  },

  onKeyPress: function(e) {
    if(!utils.restrictNumeric(e)) { return false; }
    this.restrictCVC(e);
  },
  onPaste: function(e) {
    this.reFormatCVC(e);
  },
  onInput: function(e) {
    this.reFormatCVC(e);
  },
  render: function() {
    var value = this.state.value;

    return (
      <input className="cc-ccv" ref="ccVInput" type="tel" value={value} autoComplete="off" placeholder="•••"
        onKeyPress={this.onKeyPress}
        onPaste={this.onPaste}
        onInput={this.onInput} />
    );
  }
});

module.exports = CCVInput;
