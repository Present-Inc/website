/**
 * Session.test.js
 * Test Suite for the Session Model
 */

	describe('Session', function() {

		var SessionModel,
			  UserContextManager,
				$state,
			  logger,
			  $q,
			  $rootScope,
				$httpBackend;

		jasmine.getJSONFixtures().fixturesPath = '/base/test/fixtures';

		beforeEach(function() {

			angular.mock.module('PresentWebApp');

			inject(function($injector) {

				//Service being tested
				SessionModel = $injector.get('SessionModel');




				//Service Dependencies
				UserContextManager = $injector.get('UserContextManager');
				$state = $injector.get('$state');
				logger = $injector.get('logger');


				//Test Dependencies
				$q = $injector.get('$q');
				$rootScope = $injector.get('$rootScope');
				$httpBackend = $injector.get('$httpBackend');

				spyOn(logger, 'debug').and.callThrough();
				spyOn(logger, 'error').and.callThrough();

				$httpBackend.expectGET('views/splash').respond({});

			});

		});

		describe('authorize', function() {

			var event, toState;

			beforeEach(function() {
				spyOn($state, 'go').and.stub();
				event = {
					preventDefault: jasmine.createSpy('preventDefault')
				};
				toState = {meta: {availability: 'private'}};
			});

			it('should deny the user access of the state if the user context is undefined', function() {
				spyOn(UserContextManager, 'getActiveUserContext').and.returnValue(null);
				SessionModel.authorize(event, toState);
				expect($state.go).toHaveBeenCalledWith('account.login');
			});

			it('should authorize the user to access the private state if there is a valid user context', function() {
				spyOn(UserContextManager, 'getActiveUserContext').and.returnValue(true);
				SessionModel.authorize(event, toState);
				expect($state.go).not.toHaveBeenCalled();
			});

		});

		describe('login', function() {

			var username, password;

			beforeEach(function() {
				var mockApiResponse = getJSONFixture('userContexts/create.success.json');
				spyOn(UserContextManager, 'createNewUserContext').and.callFake(function() {
					var defer = $q.defer();
					defer.resolve({token:'456', user:'123', profile: mockApiResponse.result.object.user.object});
					return defer.promise;
				});
				spyOn($state, 'go');
				username = 'ddluc32';
				password = 'hello';
			});

			it('should log the user in when the provided a valid username and password', function() {
				$rootScope.$apply(function() {
					SessionModel.login(username, password);
				});
				expect($state.go).toHaveBeenCalledWith('home.default');
			});

		});

		describe('logout', function() {

			beforeEach(function() {
				spyOn(UserContextManager, 'destroyActiveUserContext').and.callFake(function() {
					var defer = $q.defer();
					defer.resolve();
					return defer.promise;
				});
				spyOn($state, 'go');
			});

			it('should the the user out and change the state to splash', function() {
				$rootScope.$apply(function() {
					SessionModel.logout();
				});
				expect($state.go).toHaveBeenCalledWith('splash');
			});

		});


	});