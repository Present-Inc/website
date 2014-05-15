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

PresentWebApp.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/views/home',
            controller: 'homeCtrl',
            data: {
              navigation : false,
              fullsreen  : true
            },
            resolve : {
                AppScreens : ['HomeService', function(HomeService) {
                    return HomeService.preloadPhoneScreens();
                }],
                Transition : ['Utilities', function(Utilities) {
                    return Utilities.transitionComplete(1000);
                }]
            }
        })
        .state('discover', {
           url: '/discover',
           templateUrl: '/views/discover',
           controller: 'discoverCtrl',
           data: {
             navigation : true,
             fullsreen  : false
           },
           resolve: {
             Feed : ['$stateParams', 'DiscoverService', function($stateParams, DiscoverService) {
                  return DiscoverService.loadFeed();
             }],
             Transition : ['Utilities', function(Utilities){
                 return Utilities.transitionComplete(1200);
             }]
           }
        })
        .state('profile', {
            url: '/:user',
            templateUrl: '/views/profile',
            controller: 'profileCtrl',
            data: {
              navigation : true,
              fullsreen  : false
            },
            resolve : {
                Feed : ['$stateParams', 'ProfileService', function($stateParams, ProfileService) {
                    return ProfileService.loadFeed($stateParams.user);
                }],
                Profile : ['$stateParams', 'ProfileService', function($stateParams, ProfileService) {
                    return ProfileService.loadProfile($stateParams.user);
                }],
                Transition : ['Utilities', function(Utilities){
                    return Utilities.transitionComplete(1200);
                }]
            }
        })
        .state('present', {
            url: '/:user/p/:video',
            templateUrl: '/views/profile',
            controller : 'individualPresentCtrl',
            data: {
              navigation : true,
              fullsreen  : true
            },
            resolve : {
                Feed : ['$stateParams', 'ProfileService', function($stateParams, ProfileService) {
                    return ProfileService.loadIndividualPresent($stateParams.video);
                }],
                Profile : ['$stateParams', 'ProfileService', function($stateParams, ProfileService) {
                    return ProfileService.loadProfile($stateParams.user);
                }],
                Transition : ['Utilities', function(Utilities){
                    return Utilities.transitionComplete(800);
                }]
            }
        })
        .state('verification', {
            url: '/account/:user/confirm?email_confirmation_token',
            templateUrl: '/views/emailVerification',
            controller: 'verificationCtrl',
            data: {
              navigation : false,
              fullsreen  : true
            },
            resolve:  {
                ConfirmMessage : ['$stateParams', 'AccountService', function($stateParams, AccountService) {
                    return AccountService.confirmEmail($stateParams.user, $stateParams.email_confirmation_token);
                }]
            }
        })
        .state('resetPassword',  {
            url: '/account/:user/reset_password?password_reset_token',
            templateUrl: '/views/resetPassword',
            controller: 'resetPasswordCtrl',
            data: {
              navigation : false,
              fullsreen  : true
            },
            resolve: {
                ValidParams : ['$stateParams', 'Utilities', function($stateParams, Utilities) {
                    var params = [$stateParams.password_reset_token];
                    return Utilities.checkParams(params);
                }],
                Profile: ['$stateParams', 'ProfileService', function($stateParams, ProfileService) {
                    return ProfileService.loadProfile(null, $stateParams.user);
                }],
                Transition : ['Utilities', function(Utilities){
                    return Utilities.transitionComplete(600);
                }]
            }
        });
}]);

PresentWebApp.run(['$rootScope', '$templateCache', function($rootScope, $templateCache) {
    $rootScope.$on('$viewContentLoaded', function() {
       $templateCache.removeAll();
    });
}]);
