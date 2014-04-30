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
      resolve: {
        Images: [
          'Utilities',
          function (Utilities) {
            var images = ['http://10.61.32.61:8000/assets/img/left-frame-bg.jpg'];
            return Utilities.preloadImages(images);
          }
        ],
        Transition: [
          'Utilities',
          function (Utilities) {
            return Utilities.transitionComplete(1600);
          }
        ]
      }
    }).state('download', {
      url: '/download',
      templateUrl: '/views/download',
      controller: 'downloadCtrl',
      resolve: {
        Transition: [
          'Utilities',
          function (Utilities) {
            return Utilities.transitionComplete(1200);
          }
        ]
      }
    }).state('discover', {
      url: '/discover',
      templateUrl: '/views/discover',
      controller: 'discoverCtrl',
      resolve: {
        Feed: [
          'DiscoverService',
          function (DiscoverService) {
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
      resolve: {
        ValidParams: [
          '$stateParams',
          'Utilities',
          function ($stateParams, Utilities) {
            var params = [$stateParams.password_reset_token];
            return Utilities.checkParams(params);
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
      viewAnimation: 'a-fade',
      isReady: false
    };
    $scope.$on('$stateChangeStart', function () {
      $scope.app.isReady = false;
    });
    $scope.$on('$stateChangeSuccess', function () {
      $scope.app.isReady = true;
    });
  }
]);
pControllers.controller('homeCtrl', [
  '$scope',
  function ($scope) {
    $scope.message = 'Discover the present';
    $scope.app.viewAnimation = 'a-fade';
  }
]);
pControllers.controller('discoverCtrl', [
  '$scope',
  '$timeout',
  'Feed',
  'DiscoverService',
  function ($scope, $timeout, Feed, DiscoverService) {
    $scope.app.viewAnimation = 'a-fade';
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
    $scope.app.viewAnimation = 'a-fade';
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
    $scope.feedManager.presents.map(function (present) {
      present.creator.username = $scope.user.username;
    });
    $scope.loadMoreVideos = function () {
      $scope.feedManager.isLoading = true;
      console.log('Loading more videos...');
      ProfileService.loadFeed($scope.user.username, $scope.feedManager.cursor).then(function (newFeed) {
        newFeed.videos.map(function (video) {
          video.creator.username = $scope.user.username;
        });
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
  }
]);
pControllers.controller('individualPresentCtrl', [
  '$scope',
  'Feed',
  'Profile',
  'ProfileService',
  function ($scope, Feed, Profile, ProfileService) {
    $scope.app.viewAnimation = 'a-fade';
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
pControllers.controller('downloadCtrl', [function ($scope) {
  }]);
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
  'AccountService',
  function ($scope, $stateParams, ValidParams, AccountService) {
    $scope.validRequest = ValidParams;
    $scope.maxLength = 128;
    $scope.minLength = 3;
    $scope.error = {
      message: '',
      type: ''
    };
    $scope.userInput = {
      password: '',
      confirmation: '',
      valid: false
    };
    $scope.checkPassword = function () {
      if ($scope.userInput.password == $scope.userInput.confirmation) {
        if ($scope.userInput.password.length < $scope.minLength) {
          $scope.error.message = 'Password must be at least 4 characters';
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
      console.log('resetting password');
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
        });
      }
    };
  }
]);
;
;
var pDirectives = angular.module('p.directives', ['ngAnimate']);
pDirectives.directive('viewContainer', [
  '$animate',
  '$window',
  '$anchorScroll',
  function ($animate, $window, $anchorScroll) {
    return {
      restrict: 'EA',
      scope: false,
      link: function (scope, element, attrs) {
        scope.$on('$stateChangeSuccess', function () {
          $animate.addClass(element, 'dl-enter', function () {
          });
        });
        scope.$on('$stateChangeStart', function () {
          $animate.addClass(element, 'dl-leave', function () {
            $window.scrollTo(0, 0);
          });
        });
      }
    };
  }
]);
pDirectives.directive('blockScroll', [
  '$window',
  '$anchorScroll',
  '$state',
  function ($window, $anchorScroll, $state) {
    return {
      restrict: 'EA',
      link: function (scope, element, attrs) {
        angular.element($window).bind('scroll', function () {
          if ($state.current.name == 'home') {
            $anchorScroll();
          }
        });
      }
    };
  }
]);
pDirectives.directive('banner', function () {
  return {
    restrict: 'EA',
    templateUrl: '/views/partials/banner',
    replace: true
  };
});
pDirectives.directive('presentUser', function () {
  return {
    restrict: 'EA',
    templateUrl: 'views/partials/presentUser',
    replace: true
  };
});
pDirectives.directive('presentVideo', function () {
  return {
    restrict: 'EA',
    templateUrl: 'views/partials/presentVideo',
    replace: true
  };
});
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
pDirectives.directive('jwplayer', function () {
  return {
    restrict: 'EA',
    scope: {
      media: '=',
      videoid: '@'
    },
    require: '^presentFeed',
    template: '<img class="playerPlaceholder a-fade" ng-src="{{media.still}}" ng-hide="video.playerLoaded"/><div></div>',
    controller: [
      '$scope',
      function ($scope) {
        $scope.setupProperties = {
          file: $scope.media.replay,
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
      }, { offset: '50%' });
      playerElem.bind('click', function () {
        console.log('player element was clicked');
      });
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
pServices.factory('CommentsApiResource', [
  '$http',
  '$q',
  function ($http, $q) {
    return {
      listVideoComments: function (videoId, apiSuccessCallback) {
        var methodURL = protocol + developmentServer + '/v1/comments/list_video_comments';
        var defer = $q.defer();
        $http({
          method: 'GET',
          url: methodURL,
          params: { video_id: videoId }
        }).success(function (data, status, headers, config) {
          defer.resolve(data);
        }).error(function (data, status, headers, config) {
          var errorMessage = 'ERROR in commentsService: API returned with response code: ' + status;
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
      show: function (username) {
        var defer = $q.defer();
        var methodUrl = protocol + developmentServer + '/v1/users/show';
        $http({
          method: 'GET',
          url: methodUrl,
          params: { username: username }
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
        console.log(userId);
        console.log(token);
        console.log(password);
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
          defer.reject(errorMessage);
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
            feed.videos.push(nextVideo);
          });
          loadingFeed.resolve(feed);
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
            feed.videos.push(nextVideo);
          });
          loadingFeed.resolve(feed);
        }).catch(function (error) {
          loadingFeed.reject(error);
        });
        return loadingFeed.promise;
      },
      loadProfile: function (username) {
        var loadingProfile = $q.defer();
        var profile = {};
        Users.show(username).then(function (UsersApiResponse) {
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
pServices.factory('FeedDelegate', function () {
  return {
    deserializeVideo: function (video) {
      var deserializedVideo = {};
      deserializedVideo._id = video._id;
      deserializedVideo.title = video.title;
      deserializedVideo.mediaUrl = {
        still: video.mediaUrls ? video.mediaUrls.images['480px'] : '',
        live: video.mediaUrls ? video.mediaUrls.playlists.live.master : '',
        replay: video.mediaUrls ? video.mediaUrls.playlists.replay.master : ''
      };
      deserializedVideo.creator = {
        _id: video.creatorUser.object ? video.creatorUser.object._id : '',
        username: video.creatorUser.object ? video.creatorUser.object.username : '',
        profilePicture: video.creatorUser.object ? video.creatorUser.object.profile.picture : ''
      };
      deserializedVideo.likes = video.likes.count;
      deserializedVideo.start = video.creationTimeRange.startDate;
      deserializedVideo.end = video.creationTimeRange.endDate;
      if (video.creationTimeRange.endDate) {
        deserializedVideo.isLive = false;
        deserializedVideo.timeAgo = Math.abs(new Date() - new Date(video.creationTimeRange.endDate));
      } else {
        deserializedVideo.isLive = true;
        deserializedVideo.timeAgo = 'Present';
      }
      deserializedVideo.comments = '';
      return deserializedVideo;
    },
    deserializeComments: function (comments) {
      return 'comments';
    }
  };
});
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
          defer.resolve(false);
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
      preloadImages: function (images) {
        var defer = $q.defer();
        console.log('preloading images');
        angular.forEach(images, function (source, key) {
          var img = new Image();
          img.src = source;
          defer.resolve();
        });
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
/*
 * ABOUT
 * ===============================================
 */
pServices.factory('TeamInfo', [
  '$q',
  '$http',
  function ($q, $http) {
    return {
      getTeam: function () {
        var methodURL = '/data/team.json';
        var defer = $q.defer();
        $http({
          method: 'GET',
          url: methodURL
        }).success(function (data, status, headers, config) {
          defer.resolve(data);
        }).error(function (data, status, headers, config) {
          defer.reject('Could\'t Load Data');
        });
        return defer.promise;
      }
    };
  }
]);