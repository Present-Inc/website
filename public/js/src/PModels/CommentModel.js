/**
 * PModels.CommentModel.js
 */

	PModels.factory('CommentModel', function() {
		return{
			construct : function(apiCommentObject) {

				function Comment(apiCommentObject) {
					this._id = apiCommentObject._id;
					this.body = apiCommentObject.body;
					this.sourceUser = {
						username: apiCommentObject.sourceUser.object.username,
						profilePicture: apiCommentObject.sourceUser.object.profile.picture
					};
					this.timeAgo = '5 min'
				}

				return new Comment(apiCommentObject);

			}
		}
	});
