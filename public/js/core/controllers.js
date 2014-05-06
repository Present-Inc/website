

var pControllers = angular.module('p.controllers', ['ngAnimate']);

pControllers.controller('mainCtrl', ['$scope', function($scope) {
    $scope.message = 'Welcome to Present';
    $scope.app = {
        isReady : false,
        viewAnimation: 'a-fade',
        style : {
          size : 'fullscreen'
        },
        fullscreen: true,
        navigation : false,
        downloadModal: false
    };

    $scope.$on('$stateChangeStart', function() {
        $scope.app.isReady = false;
    });

    $scope.$on('$stateChangeSuccess', function() {
        $scope.app.isReady = true;
    });

    $scope.showModal = function() {
      $scope.app.downloadModal = true;
    }
}]);

pControllers.controller('downloadModalCtrl', ['$scope', 'TextMessageService', function($scope, TextMessageService) {

  $scope.phoneNumber = '+1';
  $scope.feedbackMessage = 'Message and data rates may apply';

  $scope.sendDownloadLink = function() {
    console.log('Sending link...');
    TextMessageService.sendTextMessage($scope.phoneNumber)
      .then(function(){
        $scope.feedbackMessage = 'Success! The message has been sent.';
      })
      .catch(function(){
        $scope.feedbackMessage = $scope.phoneNumber + ' is not valid';
      });
  }

}]);

pControllers.controller('homeCtrl', ['$scope', '$interval', '$timeout', 'AppScreens',
function($scope,  $interval, $timeout, AppScreens) {
    $scope.images = AppScreens;
    $scope.app.navigation = false;
    $scope.app.fullscreen = true;

    $scope.viewer = {
      changing: false,
      key: 0,
      source: $scope.images[0],
    };

    $interval(function() {
      $scope.rotateScreens();
    }, 5000);

    $scope.rotateScreens = function() {
        $scope.viewer.changing = true;

        if($scope.viewer.key ==  $scope.images.length) {
          $scope.viewer.key = 0;
        } else $scope.viewer.key++;

        $timeout(function() {
          $scope.viewer.source = $scope.images[$scope.viewer.key];
          $scope.viewer.changing = false;
        }, 1000);

    };

}]);


pControllers.controller('discoverCtrl', ['$scope', '$timeout', 'Feed', 'DiscoverService',
    function($scope, $timeout, Feed, DiscoverService) {
        $scope.app.fullscreen = false;

        $scope.feedManager = {
            active: null,
            presents: Feed.videos,
            cursor: Feed.cursor,
            isLoading : false,
            needsRefreshed : false,
            refreshLimit: 15
        };

        console.log('Cursor: ' + $scope.feedManager.cursor);

        $scope.loadMoreVideos = function() {
            $scope.feedManager.isLoading = true;
            console.log('Loading more videos...' );
            DiscoverService.loadFeed($scope.feedManager.cursor)
                .then(function(newFeed) {
                    $scope.feedManager.cursor = newFeed.cursor;
                    console.log('Next Cursor: ' + $scope.feedManager.cursor);
                    $timeout(function() {
                        $scope.feedManager.presents = $scope.feedManager.presents.concat(newFeed.videos);
                        if($scope.feedManager.presents.length == $scope.feedManager.refreshLimit) {
                            $scope.feedManager.needsRefreshed = true;
                        }
                        else {
                            $scope.feedManager.isLoading = false;
                        }
                    }, 2000);
                });
        };

        $scope.refreshFeed = function() {
           $scope.feedManager.needsRefreshed = false;
           $scope.feedManager.presents = [];
           $scope.loadMoreVideos();
        }
}]);

pControllers.controller('profileCtrl', ['$scope', '$timeout', 'Feed', 'Profile', 'ProfileService',
    function($scope, $timeout, Feed, Profile, ProfileService) {
        $scope.app.fullscreen = false;

        console.log('Profile Controllers');

        $scope.user = Profile;
        $scope.alternateLayout = {};

        if(!$scope.user.fullName) {
            $scope.alternateLayout.user = {'text-align': 'center'};
            $scope.alternateLayout.profilePicture = {'float': 'none', 'margin': '0px auto 20px auto'}
        }

        $scope.feedManager = {
            active: null,
            presents: Feed.videos,
            cursor: Feed.cursor,
            isLoading : false,
            needsRefreshed : false,
            refreshLimit: 1
        };

        $scope.loadMoreVideos = function() {
            $scope.feedManager.isLoading = true;
            console.log('Loading more videos...' );
            ProfileService.loadFeed($scope.user.username, $scope.feedManager.cursor)
                .then(function(newFeed) {
                    $scope.mapProfileData(newFeed.videos)
                    $scope.feedManager.cursor = newFeed.cursor;
                    console.log('Next Cursor: ' + $scope.feedManager.cursor);
                    $timeout(function() {
                        $scope.feedManager.presents = newFeed.videos;
                            $scope.feedManager.isLoading = false;
                    }, 2000);
                });
        };

        $scope.refreshFeed = function() {
            $scope.feedManager.needsRefreshed = false;
            $scope.feedManager.presents = [];
            $scope.loadMoreVideos();
        }

        $scope.mapProfileData = function(presents) {
            presents.map(function(present) {
                  present.creator.profilePicture.url = $scope.user.profilePicture.url;
                  if($scope.user.fullName) {
                      present.creator.displayName = $scope.user.fullName;
                  } else {
                      present.creator.displayName = $scope.user.username;
                  }
                  present.creator.username = $scope.user.username;

            });
        }

        $scope.mapProfileData($scope.feedManager.presents);

}]);


pControllers.controller('individualPresentCtrl', ['$scope', 'Feed', 'Profile', 'ProfileService',
    function($scope, Feed, Profile, ProfileService) {
    $scope.app.fullscreen = true;

    $scope.user = Profile;
    $scope.feedManager = {
        active: null,
        presents: Feed.videos,
        cursor: null,
        isLoading : false,
        needsRefreshed : false,
        refreshLimit: 1
    };
}]);


pControllers.controller('verificationCtrl', ['$scope', 'ConfirmMessage', function($scope, ConfirmMessage) {
    $scope.message = ConfirmMessage;
}]);

pControllers.controller('resetPasswordCtrl', ['$scope', '$stateParams', 'ValidParams', 'AccountService',
    function($scope, $stateParams, ValidParams, AccountService) {
    $scope.app.fullscreen = true;

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


    $scope.checkPassword = function() {
        if($scope.userInput.password == $scope.userInput.confirmation ) {
            if($scope.userInput.password.length < $scope.minLength) {
                $scope.error.message = 'Password must be at least 4 characters';
                $scope.error.type = 'short';
            }
            else if($scope.userInput.password.length > $scope.maxLength) {
                $scope.error.message = 'Password cannot be more than 120 characters';
                $scope.error.type = 'long';
            }
            else if($scope.userInput.password != '') {
                $scope.userInput.valid = true;
                $scope.error.type = '';
                $scope.error.message = '';
            }
        }
        else {
            $scope.userInput.valid = false;
            $scope.error.type = 'mismatch';
        }
    };

    $scope.sendPassword = function(){
        console.log('resetting password');
        if($scope.error.type == 'mismatch') {
            $scope.error.message = 'Passwords do not match';
        }
        if($scope.userInput.valid) {
            $scope.error.message = 'Working...';
            AccountService.resetPassword($stateParams.user, $stateParams.password_reset_token, $scope.userInput.password)
                .then(function(isReset){
                    if(isReset) $scope.error.message = 'Your password has successfully been changed';
                    else {
                        $scope.error.message = 'We could not reset your password. Please contact support@present.tv';
                    }
                })
        }
    }

}]);

;
