/**
 * Constructs a new likes object
 * @namespace
 */

	PModels.factory('LikeModel', function() {
		return {

			/**
			 * Factory method that returns a new like instance constructed from an API response
			 * @returns {Like}
			 */

			construct: function(apiLikeObject) {

				/**
				 * @constructor
				 * @param {Object} apiLikeObject - Like result object returned from the API
				 *
				 * @property {String} _id - Unique _id for the Like
				 * @property {Object} sourceUser - User who created the Like
				 * @property {String} targetVideo - String representing the _id of the target video
				 * @property {String} timeAgo - Time elapsed since the like was created
				 */

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

			},

			/**
			 * Factory method that returns a new Like instance created within the app
			 * @returns {Like}
			 */

			create : function(targetVideo, sourceUser) {

				/**
				 * 'Overloaded' constructor for creating new like objects
				 * @constructor
				 * @param {String} targetVideo
				 * @param {Object} sourceUser
				 * @see construct method for property overview
				 */

				function Like(targetVideo, sourceUser) {
					this._id = "";
					this.sourceUser = {
						_id : sourceUser._id,
						username : sourceUser.username
					};
					this.targetVideo = targetVideo;
					//TODO: implement a momentjs utility service
					this.timeAgo = 'Just now'
				}

				return new Like(targetVideo, sourceUser);

			}

		}
	});
