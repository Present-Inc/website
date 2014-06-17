/**
 * Constructs a new UserContext Model
 * @namespace
 */

	PModels.factory('UserContextModel', ['ProfileModel', function(ProfileModel) {
		return {

			/**
			 * Factory method that returns a new UserContext instance constructed from an API response
			 * @param {Object} apiResponseObject - UserContext result object returned from the API
			 * @returns {UserContext}
			 */

			construct: function(apiResponseObject) {

				/**
				 * @constructor
				 * @param {Object} apiResponseObject
				 */

				function UserContext (apiResponseObject) {
					this.token  = apiResponseObject.sessionToken;
					this.userId = apiResponseObject.user.object._id;
					this.profile = ProfileModel.construct(apiResponseObject.user.object);
				}

				return new UserContext(apiResponseObject);

			},

			/**
			 * Factory method that returns a new UserContext instance created within the app.
			 * @param {String} token - Session token associated with the user context
			 * @param {String} userId - String representing the _id of the user
			 * @param {Profile} profile - Profile of user
			 * @returns {UserContext}
			 */

			create: function(token, userId, profile) {

				function UserContext () {
					this.token = token;
					this.userId = userId;
					this.profile = profile;
				}

				return new UserContext(token, userId, profile);

			}

		}
	}]);