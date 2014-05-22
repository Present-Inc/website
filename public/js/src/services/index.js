/**
 * index.js
 * PServices
 * Combines all services into one requireJS module to be injected into PresentWebApp
 */

define(['./ApplicationManager',
        './FeedManager',
        './SessionManager',
        './FeedLoader',
        './ProfileLoader',
        './ApiClientResponseHandler',
        './apiClient/VideosApiClient',
        './apiClient/UsersApiClient',
        './apiClient/UserContextApiClient',
        './apiClient/ApiClientConfig',
        './utilities/logger'], function() {});
