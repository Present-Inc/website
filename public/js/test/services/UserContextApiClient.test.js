/**
 * UserContextApiClient.test
 * Test suite for PServices.UserContextApiClient
 */

 describe('UserContextApiClient', function() {

  var $httpBackend, UserContextApiClient;

  beforeEach(function() {

   angular.mock.module('PServices');

   inject(function($injector) {

     $httpBackend = $injector.get('$httpBackend');
     UserContextApiClient = $injector.get('UserContextApiClient');

     $httpBackend.when('POST', 'https://api.present.tv/v1/user_contexts/create')
       .respond({userId: '12345', sessionToken: '67890'});

   });

  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
  });

  afterEach(function() {
  });

  describe('createNewUserContext', function() {

    it('should create a new user context when provided a valid username and password',
        function() {
            var returnedPromise = UserContextApiClient.createNewUserContext();
            returnedPromise.then(function(apiResponse){
              console.log(apiResponse);
              expect(apiResponse).toBeDefined();
            });
            $httpBackend.flush();
        }
    );

  });

 });
