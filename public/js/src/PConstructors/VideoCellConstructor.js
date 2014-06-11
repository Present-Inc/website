/**
 * PConstructors.VideoCellConstructor
 *  Constructs the individual components of a video cell
 */

 PConstructors.factory('VideoCellConstructor', ['$state',
	 																							'UserContextManager',
	 																							'LikesApiClient',
	 																							'CommentsApiClient',
	 																							'VideoConstructor',
	 																							'CommentConstructor',
	 																							'LikeConstructor',
	 																							'ReplyConstructor',

	 function($state, UserContextManager, LikesApiClient, CommentsApiClient,
						VideoConstructor, CommentConstructor, LikeConstructor, ReplyConstructor) {

   return {
		create: function(apiVideoObject, subjectiveMeta) {

			function VideoCellConstructor() {
				this.video = VideoConstructor.create(apiVideoObject);
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
					var Comment = CommentConstructor.create(embededResults.comments[i].object);
					this.comments.push(Comment);
				}

				for(var j = 0; j < embededResults.likes.length;  j++) {
					var Like = LikeConstructor.create(embededResults.likes[j].object);
					this.likes.push(Like);
				}

				for(var k = 0; k < embededResults.replies.length; k++) {
					var Reply = ReplyConstructor.create(embededResults.replies[k].object);
					this.replies.push(Reply);
				}

			}

			VideoCellConstructor.prototype.addLike = function(apiResponse) {
				if(!apiResponse.errorCode == 100002) {
					this.likes.push(LikeConstructor(apiResponse.result.object));
				}
			};

			VideoCellConstructor.prototype.removeLike = function(apiResponse, sourceUser) {
				if(!apiResponse.errorCode == 100001) {
					for (var i=0; i < this.likes.length; i ++) {
						if (this.likes[i]._sourceUser == sourceUser)
						this.likes[i].splice(i, 1);
					}
				}
			};

			VideoCellConstructor.prototype.toggleLike = function() {

				var userContext = UserContextManager.getActiveUserContext(),
						_this = this;

				if(!userContext) {
					$state.go('login');
				}
				else if (this.subjectiveMeta.like.forward) {
					this.video.counts.likes--;
					this.subjectiveMeta.like.forward = false;
					LikesApiClient.destroy(this.video._id, userContext)
						.then(function(apiResponse) {
							_this.removeLike(apiResponse, userContext.userId);
						})
						.catch(function() {
							_this.removeLike(apiResponse, userContext.userId);
						})
				} else {
					this.video.counts.likes++;
					this.subjectiveMeta.like.forward = true;
					LikesApiClient.create(this.video._id, userContext)
						.then(function(apiResponse) {
							_this.addLike(apiResponse);
						})
						.catch(function() {
							_this.addLike(apiResponse);
						});
				}

			};

			return new VideoCellConstructor(apiVideoObject)
		}
   }

 }]);
