angular.module('livepost')
.factory('MyRoutes', function () {
    'use strict';
    var routes = [{
        path: '/',
        options: {
            templateUrl: 'home/home.view.html',
            controller: 'homeController'
        }
    },
    {
        path: '/story/:id',
        options: {
            templateUrl: 'story/story.view.html',
            controller: 'StoryController'
        }
    },
    {
        path: '/story/a/:id',
        options: {
            templateUrl: 'analytics/analytics.view.html',
            controller: 'AnalyticsController'
        }
    },
    {
        path: '/404',
        options: {
            templateUrl: 'not_found/404.html'
        }
    },
    {
        path: '/rss',
        options: {
            templateUrl: 'rss_cards/rss.view.html',
            controller: 'RssController'
        }
    }];
    return routes;
});