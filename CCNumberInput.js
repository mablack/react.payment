var React = require('react');

var cards = require('./cards');
var Util = require('./Util');
var utils = new Util();

var CCNumberInput = React.createClass({

  // # Utils

  cardFromNumber: function(num) {
    num = (num + '').replace(/\D/g, '');
    // return card for card in cards when card.pattern.test(num)
    // console.log(num);

    for(var i = 0; i < cards.length; i++) {
      var card = cards[i];
      if(card.pattern.test(num)) {
        return card;
      }
    }

    return null;
  },

  restrictCardNumber: function(e) {
    console.log('restrictCardNumber');
    var target  = e.target,
    digit   = String.fromCharCode(e.which);

    if(!/^\d+$/.test(digit)) return true;

    if(utils.hasTextSelected(target)) return true;

    // # Restrict number of digits
    var value = (target.value + digit).replace(/\D/g, ''),
    card  = this.cardFromNumber(value);

    if(card) {
      // if(value.length <= card.length[card.length.length - 1])
      if(value.length > card.length[card.length.length - 1]) {
        e.preventDefault();
        return false;
      }
    } else {
      // # All other cards are 16 digits long
      // if(value.length <= 16)
      if(value.length > 16) {
        e.preventDefault();
        return false;
      }
    }

    return true;
  },

  getCardType: function(num) {
    var card = this.cardFromNumber(num);

    if(card) {
      return card.type;
    } else {
      return 'unknown';
    }
  },

  setCardType: function(e) {
    var target    = e.target,
    val       = target.value,
    cardType  = this.getCardType(val);

    this.setState({cardType: cardType});
  },

  getFormattedCardNumber: function(num) {
    num = num.replace(/\D/g, '');

    var card = this.cardFromNumber(num);
    if(!card) return num;

    var upperLength = card.length[card.length.length - 1];
    num = num.slice(0, upperLength);//num[0...upperLength]

    if(card.format.global) {
      // num.match(card.format)?.join(' ');
      var _ref;

      var retVal = (_ref = num.match(card.format)) != null ? _ref.join(' ') : null;
      // console.log('getFormattedCardNumber'); console.log(retVal);
      return retVal;
    }
    else {
      var groups = card.format.exec(num);
      if(!groups) return;// unless groups?
        groups.shift();
        // console.log(groups, ' pre-filter');
        groups = groups.filter(function(n) { return n; });// # Filter empty groups
        // console.log(groups, ' post-filter');
        // groups = $.grep(groups, (n) -> n);// # Filter empty groups
        console.log('getFormattedCardNumber()', groups.join(' '));
        return groups.join(' ');
      }
    },
    reFormatCardNumber: function(e) {
      var target = e.target,
      value  = target.value;

      value = this.getFormattedCardNumber(value);
      console.log('reFormatCardNumber', value);
      this.setState({value: value});
      // $target.val(value);
    },

    formatCardNumber: function(e) {
      console.log('formatCardNumber');
      // # Only format if input is a number
      var digit = String.fromCharCode(e.which);
      if(!/^\d+$/.test(digit)) return;

      var target  = e.target, // $(e.currentTarget)
      value   = target.value,
      card    = this.cardFromNumber(value + digit),
      length  = (value.replace(/\D/g, '') + digit).length;

      var upperLength = 16;
      if(card) {
        upperLength = card.length[card.length.length - 1];
      }
      console.log(length, '>=', upperLength);
      if(length >= upperLength) {
        console.log('true');
        return;
      }

      // console.log('target.selectionStart');
      // console.log(target.selectionStart);

      // # Return if focus isn't at the end of the text
      if(target.selectionStart && target.selectionStart != value.length) {
        console.log('focus not at start of text');
        return;
      }
      var re;
      if(card && card.type == 'amex') {
        // # AMEX cards are formatted differently
        re = /^(\d{4}|\d{4}\s\d{6})$/;
        console.log('amex format');
      } else {
        console.log('not amex format');
        re = /(?:^|\s)(\d{4})$/;
      }

      // # If '4242' + 4
      if(re.test(value)) {
        e.preventDefault();
        // setTimeout -> $target.val(value + ' ' + digit)
        this.setState({value: value + ' ' + digit});

        // # If '424' + 2
      } else if(re.test(value + digit)) {
        e.preventDefault();
        // setTimeout -> $target.val(value + digit + ' ');
        this.setState({value: value + digit + ' '});
      }

    },

    // TODO: issues with deleting '34' from Amex card values that start with 34567
    formatBackCardNumber: function (e) {
      var target  = e.target,
      value   = target.value;

      // # Return unless backspacing
      if (e.which != 8) return;

      // # Return if focus isn't at the end of the text
      if (target.selectionStart != null && target.selectionStart != value.length) {
        // console.log('formatBackCardNumber: focus not at end of text');
        return;
      }

      // # Remove the digit + trailing space
      if (/\d\s$/.test(value)) {
        e.preventDefault();
        // console.log('formatBackCardNumber 1: ', '"' + value.replace(/\d\s$/, '') + '"');
        this.setState({value: value.replace(/\d\s$/, '') });
        // setTimeout -> $target.val(value.replace(/\d\s$/, ''));
      } else if (/\s\d?$/.test(value)) {
        // # Remove digit if ends in space + digit
        e.preventDefault();
        // console.log('formatBackCardNumber 2: ', '"' + value.replace(/\d$/, '') + '"');
        this.setState({value: value.replace(/\d$/, '') });
        // setTimeout -> $target.val(value.replace(/\d$/, ''));
      }
    },

    getInitialState: function() {
      return {
        value: '',
        cardType: 'unknown'
      };
    },
    componentDidMount: function() {
      // emitter.addListener('onKeyPress', function(e) {
      //   console.log('onKeyPress');
      //   console.log(this);
      //   console.log(e);
      //   e.stopPropagation();
      //   // this.restrictNumeric();
      // });
      // emitter.addListener('onKeyPress', this.restrictCardNumber);
      // emitter.addListener('onKeyPress', this.formatCardNumber);
      //
      // console.log('this.refs.ccInput');
      // console.log(this.refs.ccInput);

      // this.refs.ccInput.on('keyPress', function() { console.log('!!! ccInput.on !!!'); });
    },
    reFormatNumeric: function(e) {
      console.log('reFormatNumeric : value', e.target.value);
      var value = utils.reFormatNumeric(e);
      console.log('reFormatNumeric : setState(value)', value);
      this.setState({value: value });
    },
    onKeyPress: function(e) {
      console.log('CCInput -> onKeyPress');
      // console.log(e);

      // emitter.emit('onKeyPress', e);

      if(!utils.restrictNumeric(e)) { return false; }

      // this.reFormatNumeric(e);

      // if(!this.restrictCardNumber(e)) { console.log('restrictCardNumber: return false'); return false; }
      this.restrictCardNumber(e);
      this.formatCardNumber(e);
    },
    onKeyDown: function(e) {
      console.log('CCInput -> onKeyDown');
      this.formatBackCardNumber(e);
    },
    onKeyUp: function(e) {
      // console.log('CCInput -> onKeyUp');

      this.setCardType(e);
    },
    onPaste: function(e) {
      // console.log('CCInput -> onPaste');
      this.reFormatNumeric(e);
      this.reFormatCardNumber(e);
    },
    onChange: function(event) {
      console.log('CCInput -> onChange');
      // console.log(event);

      // this.setState({value: event.target.value});
    },
    onInput: function(e) {
      console.log('CCInput -> onInput');
      this.reFormatNumeric(e);
      this.reFormatCardNumber(e);
      this.setCardType(e);
    },
    render: function() {
      var value = this.state.value,
      cardType = this.state.cardType;

      return (
        <div>
        <input className="cc-number" ref="ccInput" type="tel" value={value} placeholder="•••• •••• •••• ••••"
          autoComplete="cc-number"
          onKeyPress={this.onKeyPress}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
          onPaste={this.onPaste}
          onChange={this.onChange}
          onInput={this.onInput} /> {cardType}
        </div>
      );
    }
  });

  module.exports = CCNumberInput;
