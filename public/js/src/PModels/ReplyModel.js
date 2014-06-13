/**
 * PModels.ReplyModel
 */

PModels.factory('ReplyModel', function() {
	return {
		construct: function(apiLikesObject) {

			function Reply(apiLikeObject) {
				this._id = apiLikeObject._id;
				this.sourceUser = apiLikeObject.sourceUser;
				this.targetVideo = apiLikeObject.targetVideo;
			}

			return new Reply(apiLikeObject);

		}
	}
});
