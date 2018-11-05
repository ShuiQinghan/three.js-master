var container, stats;

    var camera, scene, renderer, controls;

    var mesh;

    var controls;

    var room_1 = null;

    var point_1 = null;
    var point_2 = null;

    var pointIsSelect_1 = false;
    var pointIsSelect_2 = false;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    var raycaster;

    var mouse = new THREE.Vector2();

    var moveFrom, moveTo;

    var moveVec = new THREE.Vector3();

    var counter = 0;

    var fa = new THREE.Vector3(0, 0, -2);

    var isMoving = false;

    var isPano = true;

    var selectedObjects = new Map(); 

    init();
    animate();

    function init() {

        container = document.createElement( 'div' );
        document.body.appendChild( container );
        
        //init raycaster
        raycaster = new THREE.Raycaster();

        ////initial functions
        initCamera();
        initScene();
        initPano();
        initRoomModels();
        initRoadPoints();
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

    function initPano() {
        var geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
        // invert the geometry on the x-axis so that all of the faces point inward
        geometry.scale( - 1, 1, 1 );

        var material = new THREE.MeshBasicMaterial( {
            map: new THREE.TextureLoader().load( 'textures/color.png' )
        } );
        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );
    }

    function initRoomModels() {
        var objLoader = new THREE.OBJLoader().load(
            'models/layout.obj',
            function (room) {
                room_1 = room.children[0];

                //can add shader here, make a material
                var material = new THREE.MeshPhongMaterial( {color: 0x333fff , transparent:true, opacity:0});
                
                room_1.scale = new THREE.Vector3(90,90,90);
                room_1.position.y = -0.5;
                room_1.rotation.y = -30;
                room_1.material = material;
                scene.add(room_1);
            }
        );
    }

    function initRoadPoints() {
        //road points, I'll use a for loop to load and render all points in the future 
        //point 1
        var p1 = new THREE.SphereGeometry(0.5, 32, 32);
        var material_1 = new THREE.MeshPhongMaterial( {color: 0xffff00});
        point_1 = new THREE.Mesh(p1, material_1);
        point_1.position.x = 0;
        point_1.position.y = -2.5;
        point_1.position.z = -6;
        scene.add(point_1);
        //point 2
        var p2 = new THREE.SphereGeometry(0.5, 32, 32);
        var material_2 = new THREE.MeshPhongMaterial( {color: 0xffff00});
        point_2 = new THREE.Mesh(p2, material_2);
        point_2.position.x = -3;
        point_2.position.y = -2.5;
        point_2.position.z = 5;
        scene.add(point_2);
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
        
        if(keyCode == 90) {
            //isPano = false
            if(pointIsSelect_1 == true) {
                isMoving = true;
                moveFrom = new THREE.Vector3(camera.position.x, 0, camera.position.z);
                moveTo = new THREE.Vector3(point_1.position.x, 0, point_1.position.z);
                moveVec = subVectors(moveTo, moveFrom);
                fa = subVectors(controls.target, camera.position);
                //moveVec.divideScalar(100);
            }
            else if (pointIsSelect_2 == true) {
                isMoving = true;
                moveFrom = new THREE.Vector3(camera.position.x, 0, camera.position.z);
                moveTo = new THREE.Vector3(point_2.position.x, 0, point_2.position.z);
                moveVec = subVectors(moveTo, moveFrom);
                fa = subVectors(controls.target, camera.position);
                //moveVec.divideScalar(100);
            }
            else {
                
            }
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
        
        render();
    }
    
    function onMouseClick(event) {
        
    }

    function moveCamera() {
        ///fade
        if(counter >=0 && counter <10) {
            room_1.material.opacity += 0.1;    
            mesh.material.opacity -= 0.1;
            if(counter == 9) {
                room_1.material.transparent = false;
                mesh.material.transparent = true;
            }
        }
        ///move
        else if(counter >= 10 && counter < 110) {
            camera.position.addScaledVector(moveVec, 0.01);
            var ca = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
            controls.target.addVectors(fa, ca);
            //controls.update();
        }
        ///fade
        else if(counter >= 110 && counter < 120) {
            room_1.material.opacity -= 0.1;    
            mesh.material.opacity += 0.1;
            if(counter == 110) {
                mesh.material.transparent = false;
                room_1.material.transparent = true;
            }
        }
        
        counter++;

        if(counter == 120) {
            counter = 0;
            isMoving = false
        }

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
