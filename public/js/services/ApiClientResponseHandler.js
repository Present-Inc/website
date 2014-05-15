/*
 * ApiClientResponseHandler.js
 * Defines a RequireJS Module for the API Client Response Hadler
 */

 define(['./module'], function(PServices) {

   /*PServices.ApiClientResponseHandler
    * Handles the raw API responses from the ApiClients and constructs new objects
    * which are injected into the view controllers
    *   @dependency {Present} logger
    */

    PServices.factory('ApiClientResponseHandler', ['logger',

      function(logger) {
        return {

          /* deserializeVideo
           * Deserialzes the raw api video response object
           *   @params <Object> VideosApiClientResponse -- raw response object
           */

          deserializeVideo : function(ApiClientResponseObject) {

           function deserializedVideo(rawVideoData) {
             this._id = rawVideoData._id;
             this.title = rawVideoData.title;
             this.isAvailable = rawVideoData.isAvailable;
             this.media = {
               still: rawVideoData.mediaUrls.images['480px'],
               replayPlaylist: rawVideoData.mediaUrls.playlists.replay.master
             }

             //Check to see if the video is live
             if(!rawVideoData.creationTimeRange.endDate) {
               this.isLive = true;
               this.media.livePlaylist = rawVideoData.mediaUrls.playlists.live.master;
               this.timeAgo = 'Present';
             } else {
               this.isLive = false;
               this.timeAgo = '20 minutes ago';
             }

             this.counts = {
               likes    : rawVideoData.likes.count,
               comments : rawVideoData.comments.count,
               replies  : rawVideoData.replies.count
             };

             this.comments = [];

           }

           //logger.debug(['PServices.ApiClientResponseHandler -- deserializing new video', VideosApiClientResponse]);
           return new deserializedVideo(ApiClientResponseObject);
         },

         /* deserializeComments
          * Deserialzes the raw api comments response object
          *   @params <Object> ApiClientResponseObject -- raw response object
          */

          deserializeComments : function(ApiClientResponseObject) {

            function deserializedComment(rawCommentsData) {
              this.body = rawCommentsData.body;
              this.sourceUser = {
                username: rawCommentsData.sourceUser.object.username,
                profilePicture: rawCommentsData.sourceUser.object.profile.picture.url
              };
              this.timeAgo = '5 min';

            }

            var comments = [];

            //logger.debug(['PServices.ApiClientResponseHandler.deserializeComments -- raw comments object', ApiClientResponseObject]);
            for(var i=0; i < ApiClientResponseObject.results.length; i++) {
              comments.push(new deserializedComment(ApiClientResponseObject.results[i].object));
            }

            return comments;

          },

          /* deserializeCreator
           * Deserialized the raw creator response object
           * @params <Object> ApiClientResponseObject -- raw response object
           */

          deserializeCreator : function(ApiClientResponseObject) {

            function deserializedCreator(rawCreatorData) {
              this._id = rawCreatorData._id;
              this.username = '@' + rawCreatorData.username;
              this.fullName = rawCreatorData.profile.fullName;

              //Set Full name to Display Name, if available
              if(rawCreatorData.profile.fullName) this.displayName = rawCreatorData.profile.fullName;
              else this.displayName = rawCreatorData.username;

              this.profilePicture = rawCreatorData.profile.picture.url;
            }

            return new deserializedCreator(ApiClientResponseObject);

          },

          deserializeUser : function(ApiClientResponseObject) {
            
          }
        }
      }

    ]);

 });
