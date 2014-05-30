/**
 * FeedLoader.test
 * Test Suite for the Feed Loader
 */

describe('FeedLoader', function() {

  var FeedLoader,
      VideosApiClient,
      FeedConstructor,
      VideoCellConstructor,
      UserContextManager,
      logger,
      $q,
      $rootscope;

  jasmine.getJSONFixtures().fixturesPath = '/base/test/fixtures/videos';

  beforeEach(function() {

    angular.mock.module('PresentWebApp');

    inject(function($injector) {

      //Service being tested in the suite
      FeedLoader = $injector.get('FeedLoader');

      //Service dependencies
      logger = $injector.get('logger');
      VideosApiClient = $injector.get('VideosApiClient');
      FeedConstructor = $injector.get('FeedConstructor');
      VideoCellConstructor = $injector.get('VideoCellConstructor');
      UserContextManager = $injector.get('UserContextManager');

      //Test dependencies
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');

      spyOn(logger, 'debug').and.callThrough();
      spyOn(logger, 'error').and.callThrough();

      spyOn(FeedConstructor, 'create').and.callThrough();
      spyOn(VideoCellConstructor.Video, 'create').and.callThrough();

    });

  });

  describe('loadDiscoverFeed', function() {

    var cursor = 10;
    var mockApiResponse = {
      success: getJSONFixture('list_brand_new_videos.success.json')
    };

    beforeEach(function() {
      spyOn(UserContextManager, 'getActiveUserContext').and.callFake(function() {
        return {token: '456', userId: '123'};
      });
    });

    it('construct a new feed object with a valid api response',
      function() {
        spyOn(VideosApiClient, 'listBrandNewVideos').and.callFake(function() {
          var defer = $q.defer();
          defer.resolve(mockApiResponse.success);
          return defer.promise;
        });
        var returnedPromise = FeedLoader.loadDiscoverFeed(cursor);
        spyOn(returnedPromise, 'then').and.callThrough();
        $rootScope.$apply(function() {
          returnedPromise.then(function(Feed){
            expect(FeedConstructor.create).toHaveBeenCalled();
            expect(VideoCellConstructor.Video.create.calls.count())
              .toEqual(Feed.videoCells.length);
            for(var i=0; i<Feed.videoCells.length; i++) {
              expect(Feed.videoCells[i].video.media.replayPlaylist).toBeDefined();
            }
          });
        });
        expect(returnedPromise.then).toHaveBeenCalled();
      }
    );

    it('should call the video api client, and handle any network errors',
      function() {
        spyOn(VideosApiClient, 'listBrandNewVideos').and.callFake(function() {
          var defer = $q.defer();
          defer.reject();
          return defer.promise;
        });
        var returnedPromise = FeedLoader.loadDiscoverFeed(cursor);
        spyOn(returnedPromise, 'catch').and.callThrough();
        $rootScope.$apply(function() {
          returnedPromise.catch(function(){});
        });
        expect(returnedPromise.catch).toHaveBeenCalled();
      }
    );

  });

  describe('loadHomeFeed', function() {

    var cursor = 10;
    var mockApiResponse = {
      success: getJSONFixture('list_home_videos.success.json')
    }

    it('should call the video api client, then construct a new feed object',
      function() {
        spyOn(VideosApiClient, 'listHomeVideos').and.callFake(function() {
          var defer = $q.defer();
          defer.resolve(mockApiResponse.success);
          return defer.promise;
        });
        spyOn(UserContextManager, 'getActiveUserContext').and.callFake(function() {
          return {token: '456', userId: '123'};
        });
        var returnedPromise = FeedLoader.loadHomeFeed(cursor);
        spyOn(returnedPromise, 'then').and.callThrough();
        $rootScope.$apply(function() {
          returnedPromise.then(function(Feed){
            expect(FeedConstructor.create).toHaveBeenCalled();
            expect(VideoCellConstructor.Video.create.calls.count())
              .toEqual(Feed.videoCells.length);
            for(var i=0; i<Feed.videoCells.length; i++) {
              expect(Feed.videoCells[i].video.media.replayPlaylist).toBeDefined();
            }
          });
        });
        expect(returnedPromise.then).toHaveBeenCalled();
      }
    );

    it('should not call the video api client if the user context is invalid',
      function() {
        spyOn(VideosApiClient, 'listHomeVideos');
        spyOn(UserContextManager, 'getActiveUserContext').and.callFake(function() {
          return false;
        });
        var returnedPromise = FeedLoader.loadHomeFeed();
        expect(VideosApiClient.listHomeVideos).not.toHaveBeenCalled();
      }
    );

    it('should call the video api client and handle either a network or invalid user context error',
      function() {
        spyOn(VideosApiClient, 'listHomeVideos').and.callFake(function() {
          var defer = $q.defer();
          defer.reject();
          return defer.promise;
        });
        spyOn(UserContextManager, 'getActiveUserContext').and.callFake(function() {
          return {token: '456', userId: '123'};
        });
        var returnedPromise = FeedLoader.loadHomeFeed(cursor);
        spyOn(returnedPromise, 'catch').and.callThrough();
        $rootScope.$apply(function() {
          returnedPromise.catch(function(){});
        });
        expect(returnedPromise.catch).toHaveBeenCalled();
      }
    );

  });

  });
