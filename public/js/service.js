var npServices = angular.module('npServices', []);

npServices.factory('Articles', ['$http', function($http){
    return{
        get: function(callback){
            $http.get('articles/').success(function(data) {
                callback(data);
            });
        }
    };
}]);

npServices.factory('ArticleById', ['$http', '$routeParams', function($http, $routeParams){
    return{
        get: function(callback){
            $http.get('articles/id/' + $routeParams.id).success(function(data) {
                callback(data);
            });
        }
    };
}]);

npServices.factory('Tags', ['$http', function($http){
    return{
        get: function(callback){
            $http.get('tags/').success(function(data) {
                callback(data);
            });
        }
    };
}]);
