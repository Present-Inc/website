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
