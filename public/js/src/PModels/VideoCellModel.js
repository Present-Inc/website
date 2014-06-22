/**
 * @namespace
 * @param {UIRouter} $state
 * @param {PManagers} UserContextManager
 * @param {PManagers} ApiManager
 * @param {PModels} VideoModel
 * @param {PModels} CommentModel
 * @param {PModels} LikeModel
 * @param {PModels} ReplyModel
 */

 PModels.factory('VideoCellModel', ['$state', 'UserContextManager', 'ApiManager', 'VideoModel',
	 																	'CommentModel', 'LikeModel', 'ReplyModel',

	 function($state, UserContextManager, ApiManager, VideoModel,
						CommentModel, LikeModel, ReplyModel) {

   return {

		 /**
			* Factory method that returns a new Request instance constructed from an API response
			* @returns {VideoCell}
			*/

	 	 construct: function(apiVideoObject, subjectiveMeta) {

			 /**
				* @constructor
				* @param {Object} apiVideoObject - Video result object returned from the API
				* @param subjectiveMeta - Subjective meta data for the video result object
				*
				* @property {Video} video - Video contained within the cell
				* @property {Comments[]} comments -  Array of comments associated with the video
				* @property {Likes[]} likes - Array of likes associated with the video
				* @property {Replies[]} replies - Array of replies associated with the video
				* @property {Object} input - Object containing bindable text input values
				*/

				function VideoCell(apiVideoObject, subjectiveMeta) {
					this.video = VideoModel.construct(apiVideoObject);
					this.comments = [];
					this.likes = [];
					this.replies = [];

				 //TODO: Extract this out of the videoCell Model
					this.input = {
						comment : ''
					};

				  //TODO: Move this subjective meta to the video model instead
					this.subjectiveMeta = subjectiveMeta;

					var embededResults = {
						comments : apiVideoObject.comments.results,
						likes : apiVideoObject.likes.results,
						replies : apiVideoObject.replies.results
					};

				 /**
					* Loop through comments likes and replies, creating a new instance of each and then adding it to the VideoCell
					*
					*/

					for(var i = 0;  i < embededResults.comments.length; i++) {
						var Comment = CommentModel.construct(embededResults.comments[i].object);
						this.comments.splice(0, 0, Comment);
					}

					for(var j = 0; j < embededResults.likes.length;  j++) {
						var Like = LikeModel.construct(embededResults.likes[j].object);
						this.likes.push(Like);
					}

					for(var k = 0; k < embededResults.replies.length; k++) {
						var Reply = ReplyModel.construct(embededResults.replies[k].object);
						this.replies.push(Reply);
					}
				}

			 /**
				* Either adds or removes a like depending on the user's current relationship with the video
				* NOTE: Like create and destroy methods are stubbed intentionally
				*/

			 VideoCell.prototype.toggleLike = function() {

					var userContext = UserContextManager.getActiveUserContext(),
							_this = this;

				  /** Redirect the user to log in if there is no active user context **/
					if(!userContext) {
						$state.go('login');
					}
					/** Remove the like if the user already has a forward like relationship with the video **/
					else if (this.subjectiveMeta.like.forward) {
						this.video.counts.likes--;
						this.subjectiveMeta.like.forward = false;
						for (var i=0; i < this.likes.length; i ++) {
							if (this.likes[i].sourceUser._id == userContext.userId)
							this.likes.splice(i, 1);
						}
						ApiManager.likes('destroy', userContext, {video_id : this.video._id});
					/** Add a like if there is no forward like relationship with the video **/
					} else {
							var newLike = LikeModel.create(this.video._id, userContext.profile);
							this.video.counts.likes++;
							this.subjectiveMeta.like.forward = true;
							this.likes.push(newLike);
							ApiManager.likes('create', userContext, {video_id : this.video._id});
						}

			 };

			 /**
				* Adds a comment to the video cell, and informs the API
				*/

			 //TODO: pass in the new comment input, since it is no longer an instance property
			 VideoCell.prototype.addComment = function() {

					var userContext = UserContextManager.getActiveUserContext(),
							_this = this;

				 /** Redirect the user to log in if there is no active user context **/
				 if(!userContext) {
						$state.go('login');
					}
				 /** Add the comment to the video cell **/
				 else if (this.input.comment.length >= 1) {
						var newComment = CommentModel.create(this.input.comment, this.video._id, userContext.profile);
						this.video.counts.comments++;
						this.input.comment = '';
						ApiManager.comments('create', userContext, {body : newComment.body, video_id: newComment.targetVideo})
							.then(function(apiResponse) {
								newComment._id = apiResponse.result.object._id;
								_this.comments.push(newComment);
							});
				 }

			 };

			 /**
				* Deletes the selected comment from the video cell and informs the API
				* @param {Comment} comment - The comment to be deleted
				*/

			 VideoCell.prototype.removeComment = function(comment) {

				 var userContext = UserContextManager.getActiveUserContext();

				 /** Redirect the user if there is no active user context **/
				 if(!userContext) {
				 	$state.go('login');
				 /** Remove the comment if the active user is the source user of the comment **/
				 } else if(comment.sourceUser._id == userContext.userId) {
						this.video.counts.comments--;
						for (var i = 0; i < this.comments.length; i ++) {
							if (this.comments[i]._id == comment._id) {
								this.comments.splice(i, 1);
							}
						}
						ApiManager.comments('destroy', userContext, {comment_id : comment._id});
				 }

			 };

			 return new VideoCell(apiVideoObject, subjectiveMeta);

		 }
   }

 }]);
