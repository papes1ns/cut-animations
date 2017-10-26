var cuty = angular.module('cuty');

cuty.controller('storyController', function($scope, $state, Story) {
  $scope.stories = Story.all();
});

cuty.controller("storyEditController", function($scope, $state, Story) {
    $scope.story = Story.find($state.params.id) || new Story();
});
