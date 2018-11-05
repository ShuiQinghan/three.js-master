var container, stats;

    var camera, scene, renderer, controls;

    var controls;

    var room_1 = null;

    var point_1 = null;
    var point_2 = null;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    var raycaster;

    var mouse = new THREE.Vector2();

    var moveFrom, moveTo;

    var counter = 0;

    var isPano = true;

    var selectedObjects = new Map(); 

    init();
    animate();

    function init() {

        container = document.createElement( 'div' );
        document.body.appendChild( container );

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );

        // scene

        scene = new THREE.Scene();

        var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
        scene.add( ambientLight );

        var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
        camera.add( pointLight );
        scene.add( camera );
        camera.position.z = 2;
        
        raycaster = new THREE.Raycaster();

        var geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
        // invert the geometry on the x-axis so that all of the faces point inward
        geometry.scale( - 1, 1, 1 );

        var material = new THREE.MeshBasicMaterial( {
            map: new THREE.TextureLoader().load( 'textures/color.png' )
        } );

        mesh = new THREE.Mesh( geometry, material );

        scene.add( mesh );

        // model

        var onProgress = function ( xhr ) {

            if ( xhr.lengthComputable ) {

                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

            }

        };

        var onError = function () { };

		THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

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

        //road points
        var p1 = new THREE.SphereGeometry(0.5, 32, 32);
        var material_1 = new THREE.MeshPhongMaterial( {color: 0xffff00});
        point_1 = new THREE.Mesh(p1, material_1);
        point_1.position.x = 0;
        point_1.position.y = -2.5;
        point_1.position.z = -6;
        scene.add(point_1);

        var p2 = new THREE.SphereGeometry(0.5, 32, 32);
        var material_2 = new THREE.MeshPhongMaterial( {color: 0xffff00});
        point_2 = new THREE.Mesh(p2, material_2);
        point_2.position.x = -3;
        point_2.position.y = -2.5;
        point_2.position.z = 5;
        scene.add(point_2);

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );
        
        //control panel
        controls = new THREE.OrbitControls(camera);
        controls.target = new THREE.Vector3(0, 0, 0);
        controls.enableDamping = true;
        controls.dampingFactor = 0.15;
        controls.autoRotate = false;
        controls.rotateSpeed = 0.03;
        controls.enableZoom = false;
        controls.enablePan = false;
        

        document.addEventListener("keydown", onDocumentKeyDown, false);

        document.addEventListener("keyup", onDocumentKeyUp, false);

        window.addEventListener( 'mousemove', onMouseMove, false );

        window.addEventListener( 'resize', onWindowResize, false );

    }

    function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    
    //

    function animate() {
        
        controls.update();

        requestAnimationFrame( animate );
        render();

    }

    function onDocumentKeyDown(event) {
        var keyCode = event.which;
        
        if(keyCode == 90) {
            isPano = false
        } 
        
        render();
    };

    function onDocumentKeyUp(event) {
        var keyCode = event.which;
        
        if(keyCode == 90) {
            isPano = true;
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
            point_1.material.color.set(0x666fff);
        }
        else {
            point_1.material.color.set(0xffff00);
        }
        
        intersects = raycaster.intersectObjects( point_2 );

        point_2.raycast(raycaster, intersects);
        if(intersects.length > 0) {
            point_2.material.color.set(0x666fff);
        }
        else {
            point_2.material.color.set(0xffff00);
        }
        
        render();
    }

    function moveCamera() {

    }

    function render() {

        if(isPano == true) {
            room_1.material.opacity = 0;
            room_1.material.transparent = true;
            
            //object[0].visible = false;
            mesh.material.opacity = 1;
            mesh.material.transparent = false;
        }
        else if(isPano == false) {
            room_1.material.opacity = 1;
            room_1.material.transparent = false;

            //object[0].visible = true;
            mesh.material.opacity = 0;
            mesh.material.transparent = true;
        }


        renderer.render( scene, camera );

    }
