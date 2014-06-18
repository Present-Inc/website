
PModels.factory('ProfileModel', function() {

	return {

		construct : function(apiProfileObject) {

			function Profile(apiProfileObject) {
				this._id = apiProfileObject._id;
				this.username = apiProfileObject.username;
				this.fullName = apiProfileObject.profile.fullName || '';
				this.profilePicture = apiProfileObject.profile.picture.url;
				this.description = apiProfileObject.profile.description;


				this.counts = {
					videos: apiProfileObject.videos.count,
					views: apiProfileObject.views.count,
					likes: apiProfileObject.likes.count,
					followers: apiProfileObject.followers.count,
					friends: apiProfileObject.friends.count
				};

				this.phoneNumber = apiProfileObject.phoneNumber ? apiProfileObject.phoneNumber : null;
				this.email = apiProfileObject.email ? apiProfileObject.email : null;
			}

			return new Profile(apiProfileObject);

		}

	}

});