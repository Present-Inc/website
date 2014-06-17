/**
 * Constructs a new Profile Model
 * @namespace
 */

  PModels.factory('ProfileModel', function() {
    return {

			/**
			 * Factory method that returns a new instance of the Profile Model
 			 * @param apiProfileObject
			 * @returns {Profile}
			 */

			construct : function(apiProfileObject) {

			/**
			 * @constructor
			 * @param {Object} subjectiveObjectMeta
			 * @param {Object} apiProfileObject
			 */

			 function Profile(apiProfileObject, subjectiveObjectMeta) {
				 this._id = apiProfileObject._id;
				 this.username = apiProfileObject.username;
				 this.fullName = apiProfileObject.profile.fullName || '';
				 this.profilePicture = apiProfileObject.profile.picture.url;
				 this.description = apiProfileObject.profile.description;
				this.subjectiveMeta = subjectiveObjectMeta;

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

			 Profile.prototype.follow = function() {

			 };

			 Profile.prototype.demand = function() {

			 };

			  return new Profile(apiProfileObject);

			}
    }
 });
