/**
 * CommentModel.test.js
 */

describe('CommentModel', function() {

	var CommentModel;

	jasmine.getJSONFixtures().fixturesPath = '/base/test/fixtures';

	beforeEach(function() {

		angular.mock.module('PresentWebApp');

		inject(function($injector) {

			//Service being tested
			CommentModel = $injector.get('CommentModel');

		});

	});

	describe('create', function() {

		var mockApiResponse = getJSONFixture('comments/list_video_comments.success.json');

		it('should create a new comment object', function() {

			for(var i=0; i < mockApiResponse.results.length; i++) {
				var Comment = CommentModel.construct(mockApiResponse.results[i].object);
				expect(Comment._id).toBeDefined();
				expect(Comment.body).toBeDefined();
				expect(Comment.sourceUser.username).toBeDefined();
			}

		});

	});

});