/**
 * UserContextApiClient.test
 * Test suite for PApiClient.UserContextApiClient
 */

 describe('UserContextApiClient', function() {

  var UserContextApi, $httpBackend, ApiConfig, logger;

  beforeEach(function() {

    angular.mock.module('PApiClient');
    angular.mock.module('PUtilities');

    inject(function($injector) {

    //Service being tested in suite
    UserContextApiClient = $injector.get('UserContextApiClient');

    //Service dependencies
    $httpBackend = $injector.get('$httpBackend');
    ApiConfig = $injector.get('ApiConfig');
    logger = $injector.get('logger');

    spyOn(logger, 'debug').and.stub();
    spyOn(logger, 'error').and.stub();

    });

  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('createNewUserContext', function() {

    var mockApiResponse = {
      success: {
        status: 'OK',
        result: {
          object: {
            _id: '123',
            sessionToken: '456',
            user: {
              object: {username: 'ddluc32'}
            }
          }
        }
      },
      error: {
        status: 'ERROR',
        result: "Please log in and try again"
      },
    };

    it('should send a request to user_contexts/create when provided a valid username and password',
        function() {
          $httpBackend.expectPOST('https://api.present.tv/v1/user_contexts/create')
            .respond(200, mockApiResponse.success);
          var user = {name: 'lucas', password: 'hello'}
          UserContextApiClient.create(user.name, user.password)
            .then(function(apiResponse){
              expect(apiResponse.result.object._id).toEqual('123');
              expect(apiResponse.result.object.sessionToken).toEqual('456');
              expect(apiResponse.result.object.user.object.username).toEqual('ddluc32');
              expect(logger.debug).toHaveBeenCalled();
          });
          $httpBackend.flush();
        }
    );

    it('should send a request to user_contexts/create, but handle error when username and password are invalid',
      function() {
        $httpBackend.expectPOST('https://api.present.tv/v1/user_contexts/create')
          .respond(500, mockApiResponse.error);
        var user = {name: '', password: ''};
        var returnedPromise = UserContextApiClient.create(user.name, user.password);
        returnedPromise.catch(function(apiResponse){
          expect(apiResponse.status).toBe('ERROR');
          expect(logger.error).toHaveBeenCalled();
        });
        $httpBackend.flush();
      }
    );

  });

  describe('destroyUserContext', function() {

    var mockApiResponse = {};

    beforeEach(function() {
      mockApiResponse = {
        success: {
          status: 'OK',
          result: {}
        },
        error: {
          status: 'ERROR',
          result: "Please log in and try again"
        },
      };

    });

    it('should send a request to user_contexts/destroy with the associated provided session token',
      function() {
          $httpBackend.expectPOST('https://api.present.tv/v1/user_contexts/destroy')
            .respond(200, mockApiResponse.success);
          var session = {userId: '123', token: '456'};
          UserContextApiClient.destroy(session)
            .then(function(apiResponse) {
              expect(apiResponse.status).toEqual('OK');
              expect(logger.debug).toHaveBeenCalled();
            });
            $httpBackend.flush();
      }
    );

    it('should send a request to user_contexts/destroy with the invalid provided session token and handle error response',
      function() {
        $httpBackend.expectPOST('https://api.present.tv/v1/user_contexts/destroy')
          .respond(500, mockApiResponse.error);
        var session = {userId: '000', token: '000'};
        UserContextApiClient.destroy(session)
          .then(function(apiResponse) {
            expect(apiResponse.status).toBe('ERROR');
            expect(logger.error).toHaveBeenCalled();
          });
        $httpBackend.flush();
      }
    );

    it('should not send a request if the provided session token is undefined',
      function() {
        UserContextApiClient.destroy()
          .catch(function(apiResponse) {
            expect(apiResponse.status).toBe('ERROR');
            expect(apiResponse.mock).toBe(true);
            expect(logger.error).toHaveBeenCalled();
          });
      }
    );

  });

 });
