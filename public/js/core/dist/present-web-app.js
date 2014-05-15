/**
 * Created by dan on 3/6/14.
 *
 */
var PresentWebApp = angular.module('PresentWebApp', [
    'ngAnimate',
    'ui.router',
    'p.controllers',
    'p.directives',
    'p.services'
  ]);
PresentWebApp.config([
  '$stateProvider',
  '$locationProvider',
  function ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('home', {
      url: '/',
      templateUrl: '/views/home',
      controller: 'homeCtrl',
      data: {
        navigation: false,
        fullsreen: true
      },
      resolve: {
        AppScreens: [
          'HomeService',
          function (HomeService) {
            return HomeService.preloadPhoneScreens();
          }
        ],
        Transition: [
          'Utilities',
          function (Utilities) {
            return Utilities.transitionComplete(1000);
          }
        ]
      }
    }).state('discover', {
      url: '/discover',
      templateUrl: '/views/discover',
      controller: 'discoverCtrl',
      data: {
        navigation: true,
        fullsreen: false
      },
      resolve: {
        Feed: [
          '$stateParams',
          'DiscoverService',
          function ($stateParams, DiscoverService) {
            return DiscoverService.loadFeed();
          }
        ],
        Transition: [
          'Utilities',
          function (Utilities) {
            return Utilities.transitionComplete(1200);
          }
        ]
      }
    }).state('profile', {
      url: '/:user',
      templateUrl: '/views/profile',
      controller: 'profileCtrl',
      data: {
        navigation: true,
        fullsreen: false
      },
      resolve: {
        Feed: [
          '$stateParams',
          'ProfileService',
          function ($stateParams, ProfileService) {
            console.log($stateParams.user);
            return ProfileService.loadFeed($stateParams.user);
          }
        ],
        Profile: [
          '$stateParams',
          'ProfileService',
          function ($stateParams, ProfileService) {
            return ProfileService.loadProfile($stateParams.user);
          }
        ],
        Transition: [
          'Utilities',
          function (Utilities) {
            return Utilities.transitionComplete(1200);
          }
        ]
      }
    }).state('present', {
      url: '/:user/p/:video',
      templateUrl: '/views/profile',
      controller: 'individualPresentCtrl',
      data: {
        navigation: true,
        fullsreen: true
      },
      resolve: {
        Feed: [
          '$stateParams',
          'ProfileService',
          function ($stateParams, ProfileService) {
            return ProfileService.loadIndividualPresent($stateParams.video);
          }
        ],
        Profile: [
          '$stateParams',
          'ProfileService',
          function ($stateParams, ProfileService) {
            return ProfileService.loadProfile($stateParams.user);
          }
        ],
        Transition: [
          'Utilities',
          function (Utilities) {
            return Utilities.transitionComplete(800);
          }
        ]
      }
    }).state('verification', {
      url: '/account/:user/confirm?email_confirmation_token',
      templateUrl: '/views/emailVerification',
      controller: 'verificationCtrl',
      data: {
        navigation: false,
        fullsreen: true
      },
      resolve: {
        ConfirmMessage: [
          '$stateParams',
          'AccountService',
          function ($stateParams, AccountService) {
            return AccountService.confirmEmail($stateParams.user, $stateParams.email_confirmation_token);
          }
        ]
      }
    }).state('resetPassword', {
      url: '/account/:user/reset_password?password_reset_token',
      templateUrl: '/views/resetPassword',
      controller: 'resetPasswordCtrl',
      data: {
        navigation: false,
        fullsreen: true
      },
      resolve: {
        ValidParams: [
          '$stateParams',
          'Utilities',
          function ($stateParams, Utilities) {
            var params = [$stateParams.password_reset_token];
            return Utilities.checkParams(params);
          }
        ],
        Profile: [
          '$stateParams',
          'ProfileService',
          function ($stateParams, ProfileService) {
            return ProfileService.loadProfile(null, $stateParams.user);
          }
        ],
        Transition: [
          'Utilities',
          function (Utilities) {
            return Utilities.transitionComplete(600);
          }
        ]
      }
    });
  }
]);
PresentWebApp.run([
  '$rootScope',
  '$templateCache',
  function ($rootScope, $templateCache) {
    $rootScope.$on('$viewContentLoaded', function () {
      $templateCache.removeAll();
    });
  }
]);
;
var pControllers = angular.module('p.controllers', ['ngAnimate']);
pControllers.controller('mainCtrl', [
  '$scope',
  function ($scope) {
    $scope.message = 'Welcome to Present';
    $scope.app = {
      isReady: false,
      viewAnimation: 'a-fade',
      style: { size: 'fullscreen' },
      fullscreen: true,
      navigation: true,
      downloadModal: false
    };
    $scope.$on('$stateChangeStart', function () {
      $scope.app.isReady = false;
    });
    $scope.$on('$stateChangeSuccess', function () {
      $scope.app.isReady = true;
    });
    $scope.showModal = function () {
      $scope.app.downloadModal = true;
    };
  }
]);
pControllers.controller('downloadModalCtrl', [
  '$scope',
  'TextMessageService',
  function ($scope, TextMessageService) {
    $scope.phoneNumber = '+1';
    $scope.feedbackMessage = 'Message and data rates may apply';
    $scope.sendDownloadLink = function () {
      console.log('Sending link...');
      TextMessageService.sendTextMessage($scope.phoneNumber).then(function () {
        $scope.feedbackMessage = 'Success! The message has been sent.';
      }).catch(function () {
        $scope.feedbackMessage = $scope.phoneNumber + ' is not valid';
      });
    };
  }
]);
pControllers.controller('homeCtrl', [
  '$scope',
  '$interval',
  '$timeout',
  'AppScreens',
  function ($scope, $interval, $timeout, AppScreens) {
    $scope.images = AppScreens;
    $scope.app.fullscreen = true;
    $scope.viewer = {
      changing: false,
      key: 0,
      source: $scope.images[0]
    };
    $interval(function () {
      $scope.rotateScreens();
    }, 5000);
    $scope.rotateScreens = function () {
      $scope.viewer.changing = true;
      if ($scope.viewer.key == $scope.images.length) {
        $scope.viewer.key = 0;
      } else
        $scope.viewer.key++;
      $timeout(function () {
        $scope.viewer.source = $scope.images[$scope.viewer.key];
        $scope.viewer.changing = false;
      }, 1000);
    };
  }
]);
pControllers.controller('discoverCtrl', [
  '$scope',
  '$timeout',
  'Feed',
  'DiscoverService',
  function ($scope, $timeout, Feed, DiscoverService) {
    $scope.app.fullscreen = false;
    $scope.feedManager = {
      active: null,
      presents: Feed.videos,
      cursor: Feed.cursor,
      isLoading: false,
      needsRefreshed: false,
      refreshLimit: 15
    };
    console.log('Cursor: ' + $scope.feedManager.cursor);
    $scope.loadMoreVideos = function () {
      $scope.feedManager.isLoading = true;
      console.log('Loading more videos...');
      DiscoverService.loadFeed($scope.feedManager.cursor).then(function (newFeed) {
        $scope.feedManager.cursor = newFeed.cursor;
        console.log('Next Cursor: ' + $scope.feedManager.cursor);
        $timeout(function () {
          $scope.feedManager.presents = $scope.feedManager.presents.concat(newFeed.videos);
          if ($scope.feedManager.presents.length == $scope.feedManager.refreshLimit) {
            $scope.feedManager.needsRefreshed = true;
          } else {
            $scope.feedManager.isLoading = false;
          }
        }, 2000);
      });
    };
    $scope.refreshFeed = function () {
      $scope.feedManager.needsRefreshed = false;
      $scope.feedManager.presents = [];
      $scope.loadMoreVideos();
    };
  }
]);
pControllers.controller('profileCtrl', [
  '$scope',
  '$timeout',
  'Feed',
  'Profile',
  'ProfileService',
  function ($scope, $timeout, Feed, Profile, ProfileService) {
    $scope.app.fullscreen = false;
    console.log('Profile Controllers');
    $scope.user = Profile;
    $scope.alternateLayout = {};
    if (!$scope.user.fullName) {
      $scope.alternateLayout.user = { 'text-align': 'center' };
      $scope.alternateLayout.profilePicture = {
        'float': 'none',
        'margin': '0px auto 20px auto'
      };
    }
    $scope.feedManager = {
      active: null,
      presents: Feed.videos,
      cursor: Feed.cursor,
      isLoading: false,
      needsRefreshed: false,
      refreshLimit: 1
    };
    $scope.loadMoreVideos = function () {
      $scope.feedManager.isLoading = true;
      console.log('Loading more videos...');
      ProfileService.loadFeed($scope.user.username, $scope.feedManager.cursor).then(function (newFeed) {
        $scope.mapProfileData(newFeed.videos);
        $scope.feedManager.cursor = newFeed.cursor;
        console.log('Next Cursor: ' + $scope.feedManager.cursor);
        $timeout(function () {
          $scope.feedManager.presents = newFeed.videos;
          $scope.feedManager.isLoading = false;
        }, 2000);
      });
    };
    $scope.refreshFeed = function () {
      $scope.feedManager.needsRefreshed = false;
      $scope.feedManager.presents = [];
      $scope.loadMoreVideos();
    };
    $scope.mapProfileData = function (presents) {
      presents.map(function (present) {
        present.creator.profilePicture.url = $scope.user.profilePicture.url;
        if ($scope.user.fullName) {
          present.creator.displayName = $scope.user.fullName;
        } else {
          present.creator.displayName = $scope.user.username;
        }
        present.creator.username = $scope.user.username;
      });
    };
    $scope.mapProfileData($scope.feedManager.presents);
  }
]);
pControllers.controller('individualPresentCtrl', [
  '$scope',
  'Feed',
  'Profile',
  'ProfileService',
  function ($scope, Feed, Profile, ProfileService) {
    $scope.app.fullscreen = true;
    $scope.user = Profile;
    $scope.feedManager = {
      active: null,
      presents: Feed.videos,
      cursor: null,
      isLoading: false,
      needsRefreshed: false,
      refreshLimit: 1
    };
  }
]);
pControllers.controller('verificationCtrl', [
  '$scope',
  'ConfirmMessage',
  function ($scope, ConfirmMessage) {
    $scope.message = ConfirmMessage;
  }
]);
pControllers.controller('resetPasswordCtrl', [
  '$scope',
  '$stateParams',
  'ValidParams',
  'Profile',
  'AccountService',
  function ($scope, $stateParams, ValidParams, Profile, AccountService) {
    $scope.app.fullscreen = true;
    $scope.app.navigation = false;
    console.log(Profile.username);
    $scope.validRequest = ValidParams;
    $scope.maxLength = 128;
    $scope.minLength = 5;
    $scope.error = {
      message: '',
      type: ''
    };
    $scope.userInput = {
      username: Profile.username,
      password: '',
      confirmation: '',
      valid: false
    };
    $scope.checkPassword = function () {
      if ($scope.userInput.password == $scope.userInput.confirmation) {
        if ($scope.userInput.password.length < $scope.minLength) {
          $scope.error.message = 'Password must be at least 5 characters';
          $scope.error.type = 'short';
        } else if ($scope.userInput.password.length > $scope.maxLength) {
          $scope.error.message = 'Password cannot be more than 120 characters';
          $scope.error.type = 'long';
        } else if ($scope.userInput.password != '') {
          $scope.userInput.valid = true;
          $scope.error.type = '';
          $scope.error.message = '';
        }
      } else {
        $scope.userInput.valid = false;
        $scope.error.type = 'mismatch';
      }
    };
    $scope.sendPassword = function () {
      if ($scope.error.type == 'mismatch') {
        $scope.error.message = 'Passwords do not match';
      }
      if ($scope.userInput.valid) {
        $scope.error.message = 'Working...';
        AccountService.resetPassword($stateParams.user, $stateParams.password_reset_token, $scope.userInput.password).then(function (isReset) {
          if (isReset)
            $scope.error.message = 'Your password has successfully been changed';
          else {
            $scope.error.message = 'We could not reset your password. Please contact support@present.tv';
          }
        }).catch(function (errorMessage) {
          $scope.error.message = errorMessage;
        });
      }
    };
  }
]);
;
;
var pDirectives = angular.module('p.directives', [
    'ngAnimate',
    'ui.router'
  ]);
pDirectives.directive('viewContainer', [
  '$animate',
  '$window',
  '$location',
  '$anchorScroll',
  '$timeout',
  function ($animate, $window, $location, $anchorScroll) {
    return {
      restrict: 'EA',
      scope: false,
      link: function (scope, element, attrs) {
        scope.$on('$stateChangeSuccess', function (event, toState, fromState) {
          $animate.addClass(element, 'view-enter', function () {
          });
        });
        scope.$on('$stateChangeStart', function (event, toState, fromState) {
          if (toState.data.navigation) {
            scope.app.navigation = true;
          } else
            scope.app.navigation = false;
          if (toState.data.fullscreen)
            scope.app.fullscreen = true;
          else
            scope.app.fullscreen = false;
          $animate.addClass(element, 'view-leave', function () {
            $window.scrollTo(0, 0);
          });
        });
        angular.element($window).bind('scroll', function () {
          var screenWidth = $window.innerWidth;
          if (scope.app.fullscreen && screenWidth > 960) {
            $anchorScroll(null);
          }
        });
        element.bind('click', function (event) {
          var targetElem = angular.element(event.target);
          var targetClass = targetElem.attr('class');
          if (targetClass == 'downloadBtn') {
            scope.app.downloadModal = true;
          } else {
            scope.app.downloadModal = false;
          }
          scope.$apply();
        });
      }
    };
  }
]);
/* FEED
 ======================================= */
pDirectives.directive('presentFeed', function () {
  return {
    restrict: 'EA',
    controller: [
      '$scope',
      function ($scope) {
        console.log('Present Feed Initialized');
        this.setActiveVideo = function (video) {
          $scope.feedManager.active = video;
          $scope.$broadcast('activeVideoChanged', $scope.feedManager.active);
        };
      }
    ]
  };
});
pDirectives.directive('presentVideo', function () {
  return {
    restrict: 'EA',
    templateUrl: 'views/partials/presentVideo',
    replace: true,
    controller: [
      '$scope',
      function ($scope) {
        if ($scope.present.isLive) {
          $scope.livePlayer = 'livePlayer';
        } else
          $scope.livePlayer = '';
      }
    ]
  };
});
pDirectives.directive('jwplayer', function () {
  return {
    restrict: 'EA',
    scope: {
      media: '=',
      islive: '=',
      videoid: '@'
    },
    require: '^presentFeed',
    template: '<img class="playerPlaceholder a-fade-fast" ng-src="{{media.still}}" ng-hide="video.playerLoaded"/><div></div>',
    controller: [
      '$scope',
      function ($scope) {
        if ($scope.isLive) {
          $scope.activePlaylistUrl = $scope.media.live;
        } else {
          $scope.activePlaylistUrl = $scope.media.replay;
        }
        console.log($scope.activePlaylistUrl);
        $scope.setupProperties = {
          file: $scope.activePlaylistUrl,
          image: $scope.media.still,
          width: '100%',
          height: '100%',
          aspectratio: '1:1',
          skin: 'five',
          autostart: 'true',
          controls: 'true',
          stretching: 'exactfit',
          stagevideo: 'false',
          hdButton: false
        };
        $scope.video = {
          _id: 'present-' + $scope.videoid,
          state: 'uninitialized',
          media: $scope.media,
          playing: false
        };
      }
    ],
    link: function (scope, element, attrs, feedManager) {
      var children = element.children();
      var playerElem = angular.element(children[1]);
      playerElem.attr('id', scope.video._id);
      scope.checkState = function () {
        var playerElem = angular.element(document.querySelector('#' + scope.video._id));
        if (!playerElem[0])
          return 'destroyed';
        else
          return scope.video.state;
      };
      /*scope.$on('$destroy', function() {
                if(scope.video.state == 'playing' || scope.video.state == 'stopped') {
                  jwplayer(scope.video_id).remove();
                }
            });*/
      playerElem.waypoint(function (direction) {
        if (direction == 'down') {
          feedManager.setActiveVideo(scope.video);
          scope.video.state = scope.checkState();
          if (scope.video.state != 'destroyed') {
            if (scope.video.state == 'uninitialized') {
              scope.video.state = 'loading';
              jwplayer(scope.video._id).setup(scope.setupProperties);
              jwplayer(scope.video._id).onPlay(function () {
                if (scope.video.state == 'stopped') {
                  jwplayer(scope.video._id).play(false);
                } else {
                  scope.video.state = 'playing';
                }
                scope.video.playerLoaded = true;
                scope.$apply();
              });
              jwplayer(scope.video._id).onDisplayClick(function () {
                if (scope.video.state != 'playing') {
                  feedManager.setActiveVideo(scope.video);
                  scope.video.state = 'playing';
                  jwplayer(scope.video._id).play(true);
                }
              });
            } else if (scope.video.state == 'stopped') {
              scope.video.state = 'playing';
              jwplayer(scope.video._id).play(true);
            }
          }
        }
      }, { offset: '80%' });
      scope.$on('activeVideoChanged', function (event, active) {
        scope.video.state = scope.checkState();
        if (active._id != scope.video._id && scope.video.state != 'destroyed') {
          if (scope.video.state == 'playing') {
            scope.video.state = 'stopped';
            jwplayer(scope.video._id).stop();
            scope.playerLoaded = false;
            scope.$apply();
          } else if (scope.video.state == 'loading') {
            scope.video.state = 'stopped';
            scope.$apply();
          }
        }
      });
    }
  };
});
/* ACCOUNT
 ======================================= */
pDirectives.directive('password', [function () {
    return {
      restrict: 'EA',
      link: function (scope, element, attr) {
        var textbox = angular.element(element);
        scope.$watch('userInput.valid', function () {
          if (scope.userInput.valid) {
            scope.matchStyle = {
              'border': 'solid 1px #6CA361',
              'background-color': '#CEF7A1'
            };
          } else if (!scope.userInput.valid) {
            scope.matchStyle = {
              'border': 'solid 1px #ccc',
              'background-color': '#fff'
            };
          }
        });
      }
    };
  }]);
;
var developmentServer = 'api.present.tv';
var protocol = 'https://';
var pServices = angular.module('p.services', []);
/*API Factories
==================================== */
pServices.factory('VideosApiResource', [
  '$http',
  '$q',
  function ($http, $q) {
    return {
      listBrandNewVideos: function (cursor) {
        var methodURL = protocol + developmentServer + '/v1/videos/list_brand_new_videos';
        var defer = $q.defer();
        $http({
          method: 'GET',
          url: methodURL,
          params: {
            limit: '5',
            cursor: cursor ? cursor : null
          }
        }).success(function (data, status, headers, config) {
          defer.resolve(data);
        }).error(function (data, status, headers, config) {
          var errorMessage = 'ERROR in videosService: API returned with response code: ' + status;
          defer.reject(errorMessage);
        });
        return defer.promise;
      },
      listUserVideos: function (username, cursor) {
        var methodURL = protocol + developmentServer + '/v1/videos/list_user_videos';
        var defer = $q.defer();
        $http({
          method: 'GET',
          url: methodURL,
          params: {
            limit: '5',
            username: username,
            cursor: cursor ? cursor : null
          }
        }).success(function (data, status, headers, config) {
          defer.resolve(data);
        }).error(function (data, status, headers, config) {
          var errorMessage = 'ERROR in videosService: API returned with response code: ' + status;
          defer.reject(errorMessage);
        });
        return defer.promise;
      },
      show: function (id) {
        var methodURL = protocol + developmentServer + '/v1/videos/show';
        var defer = $q.defer();
        $http({
          method: 'GET',
          url: methodURL,
          params: { video_id: id }
        }).success(function (data, status, headers, config) {
          defer.resolve(data);
        }).error(function (data, status, headers, config) {
          var errorMessage = 'ERROR in videosService: API returned with response code: ' + status;
          defer.reject(errorMessage);
        });
        return defer.promise;
      }
    };
  }
]);
pServices.factory('UsersApiResource', [
  '$http',
  '$q',
  function ($http, $q) {
    return {
      show: function (username, userId) {
        var defer = $q.defer();
        var methodUrl = protocol + developmentServer + '/v1/users/show';
        $http({
          method: 'GET',
          url: methodUrl,
          params: {
            username: username,
            user_id: userId
          }
        }).success(function (data, status, headers, config) {
          defer.resolve(data);
        }).error(function (data, status, headers, config) {
          var errorMessage = 'ERROR in usersService: API returned with a response code: ' + status;
          defer.reject(errorMessage);
        });
        return defer.promise;
      },
      confirmEmail: function (userId, token) {
        var defer = $q.defer();
        var methodUrl = protocol + developmentServer + '/v1/users/confirm_email';
        $http({
          method: 'POST',
          url: methodUrl,
          data: {
            user_id: userId,
            email_confirmation_token: token
          }
        }).success(function (data, status, headers, config) {
          defer.resolve(data);
        }).error(function (data, status, headers, config) {
          var errorMessage = 'ERROR in usersService: API returned with a response code: ' + status;
          defer.reject(errorMessage);
        });
        return defer.promise;
      },
      resetPassword: function (userId, token, password) {
        var defer = $q.defer();
        var methodUrl = protocol + developmentServer + '/v1/users/reset_password';
        $http({
          method: 'POST',
          url: methodUrl,
          data: {
            user_id: userId,
            password_reset_token: token,
            password: password
          }
        }).success(function (data, status, headers, config) {
          defer.resolve(data);
        }).error(function (data, status, headers, config) {
          var errorMessage = 'ERROR in usersService: API returned with a response code: ' + status;
          defer.reject(data);
        });
        return defer.promise;
      }
    };
  }
]);
/* Discover
====================================== */
pServices.factory('DiscoverService', [
  '$q',
  'VideosApiResource',
  'FeedDelegate',
  function ($q, Videos, FeedDelegate) {
    return {
      loadFeed: function (cursor) {
        var loadingFeed = $q.defer();
        var feed = {
            cursor: cursor ? cursor : null,
            videos: []
          };
        Videos.listBrandNewVideos(cursor).then(function (VideosApiResponse) {
          feed.cursor = VideosApiResponse.nextCursor;
          angular.forEach(VideosApiResponse.results, function (video, key) {
            var nextVideo = FeedDelegate.deserializeVideo(video.object);
            if (nextVideo.isAvailable) {
              feed.videos.push(nextVideo);
            }
          });
          return feed;
        }).then(function (feed) {
          FeedDelegate.preRenderFeed(feed).then(function () {
            loadingFeed.resolve(feed);
          });
        }).catch(function (error) {
          loadingFeed.reject(error);
        });
        return loadingFeed.promise;
      }
    };
  }
]);
/* Profile
======================================= */
pServices.factory('ProfileService', [
  '$q',
  'VideosApiResource',
  'UsersApiResource',
  'FeedDelegate',
  'ProfileDelegate',
  function ($q, Videos, Users, FeedDelegate, ProfileDelegate) {
    return {
      loadFeed: function (username, cursor) {
        var loadingFeed = $q.defer();
        var feed = {
            cursor: '',
            videos: []
          };
        Videos.listUserVideos(username, cursor).then(function (VideosApiResponse) {
          angular.forEach(VideosApiResponse.results, function (video, key) {
            feed.cursor = VideosApiResponse.nextCursor;
            var nextVideo = FeedDelegate.deserializeVideo(video.object);
            if (nextVideo.isAvailable) {
              feed.videos.push(nextVideo);
            }
          });
          return feed;
        }).then(function (feed) {
          FeedDelegate.preRenderFeed(feed).then(function () {
            loadingFeed.resolve(feed);
          });
        }).catch(function (error) {
          loadingFeed.reject(error);
        });
        return loadingFeed.promise;
      },
      loadProfile: function (username, user_id) {
        var loadingProfile = $q.defer();
        var profile = {};
        Users.show(username, user_id).then(function (UsersApiResponse) {
          profile = ProfileDelegate.deserializeProfile(UsersApiResponse.result.object);
          loadingProfile.resolve(profile);
        }).catch(function (error) {
          loadingProfile.reject(error);
        });
        return loadingProfile.promise;
      },
      loadIndividualPresent: function (videoId) {
        var loadingPresent = $q.defer();
        var feed = {
            cursor: '',
            videos: []
          };
        Videos.show(videoId).then(function (VideosApiResponse) {
          var video = FeedDelegate.deserializeVideo(VideosApiResponse.result.object);
          feed.videos.push(video);
          loadingPresent.resolve(feed);
        });
        return loadingPresent.promise;
      }
    };
  }
]);
/*Feed Delegates
======================================= */
pServices.factory('FeedDelegate', [
  '$q',
  '$interval',
  function ($q, $interval) {
    return {
      deserializeVideo: function (video) {
        var deserializedVideo = {};
        deserializedVideo._id = video._id;
        deserializedVideo.title = video.title;
        deserializedVideo.isAvailable = video.isAvailable;
        deserializedVideo.mediaUrl = {
          still: video.mediaUrls ? video.mediaUrls.images['480px'] : '',
          live: video.mediaUrls ? video.mediaUrls.playlists.live.master : '',
          replay: video.mediaUrls ? video.mediaUrls.playlists.replay.master : ''
        };
        deserializedVideo.creator = {
          _id: video.creatorUser.object ? video.creatorUser.object._id : '',
          username: video.creatorUser.object ? video.creatorUser.object.username : '',
          fullName: video.creatorUser.object ? video.creatorUser.object.profile.fullName : '',
          profilePicture: video.creatorUser.object ? video.creatorUser.object.profile.picture : {}
        };
        deserializedVideo.likes = video.likes.count;
        deserializedVideo.start = video.creationTimeRange.startDate;
        deserializedVideo.end = video.creationTimeRange.endDate;
        if (video.creationTimeRange.endDate) {
          deserializedVideo.isLive = false;
          deserializedVideo.timeAgo = moment(deserializedVideo.end).fromNow();
        } else {
          deserializedVideo.isLive = true;
          deserializedVideo.timeAgo = 'Present';
        }
        if (deserializedVideo.creator.fullName) {
          deserializedVideo.creator.displayName = deserializedVideo.creator.fullName;
        } else {
          deserializedVideo.creator.displayName = deserializedVideo.creator.username;
        }
        return deserializedVideo;
      },
      preRenderFeed: function (Feed) {
        var promises = [];
        angular.forEach(Feed.videos, function (source, key) {
          var still = new Image();
          still.src = source.mediaUrl.still;
          var checkImageInterval = $interval(function () {
              promises.push(checkImageInterval);
              if (still.complete) {
                $interval.cancel(checkImageInterval);
              }
            }, 100);
        });
        return $q.all(promises);
      }
    };
  }
]);
/* PROFILE DELEGATE
====================================*/
pServices.factory('ProfileDelegate', function () {
  return {
    deserializeProfile: function (user) {
      var deserializedProfile = {};
      deserializedProfile._id = user._id;
      deserializedProfile.username = user.username;
      deserializedProfile.fullName = user.profile.fullName;
      deserializedProfile.profilePicture = user.profile.picture;
      deserializedProfile.description = user.profile.description;
      deserializedProfile.stats = {
        videos: user.videos.count,
        views: user.views.count,
        demands: user.demands.count,
        followers: user.followers.count,
        friends: user.friends.count
      };
      return deserializedProfile;
    }
  };
});
/* HOME
 * =============================================
 */
pServices.factory('HomeService', [
  '$q',
  function ($q) {
    return {
      preloadPhoneScreens: function () {
        var promises = [];
        var images = [
            'assets/img/app-screen.png',
            'http://placehold.it/250x361/8E03F5/FFF',
            'http://placehold.it/250x361/CCCCCC/FFF'
          ];
        angular.forEach(images, function (source, key) {
          var img = new Image();
          img.src = source;
        });
        return images;
      }
    };
  }
]);
/* DOWNLOAD LINK
 * ===========================================
 */
pServices.factory('TextMessageService', [
  '$http',
  '$q',
  function ($http, $q) {
    return {
      sendTextMessage: function (phoneNumber) {
        var defer = $q.defer();
        $http({
          method: 'POST',
          url: '/send_link/',
          data: {
            device: 'iphone',
            number: phoneNumber
          }
        }).success(function (data, status, headers, config) {
          defer.resolve();
        }).error(function (data, status, headers, config) {
          var errorMessage = 'ERROR in TextMessageService: API returned with a response code: ' + status;
          console.log(errorMessage);
          defer.reject();
        });
        return defer.promise;
      }
    };
  }
]);
/* ACCOUNT
 * =============================================
 */
pServices.factory('AccountService', [
  '$q',
  'UsersApiResource',
  function ($q, Users) {
    return {
      confirmEmail: function (userId, token) {
        var defer = $q.defer();
        Users.confirmEmail(userId, token).then(function (data) {
          console.log(data);
          defer.resolve('Thank you! Your account is now verified');
        }).catch(function (error) {
          console.log(error);
          defer.resolve('Incorrect Account Information.');
        });
        return defer.promise;
      },
      resetPassword: function (userId, token, password) {
        var defer = $q.defer();
        Users.resetPassword(userId, token, password).then(function () {
          defer.resolve(true);
        }).catch(function (error) {
          console.log(error.result);
          defer.reject(error.result);
        });
        return defer.promise;
      }
    };
  }
]);
/* UTILITY
 * =============================================
 */
pServices.factory('Utilities', [
  '$q',
  '$timeout',
  function ($q, $timeout) {
    return {
      transitionComplete: function (duration) {
        var defer = $q.defer();
        $timeout(function () {
          defer.resolve();
        }, duration);
        return defer.promise;
      },
      checkParams: function (params) {
        var defer = $q.defer();
        angular.forEach(params, function (param, key) {
          if (!param) {
            defer.resolve(false);
          } else if (key == params.length - 1) {
            defer.resolve(true);
          }
        });
        return defer.promise;
      }
    };
  }
]);