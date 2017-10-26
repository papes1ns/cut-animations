var npApp = angular.module('npApp');

npApp.controller('storyController', function($scope, $state, stories) {
  $scope.stories = stories;
});

npApp.controller("storyEditController", function($scope, $state, Story) {
    $scope.story = Story.find($state.params.id) || new Story();
    $scope.acts = $scope.story.acts;
});


npApp.controller("actController", function($scope, $state, acts) {
    $scope.acts = acts;
});
