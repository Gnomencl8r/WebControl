//checkForGCodeUpdate();

//setInterval(function(){ alert("Hello"); }, 3000);

var boardWidth = 96
var boardHeight = 48
var boardThickness = 0.75
var boardCenterX = 0
var boardCenterY = 0
var boardID = "-"
var boardMaterial = "-"
var cutSquareGroup = new THREE.Group();
var showBoard = true;
var homeX = 0;
var homeY = 0;

var renderer = new THREE.WebGLRenderer();
var w = $("#workarea").width()-20;
var h = $("#workarea").height()-20;
renderer.setSize( w, h );

container = document.getElementById('workarea');
container.appendChild(renderer.domElement);
var imageShowing = 1

var gcode = new THREE.Group();
//var cutTrailGroup = new THREE.Group();

var camera = new THREE.PerspectiveCamera(45, w/h, 1, 500);
//var camera = new THREE.OrthographicCamera(w/-2, w/2, h/2, h/-2, 1, 500);
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.screenSpacePanning = true;

camera.position.set(0, 0, 100);
camera.lookAt(0,0,0);
var view3D = true;
toggle3DView(); // makes it not true and applies appropriate settings
//controls.update();
controls.saveState();

var scene = new THREE.Scene();
scene.background= new THREE.Color(0xeeeeee);
var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );
var blueLineMaterial = new THREE.LineBasicMaterial( {color:0x0000ff });
var lightBlueLineMaterial = new THREE.LineBasicMaterial( {color:0xadd8e6 });
var greenLineMaterial = new THREE.LineBasicMaterial( {color:0x00aa00 });
var redLineMaterial = new THREE.LineBasicMaterial( {color:0xff0000 });
var blackLineMaterial = new THREE.LineBasicMaterial( {color:0x000000 });
var grayLineMaterial = new THREE.LineBasicMaterial( {color:0x777777 });

var greenLineDashedMaterial = new THREE.LineDashedMaterial( {color:0x00aa00, dashSize:.1, gapSize: .1} );
var blackDashedMaterial = new THREE.LineDashedMaterial( {color:0x000000, dashSize:.5, gapSize: .5} );

var outerFrameShape = new THREE.Geometry();
outerFrameShape.vertices.push(new THREE.Vector3(-48, 24, 0));
outerFrameShape.vertices.push(new THREE.Vector3(48, 24, 0));
outerFrameShape.vertices.push(new THREE.Vector3(48, -24, 0));
outerFrameShape.vertices.push(new THREE.Vector3(-48, -24, 0));
outerFrameShape.vertices.push(new THREE.Vector3(-48, 24, 0));
var outerFrame = new THREE.Line(outerFrameShape, blackLineMaterial);

var frameLineSegments = new THREE.Geometry();
frameLineSegments.vertices.push(new THREE.Vector3(-24, 24, 0));
frameLineSegments.vertices.push(new THREE.Vector3(-24, -24, 0));
frameLineSegments.vertices.push(new THREE.Vector3(0, 24, 0));
frameLineSegments.vertices.push(new THREE.Vector3(0, -24, 0));
frameLineSegments.vertices.push(new THREE.Vector3(24, 24, 0));
frameLineSegments.vertices.push(new THREE.Vector3(24, -24, 0));
frameLineSegments.vertices.push(new THREE.Vector3(-48, 0, 0));
frameLineSegments.vertices.push(new THREE.Vector3(48, 0, 0));
var innerFrame = new THREE.LineSegments(frameLineSegments, blackDashedMaterial)
innerFrame.computeLineDistances();

scene.add(outerFrame);
scene.add(innerFrame);


var sledHorizontalLineSegments = new THREE.Geometry();
sledHorizontalLineSegments.vertices.push(new THREE.Vector3(-1.5, 0, 0));
sledHorizontalLineSegments.vertices.push(new THREE.Vector3(1.5, 0, 0));
var sledHorizontalLine = new THREE.LineSegments(sledHorizontalLineSegments, redLineMaterial);

var sledVerticalLineSegments = new THREE.Geometry();
sledVerticalLineSegments.vertices.push(new THREE.Vector3(0, -1.5, 0));
sledVerticalLineSegments.vertices.push(new THREE.Vector3(0, 1.5, 0));
var sledVerticalLine = new THREE.LineSegments(sledVerticalLineSegments, redLineMaterial);

var sledCircleGeometry = new THREE.CircleGeometry(1,32);
var sledCircleEdges = new THREE.EdgesGeometry(sledCircleGeometry)
var sledCircle = new THREE.LineSegments(sledCircleEdges,redLineMaterial);

var sled = new THREE.Group();
sled.add(sledHorizontalLine);
sled.add(sledVerticalLine);
sled.add(sledCircle);
sled.position.set(0,0,0);


var homeHorizontalLineSegments = new THREE.Geometry();
homeHorizontalLineSegments.vertices.push(new THREE.Vector3(-1.0, 0, 0));
homeHorizontalLineSegments.vertices.push(new THREE.Vector3(1.0, 0, 0));
var homeHorizontalLine = new THREE.LineSegments(homeHorizontalLineSegments, greenLineMaterial);

var homeVerticalLineSegments = new THREE.Geometry();
homeVerticalLineSegments.vertices.push(new THREE.Vector3(0, -1.0, 0));
homeVerticalLineSegments.vertices.push(new THREE.Vector3(0, 1.0, 0));
var homeVerticalLine = new THREE.LineSegments(homeVerticalLineSegments, greenLineMaterial);

var homeCircleGeometry = new THREE.CircleGeometry(.5,32);
var homeCircleEdges = new THREE.EdgesGeometry(homeCircleGeometry)
var homeCircle = new THREE.LineSegments(homeCircleEdges,greenLineMaterial);

var home = new THREE.Group();
home.add(homeHorizontalLine);
home.add(homeVerticalLine);
home.add(homeCircle);
home.position.set(0,0,0);


var gcodePosHorizontalLineSegments = new THREE.Geometry();
gcodePosHorizontalLineSegments.vertices.push(new THREE.Vector3(-1.0, 0, 0));
gcodePosHorizontalLineSegments.vertices.push(new THREE.Vector3(1.0, 0, 0));
var gcodePosHorizontalLine = new THREE.LineSegments(gcodePosHorizontalLineSegments, blackLineMaterial);

var gcodePosVerticalLineSegments = new THREE.Geometry();
gcodePosVerticalLineSegments.vertices.push(new THREE.Vector3(0, -1.0, 0));
gcodePosVerticalLineSegments.vertices.push(new THREE.Vector3(0, 1.0, 0));
var gcodePosVerticalLine = new THREE.LineSegments(gcodePosVerticalLineSegments, blackLineMaterial);

var gcodePosCircleGeometry = new THREE.CircleGeometry(.5,32);
var gcodePosCircleEdges = new THREE.EdgesGeometry(gcodePosCircleGeometry)
var gcodePosCircle = new THREE.LineSegments(gcodePosCircleEdges,blackLineMaterial);

var gcodePos = new THREE.Group();
gcodePos.add(gcodePosHorizontalLine);
gcodePos.add(gcodePosVerticalLine);
gcodePos.add(gcodePosCircle);
gcodePos.position.set(0,0,0);

var computedSledHorizontalLineSegments = new THREE.Geometry();
computedSledHorizontalLineSegments.vertices.push(new THREE.Vector3(-1.5, 0, 0));
computedSledHorizontalLineSegments.vertices.push(new THREE.Vector3(1.5, 0, 0));
var computedSledHorizontalLine = new THREE.LineSegments(computedSledHorizontalLineSegments, grayLineMaterial);

var computedSledVerticalLineSegments = new THREE.Geometry();
computedSledVerticalLineSegments.vertices.push(new THREE.Vector3(0, -1.5, 0));
computedSledVerticalLineSegments.vertices.push(new THREE.Vector3(0, 1.5, 0));
var computedSledVerticalLine = new THREE.LineSegments(computedSledVerticalLineSegments, grayLineMaterial);

var computedSledCircleGeometry = new THREE.CircleGeometry(1,32);
var computedSledCircleEdges = new THREE.EdgesGeometry(computedSledCircleGeometry)
var computedSledCircle = new THREE.LineSegments(computedSledCircleEdges,grayLineMaterial);

var computedSled = new THREE.Group();
computedSled.add(computedSledHorizontalLine);
computedSled.add(computedSledVerticalLine);
computedSled.add(computedSledCircle);
computedSled.position.set(0,0,0);

var cursorHorizontalLineSegments = new THREE.Geometry();
cursorHorizontalLineSegments.vertices.push(new THREE.Vector3(-1.5, 0, 0));
cursorHorizontalLineSegments.vertices.push(new THREE.Vector3(1.5, 0, 0));
var cursorHorizontalLine = new THREE.LineSegments(cursorHorizontalLineSegments, blueLineMaterial);

var cursorVerticalLineSegments = new THREE.Geometry();
cursorVerticalLineSegments.vertices.push(new THREE.Vector3(0, -1.5, 0));
cursorVerticalLineSegments.vertices.push(new THREE.Vector3(0, 1.5, 0));
var cursorVerticalLine = new THREE.LineSegments(cursorVerticalLineSegments, blueLineMaterial);

var cursorCircleGeometry = new THREE.CircleGeometry(1,32);
var cursorCircleEdges = new THREE.EdgesGeometry(cursorCircleGeometry)
var cursorCircle = new THREE.LineSegments(cursorCircleEdges,blueLineMaterial);

var cursor = new THREE.Group();
cursor.add(cursorHorizontalLine);
cursor.add(cursorVerticalLine);
cursor.add(cursorCircle);
cursor.position.set(0,0,0);


var cursorVLineGeometry = new THREE.BufferGeometry();
var cursorVLinePositions = new Float32Array(2*3);
cursorVLineGeometry.addAttribute( 'position', new THREE.BufferAttribute(cursorVLinePositions, 3));
cursorVLineGeometry.setDrawRange(0, 2);
var cursorVLine = new THREE.Line(cursorVLineGeometry, lightBlueLineMaterial);
cursorVLine.frustumCulled = false;
scene.add(cursorVLine);

var cursorHLineGeometry = new THREE.BufferGeometry();
var cursorHLinePositions = new Float32Array(2*3);
cursorHLineGeometry.addAttribute( 'position', new THREE.BufferAttribute(cursorHLinePositions, 3));
cursorHLineGeometry.setDrawRange(0, 2);
var cursorHLine = new THREE.Line(cursorHLineGeometry, lightBlueLineMaterial);
cursorHLine.frustumCulled = false;
scene.add(cursorHLine);

var boardCutLinesGeometry = new THREE.BufferGeometry();
var boardCutLinesPositions = new Float32Array(1000*3);
boardCutLinesGeometry.addAttribute( 'position', new THREE.BufferAttribute(boardCutLinesPositions, 3));
boardCutLinesGeometry.setDrawRange(0, 100);
var boardCutLines = new THREE.Line(boardCutLinesGeometry, redLineMaterial);
boardCutLines.frustumCulled = false;
scene.add(boardCutLines);

var boardGroup = new THREE.Group();

var boardOutlineGeometry = new THREE.BoxBufferGeometry(96,48,0.75);
var boardFillMaterial = new THREE.MeshBasicMaterial({ color: 0xD2B48C, opacity: 0.5, transparent:true})
var boardOutlineFill = new THREE.Mesh(boardOutlineGeometry, boardFillMaterial);
var boardOutlineMaterial = new THREE.LineBasicMaterial({ color: 0x783E04})
var boardEdgesGeometry = new THREE.EdgesGeometry( boardOutlineGeometry )
var boardOutlineOutline = new THREE.LineSegments( boardEdgesGeometry, boardOutlineMaterial);
boardGroup.add(boardOutlineFill);
boardGroup.add(boardOutlineOutline);

boardGroup.position.set(0,0,-0.75/2);

scene.add(cutSquareGroup);
scene.add(boardGroup);


scene.add(sled);
scene.add(home);
scene.add(gcodePos);
if (!isMobile)
    scene.add(cursor);
//scene.add(cutSquareGroup);

var isComputedEnabled = false;

animate();

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render( scene, camera );
}

function positionUpdate(x,y,z){
    if ($("#units").text()=="MM"){
        x /= 25.4
        y /= 25.4
        z /= 25.4
    }
    sled.position.set(x,y,z);
    computedSled.position.setComponent(2,z-0.01);

    //console.log("x="+x+", y="+y+", z="+z)
}


function homePositionUpdate(x,y){
    if ($("#units").text()=="MM"){
        x /= 25.4
        y /= 25.4
    }
    home.position.set(x,y,0);
    //shift any gcode
    homeX = x;
    homeY = y;
    gcode.position.set(x,y,0);


}

function gcodePositionUpdate(x,y,z){
    if ($("#units").text()=="MM"){
        x /= 25.4
        y /= 25.4
        z /= 25.4
    }
    gcodePos.position.set(x+homeX,y+homeY,z);
    //console.log("x="+x+", y="+y)
}


function unitSwitch(){
  if ( $("#units").text()=="MM") {
    distToMove = (parseFloat($("#distToMove").val())/25.4).toFixed(3)
    updateSetting('toInches',distToMove);
  } else {
    distToMove = (parseFloat($("#distToMove").val())*25.4).toFixed(3)
    updateSetting('toMM',distToMove);
  }
}

$(document).ready(function(){
    //settingRequest("Computed Settings","units");
    //settingRequest("Computed Settings","distToMove");
    //settingRequest("Computed Settings","homePosition");
    action("statusRequest","cameraStatus");
    //checkForGCodeUpdate();
    var controllerMessage = document.getElementById('controllerMessage');
    controllerMessage.scrollTop = controllerMessage.scrollHeight;
    //var $controllerMessage = $("#controllerMessage");
    //$controllerMessage.scrollTop($controllerMessage[0].scrollHeight);

    $( "#workarea" ).contextmenu(function() {
        if (!view3D)
        {
            pos = cursorPosition();

            x = pos.x;
            x = x.toFixed(4);
            pos.x = x;

            y = pos.y;
            y = y.toFixed(4);
            pos.y = y;
            requestPage("screenAction",pos)
        }
    });
});

function pauseRun(){
  if ($("#pauseButton").text()=="Pause"){
    action('pauseRun');
  }
  else {
    action('resumeRun');
  }
}

function resumeRun(){
    action('resumeRun')
}


function processRequestedSetting(data){
  //console.log(msg);
  if (data.setting=="pauseButtonSetting"){
    if(data.value=="Resume")
        $('#pauseButton').removeClass('btn-warning').addClass('btn-info');
    else
        $('#pauseButton').removeClass('btn-info').addClass('btn-warning');
    $("#pauseButton").text(data.value);
  }
  if (data.setting=="units"){
    console.log("requestedSetting:"+data.value);
    $("#units").text(data.value)
  }
  if (data.setting=="distToMove"){
    console.log("requestedSetting for distToMove:"+data.value);
    $("#distToMove").val(data.value)
  }
  if ((data.setting=="unitsZ") || (data.setting=="distToMoveZ")){
    if (typeof processZAxisRequestedSetting === "function") {
       processZAxisRequestedSetting(data)
    }
  }
}

function processPositionMessage(data){
  $('#positionMessage').html('XPos:'+parseFloat(data.xval).toFixed(2)+' Ypos:'+parseFloat(data.yval).toFixed(2)+' ZPos:'+parseFloat(data.zval).toFixed(2));
  $('#percentComplete').html(data.pcom)
  $('#machineState').html(data.state)
  positionUpdate(data.xval,data.yval,data.zval);
}

function processErrorValueMessage(data){
 //console.log(data.leftError);
 $('#leftError').css('width', data.leftError*100+'%').attr('aria-valuenow', data.leftError*100);
 $('#rightError').css('width', data.rightError*100+'%').attr('aria-valuenow', data.rightError*100);
 //check to see if data is valid (i.e., not -999999)
 //console.log(data.computedEnabled);
 if ( !data.computedEnabled )
 {
    if (isComputedEnabled){
        scene.remove(computedSled);
        //scene.remove(cutTrailGroup);
        isComputedEnabled = false;
    }
    return;
 }
 else
 {
     var x = data.computedX/25.4;
     var y = data.computedY/25.4;
     if ($("#units").text()==""){
        x /= 25.4
        y /= 25.4
     }
     //console.log(x+", "+y);
     /*var cutTrail = new THREE.Geometry();
     cutTrail.vertices.push(new THREE.Vector3(computedSled.position.getComponent(0), computedSled.position.getComponent(1), computedSled.position.getComponent(2)));
     */
     computedSled.position.setComponent(0,x);
     computedSled.position.setComponent(1,y);
     /*
     cutTrail.vertices.push(new THREE.Vector3(x, y, computedSled.position.getComponent(2)));
     console.log(cutTrail.vertices);
     cutTrailLine = new THREE.Line(cutTrail, greenLineMaterial);
     scene.add(cutTrailLine);
     cutTrailGroup.add(cutTrailLine);

     if (isComputedEnabled)
     {
        scene.remove(cutTrailGroup);
        scene.add(cutTrailGroup);
     }
     console.log(cutTrailGroup);
     */
     if (!isComputedEnabled){
        scene.add(computedSled);
        //scene.add(cutTrailGroup);
        isComputedEnabled = true;
     }
 }
 //following always comes in mm so convert to inches for 3d space

}


function processHomePositionMessage(data){
  console.log(data.xval)
  $('#homePositionMessage').html('XPos:'+parseFloat(data.xval).toFixed(2)+' Ypos:'+parseFloat(data.yval).toFixed(2));
  homePositionUpdate(data.xval,data.yval);
}

function processGCodePositionMessage(data){
  $('#gcodePositionMessage').html('XPos:'+parseFloat(data.xval).toFixed(2)+' Ypos:'+parseFloat(data.yval).toFixed(2)+' Zpos:'+parseFloat(data.zval).toFixed(2));
  $('#gcodeLine').html(data.gcodeLine);
  $('#gcodeLineIndex').val(data.gcodeLineIndex+1)
  gcodePositionUpdate(data.xval,data.yval,data.zval);
}

function gcodeUpdate(msg){
  console.log("updating gcode");
}
function gcodeUpdateCompressed(data){
  console.log("updating gcode compressed");
  if (gcode.children.length!=0) {
    for (var i = gcode.children.length -1; i>=0; i--){
        gcode.remove(gcode.children[i]);
    }
  }

  var gcodeLineSegments = new THREE.Geometry();
  var gcodeDashedLineSegments = new THREE.Geometry();

  if ((data!=null) && (data!="")){
    var uncompressed = pako.inflate(data);
    var _str = ab2str(uncompressed);
    var data = JSON.parse(_str)
    console.log(data)
    var pX, pY, pZ = -99999.9
    var gcodeDashed;
    var gcodeUndashed;
    data.forEach(function(line) {
      if (line.type=='line'){
        //console.log("Line length="+line.points.length+", dashed="+line.dashed);
        if (line.dashed==true) {
          var gcodeDashedLineSegments = new THREE.Geometry();
          line.points.forEach(function(point) {
            gcodeDashedLineSegments.vertices.push(new THREE.Vector3(point[0], point[1], point[2]));
          })
          gcodeDashed = new THREE.Line(gcodeDashedLineSegments, greenLineDashedMaterial)
          gcodeDashed.computeLineDistances();
          gcode.add(gcodeDashed);
        } else {
          var gcodeLineSegments = new THREE.Geometry();
          line.points.forEach(function(point) {
            gcodeLineSegments.vertices.push(new THREE.Vector3(point[0], point[1], point[2]));
          })
          gcodeUndashed = new THREE.Line(gcodeLineSegments, blueLineMaterial)
          gcode.add(gcodeUndashed);

        }
      } else {
        var gcodeCircleGeometry = new THREE.CircleGeometry(line.points[1][0]/32,16);
        var gcodeCircleEdges = new THREE.EdgesGeometry(gcodeCircleGeometry)
        var gcodeCircle = new THREE.LineSegments(gcodeCircleEdges,greenLineMaterial);
        gcodeCircle.position.set(line.points[0][0], line.points[0][1], line.points[0][2]);
        gcode.add(gcodeCircle);

        var gcodeLineSegments = new THREE.Geometry();
        gcodeLineSegments.vertices.push(new THREE.Vector3(line.points[0][0], line.points[0][1], line.points[0][2]));
        gcodeLineSegments.vertices.push(new THREE.Vector3(line.points[0][0], line.points[0][1], line.points[1][2]));
        gcodeUndashed = new THREE.Line(gcodeLineSegments, blueLineMaterial)
        gcode.add(gcodeUndashed);


      }
    });
    //gcode.move(originX,originY)
    //var gcodeDashed = new THREE.LineSegments(gcodeDashedLineSegments, greenLineDashedMaterial)
    //gcodeDashed.computeLineDistances();
    //var gcodeUndashed = new THREE.LineSegments(gcodeLineSegments, blueLineMaterial)
    //gcode.add(gcodeDashed);
    //gcode.add(gcodeUndashed);
    //scene.add(gcode);
    //console.log(gcodeUndashed);
    scene.add(gcode);
  }
  else{
    scene.remove(gcode);
  }
  $("#fpCircle").hide();

}
/*
function gcodeUpdateCompressed(msg){

  //This routine was an attempt at seeing if individual line segments could be stored such
  //that we could change their color as the cut progresses.  It worked on small gcode but
  //crashed on a large file.  will need to find another way.
  console.log("updating gcode compressed");
  console.log(gcode.length);
  if (gcode.children.length!=0) {
    for (var i = gcode.children.length -1; i>=0; i--){
        gcode.remove(gcode.children[i]);
    }
  }


  var gcodeLineSegments = new THREE.Geometry();
  var gcodeDashedLineSegments = new THREE.Geometry();

  var gcodeDashed = []
  var gcodeUndashed = []

  index1 = 0
  index2 = 0
  if (msg.data!=null){
    var uncompressed = pako.inflate(msg.data);
    var _str = ab2str(uncompressed);
    var data = JSON.parse(_str)
    var pX, pY, pZ = -99999.9
    data.forEach(function(line) {
      if (line.type=='line'){
        //console.log("Line length="+line.points.length+", dashed="+line.dashed);
        if (line.dashed==true) {
          line.points.forEach(function(point) {
            gcodeDashedLineSegments.vertices.push(new THREE.Vector3(point[0], point[1], point[2]));
            if (index1 != 0) {
                gcodeDashedLineSegments.vertices.push(new THREE.Vector3(point[0], point[1], point[2]));
                gcodeDashed[index1]=new THREE.Line(gcodeDashedLineSegments, greenLineDashedMaterial)
                gcodeDashed[index1].computeLineDistances();
                gcodeDashedLineSegments = new THREE.Geometry();
            }
            index1=index1+1
          })
        } else {
          line.points.forEach(function(point) {
            gcodeLineSegments.vertices.push(new THREE.Vector3(point[0], point[1], point[2]));
            if (index2 != 0) {
                gcodeLineSegments.vertices.push(new THREE.Vector3(point[0], point[1], point[2]));
                gcodeUndashed[index2]=new THREE.Line(gcodeLineSegments, blueLineMaterial)
                gcodeUndashedLineSegments = new THREE.Geometry();
            }
            index2=index2+1
          })
        }
      }
    });
    //gcode.move(originX,originY)
    gcodeDashed.forEach(function(line){
        gcode.add(line);
    })
    gcodeUndashed.forEach(function(line){
        gcode.add(line);
    })


    scene.add(gcode);
  }
  $("#fpCircle").hide();

}
*/

function ab2str(buf) {
    var bufView = new Uint16Array(buf);
    var unis =""
    for (var i = 0; i < bufView.length; i++) {
        unis=unis+String.fromCharCode(bufView[i]);
    }
    return unis
}

function showFPSpinner(msg){
    $("#fpCircle").show();
}

function toggle3DView()
{
    console.log("toggling");
    if (view3D){
        controls.enableRotate = false;
        controls.mouseButtons = {
            LEFT: THREE.MOUSE.RIGHT,
            MIDDLE: THREE.MOUSE.MIDDLE,
            RIGHT: THREE.MOUSE.LEFT
        }
        view3D=false;
        if (isMobile)
        {
            $("#mobilebutton3D").removeClass('btn-primary').addClass('btn-secondary');
        }
        else
        {
            $("#button3D").removeClass('btn-primary').addClass('btn-secondary');
        }
        console.log("toggled off");
    } else {
        controls.enableRotate = true;
        controls.mouseButtons = {
            LEFT: THREE.MOUSE.RIGHT,
            MIDDLE: THREE.MOUSE.MIDDLE,
            RIGHT: THREE.MOUSE.LEFT
        }
        view3D=true;
        if (isMobile)
        {
            $("#mobilebutton3D").removeClass('btn-secondary').addClass('btn-primary');
        }
        else
        {
            $("#button3D").removeClass('btn-secondary').addClass('btn-primary');
        }
        console.log("toggled on");
    }
    controls.update();
}

function resetView(){
    controls.reset();
}

function cursorPosition(){
    var rect = renderer.domElement.getBoundingClientRect();
    var vec = new THREE.Vector3(); // create once and reuse
    var pos = new THREE.Vector3(); // create once and reuse
    vec.set(
        ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1,
        - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1,
        0.5 );

    vec.unproject( camera );

    vec.sub( camera.position ).normalize();

    var distance = - camera.position.z / vec.z;

    pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );
    //console.log(pos);
    return(pos);
}

function processCameraMessage(data){
    if(data.command=="cameraImageUpdated"){
        var newImg = new Image();
        if (imageShowing==1)
        {
            newImg.onload = function() {
                document.getElementById("cameraImage2").setAttribute('src',this.src);
                if (isMobile){
                    document.getElementById("mobileCameraDiv2").style.zIndex = "95";
                    document.getElementById("mobileCameraDiv1").style.zIndex = "94";
                } else {
                    document.getElementById("cameraDiv2").style.zIndex = "95";
                    document.getElementById("cameraDiv1").style.zIndex = "94";
                }
                imageShowing = 2
            }
        }
        else
        {
            newImg.onload = function() {
                document.getElementById("cameraImage1").setAttribute('src',this.src);
                if (isMobile){
                    document.getElementById("mobileCameraDiv1").style.zIndex = "95";
                    document.getElementById("mobileCameraDiv2").style.zIndex = "94";
                } else {
                    document.getElementById("cameraDiv1").style.zIndex = "95";
                    document.getElementById("cameraDiv2").style.zIndex = "94";
                }
                imageShowing = 1
            }
        }
        newImg.setAttribute('src', 'data:image/png;base64,'+data.data)

    }
    if(data.command=="updateCamera")
    {
        if (data.data=="on"){
            $("#videoStatus svg.feather.feather-video-off").replaceWith(feather.icons.video.toSvg());
            feather.replace();
            console.log("video on");
            document.getElementById("cameraImage1").style.display = "block"
            document.getElementById("cameraImage2").style.display = "block"
            if (isMobile)
                document.getElementById("mobileCameraArea").style.display = "block"
        }

        if (data.data=="off"){
            $("#videoStatus svg.feather.feather-video").replaceWith(feather.icons["video-off"].toSvg());
            feather.replace();
            console.log("video off")
            document.getElementById("cameraImage1").style.display = "none";
            document.getElementById("cameraImage2").style.display = "none"
            if (isMobile)
                document.getElementById("mobileCameraArea").style.display = "none"
        }
    }
}

function processControllerMessage(data){
    if (controllerMessages.length >100)
        controllerMessages.shift();
    controllerMessages.push(data);
    $('#controllerMessage').html('');
    controllerMessages.forEach(function(message){
        $('#controllerMessage').append(message+"<br>");
    });
    $('#controllerMessage').scrollBottom();
}

function processAlarm(data){
    console.log("alarm received");
    $("#alarms").html("<marquee behavior='scroll' direction='left'>"+data.message+"</marquee>");
    $("#alarms").removeClass('alert-success').addClass('alert-danger');
    $("#stopButton").addClass('stopbutton');
}

function clearAlarm(data){
    console.log("clearing alarm");
    $("#alarms").text("Alarm cleared.");
    $("#alarms").removeClass('alert-danger').addClass('alert-success');
    $("#stopButton").removeClass('stopbutton');
}

document.onmousemove = function(event){
    if (!isMobile)
    {
        pos = cursorPosition();
        cursor.position.set(pos.x,pos.y,pos.z);
        var linePosX = confine(pos.x,-48, 48);
        var linePosY = confine(pos.y,-24, 24);

        var positions = cursorVLine.geometry.attributes.position.array;
        positions[0]=linePosX;
        positions[1]=24;
        positions[2]=-0.001;
        positions[3]=linePosX;
        positions[4]=-24;
        positions[5]=-0.001;
        cursorVLine.geometry.attributes.position.needsUpdate=true;

        positions = cursorHLine.geometry.attributes.position.array;
        positions[0]=48;
        positions[1]=linePosY;
        positions[2]=-0.001;
        positions[3]=-48;
        positions[4]=linePosY;
        positions[5]=-0.001;
        cursorHLine.geometry.attributes.position.needsUpdate=true;


        if ($("#units").text()=="MM"){
            pos.x *= 25.4
            pos.y *= 25.4
        }
        $("#cursorPosition").text("X: "+pos.x.toFixed(2)+", Y: "+pos.y.toFixed(2));
    }
}

function confine(value, low, high)
{
    if (value<low)
        return low;
    if (value>high)
        return high;
    return value;
}

function boardDataUpdate(data){
  console.log("updating board data");
  boardWidth = data.width;
  boardHeight = data.height;
  boardThickness = data.thickness;
  boardCenterX = data.centerX;
  boardCenterY = data.centerY;
  boardID = data.boardID;
  boardMaterial = data.material;

  boardOutlineGeometry.dispose();
  boardOutlineGeometry = new THREE.BoxBufferGeometry(boardWidth,boardHeight,boardThickness);
  boardOutlineFill.geometry = boardOutlineGeometry;
  boardEdgesGeometry = new THREE.EdgesGeometry( boardOutlineGeometry )
  boardOutlineOutline.geometry = boardEdgesGeometry;

  boardOutlineFill.geometry.needsUpdate=true;
  boardOutlineOutline.geometry.needsUpdate=true;
  boardGroup.position.set(boardCenterX,boardCenterY,boardThickness/-2.0);

  $("#boardID").text("Board: "+boardID+", Material: "+boardMaterial);


}

function boardCutDataUpdateCompressed(data){
  console.log("updating board cut data compressed");
  if (cutSquareGroup.children.length!=0) {
    for (var i = cutSquareGroup.children.length -1; i>=0; i--){
        cutSquareGroup.remove(cutSquareGroup.children[i]);
    }
  }
  if (data!=null){
    //var cutSquareMaterial = new THREE.MeshBasicMaterial( {color:0xffff00, side: THREE.DoubleSide});
    var cutSquareMaterial = new THREE.MeshBasicMaterial( {color:0xff6666});
    var noncutSquareMaterial = new THREE.MeshBasicMaterial( {color:0x333333});
    var uncompressed = pako.inflate(data);
    var _str = ab2str(uncompressed);
    var data = JSON.parse(_str)

    var pointsX = Math.ceil(boardWidth)
    var pointsY = Math.ceil(boardHeight)
    console.log("boardWidth="+boardWidth)
    console.log("boardHeight="+boardHeight)
    console.log("boardCenterY="+boardCenterY)
    var offsetX = pointsX / 2
    var offsetY = pointsY / 2

    for (var x =0; x<pointsX; x++){
        for (var y =0; y<pointsY; y++){
            if (data[x+y*pointsX]){
                //console.log(x+", "+y);
                var geometry = new THREE.PlaneGeometry(1,1);
                var plane = new THREE.Mesh(geometry, cutSquareMaterial);
                plane.position.set(x-offsetX+boardCenterX, y-offsetY+boardCenterY, 0.01);
                cutSquareGroup.add(plane);
            }/*
            else{
                var geometry = new THREE.PlaneGeometry(1,1);
                var plane = new THREE.Mesh(geometry, noncutSquareMaterial);
                plane.position.set(x-offsetX+boardCenterX, y-offsetY+boardCenterY, 0.01);
                cutSquareGroup.add(plane);
            }*/
        }
    }
  }
  var e = new Date();
  $("#fpCircle").hide();

}

function toggleBoard(){
    if (showBoard) {
        showBoard = false;
        scene.remove(cutSquareGroup);
        scene.remove(boardGroup);
        $("#boardID").removeClass('btn-primary').addClass('btn-secondary');
    } else {
        showBoard = true;
        scene.add(cutSquareGroup);
        scene.add(boardGroup);
        $("#boardID").removeClass('btn-secondary').addClass('btn-primary');
    }
}

