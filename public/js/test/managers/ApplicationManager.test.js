/**
 * ApplicationManager.js
 * Test Suite for the Application Manager
 */

	describe('ApplicationManager', function() {

		var ApplicationManager,
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
				ApplicationManager = $injector.get('ApplicationManager');

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
				toState = {metaData: {requireSession: true}};
			});

			it('should not authorize the user to access the private state if the user context is undefined', function() {
				spyOn(UserContextManager, 'getActiveUserContext').and.returnValue(undefined);
				ApplicationManager.authorize(event, toState);
				expect($state.go).toHaveBeenCalledWith('login');
			});

			it('should authorize the user to access the private state if there is a valid user context', function() {
				spyOn(UserContextManager, 'getActiveUserContext').and.returnValue({token: '456', userId: '123'});
				ApplicationManager.authorize(event, toState);
				expect($state.go).not.toHaveBeenCalled();
			});

		});

		describe('login', function() {

			var username, password;

			beforeEach(function() {
				spyOn(UserContextManager, 'createNewUserContext').and.callFake(function() {
					var defer = $q.defer();
					defer.resolve({token:'456', user:'123', profile:{username:'ddluc32'}});
					return defer.promise;
				});
				spyOn($state, 'go');
				username = 'ddluc32';
				password = 'hello';
			});

			it('should log the user in if the username and password are correct', function() {
				$rootScope.$apply(function() {
					ApplicationManager.login(username, password);
				});
				expect(ApplicationManager.user.active.username).toEqual('ddluc32');
				expect($state.go).toHaveBeenCalledWith('home');
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


			it('should the the user out', function() {
				$rootScope.$apply(function() {
					ApplicationManager.logout();
				});
				expect($state.go).toHaveBeenCalledWith('splash');
			});

		});


	});