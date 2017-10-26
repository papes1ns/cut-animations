var cuty = angular.module('cuty');

cuty.factory('Segment', function() {

  var Segment = function(data) {
    this.id = null;
    this.act_id = null;
    this.in_point = null;
    this.out_point = null;
    this.caption = "";
    angular.extend(this, data);
  }


  return Segment;
});


cuty.factory('Story', function() {

  var _storiesCache = [];
  console.log(_storiesCache);

  var Story = function(data) {
    this.id = null;
    this.title = null;
    angular.extend(this, data);
  }

  Story.all = function() {
    if (_storiesCache.length == 0) {
      _storiesCache = [new Story({id:10,title:"YHH Pilot",number_of_acts:3,created_at:new Date()})];
    }
    return _storiesCache;
  }

  Story.find = function(id) {
    var story = _.find(Story.all(),{id:parseInt(id)});
    return story;
  }

  return Story;
});

cuty.factory('Act', function() {

  var Act = function(data) {
    this.id = null;
    this.story_id = null;
    this.title = null;
    this.icon = null;
    this.segments = [];
    angular.extend(this, data);
  }

  return Act;
});
