/*
 * main.js
 * Configure requireJs to load all application dependencies
 */


require.config({

  //create aliases for library components
  paths: {
    'domReady'        : '../components/requirejs-domready/domReady',
    'angular'         : '../components/angular/angular',
    'ui-router'       : '../components/angular-ui-router/release/angular-ui-router',
    'jquery'          : '../components/jquery/dist/jquery'
  },

  //Place angular in a shim
  shim: {
    'jquery': {
      exports: 'angular'
    },
    'angular': {
       exports: 'angular'
    },
    'ui-router' : {
     deps: ['angular']
    },
  },

  //Kickstart application
  deps: ['./bootstrap']

});
