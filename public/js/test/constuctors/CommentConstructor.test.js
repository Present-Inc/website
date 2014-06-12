/**
 * CommentConstructor.test.js
 */

describe('CommentConstructor', function() {

	var CommentConstructor;

	jasmine.getJSONFixtures().fixturesPath = '/base/test/fixtures';

	beforeEach(function() {

		angular.mock.module('PresentWebApp');

		inject(function($injector) {

			//Service being tested
			CommentConstructor = $injector.get('CommentConstructor');

		});

	});

	describe('create', function() {

		var mockApiResponse = getJSONFixture('comments/list_video_comments.success.json');

		it('should create a new comment object', function() {

			for(var i=0; i < mockApiResponse.results.length; i++) {
				var Comment = CommentConstructor.create(mockApiResponse.results[i].object);
				expect(Comment._id).toBeDefined();
				expect(Comment.body).toBeDefined();
				expect(Comment.sourceUser.username).toBeDefined();
			}

		});

	});

});