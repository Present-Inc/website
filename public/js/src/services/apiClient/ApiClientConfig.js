/**
* PServices.ApiClientConfig
* Provides configuration properties and methods to the ApiClient
*/

  PServices.factory('ApiConfig', [function(){
   return {
     getAddress : function() {
       return 'https://api.present.tv'
     },
     getVideoQueryLimit: function() {
       return 5;
     }
   }
  }]);
