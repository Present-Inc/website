/*
 * ApiClientConfig.js
 * Defines RequireJS module for the Present Video Api Client Configuration
 */

define(['../module'], function(PApiClient){

   /* PServices.ApiClientConfig
    * Provides configuration properties and methods to the ApiClient
    */

   PApiClient.factory('ApiConfig', [function(){
     return {
       getAddress : function() {
         return 'https://api.present.tv'
       },
       getVideoQueryLimit: function() {
         return 5;
       }
     }
   }]);

});
