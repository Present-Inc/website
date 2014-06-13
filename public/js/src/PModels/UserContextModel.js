/**
 * PModels.UserContextConstructor
 */

	PModels.factory('UserContextModel', ['ProfileModel', function(ProfileModel) {
		return {

			construct: function(apiResponseObject) {

				function UserContext (apiResponseObject) {
					this.token  = apiResponseObject.sessionToken;
					this.userId = apiResponseObject.user.object._id;
					this.profile = ProfileModel.construct(apiResponseObject.user.object);
				}

				return new UserContext(apiResponseObject);

			},

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