/**
 * PModels.VideoCellModel
 * Constructs the individual components of a video cell
 */

 PModels.factory('VideoCellModel', ['$state', 'UserContextManager', 'LikesApiClient', 'CommentsApiClient',
	 																				'VideoModel', 'CommentModel', 'LikeModel', 'ReplyModel',

	 function($state, UserContextManager, LikesApiClient, CommentsApiClient,
						VideoModel, CommentModel, LikeModel, ReplyModel) {

   return {
		construct: function(apiVideoObject, subjectiveMeta) {

			function VideoCell(apiVideoObject, subjectiveMeta) {
				this.video = VideoModel.construct(apiVideoObject);
				this.subjectiveMeta = subjectiveMeta;
				this.comments = [];
				this.likes = [];
				this.replies = [];

				var embededResults = {
					comments : apiVideoObject.comments.results,
					likes : apiVideoObject.likes.results,
					replies : apiVideoObject.replies.results
				};

				for(var i = 0;  i < embededResults.comments.length; i++) {
					var Comment = CommentModel.construct(embededResults.comments[i].object);
					this.comments.push(Comment);
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

			VideoCell.prototype.toggleLike = function() {

				var userContext = UserContextManager.getActiveUserContext(),
						_this = this;

				if(!userContext) {
					$state.go('login');
				}
				else if (this.subjectiveMeta.like.forward) {
					this.video.counts.likes--;
					this.subjectiveMeta.like.forward = false;
					for (var i=0; i < this.likes.length; i ++) {
						if (this.likes[i].sourceUser._id == userContext.userId)
						this.likes.splice(i, 1);
					}
					LikesApiClient.destroy(this.video._id, userContext);
				} else {
						this.video.counts.likes++;
						this.subjectiveMeta.like.forward = true;
						this.likes.push(LikeModel.create(_this.video._id, userContext.profile));
						//LikesApiClient.create(this.video._id, userContext);
					}

			};

			VideoCell.prototype.createComment = function() {

			};

			VideoCell.prototype.deleteComment = function() {

			};

			return new VideoCell(apiVideoObject, subjectiveMeta);
		}
   }

 }]);
