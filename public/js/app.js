'use strict';

var npApp = angular.module('npApp', [
    'ngRoute',
    'ngSanitize',
    'npControllers',
    'npServices',
    'ui.select'
]);

npApp.config(function($routeProvider) {
  $routeProvider
      .when('/articles', {
        templateUrl: 'templates/np-article.html',
        controller: 'npArticlesCtrl'
      })
      .when('/about', {
        templateUrl: 'templates/np-about.html'
      })
      .when('/article/:id', {
        templateUrl: 'templates/np-article-id.html',
        controller: 'npArticlesIdCtrl'
      })
      .otherwise({
        redirectTo: '/articles'
      });
});
