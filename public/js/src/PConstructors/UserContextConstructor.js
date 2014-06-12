/**
 * PConstructor.UserContextConstructor
 */

	PConstructors.factory('UserContextModel', ['ProfileConstructor', function(ProfileConstructor) {
		return {

			construct: function(apiResponseObject) {

				function UserContextConstructor (apiResponseObject) {
					this.token  = apiResponseObject.sessionToken;
					this.userId = apiResponseObject.user.object._id;
					this.profile = ProfileConstructor.create(apiResponseObject.user.object);
				}

				return new UserContextConstructor(apiResponseObject);

			},

			create: function(token, userId, profile) {

				function UserContextConstructor() {
					this.token = token;
					this.userId = token;
					this.profile = profile;
				}

				return new UserContextConstructor(token, userId, profile);

			}

		}
	}]);