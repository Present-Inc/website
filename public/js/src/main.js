/*
 * main.js
 * Configure requireJs to load all application dependencies
 */


require.config({

  //create aliases for library components
  paths: {
    'domReady'        : '../lib/requirejs-domready/domReady',
    'angular'         : '../lib/angular/angular',
    'ui-router'       : '../lib/angular-ui-router/release/angular-ui-router',
    'local-storage'   : '../lib/angular-local-storage/angular-local-storage',
    'jquery'          : '../lib/jquery/dist/jquery'
  },

  //Place angular in a shim
  shim: {
    'jquery': {
      exports: 'jquery'
    },
    'angular': {
       exports: 'angular'
    },
    'local-storage' : {
      deps: ['angular']
    },
    'ui-router' : {
     deps: ['angular']
    },
  },

  //Kickstart application
  deps: ['./bootstrap']

});
