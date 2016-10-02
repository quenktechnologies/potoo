# criteria-pattern-core

Library classes for the criteria-pattern package.

Provides the [Criterion](src/Criterion.js) class which can be extended to satisfy the
interface `criteria-pattern` expects and the [Failure](src/Failure.js) class
for indicating a value failed to satisfy the Criterion.

## Installation

`npm install --save criteria-pattern-core`

## Usage

```javascript

import {Criterion, Failure} from 'criteria-pattern-core'

 class MyCriterion extends Criterion {

   call(value) {

   return (value)? value : new Failure('Value is required!', {value:value});

   }

 }

```
