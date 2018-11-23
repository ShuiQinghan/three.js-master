var container, stats;

var camera, scene, renderer, controls;

var controls;

////these two groups are mean to store all pano and model in the house
var rooms = new THREE.Group();
var panos = new THREE.Group();
var doors = new THREE.Group();

//////calculation for window
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

//////for mouse control
var mouse = new THREE.Vector2();
var oldmouse = new THREE.Vector2();
var mouseisClicking = false;

var raycaster;

var moveFrom, moveTo;

var moveVec = new THREE.Vector3();

var counter = 0;

var fa = new THREE.Vector3(0, 0, -2);

var isMoving = false;

var isPano = true;

var selectedObjects = new Map(); 

var jsonData = null;

var roomNow = 0;

var loadJsonFinish = false;

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );
    
    //init raycaster
    raycaster = new THREE.Raycaster();

    ////put panorama and obj model initial functions inside of jsonloader callback function due to ascynchronize problem
    loadJsonData();

    ////initial functions for those don't need json data
    initCamera();
    initScene();
    initRenderer();
    initControls();

    /////add listeners
    document.addEventListener("keydown", onDocumentKeyDown, false);
    document.addEventListener("keyup", onDocumentKeyUp, false);
    window.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'click', onMouseClick, false );
    window.addEventListener( 'resize', onWindowResize, false );

}

function initCamera() {
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( pointLight );
    camera.position.z = 2;
}

function initScene() {
    scene = new THREE.Scene();
    var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    scene.add( ambientLight );
    scene.add( camera );
}

function initPano(modelNum) {

    //load all panos in the house
    var i;
    for(i = 0 ; i < jsonData.roomNum ; i++) {
        loadPano(i);
    }
    scene.add(panos);
}

function loadPano(i) {
    var geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
    // invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale( - 1, 1, 1 );

    var material = new THREE.MeshBasicMaterial( {
        map: new THREE.TextureLoader().load( 'models/' + jsonData.thismodel + '/' + i + '/color.png' )
    } );
    var mesh = new THREE.Mesh( geometry, material );
    if(roomNow != i) {
        mesh.material.transparent = true;
        mesh.material.opacity = 0;
    }
    panos.add(mesh);
}

function initRoomModels(modelNum) {
    //load all obj model in the house
    var i;
    for(i = 0 ; i < jsonData.roomNum ; i++) {
        loadRoom(i);
    }
    scene.add(rooms);
}

function loadRoom(i) {
    var objLoader = new THREE.OBJLoader().load(
        'models/1/'+ (i+1) +'/layout.obj',
        function (room) {
            var room_data = room.children[0];

            //can add shader here, make a material
            //if you wanna know how to add a shader as a amaterial, ckeck three.js website
            
            var material = new THREE.MeshPhongMaterial( {color: 0x333fff , transparent:true, opacity:0});

            
            /////set position and rotation here
            /////parse json inform we need first
            var roomData = jsonData[i.toString()];
            console.log("Room Data from local json is " + roomData);

            /////set position and rotation
            room_data.position.x = roomData.x;
            room_data.position.z = roomData.y;
            room_data.rotation.y = roomData.r;

            room_data.material = material;
            rooms.add(room_data);
        }
    )
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
}

function initControls() {
    //control camera by orbit, but maybe I'll use trackball instead someday.
    controls = new THREE.OrbitControls(camera);
    var ca = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
    controls.target.addVectors(fa,ca);
    controls.enableDamping = true;
    controls.dampingFactor = 0.15;
    controls.autoRotate = false;
    controls.rotateSpeed = 0.03;
    controls.enableZoom = false;
    controls.enablePan = false;
}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentKeyDown(event) {
    var keyCode = event.which;
    
    ////0~9 = 48~49

    if(keyCode == 90) {
        
    } 
    
    render();
};

function onDocumentKeyUp(event) {
    var keyCode = event.which;
    
    if(keyCode == 90) {
        
    } 
    
    render();
};

function onMouseMove( event ) {

    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    //if()

    /*
    raycaster.setFromCamera( mouse, camera );

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects( point_1 );

    point_1.raycast(raycaster, intersects);
    if(intersects.length > 0) {
        pointIsSelect_1 = true;
        point_1.material.color.set(0x666fff);
    }
    else {
        pointIsSelect_1 = false;
        point_1.material.color.set(0xffff00);
    }
    
    intersects = raycaster.intersectObjects( point_2 );

    point_2.raycast(raycaster, intersects);
    if(intersects.length > 0) {
        pointIsSelect_2 = true;
        point_2.material.color.set(0x666fff);
    }
    else {
        pointIsSelect_2 = false;
        point_2.material.color.set(0xffff00);
    }
    */
    
    render();
}

function onMouseClick(event) {
    ////record old mouse
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    oldmouse = mouse;
}

function moveCamera() {
    
    render();
}

function animate() {
    
    if(isMoving) {
        moveCamera();
    }
    
    controls.update();

    requestAnimationFrame( animate );
    render();

}

function render() {

    renderer.render( scene, camera );

}

function loadJsonData() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            jsonData = JSON.parse(this.responseText);
        
            roomNow = jsonData.mainroomid;
            ////initial functions for those who need json data
            initPano(jsonData.thismodel);
            initRoomModels(jsonData.thismodel);
            loadJsonFinish = true;
        }
    };
    xmlhttp.open("GET", "testFile.json", true);
    xmlhttp.send();
    
}
