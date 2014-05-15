/*
 * index.js
 * PServices
 * Combines all services into one requireJS module to be injected into PresentWebApp
 */

define(['./ApplicationManager',
        './FeedManager',
        './SessionManager',
        './FeedLoader',
        './logger',
        './ApiClientResponseHandler',
        './apiClient/VideosApiClient',
        './apiClient/UserContextApiClient', 
        './apiClient/ApiClientConfig'], function() {});
