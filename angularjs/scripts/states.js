var npApp = angular.module("npApp");

npApp.config(function($stateProvider, $urlRouterProvider) {


  $stateProvider.state("stories", {
    title: "Stories",
    url: "/stories",
    controller: "storyController",
    templateUrl: "scripts/stories-template.html",
    resolve: {
      stories: function(Story) {
        return Story._initialize(storiesCollection);
      }
    }
  });

  $stateProvider.state("stories.id", {
    title: "Edit Story",
    url: "/:id",
    controller: "storyEditController",
    templateUrl: "scripts/stories-edit-template.html"
  });

  $stateProvider.state("stories.new", {
    title: "New Story",
    url: "/new",
    controller: "storyEditController",
    templateUrl: "scripts/stories-edit-template.html"
  });

  $stateProvider.state("stories.id.acts", {
    title: "New Act",
    abstract: true,
    url: "/acts"
  });

  $stateProvider.state("stories.id.acts.index", {
    title: "All Act",
    url: "/",
    controller: "storyEditController",
    templateUrl: "scripts/acts-template.html"
  });

  $stateProvider.state("stories.id.acts.new", {
    title: "New Act",
    url: "/new",
    controller: "storyEditController",
    templateUrl: "scripts/acts-edit-template.html"
  });

  $stateProvider.state("stories.id.acts.act_id", {
    title: "Edit Act",
    url: "/:act_id",
    controller: "storyEditController",
    templateUrl: "scripts/acts-edit-template.html"
  });


  $urlRouterProvider.otherwise('/stories');

});
