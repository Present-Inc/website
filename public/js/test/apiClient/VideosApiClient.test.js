/**
 * VideosApiClient.test
 * Test suite for PApiClient.VideosApiClient
 */

describe('VideosApiClient', function() {

  var VideosApiClient, $httpBackend, ApiConfig, logger;
  jasmine.getJSONFixtures().fixturesPath = '/base/test/fixtures/videos';

  beforeEach(function() {

    angular.mock.module('PApiClient');
    angular.mock.module('PUtilities');

    inject(function($injector) {

      //Services being tested in the suite
      VideosApiClient = $injector.get('VideosApiClient');

      //Service dependencies
      $httpBackend = $injector.get('$httpBackend');
      ApiConfig = $injector.get('ApiConfig');
      logger = $injector.get('logger');

      spyOn(logger, 'debug').and.stub();
      spyOn(logger, 'error').and.stub();

    });

  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('listBrandNewVideos', function() {

    var userContext = {token: '456', userId: '123'};
    var cursor = 10;
    var mockApiResponse = {
      success: getJSONFixture('list_brand_new_videos.success.json')
    }

    it('should send a request to videos/list_brand_new_videos with no provided arguments', function(){
      $httpBackend.expectGET('https://api.present.tv/v1/videos/list_brand_new_videos?limit=5')
        .respond(200, mockApiResponse.success);
      VideosApiClient.listBrandNewVideos()
        .then(function(apiResponse) {
          expect(apiResponse.status).toEqual('OK');
          expect(apiResponse.results).toBeDefined();
          expect(logger.debug).toHaveBeenCalled();
        });
      $httpBackend.flush();
    });

    it('should send a request to videos/list_brand_new_videos with provided cursor and user context',
      function() {
        $httpBackend.expectGET('https://api.present.tv/v1/videos/list_brand_new_videos?cursor=10&limit=5')
          .respond(200, mockApiResponse.success);
        VideosApiClient.listBrandNewVideos(cursor, userContext)
          .then(function(apiResponse) {
            expect(apiResponse.status).toEqual('OK');
            expect(apiResponse.results).toBeDefined();
            expect(logger.debug).toHaveBeenCalled();
          });
        $httpBackend.flush();
      }
    );

  });

  describe('listhomeVideos', function() {

    var userContext = {token: '456', userId: '123'}
    var cursor = 10;
    var mockApiResponse = {
      success: getJSONFixture('list_home_videos.success.json'),
      error: getJSONFixture('list_home_videos.error.json')
    }

    it('should send a request to videos/list_home_videos with provided cursor and user context',
      function() {
          $httpBackend.expectGET('https://api.present.tv/v1/videos/list_home_videos?cursor=10&limit=5')
            .respond(200, mockApiResponse.success);
          VideosApiClient.listHomeVideos(cursor, userContext)
            .then(function(apiResponse) {
              expect(apiResponse.status).toEqual('OK');
              expect(apiResponse.results).toBeDefined();
              expect(logger.debug).toHaveBeenCalled();
            });
          $httpBackend.flush();
      }
    );

  });

  it('should not send a request if it the provided user context is undefined',
    function() {
      VideosApiClient.listHomeVideos()
        .catch(function(apiResponse) {
          expect(apiResponse.status).toBe('ERROR');
          expect(apiResponse.mock).toBe(true);
          expect(logger.error).toHaveBeenCalled();
        });
    }
  );

});
