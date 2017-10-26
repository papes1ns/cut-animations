var npApp = angular.module('npApp');

npApp.factory("InstanceMixins", function() {
  var InstanceMixins = new Object();

  InstanceMixins.isNew = function() {
    return !this.id;
  }

  return InstanceMixins;
});


npApp.factory('Story', function(InstanceMixins, Act, Animation, Segment, Monologue) {

  var _storiesCache = [];

  var Story = function(data) {
    this.id = null;
    this.name = null;
    this.thumbnail = null;
    this.acts = [];
    angular.extend(this, data);
  }


  Story._initialize = function(collection) {
    _storiesCache = collection.map(function(storyData) {
      storyData.acts = storyData.acts.map(function(actData) {
        actData.animation = new Animation(actData.animation);
        actData.monologue = actData.monologue.map(function(monologueData) {
          return new Monologue(monologueData);
        });
        actData.segments = actData.segments.map(function(segmentData) {
          return new Segment(segmentData);
        });
        return new Act(actData);
      });
      return new Story(storyData);
    });
    return _storiesCache;
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


  Story.prototype.numberOfActs = function() {
    return this.acts.length;
  }

  angular.extend(Story.prototype, InstanceMixins);

  return Story;
});

npApp.factory('Act', function() {

  var Act = function(data) {
    this.id = null;
    this.tag = null;
    this.story_id = null;
    this.act_id = null;
    this.starts_on_week = null;
    this.icon = null;
    this.segments = [];
    angular.extend(this, data);
  }

  Act._initialize = function(data) {
    _actsCache = data.map(function(act) {
      return new Act(data);
    });
    return _actsCache;
  }

  Act.prototype.numberOfSegments = function() {
      return this.segments.length;
  }

  return Act;
});


npApp.factory('Segment', function() {

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

npApp.factory('Animation', function() {

  var Animation = function(data) {
    angular.extend(this, data);
  }


  return Animation;
});


npApp.factory('Monologue', function() {

  var Monologue = function(data) {
    angular.extend(this, data);
  }


  return Monologue;
});
