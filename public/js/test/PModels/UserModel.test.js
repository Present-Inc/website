/**
 * UserModel.test.js
 */

	describe('UserModel', function() {

		var UserModel,
			  UserContextManager,
			  ApiManager,
			  logger,
				$state,
			  $q,
			  $rootScope,
			  $httpBackend;

		jasmine.getJSONFixtures().fixturesPath = '/base/test/fixtures';

		beforeEach(function() {

			angular.mock.module('PresentWebApp');

			inject(function($injector) {

				//Service being tested
				UserModel = $injector.get('UserModel');

				//Service dependencies
				UserContextManager = $injector.get('UserContextManager');
				ApiManager = $injector.get('ApiManager');
				logger = $injector.get('logger');
				$state = $injector.get('$state');

				//Test dependencies
				$q = $injector.get('$q');
				$rootScope = $injector.get('$rootScope');
				$httpBackend = $injector.get('$httpBackend');

				$httpBackend.expectGET('views/splash').respond();

			});

		});


		describe('demand', function() {

			var mockUserApiResponse = getJSONFixture('users/show.success.json'),
					User,
					UserContextManagerSpy,
					mockUserContext;


			beforeEach(function() {
				User = UserModel
										.construct(mockUserApiResponse.result.object, mockUserApiResponse.result.subjectiveObjectMeta);
				UserContextManagerSpy = spyOn(UserContextManager, 'getActiveUserContext');
				mockUserContext = {token: '456', userId: '123', profile: {username: 'testuser'}};
				spyOn($state, 'go').and.stub();
				spyOn(ApiManager, 'demands').and.callFake(function() {
					return {status: 'OK'}
				});
			});

			it('should redirect the user if there is no active user context', function() {
				UserContextManagerSpy.and.returnValue(null);
				User.demand();
				expect($state.go).toHaveBeenCalled();
			});

			it('should demand the selected user', function() {
				UserContextManagerSpy.and.returnValue(mockUserContext);
				User.subjectiveMeta.demand.forward = false;
				User.demand();
				expect(User.subjectiveMeta.demand.forward).toBe(true);
				expect(ApiManager.demands).toHaveBeenCalled();
			});

		});

		describe('follow', function() {

			var mockUserApiResponse = getJSONFixture('users/show.success.json'),
					User,
					UserContextManagerSpy,
					mockUserContext;

			beforeEach(function() {
				User = UserModel
					.construct(mockUserApiResponse.result.object, mockUserApiResponse.result.subjectiveObjectMeta);
				UserContextManagerSpy = spyOn(UserContextManager, 'getActiveUserContext');
				mockUserContext = {token: '456', userId: '123', profile: {username: 'testuser'}};
				spyOn($state, 'go').and.stub();
				spyOn(ApiManager, 'friendships').and.callFake(function() {
					return {status: 'OK'}
				});
			});

			it('should redirect the user if there is no active user context', function() {
				UserContextManagerSpy.and.returnValue(null);
				User.follow();
				expect($state.go).toHaveBeenCalled();
			});

			it('should follow the user if the active user has no forward friendship relationship with the selected user',
				function() {
					UserContextManagerSpy.and.returnValue(mockUserContext);
					User.subjectiveMeta.friendship.forward = false;
					User.follow();
					expect(User.subjectiveMeta.friendship.forward).toBe(true);
					expect(ApiManager.friendships).toHaveBeenCalled();
				}
			);

			it('should unfollow the user if the active user has a forward friendship relationship with the selected user',
				function(){
					UserContextManagerSpy.and.returnValue(mockUserContext);
					User.subjectiveMeta.friendship.forward = true;
					User.follow();
					expect(User.subjectiveMeta.friendship.forward).toBe(false);
					expect(ApiManager.friendships).toHaveBeenCalled();
				}
			);

		});

		describe('update', function() {

			it('should update the active user', function() {


			});

		});

	});
