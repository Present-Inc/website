/**
 * PConstructors.LikeConstructor
 */

	PConstructors.factory('LikeConstructor', function() {
		return {
			create: function(apiLikeObject) {

				function Like(apiLikeObject) {
					this._id = apiLikeObject._id;
					this.sourceUser = {
						_id : apiLikeObject.sourceUser.object._id,
						username : apiLikeObject.sourceUser.object.username
					};
					this.targetVideo = apiLikeObject.targetVideo;
					//TODO: implement a momentjs utility service
					this.timeAgo = '2 minutes'
				}

				return new Like(apiLikeObject);

			}
		}
	});
