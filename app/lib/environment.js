import _ from 'lodash';
global._ = _;

// ddp-rate-limiter version 1.0.7 uses lodash contains which has been renamed
_.contains = _.includes;

import moment from 'moment';
import 'moment-timezone';
