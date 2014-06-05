/**
 * UserContextManager.test
 * Test suite for PManagers.UserContextManager
 */

describe('UserContextManager', function() {

  var UserContextManager, logger, localStorageService, UserContextApiClient,  ProfileConstructor, $q, $httpBackend, $rootScope;
	jasmine.getJSONFixtures().fixturesPath = '/base/test/fixtures/';

  beforeEach(function() {

    angular.mock.module('PresentWebApp');

    inject(function($injector) {

      //Service being tested in suite
      UserContextManager = $injector.get('UserContextManager');

      //Service dependencies
      logger = $injector.get('logger');
      localStorageService = $injector.get('localStorageService');
      UserContextApiClient = $injector.get('UserContextApiClient');
			ProfileConstructor = $injector.get('ProfileConstructor');

      //Test dependencies
      $q = $injector.get('$q');
      $httpBackend = $injector.get('$httpBackend');
      $rootScope = $injector.get('$rootScope');

      spyOn(logger, 'debug').and.stub();
      spyOn(logger, 'error').and.stub();

      spyOn(localStorageService, 'set').and.stub();
      spyOn(localStorageService, 'clearAll').and.stub();

    });

  });

  describe('createNewUserContext', function() {

		beforeEach(function() {
			spyOn(UserContextApiClient, 'create').and.callFake(function() {
				var defer = $q.defer();
				defer.resolve(getJSONFixture('userContexts/create.success.json'));
				return defer.promise;
			});
		});

    it('should accept a valid username and password, retrieve a remote user context, save it in local storage and return the user context',
      function() {
        var user = {name: 'ddluc32', password: 'hello'};
        var returnedPromise = UserContextManager.createNewUserContext(user.name, user.password);
        spyOn(returnedPromise, 'then').and.callThrough();
        $rootScope.$apply(function() {
            returnedPromise.then(function(userContext) {
              expect(userContext.token).toEqual('fc7469fff6f82724640ebfa12cdcd80dc517fdb1cb0ec059f1d43a3847fe512f2d77733cf293dfd256f0bc46d225fba50e7f806b53c818256d7153ae5909a618');
              expect(userContext.userId).toEqual('53744bf4650762a97c8c94f2');
							expect(userContext.profile.username).toBeDefined('ddluc32');
              expect(localStorageService.set).toHaveBeenCalledWith('token', userContext.token);
              expect(localStorageService.set).toHaveBeenCalledWith('userId', userContext.userId);
            });
        });
        expect(returnedPromise.then).toHaveBeenCalled();
      }
    );

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
      }
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
