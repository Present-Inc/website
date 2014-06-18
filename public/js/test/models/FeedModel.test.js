/**
 * FeedModel.test.js
 * Test suite for the PModels.FeedModel
 */

describe('FeedModel', function() {

	var FeedModel,
			UserContextManager,
			ApiManager,
			VideoCellModel,
			logger,
			$q,
			$rootScope;

	beforeEach(function() {

		angular.mock.module('PresentWebApp');

		inject(function($injector) {

			//Service being tested
			FeedModel = $injector.get('FeedModel');

			//Service Dependencies
			UserContextManager = $injector.get('UserContextManager');
			ApiManager = $injector.get('ApiManager');
			VideoCellModel = $injector.get('VideoCellModel');
			logger = $injector.get('logger');

			//Test Dependencies
			$q = $injector.get('$q');
			$rootScope = $injector.get('$rootScope');

		});

	});

	describe('create', function() {

		it('should create a new Feed Object', function() {

		});

	});

	describe('load', function() {

		beforeEach(function() {

		});

		it('should load a video feed of the desired type', function() {

		});

	});

});