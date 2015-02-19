var Util = function Util() {
};

Util.prototype.reFormatNumeric = function reFormatNumeric(e) {
  var value = e.target.value;
  return value.replace(/\D/g, '');
};


Util.prototype.restrictNumeric = function restrictNumeric(e) {
  console.log('restrictNumeric');
  console.log(this);
  // console.log(e.target.value);

  // # Key event is for a browser shortcut
  if(e.metaKey || e.ctrlKey) return true;

  // # If keycode is a space
  if(e.which == 32) return true;

  // # If keycode is a special char (WebKit)
  if(e.which == 0) return true;

  // # If char is a special char (Firefox)
  if(e.which < 33) return true;

  var input = String.fromCharCode(e.which);

  // # Char is a number or a space
  if(!/[\d\s]/.test(input)) {
    e.preventDefault();
    return false;
  }

  return true;
};

Util.prototype.hasTextSelected = function hasTextSelected(target) {
  console.log('hasTextSelected', (target.selectionStart != null &&
  target.selectionStart != target.selectionEnd));

  console.log('target.selectionStart != null', target.selectionStart != null);
  console.log('target.selectionEnd', target.selectionEnd);
  console.log('target.selectionStart != target.selectionEnd', target.selectionStart != target.selectionEnd);

  // # If some text is selected
  return (target.selectionStart != null &&
    target.selectionStart != target.selectionEnd);

    // # If some text is selected in IE
    // if document?.selection?.createRange?
    // return true if document.selection.createRange().text

    // return false;
};

module.exports = Util;
