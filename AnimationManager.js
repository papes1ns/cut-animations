var AnimationManager = function(opts) {
  this.identifier = "anim-manager";
  this.positionPrefix = "$";
  this.targetVideo = opts.targetVideo;
  this.targetNode = opts.targetNode;
  this.width = opts.width || "960px";
  this.height = opts.height || "100px";
  this.modifier = opts.modifier || 1;

  this.startSelectionTime = null;
  this.endSelectionTime = null;
  this.startSelectionPosition = null;
  this.endSelectionPosition = null;
  this.currentPosition = null;

  this.isMouseDown = false;
  this.playhead = null;

  this.simpleInterface = true;
  this.player = new AnimationPlayer(this.targetVideo);

  this.selectorNodes = [];
  this.selectionNodes = [];

  this.segmentTbl = null;
  this.segments = [];

  this._initialize();
}

AnimationManager.prototype._initialize = function() {
  var _this = this;
  var tbl = document.createElement("table");
  tbl.setAttribute('draggable', false);
  tbl.id = this.identifier;
  tbl.classList.add(this.identifier);
  tbl.style.width = "100%";
  tbl.style.height = this.height;
  tbl.style.background = this.backgroundColor;
  this.targetNode.setAttribute("style","max-width:"+this.width+"; width:100%;");

  var row0 = document.createElement("tr");
  row0.setAttribute('draggable', false);
  tbl.appendChild(row0);

  var metaNode = document.createElement("span");
  metaNode.classList.add("anim-manager-meta");

  tbl.onmouseout = function() {
    _this.currentTime = null;
    if (typeof _this.startSelectionTime == "number" && _this.endSelectionTime) {
      metaNode.innerHTML = "start: "+_this.startSelectionTime+" secs, end: "+_this.endSelectionTime+" secs";
    }
  }

  tbl.ondrag = function() {
    return false;
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
      e.preventDefault();
      _this.clearSelection();
      _this.clearPlayHead();
      _this.startSelectionTime = _this.currentVideoTime;
      _this.startSelectionPosition = _this.currentNodePosition;
      _this.isMouseDown = true;
    }

    function onMouseUp(e) {
      _this.endSelectionTime = _this.currentVideoTime;
      _this.endSelectionPosition = _this.currentNodePosition;
      _this.isMouseDown = false;

      _this.selectionNodes = _this._getNodesBetweenSelection();
      _this.selectionNodes.forEach(function(node) {
        node.classList.add("selection");
      });
      metaNode.innerHTML = "start: "+_this.startSelectionTime+" secs, end: "+_this.endSelectionTime+" secs";
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
      part.setAttribute('draggable', false);

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
    this.segments = [];

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

      var stopBtn = document.createElement("button");
      stopBtn.innerHTML = "Stop";
      stopBtn.classList.add("anim-manager-btn");
      stopBtn.onclick = function(){
        _this.player.stop();
      }
      this.targetNode.appendChild(stopBtn);

      var modifierField = document.createElement("input");
      modifierField.type = "number";
      modifierField.id = "anim-manager-modifier";
      modifierField.value = this.modifier;
      modifierField.onchange = function(e) {
        _this.modifier = parseInt(e.target.value);
        _this._initialize();
      }
      this.targetNode.appendChild(modifierField);

      var makeSegmentBtn = document.createElement("button");
      makeSegmentBtn.innerHTML = "Build segment";
      makeSegmentBtn.classList.add("anim-manager-btn");
      makeSegmentBtn.onclick = function() {
        _this.buildSegment();
      }
      this.targetNode.appendChild(makeSegmentBtn);

      var clearSegmentBtn = document.createElement("button");
      clearSegmentBtn.innerHTML = "Clear all segment";
      clearSegmentBtn.classList.add("anim-manager-btn");
      clearSegmentBtn.onclick = function() {
        _this.clearSegments();
      }
      this.targetNode.appendChild(clearSegmentBtn);

      this.segmentTbl = document.createElement("table");
      var segmentTblHead = document.createElement("thead");
      segmentTblHead.innerHTML = "\
        <th>start</th>\
        <th>name</th>\
        <th>508 Msg</th>\
        <th>content</th>\
        <th>isLoop</th>\
        <th>actions</th>";
      this.segmentTbl.appendChild(segmentTblHead);
      this.targetNode.appendChild(this.segmentTbl);
    }
  } // end _initialize

  AnimationManager.prototype.clearPlayHead = function() {
    this.playhead = null;
    document.querySelectorAll(".active").forEach(function(node) {
      node.classList.remove("active");
    });
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


  AnimationManager.prototype._getNodesBetweenSelection = function() {
    var nodes = [];
    var node = null
    for(var k=this.startSelectionPosition; k <= this.endSelectionPosition; ++k) {
      node = document.getElementById(this.positionPrefix+k);
      if (node != null) {
        nodes.push(node);
      }
    }
    return nodes;
  }


  AnimationManager.prototype._isStartTimeValid = function() {
    var _this = this;
    var isValid = true;
    this.segments.forEach(function(segment) {
      if (segment.startTime() >= _this.startSelectionTime) {
        console.log("NOT VALID");
        isValid = false;
      }
    });
    return isValid;
  }

  AnimationManager.prototype._getSegmentStartAll = function() {
    return this.segments.map(function(s){ return s.startTime(); });
  }

  AnimationManager.prototype.buildSegment = function() {
    if (typeof this.startSelectionTime == "number" && this._isStartTimeValid()) {
      var seg = new AnimationSegment();
      seg.nodes = this._getNodesBetweenSelection();
      this.segments.push(seg);
      this.applySegments();
    }
  }

  AnimationManager.prototype.applySegments = function() {
    for (var k=0; k < this.segments.length; ++k) {
      var class0 = "segment";
      var class1 = "segment-"+k;
      var class2 = "segment-start"
      for (var j=0; j < this.segments[k].nodes.length; ++j) {
        this.segments[k].nodes[j].classList.add(class0);
        this.segments[k].nodes[j].classList.add(class1);
        if (j == this.segments[k].nodes.length-1) {
          this.segments[k].nodes[j].classList.add(class2);
        }
      }
    }
    this._updateSegmentTbl();
  }

  AnimationManager.prototype._clearSegmentTbl = function() {
    document.querySelectorAll(".segment-row").forEach(function(node) {
      node.remove();
    });
  }

  AnimationManager.prototype._updateSegmentTbl = function() {
    var _this = this;
    this._clearSegmentTbl();
    for (var k=0; k < this.segments.length; ++k) {
      var seg = this.segments[k];
      var identifier = "s"+k;
      var row = document.createElement("tr");
      row.classList.add("segment-row");
      row.id = identifier;
      row.innerHTML = "\
        <td>"+seg.startTime()+"</td>\
        <td><input class='segment-input' type='text'></input></td>\
        <td><input class='segment-input' type='text'></input></td>\
        <td><input class='segment-input' type='text'></input></td>\
        <td><input class='segment-checkbox' type='checkbox'></input></td>\
      ";
      var actionTd = document.createElement("td");
      var playBtn = document.createElement("button");
      playBtn.innerHTML = "Play";
      playBtn.onclick = function(e) {
        var segmentIndex = parseInt(e.target.parentNode.parentNode.id.split("s")[1]);
        var seg = _this.segments[segmentIndex];
        var isLoop = e.target.parentNode.previousElementSibling.firstElementChild.checked;
        _this.player.playFromAndTo(seg.startTime(),seg.endTime(),isLoop);
      }
      actionTd.appendChild(playBtn);
      row.appendChild(actionTd);
      _this.segmentTbl.appendChild(row);
    };
  }

  AnimationManager.prototype.clearSegments = function() {
    document.querySelectorAll(".segment").forEach(function(node) {
      node.className = "";
      node.classList.add("selector");
    });
    this.segments = [];
    this._clearSegmentTbl();
  }

}
