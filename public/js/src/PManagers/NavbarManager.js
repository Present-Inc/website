/**
 * PManagers.NavbarManager
 * Provides properties and methods to handle the state of the Navbar
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

			this.searchResults = {
				users : [],
				videos : []
			};

		}

		NavbarManager.prototype.configure = function(toState) {

			var userContext = UserContextManager.getActiveUserContext();

			if(toState.metaData.navbarEnabled) this.isEnabled = true;
			else this.isEnabled = false;

			if(userContext) this.mode.loggedIn = true;
			else this.mode.loggedIn = false;

		};

		NavbarManager.prototype.loadHub = function() {
			var userContext = UserContextManager.getActiveUserContext();
			var hub = this.hub;
			if(userContext) {
				UsersApiClient.showMe(userContext)
					.then(function(apiResponse) {
						hub.username = apiResponse.result.object.username;
						hub.profilePicture = apiResponse.result.object.profile.picture.url;
					});
			}
		};

		NavbarManager.prototype.logout = function() {
			var hub = this.hub;
			UserContextManager.destroyActiveUserContext()
				.then(function() {
					$state.go('splash');
					hub.username = '';
					hub.profilePicture = '';
				});
		};

		NavbarManager.prototype.showDropdown = function() {
			this.search.dropdownEnabled = true;
		};

		NavbarManager.prototype.hideDropdown = function() {
			this.search.dropdownEnabled = false;
		};

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
				 for(var i = 0;  i < apiResponse.results.length; i++) {
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

		return new NavbarManager();

	}

]);