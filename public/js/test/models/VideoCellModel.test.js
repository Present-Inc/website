/**
 * VideoCellModel.test.js
 */

	describe('VideoCellModel', function() {

		var VideoCellModel,
				$state,
				UserContextManager,
				LikesApiClient,
				CommentsApiClient,
				$q,
				$rootScope,
				$httpBackend;

		jasmine.getJSONFixtures().fixturesPath = '/base/test/fixtures';

		beforeEach(function() {

			angular.mock.module('PresentWebApp');

			inject(function ($injector) {

				//Service Being Tested
				VideoCellModel = $injector.get('VideoCellModel');

				//Service Dependencies
				$state = $injector.get('$state');
				UserContextManager = $injector.get('UserContextManager');
				LikesApiClient = $injector.get('LikesApiClient');
				CommentsApiClient = $injector.get('CommentsApiClient');


				//Test Dependencies
				$q = $injector.get('$q');
				$rootScope = $injector.get('$rootScope');
				$httpBackend = $injector.get('$httpBackend');

				$httpBackend.expectGET('views/splash').respond({});

			});

		});

		describe('construct', function() {

			var mockApiResponse = getJSONFixture('videos/list_brand_new_videos.success.json');

			it('should create a new VideoCell Object', function() {
				for(var i= 0, length = mockApiResponse.results.length; i < length; i++) {
					var VideoCell = VideoCellModel
										.construct(mockApiResponse.results[i].object, mockApiResponse.results[i].subjectiveObjectMeta);
					expect(VideoCell.video).toBeDefined();
					expect(VideoCell.subjectiveMeta).toBeDefined();
				}
			});


		});

		describe('toggleLike', function() {

			var mockVideoApiResponse = getJSONFixture('videos/list_brand_new_videos.success.json'),
					mockLikesApiResponse = getJSONFixture('likes/create.success.json'),
					VideoCell,
					originalLikeCount,
					UserContextManagerSpy,
					mockUserContext;

			beforeEach(function() {
				VideoCell = VideoCellModel
						.construct(mockVideoApiResponse.results[0].object, mockVideoApiResponse.results[0].subjectiveObjectMeta);
				originalLikeCount = VideoCell.video.counts.likes;
				UserContextManagerSpy = spyOn(UserContextManager, 'getActiveUserContext');
				mockUserContext = {token : '456', userId: '123', profile: {_id:'123', username: 'ddluc32'}};
				spyOn($state, 'go').and.stub();
				spyOn(LikesApiClient, 'create').and.callFake(function() {
						var defer = $q.defer();
						defer.resolve(mockLikesApiResponse);
						return defer.promise;
				});
			});

			it('should redirect the user if there is no valid user context', function() {
					UserContextManagerSpy.and.returnValue(null);
					VideoCell.toggleLike();
					expect($state.go).toHaveBeenCalled();
			});

			it('should add a like if the user does not already like the video', function() {
				UserContextManagerSpy.and.returnValue(mockUserContext);
				VideoCell.subjectiveMeta.like.forward = false;
				$rootScope.$apply(VideoCell.toggleLike());
				expect(VideoCell.video.counts.likes).toBeGreaterThan(originalLikeCount);
				expect(VideoCell.subjectiveMeta.like.forward).toBe(true);
				expect(VideoCell.likes.length).toEqual(VideoCell.video.counts.likes);
			});

			it('should remove the like if the user does not already like the video', function() {

			});

		});



		describe('prototype.addComment', function() {

			beforeEach(function() {

			});

			it('should add a new comment to the video cell', function() {

			});


		});

	});