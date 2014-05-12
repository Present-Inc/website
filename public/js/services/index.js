/*
 * index.js
 * PServices
 * Combines all services into one requireJS module to be injected into PresentWebApp
 */

define(['./ApplicationManager',
        './FeedManager',
        './FeedLoader',
        './Logger',
        './apiClient/VideosApiClient',
        './apiClient/ApiClientConfig'], function() {});
