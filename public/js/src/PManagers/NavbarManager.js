/**
 * PManagers.NavbarManager
 * Properties and methods to handle the state of the Navbar
 * 	@dependency $q {Angular}
 * 	@dependency $state {Ui-Router}
 * 	@dependency logger {PUtilities}
 * 	@dependency UserContextManager {PManagers}
 * 	@dependency VideosApiClient {PApiClient}
 * 	@dependency UsersApiClient {PApiClient}
 * 	@dependency VideoCellConstructor {PConstructors}
 * 	@dependency ProfileConstructor {PConstructors}
 */

PManagers.factory('NavbarManager', ['$q',
																		'$state',
																		'logger',
																		'UserContextManager',
																		'VideosApiClient',
																		'UsersApiClient',
																		'VideoCellConstructor',
																		'ProfileConstructor',

	function($q, $state, logger, UserContextManager, VideosApiClient, UsersApiClient, VideoCellConstructor, ProfileConstructor) {

		function NavbarManager(){

			this.mode = {
				loggedIn : false
			};

			this.isEnabled = false;

			this.hub = {
				username : '',
				profilePicture : ''
			};

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
		 * NavbarManager.configure
		 * Configuration method that is called on the ui router stateChangeStart event
		 *  @param toState <Object> Ui-Router object that defines the requested state
		 */

		NavbarManager.prototype.configure = function(toState) {

			var userContext = UserContextManager.getActiveUserContext();

			if (toState.metaData.navbarEnabled) this.isEnabled = true;
			else this.isEnabled = false;

			if (userContext) this.mode.loggedIn = true;
			else this.mode.loggedIn = false;

		};

		/**
		 * NavbarManager.loadHub
		 * Load the hub data if the user is still logged in when they enter the site
		 * Otherwise, the data is set on the _newUserLoggedIn event
		 */

		NavbarManager.prototype.loadHub = function() {
			var userContext = UserContextManager.getActiveUserContext();
			var hub = this.hub;
			if (userContext) {
				UsersApiClient.showMe(userContext)
					.then(function(apiResponse) {
						hub.username = apiResponse.result.object.username;
						hub.profilePicture = apiResponse.result.object.profile.picture.url;
					});
			}
		};

		/**
		 * NavbarManager.sendSearchQuery
		 * Sends Users and Videos search API requests in parallel and then updates the search result properties
		 * 	@param query <String> the search query string provided by the user
		 * 	@returns promise <Object>
		 */

		NavbarManager.prototype.sendSearchQuery = function(query) {

			var sendingVideosSearch = $q.defer(),
					sendingUsersSearch = $q.defer(),
					videosSearchResults = this.search.results.videos;
					usersSearchResults = this.search.results.users;
				  userContext = UserContextManager.getActiveUserContext(),
				  limit = 5;

			var promises  = [sendingVideosSearch, sendingUsersSearch];

			videosSearchResults.length = 0;
			usersSearchResults.length = 0;

			VideosApiClient.search(query, limit, userContext)
			 .then(function(apiResponse){
				 for (var i = 0;  i < apiResponse.results.length; i++) {
						var Video = VideoCellConstructor.Video.create(apiResponse.results[i].object);
						videosSearchResults.push(Video);
				 }
				 logger.debug(['PManagers.NavbarManager', videosSearchResults]);
				 sendingVideosSearch.resolve();
			 });

			UsersApiClient.search(query, limit, userContext)
			 .then(function(apiResponse) {
					for (var i=0; i < apiResponse.results.length; i++) {
						var Profile = ProfileConstructor.create(apiResponse.results[i].object);
						usersSearchResults.push(Profile);
					}
					logger.debug(['PManagers.NavbarManager', usersSearchResults]);
					sendingUsersSearch.resolve();
			 });

			 return $q.all(promises);

		};

		/**
		 * NavbarManager.showDropdown
		 * Sets the search.dropdownEnabled to true
		 */

		NavbarManager.prototype.showDropdown = function() {
			this.search.dropdownEnabled = true;
		};

		/**
		 * NavbarManager.hideDropdown
		 * Sets the search.dropdownEnabled to false
		 */

		NavbarManager.prototype.hideDropdown = function() {
			this.search.dropdownEnabled = false;
		};

		return new NavbarManager();

	}

]);