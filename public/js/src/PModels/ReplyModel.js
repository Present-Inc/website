/**
 * Constructs a new Reply Model
 */

PModels.factory('ReplyModel', function() {
	return {
		construct: function(apiReplyObject) {

			function Reply(apiReplyObject) {
				this._id = apiReplyObject._id;
				this.sourceUser = apiReplyObject.sourceUser;
				this.targetVideo = apiReplyObject.targetVideo;
			}

			return new Reply(apiReplyObject);

		}
	}
});
