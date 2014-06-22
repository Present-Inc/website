/**
 * Properties and methods to handle the state of the Navbar
 * 	@param $q {Angular}
 * 	@param $state {Ui-Router}
 * 	@param logger {PUtilities}
 * 	@param UserContextManager {PManagers}
 * 	@param VideosApiClient {PApiClient}
 * 	@param UsersApiClient {PApiClient}
 * 	@param VideoModel {PModels}
 * 	@param ProfileModel {PModels}
 */

PModels.factory('NavbarModel', ['$q',
																'$state',
																'logger',
																'UserContextManager',
																'ApiManager',
																'VideoModel',
																'ProfileModel',

	function($q, $state, logger, UserContextManager, ApiManager, VideoModel, ProfileModel) {

		return {

			/**
			 * Factory method that returns a new Navbar instance
			 * @returns {Navbar}
			 */
			create : function() {

				/**
				 * @constructor
				 *
				 * @property {Object} mode
				 * @property {Boolean} isEnabled - Indicates whether the current view has the navbar enabled (visible)
				 * @property {Object} hub - Contains the profile information of the active user
				 * @property {Object search - Contains the properties and results of the search bar
				 */

				function Navbar(){

					var userContext = UserContextManager.getActiveUserContext();

					this.mode = {loggedIn: false};

					if (userContext) this.mode = {loggedIn : true};

					this.hub = {
						username : '',
						profilePicture : ''
					};

					if (userContext) {
						this.hub.username = userContext.profile.username;
						this.hub.profilePicture = userContext.profile.profilePicture;
					}

					this.search = {
						dropdownEnabled : false,
						query : '',
						results  : {
							users  : [],
							videos : []
						}
					};

				}

				/**
				 * Sends Users and Videos search API requests in parallel and then updates the search result properties
				 * @param {String} query the search query string provided by the user
				 * @returns {*}
				 */

				Navbar.prototype.sendSearchQuery = function(query) {

					var sendingVideosSearch = $q.defer(),
						 sendingUsersSearch = $q.defer(),
						 videosSearchResults = this.search.results.videos,
						 usersSearchResults = this.search.results.users,
						 userContext = UserContextManager.getActiveUserContext();

					var promises  = [sendingVideosSearch, sendingUsersSearch];

					videosSearchResults.length = 0;
					usersSearchResults.length = 0;

					ApiManager.videos('search', userContext, {query: query, limit: 5})
						.then(function(apiResponse){
							for (var i = 0;  i < apiResponse.results.length; i++) {
								var Video = VideoModel.construct(apiResponse.results[i].object);
								videosSearchResults.push(Video);
							}
							logger.debug(['PManagers.NavbarManager', videosSearchResults]);
							sendingVideosSearch.resolve();
						});

					ApiManager.users('search', userContext, {query: query, limit: 5})
						.then(function(apiResponse) {
							for (var i=0; i < apiResponse.results.length; i++) {
								var Profile = ProfileModel.construct(apiResponse.results[i].object);
								usersSearchResults.push(Profile);
							}
							logger.debug(['PManagers.NavbarManager', usersSearchResults]);
							sendingUsersSearch.resolve();
						});

					return $q.all(promises);

				};

				/**
				 * Sets the search.dropdownEnabled to true
				 */

				Navbar.prototype.showDropdown = function() {
					this.search.dropdownEnabled = true;
				};

				/**
				 * Sets the search.dropdownEnabled to false
				 */

				Navbar.prototype.hideDropdown = function() {
					this.search.dropdownEnabled = false;
				};

				return new Navbar();

			}
		};

	}

]);