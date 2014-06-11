/**
 * PConstructors.VideoCellConstructor
 *  Constructs the individial components of a video cell
 */

 PConstructors.factory('VideoCellConstructor', ['VideoConstructor', 'CommentConstructor', 'LikeConstructor', 'ReplyConstructor',

	 function(VideoConstructor, CommentConstructor, LikeConstructor, ReplyConstructor) {

   return {
		create: function(apiVideoObject) {

			function VideoCellConstructor() {
				this.video = VideoConstructor.create(apiVideoObject);
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

				for(var j = 0; j < embededResults.likes.length;  i++) {
					var Like = LikeConstructor.create(embededResults.likes[j].object);
					this.likes.push(Like);
				}

				for(var k = 0; i < embededResults.replies.length; i++) {
					var Reply = ReplyConstructor.create(embededResults.replies[k].object);
					this.replies.push(Reply);
				}

			}

			return new VideoCellConstructor(apiVideoObject)
		}
   }

 }]);
