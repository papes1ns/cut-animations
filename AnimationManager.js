var AnimationManager = function(opts) {
  this.identifier = "anim-manager";
  this.positionPrefix = "$";
  this.targetVideo = opts.targetVideo;
  this.targetNode = opts.targetNode;
  this.width = opts.width || "960px";
  this.height = opts.height || "100px";
  this.modifier = opts.modifier || 4;

  this.startSelectionTime = null;
  this.endSelectionTime = null;
  this.startSelectionPosition = null;
  this.endSelectionPosition = null;
  this.currentPosition = null;

  this.isMouseDown = false;
  this.isValid = true;

  this.playhead = null;

  this.simpleInterface = true;
  this.player = new AnimationPlayer(this.targetVideo);

  this.selectorNodes = [];
  this.selectionNodes = [];

  this._initialize();
}

AnimationManager.prototype._initialize = function() {
  var _this = this;
  var tbl = document.createElement("table");
  tbl.id = this.identifier;
  tbl.classList.add(this.identifier);
  tbl.style.width = "100%";
  tbl.style.height = this.height;
  tbl.style.background = this.backgroundColor;
  this.targetNode.setAttribute("style","max-width:"+this.width+"; width:100%;");

  var row0 = document.createElement("tr");
  tbl.appendChild(row0);

  var metaNode = document.createElement("span");
  metaNode.classList.add("anim-manager-meta");

  tbl.onmouseout = function() {
    _this.currentTime = null;
    if (typeof _this.startSelectionTime == "number" && _this.endSelectionTime) {
      metaNode.innerHTML = "start: "+_this.startSelectionTime+" secs, end: "+_this.endSelectionTime+" secs";
    }
  }

  if (this.targetVideo && this.targetVideo.duration) {
    var duration = parseFloat(Math.floor(this.targetVideo.duration));
    console.log("targetVideo duration: "+duration);


    function onTick(e) {
      var previous = _this.playhead;
      _this.playhead = document.getElementById(_this.positionPrefix+Math.floor(e.target.currentTime*_this.modifier));
      if (previous && _this.playhead && previous.id != _this.playhead.id) {
        previous.classList.remove("active")
        _this.playhead.classList.add("active");
      } else if(!previous) {
        _this.playhead.classList.add("active");
      }
    }

    this.targetVideo.addEventListener("tick", onTick);

    function onMouseOver(e) {
      if (!_this.player.isPlaying) {
        _this.currentVideoTime = parseFloat(e.target.getAttribute("data-time"));
        _this.currentNodePosition = parseInt(e.target.getAttribute("data-position"));
        _this.targetVideo.currentTime = _this.currentVideoTime;
        metaNode.innerHTML = "current time: "+ _this.targetVideo.currentTime + " secs";
      }
    }

    function onMouseDown(e) {
      _this.clearSelection();
      _this.startSelectionTime = _this.currentVideoTime;
      _this.startSelectionPosition = _this.currentNodePosition;
      _this.isMouseDown = true;
    }

    function onMouseUp(e) {
      if (_this.isValid) {
        _this.endSelectionTime = _this.currentVideoTime;
        _this.endSelectionPosition = _this.currentNodePosition;
        _this.isMouseDown = false;

        for(var k=_this.startSelectionPosition; k <= _this.endSelectionPosition; ++k) {
          var node = document.getElementById(_this.positionPrefix+k);
          node.classList.add("selection");
          _this.selectionNodes.push(node);
        }
        metaNode.innerHTML = "start: "+_this.startSelectionTime+" secs, end: "+_this.endSelectionTime+" secs";
      } else {
        _this.isValid = false;
      }
    }

    function onMouseMove(e) {
      if (typeof _this.startSelectionTime != null && _this.isMouseDown && (_this.currentVideoTime >= _this.startSelectionTime)) {
        e.target.classList.add("selection");
      }
    }

    for (var k=0; k < duration*this.modifier; ++k) {
      var part = document.createElement("td");
      part.id = _this.positionPrefix+k;
      part.classList.add("selector");

      part.setAttribute("data-position",k);
      part.setAttribute("data-time",k/this.modifier);

      part.onmouseover = onMouseOver;
      part.onmousedown = onMouseDown;
      part.onmouseup = onMouseUp;
      part.onmousemove = onMouseMove;

      row0.appendChild(part);
      _this.selectorNodes.push(part);
    }


    while (this.targetNode.lastChild && this.targetNode.lastChild.id != "anim") {
      this.targetNode.removeChild(this.targetNode.lastChild);
    }
    this.targetNode.appendChild(tbl);

    if (_this.simpleInterface) {
      this.targetNode.appendChild(metaNode);

      var clearSelectionBtn = document.createElement("button");
      clearSelectionBtn.classList.add("anim-manager-btn");
      clearSelectionBtn.innerHTML = "Clear Selection";
      clearSelectionBtn.onclick = function() {
        _this.clearSelection();
      }
      this.targetNode.appendChild(clearSelectionBtn);

      var clearPlayHeadBtn = document.createElement("button");
      clearPlayHeadBtn.innerHTML = "Clear Playhead";
      clearPlayHeadBtn.classList.add("anim-manager-btn");
      clearPlayHeadBtn.onclick = function() {
        _this.clearPlayHead();
      }
      this.targetNode.appendChild(clearPlayHeadBtn);

      var loopSelectionBtn = document.createElement("button");
      loopSelectionBtn.innerHTML = "Play Selection";
      loopSelectionBtn.classList.add("anim-manager-btn");
      loopSelectionBtn.onclick = function(){
        if (typeof _this.startSelectionTime == "number" && _this.endSelectionTime) {
          _this.player.playFromAndTo(_this.startSelectionTime,_this.endSelectionTime);
        }
      }
      this.targetNode.appendChild(loopSelectionBtn);

      var modifierField = document.createElement("input");
      modifierField.type = "number";
      modifierField.id = "anim-manager-modifier";
      modifierField.value = this.modifier;
      modifierField.onchange = function(e) {
        _this.modifier = parseInt(e.target.value);
        _this._initialize();
      }
      this.targetNode.appendChild(modifierField);


    }
  } // end _initialize

  AnimationManager.prototype.clearPlayHead = function() {
    if (this.playhead) {
      this.playhead.classList.remove("active");
      this.playhead = null;
    }
  }

  AnimationManager.prototype.clearSelection = function() {
    this.startSelectionTime = null;
    this.endSelectionTime = null;
    this.startSelectionPosition = null;
    this.endSelectionPosition = null;
    this.currentPosition = null;
    this.player.pause();
    this.selectorNodes.forEach(function(node) {
      node.classList.remove("selection");
    });
  }

}
