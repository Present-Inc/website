/**
 * ProfileLoader.test
 * Test Suite for the Feed Loader
 */

 describe('FeedLoader', function() {

  var ProfileLoader,
      UsersApiClient,
      ProfileConstructor,
      UserContextManager,
      logger,
      $q,
      $rootScope;

  jasmine.getJSONFixtures().fixturesPath = '/base/test/fixtures/users';

  beforeEach(function() {

    angular.mock.module('PresentWebApp');

    inject(function($injector) {

      //Service being tested in the suite
      ProfileLoader = $injector.get('ProfileLoader');

      //Service dependencies
      logger = $injector.get('logger');
      UserContextManager = $injector.get('UserContextManager');
      UsersApiClient = $injector.get('UsersApiClient');
      ProfileConstructor = $injector.get('ProfileConstructor');

      //Test dependencies
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');

      spyOn(logger, 'debug').and.callThrough();
      spyOn(logger, 'error').and.callThrough();

      spyOn(ProfileConstructor, 'create').and.callThrough();

    });

  });

  describe('loadProfile', function() {

    var mockApiResponse = {
      success: getJSONFixture('show.success.json'),
      error: getJSONFixture('show.error.json')
    }
    var user = {name: 'ddluc32'};

    beforeEach(function() {
      spyOn(UserContextManager, 'getActiveUserContext').and.callFake(function() {
        return {token: '456', userId: '123'};
      });
    });

    it('should call the users api client with the provided username and construct a new profile',
      function() {
        spyOn(UsersApiClient, 'show').and.callFake(function() {
          var defer = $q.defer();
          defer.resolve(mockApiResponse.success);
          return defer.promise;
        });
        var returnedPromise = ProfileLoader.loadUserProfile(user.name);
        spyOn(returnedPromise, 'then').and.callThrough();
        $rootScope.$apply(function() {
          returnedPromise.then(function(Profile) {
            expect(Profile).toBeDefined();
          });
        });
        expect(returnedPromise.then).toHaveBeenCalled();
      }
    );

    it('should call the users api client, then handle a network error',
      function() {
        spyOn(UsersApiClient, 'show').and.callFake(function(){
          var defer = $q.defer();
          defer.reject(mockApiResponse.error);
          return defer.promise;
        });
        var returnedPromise = ProfileLoader.loadUserProfile(user.name);
        spyOn(returnedPromise, 'catch').and.callThrough();
        $rootScope.$apply(function() {
          returnedPromise.catch(function(error) {});
        });
        expect(returnedPromise.catch).toHaveBeenCalled();
      }
    );

  });

  describe('loadOwnProfile', function() {

    var mockApiResponse = {
      success: getJSONFixture('show.success.json'),
      error: getJSONFixture('show.error.json')
    };

    it('should call the users api client with the provided username and construct a new profile',
      function() {
        spyOn(UsersApiClient, 'showMe').and.callFake(function() {
          var defer = $q.defer();
          defer.resolve(mockApiResponse.success);
          return defer.promise;
        });
        spyOn(UserContextManager, 'getActiveUserContext').and.callFake(function() {
          return {token: '456', userId: '123'};
        });
        var returnedPromise = ProfileLoader.loadOwnProfile();
        spyOn(returnedPromise, 'then').and.callThrough();
        $rootScope.$apply(function() {
          returnedPromise.then(function(Profile) {
            expect(Profile).toBeDefined();
          });
        });
      }
    );

    it('shold not call the users api client if the user context is invalid',
      function() {
        spyOn(UsersApiClient, 'showMe');
        spyOn(UserContextManager, 'getActiveUserContext').and.callFake(function() {
          return false;
        });
        var returnedPromise = ProfileLoader.loadOwnProfile();
        expect(UsersApiClient.showMe).not.toHaveBeenCalled();
      }
    );

    it('should call the video api client and handle wither a network error, or an invalid user context error',
      function() {
        spyOn(UsersApiClient, 'showMe').and.callFake(function() {
          var defer = $q.defer();
          defer.reject();
          return defer.promise;
        });
        spyOn(UserContextManager, 'getActiveUserContext').and.callFake(function () {
          return {token: '456', userId: '123'};
        });
        var returnedPromise = ProfileLoader.loadOwnProfile();
        spyOn(returnedPromise, 'catch').and.callThrough();
        $rootScope.$apply(function() {
          returnedPromise.catch(function(){});
        });
        expect(returnedPromise.catch).toHaveBeenCalled();
      }
    );

  });


 });
