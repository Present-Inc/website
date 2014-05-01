

var pControllers = angular.module('p.controllers', ['ngAnimate']);

pControllers.controller('mainCtrl', ['$scope', function($scope) {
    $scope.message = 'Welcome to Present';
    $scope.app = {
        viewAnimation : 'a-fade',
        isReady : false,
        style : {
          size : 'fullscreen'
        },
        fullscreen: true,
        navigation : false
    };

    $scope.$on('$stateChangeStart', function() {
        $scope.app.isReady = false;
    });

    $scope.$on('$stateChangeSuccess', function() {
        $scope.app.isReady = true;
    });


}]);

pControllers.controller('homeCtrl', ['$scope', function($scope) {
    $scope.message = 'Discover the present';
    $scope.app.navigation = false;
    $scope.app.fullscreen = true;
    $scope.app.viewAnimation = 'a-fade';
}]);


pControllers.controller('discoverCtrl', ['$scope', '$timeout', 'Feed', 'DiscoverService',
    function($scope, $timeout, Feed, DiscoverService) {
        $scope.app.navigation = true;
        $scope.app.fullscreen = false;
        $scope.app.viewAnimation = 'a-fade';

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
        $scope.app.navigation = true;
        $scope.app.viewAnimation = 'a-fade';
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

        $scope.feedManager.presents.map(function(present) {
              present.creator.username = $scope.user.username;
        });

        $scope.loadMoreVideos = function() {
            $scope.feedManager.isLoading = true;
            console.log('Loading more videos...' );
            ProfileService.loadFeed($scope.user.username, $scope.feedManager.cursor)
                .then(function(newFeed) {
                    newFeed.videos.map(function(video) {
                        video.creator.username = $scope.user.username;
                    });
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

}]);


pControllers.controller('individualPresentCtrl', ['$scope', 'Feed', 'Profile', 'ProfileService',
    function($scope, Feed, Profile, ProfileService) {
    $scope.app.viewAnimation = 'a-fade';
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
