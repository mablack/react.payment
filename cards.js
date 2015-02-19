var defaultFormat = /(\d{1,4})/g;

var cards = [
// # Debit cards must come first, since they have more
// # specific patterns than their credit-card equivalents.
{
  type: 'visaelectron',
  pattern: /^4(026|17500|405|508|844|91[37])/,
  format: defaultFormat,
  length: [16],
  cvcLength: [3],
  luhn: true
},
{
  type: 'maestro',
  pattern: /^(5(018|0[23]|[68])|6(39|7))/,
  format: defaultFormat,
  length: [12, 13, 14, 15, 16, 17, 18, 19],
  cvcLength: [3],
  luhn: true
},
{
  type: 'forbrugsforeningen',
  pattern: /^600/,
  format: defaultFormat,
  length: [16],
  cvcLength: [3],
  luhn: true
},
{
  type: 'dankort',
  pattern: /^5019/,
  format: defaultFormat,
  length: [16],
  cvcLength: [3],
  luhn: true
},
// # Credit cards
{
  type: 'visa',
  pattern: /^4/,
  format: defaultFormat,
  length: [13, 16],
  cvcLength: [3],
  luhn: true
},
{
  type: 'mastercard',
  pattern: /^5[0-5]/,
  format: defaultFormat,
  length: [16],
  cvcLength: [3],
  luhn: true
},
{
  type: 'amex',
  pattern: /^3[47]/,
  format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
  length: [15],
  cvcLength: [3, 4],
  luhn: true
},
{
  type: 'dinersclub',
  pattern: /^3[0689]/,
  format: defaultFormat,
  length: [14],
  cvcLength: [3],
  luhn: true
},
{
  type: 'discover',
  pattern: /^6([045]|22)/,
  format: defaultFormat,
  length: [16],
  cvcLength: [3],
  luhn: true
},
{
  type: 'unionpay',
  pattern: /^(62|88)/,
  format: defaultFormat,
  length: [16, 17, 18, 19],
  cvcLength: [3],
  luhn: false
},
{
  type: 'jcb',
  pattern: /^35/,
  format: defaultFormat,
  length: [16],
  cvcLength: [3],
  luhn: true
}
];

module.exports = cards;
