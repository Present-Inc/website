/**
 * VideoModel.test.js
 */

describe('VideoModel', function() {

	var VideoModel;

	jasmine.getJSONFixtures().fixturesPath = '/base/test/fixtures';

	beforeEach(function() {

		angular.mock.module('PresentWebApp');

		inject(function($injector) {

			//Service being tested
			VideoModel = $injector.get('VideoModel');


		});

	});

	describe('create', function() {

		var mockApiResponse = getJSONFixture('videos/list_brand_new_videos.success.json');

		it('should create a new video object', function() {

			for(var i=0; i < mockApiResponse.results.length; i++) {
				var Video = VideoModel.construct(mockApiResponse.results[i].object);
				expect(Video._id).toBeDefined();
				expect(Video.media.replayPlaylist).toBeDefined();
				expect(Video.creator.displayName).toBeDefined();
			}

		});

	});

});