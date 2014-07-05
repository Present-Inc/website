
  var request = require('request');

  module.exports = {

    create: function(videoId, callback) {

				function Video(apiVideoObject) {
					this._id = apiVideoObject._id;
					this.title = apiVideoObject.title;
					this.isAvailable = apiVideoObject.isAvailable;
					this.media = {
						still          : apiVideoObject.mediaUrls.images['480px'] || null,
						replayPlaylist : apiVideoObject.mediaUrls.playlists.replay.master || null
					};

					/** Check to see if the video is live **/
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
						long: null
					};

					this.counts = {
						comments: apiVideoObject.comments.count,
						likes: apiVideoObject.likes.count
					};

					if (apiVideoObject.creatorUser.object)
					this.creator = apiVideoObject.creatorUser.object;
				}

      var requestOptions = {
        url: 'https://api.present.tv/v1/videos/show?video_id=' + videoId,
      };

      request(requestOptions, function(error, response, body) {
        if(error) callback(error);
        else if (response.statusCode == 200) {
          var body = JSON.parse(body),
              video = new Video(body.result.object);
          callback(null, video);
        } else {
          callback(body);
        }
      });

    }

  };
