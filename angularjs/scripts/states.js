var cuty = angular.module("cuty");

cuty.config(function($stateProvider, $urlRouterProvider) {


  $stateProvider.state("stories", {
    title: "Stories",
    url: "/stories",
    controller: "storyController",
    templateUrl: "scripts/story-index-template.html"
  });

  $stateProvider.state("stories.edit", {
    title: "Stories edit",
    url: "/:id/edit",
    controller: "storyEditController",
    templateUrl: "scripts/story-edit-template.html"
  });

  $stateProvider.state("stories.new", {
    title: "Stories edit",
    url: "/new",
    controller: "storyEditController",
    templateUrl: "scripts/story-edit-template.html"
  });



  $urlRouterProvider.otherwise('/stories');

});
