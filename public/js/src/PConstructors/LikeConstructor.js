/**
 * PConstructors.LikeConstructor
 */

	PConstructors.factory('LikeConstructor', function() {
		return {
			create: function(apiLikeObject) {

				function Like(apiLikeObject) {
					this._id = apiLikeObject._id;
					this.sourceUser = apiLikeObject.sourceUser;
					this.targetVideo = apiLikeObject.targetVideo;
				}

				return new Like(apiLikeObject);

			}
		}
	});
