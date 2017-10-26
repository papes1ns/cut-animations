var npApp = angular.module("npApp");

npApp.config(function($stateProvider, $urlRouterProvider) {


  // stories state

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

  $stateProvider.state("stories.edit", {
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

  $stateProvider.state("stories.edit.acts", {
    title: "New Act",
    abstract: true,
    url: "/acts"
  });

  $stateProvider.state("stories.edit.acts.index", {
    title: "All Act",
    url: "/",
    controller: "storyEditController",
    templateUrl: "scripts/acts-template.html"
  });

  $stateProvider.state("stories.edit.acts.new", {
    title: "New Act",
    url: "/new",
    controller: "storyEditController",
    templateUrl: "scripts/acts-edit-template.html"
  });

  $stateProvider.state("stories.edit.acts.act_id", {
    title: "Edit Act",
    url: "/:act_id",
    controller: "storyEditController",
    templateUrl: "scripts/acts-edit-template.html"
  });



  // acts state

  $stateProvider.state("acts", {
    title: "List Acts",
    url: "/acts",
    controller: "actController",
    templateUrl: "scripts/acts-template.html",
    resolve: {
      acts: function(Act) {
        return Act._initialize(actsCollection);
      }
    }
  });

  $stateProvider.state("acts.new", {
    title: "List Acts",
    url: "/new",
    controller: "actController",
    templateUrl: "scripts/acts-edit-template.html"
  });


  $stateProvider.state("acts.edit", {
    title: "List Acts",
    url: "/:id",
    controller: "actController",
    templateUrl: "scripts/acts-edit-template.html"
  });

  $urlRouterProvider.otherwise('/stories');

});
