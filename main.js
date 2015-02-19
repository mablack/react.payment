var React = require('react');
var EventEmitter = require('events').EventEmitter;

var cards = require('./cards');
var Util = require('./Util');

console.log(Util);

window.React = React;

var emitter = new EventEmitter();
var utils = new Util();

var CCNumberInput = require('./CCNumberInput');
var CCVInput = require('./CCVInput');
var CCExpiryInput = require('./CCExpiryInput');

var TestApplication = React.createClass({
  render: function() {
    return <div>
      <CCNumberInput />
      <CCExpiryInput />
      <CCVInput />
    </div>;
  }
});


React.initializeTouchEvents(true);

  React.render(
    <TestApplication />,
    document.getElementById('container')
  );
