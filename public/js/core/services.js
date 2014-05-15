var developmentServer = 'api.present.tv';
var protocol = 'https://';

var pServices = angular.module('p.services', []);

/*API Factories
==================================== */

pServices.factory('VideosApiResource', ['$http', '$q', function($http, $q) {
    return {
        listBrandNewVideos : function(cursor) {
            var methodURL = protocol +  developmentServer + '/v1/videos/list_brand_new_videos';
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: methodURL,
                params: {limit: '5', cursor: cursor ? cursor : null}
            })
            .success(function(data, status, headers, config) {
                defer.resolve(data);
            })
            .error(function(data, status, headers, config) {
                var errorMessage = 'ERROR in videosService: API returned with response code: ' + status;
                defer.reject(errorMessage);
            });
            return defer.promise;
        },
        listUserVideos: function(username, cursor) {
            var methodURL = protocol + developmentServer + '/v1/videos/list_user_videos';
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: methodURL,
                params : {limit: '5', username : username, cursor: cursor ? cursor : null}
            })
            .success(function(data, status, headers, config) {
                defer.resolve(data);
            })
            .error(function(data, status, headers, config) {
                var errorMessage = 'ERROR in videosService: API returned with response code: ' + status;
                defer.reject(errorMessage);
            });
            return defer.promise;
        },
        show: function(id) {
            var methodURL = protocol + developmentServer + '/v1/videos/show';
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: methodURL,
                params: {video_id : id}
            })
            .success(function(data, status, headers, config) {
                defer.resolve(data);
            })
            .error(function(data, status, headers, config) {
                var errorMessage = 'ERROR in videosService: API returned with response code: ' + status;
                defer.reject(errorMessage);
            });
            return defer.promise;
        }
    }
}]);

pServices.factory('UsersApiResource', ['$http', '$q', function($http, $q) {
    return{
        show: function(username, userId) {
            var defer = $q.defer();
            var methodUrl = protocol + developmentServer + '/v1/users/show';
            $http({
                method: 'GET',
                url: methodUrl,
                params: {username: username, user_id: userId}
            })
            .success(function(data, status, headers, config) {
                defer.resolve(data);
            })
            .error(function(data, status, headers, config) {
                var errorMessage = 'ERROR in usersService: API returned with a response code: ' + status;
                defer.reject(errorMessage);
            });
            return defer.promise;
        },
        confirmEmail : function(userId, token) {
         var defer = $q.defer();
            var methodUrl = protocol + developmentServer + '/v1/users/confirm_email';
            $http({
                method: 'POST',
                url: methodUrl,
                data: {user_id: userId, email_confirmation_token: token}
            })
            .success(function(data, status, headers, config) {
                defer.resolve(data);
            })
            .error(function(data, status, headers, config) {
                var errorMessage = 'ERROR in usersService: API returned with a response code: ' + status;
                defer.reject(errorMessage);
            });
            return defer.promise;
        },
        resetPassword : function(userId, token, password) {
            var defer = $q.defer();
            var methodUrl = protocol + developmentServer + '/v1/users/reset_password';
            $http({
                method: 'POST',
                url: methodUrl,
                data: {user_id: userId, password_reset_token: token, password: password}
            })
            .success(function(data, status, headers, config) {
                defer.resolve(data);
            })
            .error(function(data, status, headers, config) {
                var errorMessage = 'ERROR in usersService: API returned with a response code: ' + status;
                defer.reject(data);
            });
            return defer.promise;
        }
    }
}]);

/* Discover
====================================== */
pServices.factory('DiscoverService', ['$q', 'VideosApiResource', 'FeedDelegate',
    function($q, Videos, FeedDelegate) {
        return{
            loadFeed: function(cursor) {
                var loadingFeed = $q.defer();
                var feed = {cursor : cursor ? cursor : null, videos : []};
                Videos.listBrandNewVideos(cursor)
                    .then(function(VideosApiResponse){
                        feed.cursor = VideosApiResponse.nextCursor;
                        angular.forEach(VideosApiResponse.results, function(video, key) {
                            var nextVideo = FeedDelegate.deserializeVideo(video.object);
                            if (nextVideo.isAvailable) {
                              feed.videos.push(nextVideo);
                            }
                        });
                        return feed;
                    })
                    .then(function(feed) {
                      FeedDelegate.preRenderFeed(feed).then(function() {
                        loadingFeed.resolve(feed);
                      });
                    })
                    .catch(function(error) {
                        loadingFeed.reject(error);
                    });
                return loadingFeed.promise;
            }
        }
}]);

/* Profile
======================================= */
pServices.factory('ProfileService', ['$q', 'VideosApiResource', 'UsersApiResource', 'FeedDelegate', 'ProfileDelegate',
    function($q, Videos, Users, FeedDelegate, ProfileDelegate) {
    return {
        loadFeed : function(username, cursor) {
            var loadingFeed = $q.defer();
            var feed = {cursor: '', videos: []};
            Videos.listUserVideos(username, cursor)
                .then(function(VideosApiResponse) {
                    angular.forEach(VideosApiResponse.results, function(video, key) {
                        feed.cursor = VideosApiResponse.nextCursor;
                        var nextVideo = FeedDelegate.deserializeVideo(video.object);
                        if (nextVideo.isAvailable) {
                          feed.videos.push(nextVideo);
                        }
                    });
                    return feed;
                })
                .then(function(feed) {
                  FeedDelegate.preRenderFeed(feed).then(function() {
                    loadingFeed.resolve(feed);
                  });
                })
                .catch(function(error) {
                    loadingFeed.reject(error);
                });
            return loadingFeed.promise;
        },
        loadProfile : function(username, user_id) {
            var loadingProfile = $q.defer();
            var profile = {};
            Users.show(username, user_id)
                .then(function(UsersApiResponse) {
                   profile = ProfileDelegate.deserializeProfile(UsersApiResponse.result.object);
                    loadingProfile.resolve(profile);
                })
                .catch(function(error) {
                   loadingProfile.reject(error);
                });
            return loadingProfile.promise;
        },
        loadIndividualPresent : function(videoId) {
            var loadingPresent = $q.defer();
            var feed = {cursor: '', videos: []};
            Videos.show(videoId)
                .then(function(VideosApiResponse){
                    var video = FeedDelegate.deserializeVideo(VideosApiResponse.result.object);
                    feed.videos.push(video);
                    loadingPresent.resolve(feed);
                });
            return loadingPresent.promise;
        }
    }
}]);

/*Feed Delegates
======================================= */
pServices.factory('FeedDelegate', ['$q', '$interval', function($q, $interval) {
    return{
        deserializeVideo : function(video) {
            var deserializedVideo = {};
            deserializedVideo._id = video._id;
            deserializedVideo.title = video.title;
            deserializedVideo.isAvailable = video.isAvailable;
            deserializedVideo.mediaUrl = {
                still  : video.mediaUrls ? video.mediaUrls.images['480px'] : '',
                live   : video.mediaUrls ? video.mediaUrls.playlists.live.master : '',
                replay : video.mediaUrls ? video.mediaUrls.playlists.replay.master : ''
            };
            deserializedVideo.creator = {
                _id            : video.creatorUser.object ? video.creatorUser.object._id : '',
                username       : video.creatorUser.object ? video.creatorUser.object.username : '',
                fullName       : video.creatorUser.object ? video.creatorUser.object.profile.fullName : '',
                profilePicture : video.creatorUser.object ? video.creatorUser.object.profile.picture : {}
            };
            deserializedVideo.likes = video.likes.count;
            deserializedVideo.start = video.creationTimeRange.startDate;
            deserializedVideo.end = video.creationTimeRange.endDate;

            if(video.creationTimeRange.endDate) {
                deserializedVideo.isLive = false;
                deserializedVideo.timeAgo = moment(deserializedVideo.end).fromNow();
            }
            else {
                deserializedVideo.isLive = true;
                deserializedVideo.timeAgo = 'Present';
            }

            if(deserializedVideo.creator.fullName) {
              deserializedVideo.creator.displayName = deserializedVideo.creator.fullName;
            } else {
              deserializedVideo.creator.displayName = deserializedVideo.creator.username;
            }

            return deserializedVideo;
        },
        preRenderFeed: function(Feed) {
            var promises = [];
            angular.forEach(Feed.videos, function(source, key) {
                var still = new Image();
                still.src = source.mediaUrl.still;
                var checkImageInterval = $interval(function() {
                  promises.push(checkImageInterval);
                  if(still.complete) {
                    $interval.cancel(checkImageInterval);
                  }
                }, 100)
            });
            return $q.all(promises);
        },
    }
}]);

/* PROFILE DELEGATE
====================================*/

pServices.factory('ProfileDelegate', function() {
    return {
        deserializeProfile : function(user) {
            var deserializedProfile = {};
            deserializedProfile._id = user._id;
            deserializedProfile.username = user.username;
            deserializedProfile.fullName = user.profile.fullName;
            deserializedProfile.profilePicture = user.profile.picture;
            deserializedProfile.description = user.profile.description;
            deserializedProfile.stats = {
                videos     : user.videos.count,
                views      : user.views.count,
                demands    : user.demands.count,
                followers  : user.followers.count,
                friends    : user.friends.count
            };
            return deserializedProfile;
        }
    }
});


/* HOME
 * =============================================
 */

 pServices.factory('HomeService', ['$q', function($q) {
   return{
     preloadPhoneScreens: function() {
         var promises = [];
         var images = ['assets/img/app-screen.png', 'http://placehold.it/250x361/8E03F5/FFF', 'http://placehold.it/250x361/CCCCCC/FFF'];
         angular.forEach(images, function(source, key) {
             var img = new Image();
             img.src = source;
         });
         return images;
     },
   }
 }]);


/* DOWNLOAD LINK
 * ===========================================
 */

pServices.factory('TextMessageService', ['$http', '$q', function($http, $q) {
    return {
      sendTextMessage : function(phoneNumber) {
        var defer = $q.defer();
        $http({
            method: 'POST',
            url: '/send_link/',
            data: {device: 'iphone', number: phoneNumber}
        })
        .success(function(data, status, headers, config) {
            defer.resolve();
        })
        .error(function(data, status, headers, config) {
            var errorMessage = 'ERROR in TextMessageService: API returned with a response code: ' + status;
            console.log(errorMessage);
            defer.reject();
        });
        return defer.promise;
      }
    }
}]);


/* ACCOUNT
 * =============================================
 */

pServices.factory('AccountService', ['$q', 'UsersApiResource', function($q, Users) {
    return {
        confirmEmail : function(userId, token) {
            var defer = $q.defer();
            Users.confirmEmail(userId, token)
                .then(function(data){
                   console.log(data);
                   defer.resolve('Thank you! Your account is now verified');
                })
                .catch(function(error){
                  console.log(error);
                    defer.resolve('Incorrect Account Information.');
                });
            return defer.promise;
        },
        resetPassword: function(userId, token, password) {
            var defer = $q.defer();
            Users.resetPassword(userId, token, password)
                .then(function() {
                   defer.resolve(true);
                })
                .catch(function(error) {
                   console.log(error.result);
                   defer.reject(error.result);
                });
                return defer.promise;
            }
        }
}]);


/* UTILITY
 * =============================================
 */

pServices.factory('Utilities', ['$q', '$timeout', function($q, $timeout) {
    return {
        transitionComplete: function(duration) {
            var defer = $q.defer();
            $timeout(function() {
                defer.resolve();
            }, duration);
            return defer.promise;
        },
        checkParams: function(params) {
            var defer = $q.defer();
            angular.forEach(params, function(param, key) {
                if(!param) {
                    defer.resolve(false)
                }
                else if(key == params.length -1){
                    defer.resolve(true)
                }
            });
            return defer.promise;
        }
    }
}]);