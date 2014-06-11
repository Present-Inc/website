/**
 * NavbarManager.text.js
 * Test Suite for the Navbar Manager
 */

	describe('NavbarManager', function() {

		var Navbar,
				UserContextManager,
				VideosApiClient,
				UsersApiClient,
				VideoCellConstructor,
				logger,
				$state,
				$q,
				$httpBackend,
				$rootScope;

		jasmine.getJSONFixtures().fixturesPath = '/base/test/fixtures/';

		beforeEach(function() {

			angular.mock.module('PresentWebApp');

			inject(function($injector) {

				//Service Being Tested
				var NavbarConstructor = $injector.get('NavbarConstructor');
				Navbar = NavbarConstructor.create();

				//Service Dependencies
				UserContextManager = $injector.get('UserContextManager');
				VideosApiClient = $injector.get('VideosApiClient');
				UsersApiClient = $injector.get('UsersApiClient');
				VideoCellConstructor = $injector.get('VideoCellConstructor');
				logger = $injector.get('logger');
				$state = $injector.get('$state');

				//Test Dependencies
				$q = $injector.get('$q');
				$httpBackend = $injector.get('$httpBackend');
				$rootScope = $injector.get('$rootScope');

				spyOn(logger, 'debug').and.stub();
				spyOn(logger, 'error').and.stub();

				$httpBackend.expectGET('views/splash').respond({});

			});

		});


		describe('configure', function() {

			var toState;

			beforeEach(function() {
				toState = {metaData : {navbarEnabled : true}};
				spyOn(UserContextManager, 'getActiveUserContext').and.returnValue({token: '456', userId: '123'})
			});

			it('should enable the navigation when the toState has navigation enabled', function() {
				Navbar.configure(toState);
				expect(Navbar.isEnabled).toBe(true);
			});

			it('should set the mode.loggedIn to true when there is a valid user context', function() {
				Navbar.configure(toState);
				expect(Navbar.mode.loggedIn).toBe(true);
			})

		});


		describe('loadHub', function() {

			beforeEach(function() {
				spyOn(UserContextManager, 'getActiveUserContext').and.returnValue({token: '456', userId: '123'});
				spyOn(UsersApiClient, 'showMe').and.callFake(function() {
					var defer = $q.defer();
					defer.resolve(getJSONFixture('users/show.success.json'));
					return defer.promise;
				});
			});

			it('should load active users username and picture for the navbar hub', function() {
				$rootScope.$apply(function() {
					Navbar.loadHub();
				});
				expect(Navbar.hub.username).toEqual('ddluc32');
			});

		});

		describe('sendSearchQuery', function() {

			var searchQuery = 'ddl';

			beforeEach(function() {

				spyOn(UserContextManager, 'getActiveUserContext').and.returnValue({});

				spyOn(VideosApiClient, 'search').and.callFake(function() {
					var defer = $q.defer();
					defer.resolve(getJSONFixture('videos/search.success.json'));
					return defer.promise;
				});

				spyOn(UsersApiClient, 'search').and.callFake(function() {
					var defer = $q.defer();
					defer.resolve(getJSONFixture('users/search.success.json'));
					return defer.promise;
				});

			});


			it('should send the search query and update the searchResults', function() {
				var returnedPromise = Navbar.sendSearchQuery();
				spyOn(returnedPromise, 'then').and.callThrough();
				$rootScope.$apply(function() {
					returnedPromise.then(function() {
						expect(Navbar.search.results.videos[0].creator.username).toEqual('ddluc32');
						expect(Navbar.search.results.users[0].username).toEqual('ddluc32');
						expect(Navbar.search.results.users[0].profilePicture).toBeDefined();
					});
				});
				expect(returnedPromise.then).toHaveBeenCalled();
				expect(VideosApiClient.search).toHaveBeenCalled();
				expect(UsersApiClient.search).toHaveBeenCalled();
			});

		});

	});