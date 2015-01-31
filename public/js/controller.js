var npControllers = angular.module('npControllers', []);

npControllers.controller('npArticlesCtrl', function($scope, Articles, Tags, $http) {
    $scope.tags = [];
    $scope.search = {};
    $scope.pages = 1;
    Articles.get(function(data){
        $scope.articlesAll = data;
        $scope.articles = data;
    });

    Tags.get(function(data){
        $scope.tags = data;
    });

    $scope.searchTag = function() {
        if($scope.search.tags.length > 0) {
            $http.get('articles/tags/'+$scope.search.tags.join('+')).success(function(data) {
                $scope.articles = data;
            });
        }
        else {
            $scope.articles = $scope.articlesAll;
        }
    }

    $scope.loadMore = function() {
      $scope.pages++;
      $http.get('articles?pageNum=' + $scope.pages).success(function(data) {
        console.log(data);
        console.log($scope.articles);
        $scope.articles = $scope.articles.concat(data);
        console.log($scope.articles);
      });
    };

});

npControllers.controller('npArticlesIdCtrl', function($scope, ArticleById) {

    console.log('yo');
  ArticleById.get(function(data){
    $scope.article = data;
  });

});

