/**
 * UserContextManager.test
 * Test suite for PManagers.UserContextManager
 */

describe('UserContextManager', function() {

  var UserContextManager,
			logger,
			localStorageService,
			ApiManager,
			UserContextModel,
			$q,
			$httpBackend,
			$rootScope;

	jasmine.getJSONFixtures().fixturesPath = '/base/test/fixtures/';

  beforeEach(function() {

    angular.mock.module('PresentWebApp');

    inject(function($injector) {

      //Service being tested in suite
      UserContextManager = $injector.get('UserContextManager');

      //Service dependencies
      logger = $injector.get('logger');
      localStorageService = $injector.get('localStorageService');
      ApiManager = $injector.get('ApiManager');
			UserContextModel = $injector.get('UserContextModel');

      //Test dependencies
      $q = $injector.get('$q');
      $httpBackend = $injector.get('$httpBackend');
      $rootScope = $injector.get('$rootScope');

      spyOn(logger, 'debug').and.stub();
      spyOn(logger, 'error').and.stub();

      spyOn(localStorageService, 'set').and.stub();
      spyOn(localStorageService, 'clearAll').and.stub();


			var userContext = {token: '456', userId: '123', profile: {_id: '123', username:'ddluc32'}};
			spyOn(UserContextModel, 'construct').and.returnValue(userContext);
			spyOn(UserContextModel, 'create').and.returnValue(userContext);


    });

  });

  describe('createNewUserContext', function() {

		beforeEach(function() {
			spyOn(ApiManager, 'userContexts').and.callFake(function() {
				var defer = $q.defer();
				defer.resolve(getJSONFixture('userContexts/create.success.json'));
				return defer.promise;
			});
		});

    it('should create a new user context, save it in local storage, and return a new user context',
      function() {
        var user = {name: 'ddluc32', password: 'hello'};
        var returnedPromise = UserContextManager.createNewUserContext(user.name, user.password);
        spyOn(returnedPromise, 'then').and.callThrough();
        $rootScope.$apply(function() {
            returnedPromise.then(function(userContext) {
          		expect(UserContextModel.construct).toHaveBeenCalled();
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
        spyOn(ApiManager, 'userContexts').and.callFake(function() {
          var defer = $q.defer();
          defer.resolve(mockApiResponse.success);
          return defer.promise;
        });
				spyOn(localStorageService, 'get').and.returnValue(true);
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
        spyOn(ApiManager, 'userContexts').and.stub();
        spyOn(localStorageService, 'get').and.returnValue(false);
        var returnedPromise = UserContextManager.destroyActiveUserContext();
        spyOn(returnedPromise, 'catch').and.callThrough();
        $rootScope.$apply(function() {
          returnedPromise.catch(function(error) {
              expect(ApiManager.userContexts).not.toHaveBeenCalled();
              expect(error).toBeDefined();
          });
        });
        expect(returnedPromise.catch).toHaveBeenCalled();
      }
    );

  });


  describe('getActiveUserContext', function() {

    it('should return the active user context if it is saved in local storage', function() {
      spyOn(localStorageService, 'get').and.returnValue(true);
      var userContext = UserContextManager.getActiveUserContext();
      expect(userContext.token).toEqual('456');
      expect(userContext.userId).toEqual('123');
    });

    it('should return undefined if there is no active user context saved in local storage', function() {
      spyOn(localStorageService, 'get').and.returnValue(null);
      var userContext = UserContextManager.getActiveUserContext();
      expect(userContext).toBeFalsy();
    });

  })

});
