/**
 * PConstructors.ReplyConstructor
 */

PConstructors.factory('ReplyConstructor', function() {
	return {
		create: function(apiLikesObject) {

			function Reply(apiLikeObject) {
				this._id = apiLikeObject._id;
				this.sourceUser = apiLikeObject.sourceUser;
				this.targetVideo = apiLikeObject.targetVideo;
			}

			return new Reply(apiLikeObject);

		}
	}
});
