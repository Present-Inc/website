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

		describe('Likes', function() {

			var mockVideoApiResponse = getJSONFixture('videos/list_brand_new_videos.success.json'),
					mockLikesApiResponse = getJSONFixture('likes/create.success.json'),
					VideoCell,
					originalLikeCount,
					UserContextManagerSpy,
					mockUserContext;

			beforeEach(function() {
				VideoCell = VideoCellModel
						.construct(mockVideoApiResponse.results[3].object, mockVideoApiResponse.results[3].subjectiveObjectMeta);
				originalLikeCount = VideoCell.video.counts.likes;
				UserContextManagerSpy = spyOn(UserContextManager, 'getActiveUserContext');
				mockUserContext = {token : '456', userId: '123', profile: {_id:'123', username: 'ddluc32'}};
				spyOn($state, 'go').and.stub();
				spyOn(LikesApiClient, 'create').and.callFake(function() {
						var defer = $q.defer();
						defer.resolve(mockLikesApiResponse);
						return defer.promise;
				});
				spyOn(LikesApiClient, 'destroy').and.callFake(function() {
					var defer = $q.defer();
					defer.resolve();
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
				UserContextManagerSpy.and.returnValue(mockUserContext);
				VideoCell.subjectiveMeta.like.forward = true;
				VideoCell.likes[0].sourceUser._id = '123';
				$rootScope.$apply(VideoCell.toggleLike());
				expect(VideoCell.video.counts.likes).toBeLessThan(originalLikeCount);
				expect(VideoCell.subjectiveMeta.like.forward).toBe(false);
				expect(VideoCell.likes.length).toEqual(VideoCell.video.counts.likes);
			});

		});



		describe('Comments', function() {

			var mockVideoApiResponse = getJSONFixture('videos/list_brand_new_videos.success.json'),
					mockCommentsApiResponse = getJSONFixture('likes/create.success.json'),
					VideoCell,
					originalCommentCount,
					mockComment,
				  mockUserContext,
					UserContextManagerSpy;

			beforeEach(function() {
				VideoCell = VideoCellModel
					.construct(mockVideoApiResponse.results[7].object, mockVideoApiResponse.results[7].subjectiveObjectMeta);
				originalCommentCount = VideoCell.comments.length;

				UserContextManagerSpy = spyOn(UserContextManager, 'getActiveUserContext');
				mockComment = {id: '234', body : 'this is a new comment'};
				mockUserContext = {token : '456', userId: '123', profile: {_id:'123', username: 'ddluc32'}};
				spyOn($state, 'go').and.stub();
				spyOn(CommentsApiClient, 'create').and.callFake(function() {
					var defer = $q.defer();
					defer.resolve(mockCommentsApiResponse);
					return defer.promise;
				});
				spyOn(CommentsApiClient, 'destroy').and.callFake(function() {
					var defer = $q.defer();
					defer.resolve();
					return defer.promise;
				});
			});

			it('should redirect the user if there is an invalid context', function() {
				UserContextManagerSpy.and.returnValue(null);
				VideoCell.addComment();
				expect($state.go).toHaveBeenCalled();
			});

			it('should add a new comment to the video cell', function() {
				UserContextManagerSpy.and.returnValue(mockUserContext);
				$rootScope.$apply(VideoCell.addComment(mockComment.body));
				expect(VideoCell.video.counts.comments).toBeGreaterThan(originalCommentCount);
				expect(VideoCell.comments.length).toBeGreaterThan(originalCommentCount);
				expect(VideoCell.input.comment).toBeFalsy();
			});

			it('should remove a comment from the video cell', function() {
				UserContextManagerSpy.and.returnValue(mockUserContext);
				$rootScope.$apply(VideoCell.removeComment(mockComment));
				expect(VideoCell.video.counts.comments).toBeLessThan(originalCommentCount);
				expect(VideoCell.comments.length).toEqual(originalCommentCount);
			});


		});

	});