/**
 * Constructs a new Comment Object
 * @namespace
 */

	PModels.factory('CommentModel', function() {
		return{

			/**
			 * Factory method that returns a new Comment instance from an API response object
			 * @param {Object} apiCommentObject - Comment result object returned from the API
			 * @returns {Comment}
			 */
			construct : function(apiCommentObject) {

				/**
				 * @constructor
				 * @param {Object} apiCommentObject - Like result object returned from the API
				 *
				 * @property {String} _id - Unique _id for the Comment
				 * @property {Object} sourceUser - User who created the Comment
				 * @property {String} targetVideo - String representing the _id of the target video
				 * @property {String} timeAgo - Time elapsed since the like was created
				 */

				function Comment(apiCommentObject) {
					this._id = apiCommentObject._id;
					this.body = apiCommentObject.body;
					this.sourceUser = {
						_id: apiCommentObject.sourceUser.object._id,
						username: apiCommentObject.sourceUser.object.username,
						profilePicture: apiCommentObject.sourceUser.object.profile.picture.url
					};
					this.targetVideo = apiCommentObject.targetVideo;
					this.timeAgo = '5 min'
				}

				return new Comment(apiCommentObject);

			},

			create : function(body, targetVideo, sourceUser) {

				/**
				 * 'Overloaded' constructor for creating new comment objects
				 * @constructor
				 * @param {String} targetVideo
				 * @param {Object} sourceUser
				 * @see construct method for property overview
				 */

				function Comment(body, targetVideo, sourceUser) {
					this._id = "";
					this.body = body;
					this.sourceUser = {
						_id: sourceUser._id,
						username: sourceUser.username,
						profilePicture: sourceUser.profilePicture
					};
					this.targetVideo = targetVideo;
					this.timeAgo = '5 min';
				}

				return new Comment(body, targetVideo, sourceUser)

			}

		}
	});
