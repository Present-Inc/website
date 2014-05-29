/**
 * PConstructors.FeedConstructor
 * Constructs the Feed, which is composed of Video Cells
 *   @dependency {Present} VideoCellConstructor
 */

  PConstructors.factory('FeedConstructor', ['VideoCellConstructor',

    function(VideoCellConstructor) {
      return {
        create: function(apiResponse) {

          var Feed = {
            cursor: apiResponse.nextCursor,
            videoCells: []
          }

          for(var i=0, length=apiResponse.results.length; i < length; i++) {
            var VideoCell = {
              video    : VideoCellConstructor.Video.create(apiResponse.results[i].object),
              comments : VideoCellConstructor.Comments.create(apiResponse.results[i].object.comments),
              likes    : VideoCellConstructor.Likes.create(apiResponse.results[i].object.likes),
              replies  : VideoCellConstructor.Replies.create(apiResponse.results[i].object.replies)
            };
            Feed.videoCells.push(VideoCell);
          }

          return Feed;

        }
      }
    }

 ]);


/**
 * PConstructors.VideoCellConstructor
 *  Constructs the individial components of a video cell
 */

 PConstructors.factory('VideoCellConstructor', [function() {
   return {
    Video : {
      create : function(apiVideoObject) {

        function Video(apiVideoObject) {
          this._id = apiVideoObject._id;
          this.title = apiVideoObject.title;
          this.isAvailable = apiVideoObject.isAvailable;
          this.media = {
            still          : apiVideoObject.mediaUrls.images['480px'] || null,
            replayPlaylist : apiVideoObject.mediaUrls.playlists.replay.master || null
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
            _id             : apiVideoObject.creatorUser.object._id,
            username        : apiVideoObject.creatorUser.object.username,
            fullName        : apiVideoObject.creatorUser.object.profile.fullName,
            profilePicture  : apiVideoObject.creatorUser.object.profile.picture.url,
          }

          //Determine the display name(s)
          if(apiVideoObject.creatorUser.object.fullName) {
            this.displayName = apiVideoObject.creatorUser.object.fullName;
            this.altName = apiVideoObject.creatorUser.object.username;
          } else {
            this.displayName = apiVideoObject.creatorUser.object.username;
            this.altName = null;
          }
        }

        return new Video(apiVideoObject);

      }
     },
     Comments: {
      create: function(apiCommentsObject) {

       function Comment(apiCommentObject) {
         this.body = apiCommentObject.body,
         this.sourceUser = {
           username: apiCommentObject.sourceUser.object.username,
           profilePicture: apiCommentObject.sourceUser.object.profile.picture
         }
         //TODO: implement momentsjs to generate formatted time from apiCommentObject
         this.timeAgo = '5 min'
       }

       var comments = [];

       for(var i=0, length=apiCommentsObject.results.length; i < length; i++) {
           var newComment = new Comment(apiCommentsObject.results[i].object);
           comments.push(newComment);
       }

       return comments;

       }
     },
     Replies: {
       create: function(apiRepliesObject) {

        function Reply(apiRepliesObject) {
           this.count = apiRepliesObject.count
        };

        return new Reply(apiRepliesObject);

       }
     },
     Likes: {
      create: function(apiLikesObject) {

       function Likes(apiLikesObject) {
          this.count = apiLikesObject.count
       }

       return new Likes(apiLikesObject);

      }
     }

   }
 }]);
