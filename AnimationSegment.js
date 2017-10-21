var AnimationSegment = function() {
  this.nodes = [];
  this.fiveZeroEight = "";
  this.content = "";
  this.isLoop = false;
 }

AnimationSegment.prototype.startTime = function() {
  return parseFloat(this.nodes[0].getAttribute("data-time"));
}

AnimationSegment.prototype.endTime = function() {
  return parseFloat(this.nodes[this.nodes.length-1].getAttribute("data-time"));
}
