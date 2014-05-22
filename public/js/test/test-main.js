/*
 * main.js
 * Configure requireJs to load all application dependencies
 */

var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/Spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

console.log('Loading tests....');
console.log(tests);


require.config({

  baseUrl: '/base',

  //create aliases for library components
  paths: {
    'angular': 'public/lib/angular/angular.js',
  },

  shim : {
    'angular' : {
      exports: 'angular'
    }
  },

  //Kickstart application
  deps: tests

});
