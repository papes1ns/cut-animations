var AnimationPlayer = function(animation) {
  this.animation = animation;
  this._onTimeUpdate = null;
  this.isPlaying = false;
  this.isLooping = false;
}

AnimationPlayer.prototype.pause = function() {
  this.animation.pause();
  this.isPlaying = false;
}

AnimationPlayer.prototype.play = function() {
  this.animation.play();
  this.isPlaying = true;
}

AnimationPlayer.prototype.stop = function() {
  this._clearInterval();
  this.isPlaying = false;
  this.isLooping = false;
  this.animation.pause();
}

AnimationPlayer.prototype.playFromAndTo = function(fromTime,toTime,isLoop) {
  if (this._onTimeUpdate) {
    this._clearInterval();
  }
  var _this = this;
  console.log("animation started at: "+fromTime);
  this.animation.paused
  this.animation.currentTime = fromTime;
  this.play();
  this._onTimeUpdate = setInterval(function(){
    _this.animation.dispatchEvent(new CustomEvent("tick"));
    if (_this.animation.currentTime >= toTime || !_this.isPlaying) {
      _this.stop();
      console.log("animation ended at: "+_this.animation.currentTime);
      if (isLoop) {
        _this.isLooping = true;
        _this.playFromAndTo(fromTime,toTime,isLoop);
      } else {
        _this.animation.dispatchEvent(new CustomEvent("didFinish"));
      }
    }
  }, 100);
}

AnimationPlayer.prototype._clearInterval = function() {
  clearInterval(this._onTimeUpdate);
  this._onTimeUpdate = null;
}
