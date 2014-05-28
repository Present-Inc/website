/**
 * UsersApiClient.test
 * Test suite for PServices.UsersApiClient
 */

 describe('UsersApiClient', function() {
    var UsersApiClient, $httpBackend, ApiConfig, logger;
    jasmine.getJSONFixtures().fixturesPath = '/base/test/fixtures/users';

    beforeEach(function() {

      angular.mock.module('PServices');

      inject(function($injector) {

        //Services being tested in the suite
        UsersApiClient = $injector.get('UsersApiClient');

        //Service depenencies
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

    describe('show', function() {

      var userContext = {token: '456', userId: '123'};
      var user = {name: 'ddluc32', id: '123'}
      var mockApiResponse = {
        success: getJSONFixture('show.success.json'),
        errror:   getJSONFixture('show.error.json')
      }

      it('should send a request to users/show when provided a valid username and user context',
        function() {
          $httpBackend.expectGET('https://api.present.tv/v1/users/show?username=ddluc32').respond(mockApiResponse.success);
          UsersApiClient.show(user.name, userContext)
            .then(function(apiResponse) {
              expect(apiResponse.status).toEqual('OK');
              expect(apiResponse.result).toBeDefined();
            });
          $httpBackend.flush();
        }
      );

      it('should send a request to users/show when provided with a valid username, but no user context',
        function() {
          $httpBackend.expectGET('https://api.present.tv/v1/users/show?username=ddluc32').respond(mockApiResponse.success);
          UsersApiClient.show(user.name)
            .then(function(apiResponse) {
              expect(apiResponse.status).toEqual('OK');
              expect(apiResponse.result).toBeDefined();
            });
          $httpBackend.flush();
        }
      );

      it('should not send a request if it is not provided any user', function() {
        UsersApiClient.show()
          .catch(function(apiResponse) {
            expect(apiResponse.status).toEqual('ERROR');
            expect(apiResponse.mock).toBe(true);
            expect(logger.error).toHaveBeenCalled();
          });
      });

      it('should send a request to user/show, and then handle any potential api error',
        function() {
          $httpBackend.expectGET('https://api.present.tv/v1/users/show?username=ddluc32').respond(mockApiResponse.error);
          UsersApiClient.show(user.name, userContext)
            .catch(function(apiResponse) {
              expect(apiResponse.status).toEqual('ERROR');
              expect(logger.error).toHaveBeenCalled();
            });
          $httpBackend.flush();
        }
      );

    });

    describe('showMe', function() {

      var userContext = {token: '456', userId: '123'};
      var mockApiResponse = {
        success :  getJSONFixture('show.success.json'),
        errror  :  getJSONFixture('show.error.json')
      }

     it('should send a request to user/show_me when provided with a valid user context',
        function() {
          $httpBackend.expectGET('https://api.present.tv/v1/users/show_me').respond(mockApiResponse.success);
          UsersApiClient.showMe(userContext)
            .then(function(apiResponse) {
              expect(apiResponse.status).toBe('OK');
              expect(apiResponse.result).toBeDefined();
            })
          $httpBackend.flush();
        }
      );

      it('should not send a request if no user context is provided',
        function() {
          UsersApiClient.showMe()
            .catch(function(apiResponse) {
              expect(apiResponse.mock).toBe(true);
              expect(logger.error).toHaveBeenCalled();
            });
        }
      );

      it('should send a request to user/show, then handle any potenial api error',
        function() {
          $httpBackend.expectGET('https://api.present.tv/v1/users/show_me').respond(mockApiResponse.error);
          UsersApiClient.showMe(userContext)
            .catch(function(apiResponse) {
              expect(apiResponse.status).toBe('ERROR');
              expect(logger.error).toHaveBeenCalled();
            });
          $httpBackend.flush();
        }
      );

    });

 });
