/**
 * UserContextManager.test
 * Test suite for PServices.UserContextManager
 */

describe('UserContextManager', function() {

  var UserContextManager, logger, localStorageService, UserContextApiClient, mockApiResponse, $q, $httpBackend, $rootScope;

  beforeEach(function() {

    angular.mock.module('PServices');
    angular.mock.module('LocalStorageModule');

    inject(function($injector) {

      //Service being tested in suite
      UserContextManager = $injector.get('UserContextManager');

      //Service dependencies
      logger = $injector.get('logger');
      localStorageService = $injector.get('localStorageService');
      UserContextApiClient = $injector.get('UserContextApiClient');

      //Test Dependencies
      $q = $injector.get('$q');
      $httpBackend = $injector.get('$httpBackend');
      $rootScope = $injector.get('$rootScope');

      spyOn(logger, 'debug').and.callThrough();
      spyOn(logger, 'error').and.callThrough();

      spyOn(localStorageService, 'set').and.stub();
      spyOn(localStorageService, 'clearAll').and.stub();

    });

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

    it('should accept a valid username and password, retrieve a remote user context if args are valid, and save it in local storage',
      function() {
        spyOn(UserContextApiClient, 'create').and.callFake(function() {
          var defer = $q.defer();
          defer.resolve(mockApiResponse.success);
          return defer.promise;
        });
        var user = {name: 'ddluc', password: 'hello'};
        var returnedPromise = UserContextManager.createNewUserContext(user.name, user.password);
        spyOn(returnedPromise, 'then').and.callThrough();
        $rootScope.$apply(function() {
            returnedPromise.then(function(userContext) {
              expect(userContext.token).toEqual('456');
              expect(userContext.userId).toEqual('123');
              expect(localStorageService.set).toHaveBeenCalledWith('token', userContext.token);
              expect(localStorageService.set).toHaveBeenCalledWith('userId', userContext.userId);
            });
        });
        expect(returnedPromise.then).toHaveBeenCalled();
      }
    );

    it('should accept an invalid username and password, attempt to retrieve a remote user context, and handle error',
      function() {
        spyOn(UserContextApiClient, 'create').and.callFake(function() {
          var defer = $q.defer();
          defer.reject(mockApiResponse.error);
          return defer.promise;
        });
        var user = {name: 'invalid', password: 'invalid'};
        var returnedPromise = UserContextManager.createNewUserContext(user.name, user.password);
        spyOn(returnedPromise, 'catch').and.callThrough();
        $rootScope.$apply(function() {
            returnedPromise.catch(function(error) {
              expect(error).toBeDefined();
              expect(logger.error).toHaveBeenCalled();
              expect(localStorageService.set.calls.count()).toEqual(0);
            });
        });
        expect(returnedPromise.catch).toHaveBeenCalled();
    });

  });


  describe('destroyActiveUserContext', function() {

    var mockApiResponse = {
      success: {
        status: 'OK',
        result: {}
      },
      error: {
        status: 'ERROR',
        result: "Please log in and try again"
      },
    };

    it('should destroy the local user context from local storage, and then destroy the remote user context',
      function() {
        spyOn(UserContextApiClient, 'destroy').and.callFake(function() {
          var defer = $q.defer();
          defer.resolve(mockApiResponse.success);
          return defer.promise;
        });
        spyOn(localStorageService, 'get').and.returnValue('123');
        var returnedPromise = UserContextManager.destroyActiveUserContext();
        spyOn(returnedPromise, 'then').and.callThrough();
        $rootScope.$apply(function() {
          returnedPromise.then(function() {
            expect(localStorageService.clearAll).toHaveBeenCalled();
          });
        });
        expect(returnedPromise.then).toHaveBeenCalled();
      }
    );

    it('should destroy the local user context from local storage, even if the remote user context could not be deleted',
      function() {
        spyOn(UserContextApiClient, 'destroy').and.callFake(function() {
          var defer = $q.defer();
          defer.reject(mockApiResponse.error);
          return defer.promise;
        });
        spyOn(localStorageService, 'get').and.returnValue('123');
        var returnedPromise = UserContextManager.destroyActiveUserContext();
        spyOn(returnedPromise, 'then').and.callThrough();
        $rootScope.$apply(function() {
          returnedPromise.catch(function(error) {
            expect(error).toBeDefined();
            expect(localStorageService.clearAll).toHaveBeenCalled();
          });
        });
        expect(returnedPromise.then).toHaveBeenCalled();
      }
    );

    it('should do nothing if the user context is not defined',
      function() {
        spyOn(UserContextApiClient, 'destroy').and.stub();
        spyOn(localStorageService, 'get').and.returnValue(undefined);
        var returnedPromise = UserContextManager.destroyActiveUserContext();
        spyOn(returnedPromise, 'catch').and.callThrough();
        $rootScope.$apply(function() {
          returnedPromise.catch(function(error) {
              expect(UserContextApiClient.destroy).not.toHaveBeenCalled();
              expect(error).toBeDefined();
          });
        });
        expect(returnedPromise.catch).toHaveBeenCalled();
      }
    );

  });


  describe('getActiveUserContext', function() {

    it('should return the active user context if it is saved in local storage', function() {
      spyOn(localStorageService, 'get').and.returnValue('123');
      var userContext = UserContextManager.getActiveUserContext();
      expect(userContext.token).toEqual('123');
      expect(userContext.userId).toEqual('123');
    });

    it('should return undefined if there is no active user context saved in local storage', function() {
      spyOn(localStorageService, 'get').and.returnValue(undefined);
      var userContext = UserContextManager.getActiveUserContext();
      expect(userContext).not.toBeDefined();
    });

  })

});
