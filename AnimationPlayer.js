var AnimationPlayer = function(animation) {
  this.animation = animation;
  this._onTimeUpdate = null;
}

AnimationPlayer.prototype.pause = function() {
  this.animation.pause();
}

AnimationPlayer.prototype.playFromAndTo = function(fromTime,toTime) {
  var _this = this;
  console.log("animation started at: "+fromTime);
  this.animation.currentTime = fromTime;
  if(this.animation.paused) {
      this.animation.play();
  }
  this._onTimeUpdate = setInterval(function(){
    if (_this.animation.currentTime >= toTime) {
      _this.animation.pause();
      console.log("animation ended at: "+_this.animation.currentTime);
      if (_this._onTimeUpdate != null) {
        clearInterval(_this._onTimeUpdate);
        _this._onTimeUpdate = null;
      }
    }
  }, 100);
}
