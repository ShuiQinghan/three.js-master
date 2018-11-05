var container, stats;

    var camera, scene, renderer, controls;

    var controls;

    var room_1 = null;

    var point_1 = null;
    var point_2 = null;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    var counter = 0;

    var isPano = true;

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
        var p1 = new THREE.SphereGeometry(3, 32, 32);
        var material_1 = new THREE.MeshBasicMaterial( {color: 0xffff00});
        point_1 = new THREE.Mesh(p1, material_1);
        point_1.position.x = 0.5;
        scene.add(point_1);

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );
        
        
        controls = new THREE.OrbitControls(camera);
        controls.target = new THREE.Vector3(0, 0, 0);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.autoRotate = false;
        controls.enableZoom = false;
        

        document.addEventListener("keydown", onDocumentKeyDown, false);

        document.addEventListener("keyup", onDocumentKeyUp, false);

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
