var pDirectives = angular.module('p.directives', ['ngAnimate', 'ui.router']);


pDirectives.directive('blockScroll', ['$window', '$anchorScroll', function($window, $anchorScroll) {
  return {
    restrict: 'EA',
    link: function($scope) {
      $window.bind('scroll', function() {
        if (app.isFullScreen) {
          $location.$hash('#header');
          $anchorScroll();
        }
      });
    }
  }
}]);


pDirectives.directive('viewContainer', ['$animate', '$window', '$anchorScroll', function($animate, $window, $anchorScroll) {
    return {
        restrict: 'EA',
        scope: false,
        link : function(scope, element, attrs) {
            scope.$on('$stateChangeSuccess', function() {
                $animate.addClass(element, 'dl-enter', function(){
                });
            });

            scope.$on('$stateChangeStart', function() {
                $animate.addClass(element, 'dl-leave', function(){
                    $window.scrollTo(0,0);
                });
            });
        }
    }
}]);


/* DOWNLOAD
  ====================================== */
pDirectives.directive('iphone', ['$interval', '$timeout', function($interval, $timeout) {
  return {
    restrict: 'EA',
    controller: function($scope) {

      $scope.images = ['http://placehold.it/250x360/33AAFF/FFF', 'http://placehold.it/250x361/8E03F5/FFF', 'http://placehold.it/250x361/CCCCCC/FFF'];

      $scope.viewer = {
        changing: true,
        key: 0,
        source: '',
      };

      $interval(function() {
        $scope.rotateScreens();
      }, 5000);

      $scope.rotateScreens = function() {
          $scope.viewer.changing = true;

          if($scope.viewer.key ==  $scope.images.length) {
            $scope.viewer.key = 0;
          }

          $timeout(function() {
            $scope.viewer.source = $scope.images[$scope.viewer.key];
            console.log($scope.viewer.source);
            $scope.viewer.changing = false;
            $scope.viewer.key++;
          }, 800);

      };

      $scope.rotateScreens();
    }
  }
}]);



/* FEED
 ======================================= */

pDirectives.directive('presentFeed', function() {
     return {
         restrict: 'EA',
         controller: function($scope) {

            console.log('Present Feed Initialized');

            this.setActiveVideo = function(video) {
                $scope.feedManager.active = video;
                $scope.$broadcast('activeVideoChanged', $scope.feedManager.active);
            };

         }
     }
});

pDirectives.directive('presentUser', function() {
    return {
        restrict: 'EA',
        templateUrl:'views/partials/presentUser',
        replace: true

    }
});

pDirectives.directive('presentVideo', function() {
    return {
        restrict : 'EA',
        templateUrl: 'views/partials/presentVideo',
        replace: true
   }
});

pDirectives.directive('jwplayer', function() {
    return {
        restrict: 'EA',
        scope: {
               media : '=',
               videoid : '@'
        },
        require: '^presentFeed',
        template : '<img class="playerPlaceholder a-fade" ng-src="{{media.still}}" ng-hide="video.playerLoaded"/><div></div>',
        controller: function($scope) {

            $scope.setupProperties = {
                file : $scope.media.replay,
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
               _id : 'present-' + $scope.videoid,
               state : 'uninitialized',
               media: $scope.media,
               playing: false
           };

        },
        link: function(scope, element, attrs, feedManager) {
            var children = element.children();
            var playerElem = angular.element(children[1]);
            playerElem.attr('id', scope.video._id);

            scope.checkState = function() {
                var playerElem = angular.element(document.querySelector('#' + scope.video._id));
                if (!playerElem[0]) return 'destroyed';
                else return scope.video.state;
            };

            playerElem.waypoint(function(direction) {
                if(direction == 'down') {
                    feedManager.setActiveVideo(scope.video);
                    scope.video.state = scope.checkState();
                    if(scope.video.state != 'destroyed'){
                        if(scope.video.state == 'uninitialized') {
                            scope.video.state = 'loading';
                            jwplayer(scope.video._id).setup(scope.setupProperties);
                            jwplayer(scope.video._id).onPlay(function() {
                                if(scope.video.state == 'stopped') {
                                    jwplayer(scope.video._id).play(false);
                                } else {
                                    scope.video.state = 'playing'
                                }
                                scope.video.playerLoaded = true;
                                scope.$apply();
                            });
                            jwplayer(scope.video._id).onDisplayClick(function() {
                                  if(scope.video.state != 'playing') {
                                      feedManager.setActiveVideo(scope.video);
                                      scope.video.state = 'playing';
                                      jwplayer(scope.video._id).play(true);
                                  }
                            });
                        }
                        else if(scope.video.state == 'stopped') {
                            scope.video.state = 'playing';
                            jwplayer(scope.video._id).play(true);
                        }
                    }
                }
            }, {offset: '50%'});

            playerElem.bind('click', function() {
               console.log('player element was clicked');
            });

            scope.$on('activeVideoChanged', function(event, active) {
                scope.video.state = scope.checkState();
                if(active._id != scope.video._id && scope.video.state != 'destroyed') {
                    if(scope.video.state == 'playing') {
                        scope.video.state = 'stopped';
                        jwplayer(scope.video._id).stop();
                        scope.playerLoaded = false;
                        scope.$apply();
                    }
                    else if(scope.video.state == 'loading') {
                       scope.video.state = 'stopped';
                       scope.$apply();
                    }
                }
            });
        }
    }
});


/* ACCOUNT
 ======================================= */


pDirectives.directive('password', [function() {
    return  {
        restrict: 'EA',
        link: function(scope, element, attr) {
            var textbox = angular.element(element);
            scope.$watch('userInput.valid', function() {
                if(scope.userInput.valid) {
                       scope.matchStyle = {
                           'border': 'solid 1px #6CA361',
                           'background-color': '#CEF7A1'
                       };
                }
                else if(!scope.userInput.valid) {
                    scope.matchStyle = {
                        'border': 'solid 1px #ccc',
                        'background-color': '#fff'
                    };
                }
            });
        }
    }
}]);
