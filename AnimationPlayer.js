var AnimationPlayer = function(animation) {
  this.animation = animation;
  this._onTimeUpdate = null;
  this.isPlaying = false;
}

AnimationPlayer.prototype.pause = function() {
  this.animation.pause();
  this.isPlaying = false;
}

AnimationPlayer.prototype.playFromAndTo = function(fromTime,toTime) {
  var _this = this;
  this.isPlaying = true;
  console.log("animation started at: "+fromTime);
  this.animation.currentTime = fromTime;
  if(this.animation.paused) {
      this.animation.play();
  }
  this._onTimeUpdate = setInterval(function(){
    _this.animation.dispatchEvent(new CustomEvent("tick"));
    if (_this.animation.currentTime >= toTime) {
      _this.animation.pause();
      _this.isPlaying = false;
      console.log("animation ended at: "+_this.animation.currentTime);
      if (_this._onTimeUpdate != null) {
        clearInterval(_this._onTimeUpdate);
        _this._onTimeUpdate = null;
        _this.animation.dispatchEvent(new CustomEvent("didFinish"));
      }
    }
  }, 100);
}
