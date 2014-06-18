/**
 * Constructs a new Profile Model
 * @namespace
 */

PModels.factory('UserModel', ['logger', '$state', 'ProfileModel', 'UserContextManager', 'ApiManager',

	function(logger, $state, ProfileModel, UserContextManager, ApiManager) {

			return {

			/**
			 * Factory method that returns a new instance of the Profile Model
			 * @param apiProfileObject
			 * @param subjectiveObjectMeta
			 * @returns {Profile}
			 */

				construct : function(apiUserObject, subjectiveObjectMeta) {

				/**
				 * @constructor
				 * @param {Object} subjectiveObjectMeta
				 * @param {Object} apiProfileObject
				 */

					function User(apiProfileObject, subjectiveObjectMeta) {
						this.profile = ProfileModel.construct(apiProfileObject, subjectiveObjectMeta);
						this.subjectiveMeta = subjectiveObjectMeta;
						this.input = {
							fullName: this.fullName,
							description: this.description,
							gender: this.gender,
							location: this.location,
							website: this.website,
							email: this.email,
							phoneNumber: this.phoneNumber
						};
					}


					User.prototype.follow = function() {

						var userContext = UserContextManager.getActiveUserContext();

						if(!userContext) {
							$state.go('login');
						} else if(this.subjectiveMeta.friendship.forward) {
							this.subjectiveMeta.friendship.forward = false;
							ApiManager.friendships('destroy', userContext, {});
						} else {
							this.subjectiveMeta.friendship.forward = true;
							ApiManager.friendships('create', userContext, {});
						}

					};

					User.prototype.demand = function() {

						var userContext = UserContextManager.getActiveUserContext();

						if(!userContext) {
							$state.go('login');
						} else {
							this.subjectiveMeta.demand.forward = true;
							ApiManager.demands('create', userContext, {});
						}

					};

					User.prototype.update = function() {

						var userContext = UserContextManager.getActiveUserContext();

						if (userContext) {
							ApiManager.users('update', userContext, this.input)
								.then(function(apiResponse) {
									return apiResponse.result;
							});
						}

					};

					return new User(apiUserObject, subjectiveObjectMeta);

				}

			}
 		}
	]);
