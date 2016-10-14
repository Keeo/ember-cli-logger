# Ember-cli-logger

Ember addon that will report boot time, transition times and errors to your api.
You will have to create this api yourself as this addon provides only client part and example schema.
For more info look into `logger.js` and `reporter.js` services inside addon folder.

## Installation

`ember install ember-cli-logger`

## Configuration
Configuration is done through `environment.js` file.
```js
ENV.logger: {
  isReportingEnabled: false,
  isErrorHookEnabled: false,
  isConsoleEnabled: false,
  endpoint: null,
  server: 'development',
},
```

### isReportingEnabled
When enabled addon will report events to your api.

### isErrorHookEnabled
When enabled addon will overwrite default event hook.

### isConsoleEnabled
When enabled addon will log all events to console too.

### endpoint
Place to send events (for example: `https://example/reporter`).

### server
Your identification to know where the event come from.

## Build configuration
This addon also modifies build pipeline to inject timer into index.html and polyfill. You can toggle these with flags in `ember-cli-build.js`.

```
new EmberApp(defaults, {
  measureBootTime: false,
  isPerformancePolyfillEnabled: true,
});
```

### measureBootTime
If disabled `index.html` file wont be affected in any way note that performance polyfill wont be also included.

### isPerformancePolyfillEnabled
If enabled [polyfill](https://polyfill.io/v2/polyfill.min.js?features=performance.now) for performance.now is included.

## Events
Every event contains `tick` and `instance` property.
 - tick - used to number events one by one.
 - instance - each application gets random instance number so you can track application flow.

### Boot `/boot POST`
After boot is completed event is created and reported(if enabled).
#### Payload
 - start - time of performance.now() executed from index.html
 - ready - time of performance.now() executed [application ready hook](http://emberjs.com/api/classes/Ember.Application.html#event_ready)
 - finish - time of performance.now() executed from first didTransition hook
 - browser - navigator.userAgent
 - server - value specified from config

### Transition `/transition POST`
Each transition is logged and measured.
#### Payload
 - time - delta time between willTransition and didTransition hooks
 - name - name of the route
 - params - parameters for route

### Error `/error POST`
When `isErrorHookEnabled` errors are reported as well.
#### Payload
 - message - message of the error
 - stack - stack trace (although not very useful)

## Logging of custom events
You can log custom events via `logger` service: ```Logger.log(severity, message, time)```

```js
import Ember from 'ember';
const {computed, inject: {service}, K} = Ember;

Ember.Controller.extend({
  logger: service(),

  filteredModel: computed('model', {
    get() {
      const start = performance.now();
      const filteredModel = model.filter(K);
      this.get('logger').log('info', 'Delta time to filter model', performance.now() - start);
      return filteredModel;
    }
  });
});
```

## Example of sql database
Sql tables may look like this.
```sql
CREATE TABLE `boot` (
  `instance` int(11) NOT NULL,
  `tick` int(11) NOT NULL,
  `server` varchar(255) NOT NULL,
  `start` float NOT NULL,
  `ready` float NOT NULL,
  `finish` float NOT NULL,
  `browser` varchar(255) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `error` (
  `instance` int(11) NOT NULL,
  `tick` int(11) NOT NULL,
  `message` text NOT NULL,
  `stack` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `transition` (
  `instance` int(11) NOT NULL,
  `tick` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `time` float NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `params` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `log` (
  `instance` int(11) NOT NULL,
  `tick` int(11) NOT NULL,
  `message` text NOT NULL,
  `severity` varchar(255) NOT NULL,
  `time` float NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `boot` ADD PRIMARY KEY (`instance`);
ALTER TABLE `error` ADD PRIMARY KEY (`tick`,`instance`);
ALTER TABLE `transition` ADD PRIMARY KEY (`tick`,`instance`);
ALTER TABLE `log` ADD PRIMARY KEY (`tick`,`instance`);
```
