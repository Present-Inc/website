/**
 * PConstructors.VideoCellConstructor
 *  Constructs the individial components of a video cell
 *   @dependency {Utilities} logger
 */

 PConstructors.factory('VideoCellConstructor', ['logger', function() {
   return {
    Video : {
      create : function(apiVideoObject) {

        function Video(apiVideoObject) {
          this._id = apiVideoObject._id;
          this.title = apiVideoObject.title;
          this.isAvailable = apiVideoObject.isAvailable;
          this.media = {
            still          : apiVideoObject.mediaUrls.images['480px'],
            replayPlaylist : apiVideoObject.mediaUrls.playlists.replay.master
          }
          //Check to see if the video is live
          if(!apiVideoObject.creationTimeRange.endDate) {
            this.isLive = true;
            this.media.livePlaylist = apiVideoObject.mediaUrls.playlists.live.master;
            this.timeAgo = "Present"
          } else {
            this.isLive = false;
            //TODO: implement momentsjs to generate formatted time from apiVideoObject.creationTimeRange.endDate
            this.timeAgo = '20 minutes ago'
          }

          this.location = {
            name: null,
            lat: null,
            long: null,
          };

          this.creator = {
            _id             : creatorUser.object._id,
            username        : creatorUser.object.username,
            fullName        : creatorUser.obect.fullName,
            profilePicture  : creatorUser.object.profile.picture.url,
          }

          //Determine the display name(s)
          if(this.creator.fullname) {
            this.displayName = this.creator.fullName;
            this.altName = this.creator.username;
          } else {
            this.displayName = this.creator.username;
            this.altName = null;
          }
        }

        return new Video(apiVideoObject);

      }
     },
     Comments: {
      create: function(apiCommentResults) {

       function Comment(apiCommentObject) {
         this.body = apiCommentObject.body,
         this.sourceUser = {
           username: apiCommentObject.sourceUser.object.username,
           profilePicture: apiCommentObjectx.sourceUser.object.profile.picture
         }
         //TODO: implement momentsjs to generate formatted time from apiCommentObject
         this.timeAgo = '5 min'
       }

       var comments = [];

       for(var i=0, length=apiCommentResults.length; i < length; i++) {
           var newComment = new Comment(apiCommentResults[i]);
           comments.push(newComment);
       }

         return comments;

       }
     },
     Replies: {
       create: function(apiRepliesObject) {

        function Reply(ApiRepliesObject) {
           count: ApiRepliesObject
        };

        return new Reply(apiRepliesObject);

       }
     },
     Likes: {
      create: function(ApiLikesObject) {

       function Likes() {
          count: ApiLikesObject.count
       }

       return new Likes();

      }
     }

   }
 }]);
