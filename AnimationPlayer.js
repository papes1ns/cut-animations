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
  if (this._onTimeUpdate) {
    this._clearInterval();
  }
  var _this = this;
  console.log("animation started at: "+fromTime);
  this.animation.paused
  this.animation.currentTime = fromTime;
  this.animation.play();
  this.isPlaying = true;
  this._onTimeUpdate = setInterval(function(){
    _this.animation.dispatchEvent(new CustomEvent("tick"));
    if (_this.animation.currentTime >= toTime || !_this.isPlaying) {
      _this.animation.pause();
      _this.isPlaying = false;
      console.log("animation ended at: "+_this.animation.currentTime);
      if (_this._onTimeUpdate != null) {
        _this._clearInterval();
        _this.animation.dispatchEvent(new CustomEvent("didFinish"));
      }
    }
  }, 100);
}

AnimationPlayer.prototype._clearInterval = function() {
  clearInterval(this._onTimeUpdate);
  this._onTimeUpdate = null;
}
