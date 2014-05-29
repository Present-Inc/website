/**
 * UserContextManager.test.js
 * Jasmine unit tests for PApiClient.UserContextManager
 */

  describe('ApiConfig', function() {

    beforeEach(function() {
      angular.mock.module('PApiClient');
    });

    describe('getAddress', function() {
      it('getAddress should return the api adress', inject(function(ApiConfig) {
        expect(ApiConfig.getAddress()).toEqual('https://api.present.tv');
      }));
    });

    describe('getVideoQueryLimit' , function() {
      it('should return the video query limit', inject(function(ApiConfig) {
        expect(ApiConfig.getVideoQueryLimit()).toEqual(5);
      }));
    });

  });
