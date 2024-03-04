# is-today [![Build Status](https://travis-ci.org/rsystem-se/is-today.svg?branch=master)](https://travis-ci.org/rsystem-se/is-today)

> Check if a date is today with optional conversion to date and time travel.


## Install

```
$ npm install --save is-today
```


## Usage

```js
var isToday = require('is-today');

isToday(new Date());
//=> true

isToday('2015-08-19', {convert: true});
//=> true

isToday('1997-01-11', {convert: true, scope: new Date('1997-01-01')});
//=> true
```


## API

### isToday(date, [options])

#### date

*Required*  
Type: `Date`

#### options

Type: `object`
Default: `{}`

#### keys on options

Type: `convert`
Default: `boolean`

if true convert first parameter into a date object

Type: `scope`
Default: `new Date()`

i can hack you back in time...


## License

MIT © [Ulrik Augustsson](http://google.com)
