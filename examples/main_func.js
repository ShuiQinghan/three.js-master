var container, stats;

    var camera, scene, renderer;

    var mouseX = 0, mouseY = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    var isPano = true;

    init();
    animate();


    function init() {

        container = document.createElement( 'div' );
        document.body.appendChild( container );

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
        camera.position.z = 250;

        // scene

        scene = new THREE.Scene();

        var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
        scene.add( ambientLight );

        var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
        camera.add( pointLight );
        scene.add( camera );

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

        var onError = function ( xhr ) { };

        THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

        

        new THREE.MTLLoader()
            .setPath( 'models/obj/male02/' )
            .load( 'male02_dds.mtl', function ( materials ) {

                materials.preload();

                new THREE.OBJLoader()
                    .setMaterials( materials )
                    .setPath( 'models/obj/male02/' )
                    .load( 'male02.obj', function ( object ) {

                        object.position.y = - 95;
                        scene.add( object );

                    }, onProgress, onError );

            } );

        //

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );

        document.addEventListener("keydown", onDocumentKeyDown, false);

        document.addEventListener("keyup", onDocumentKeyUp, false);

        //

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

        requestAnimationFrame( animate );
        render();

    }

    function onDocumentKeyDown(event) {
        var keyCode = event.which;
        
        if(keyCode == 90) {
            isPano = !isPano;
        } 
        else if (keyCode == 87) {
            camera.position.z -= 0.5;
            isPano = false;
        }
        else if (keyCode == 65) {
            camera.position.x -= 0.5;
            isPano = false;
        }
        else if (keyCode == 83) {
            camera.position.z += 0.5;
            isPano = false;
        }
        else if (keyCode == 68) {
            camera.position.x += 0.5;
            isPano = false;
        }
        render();
    };

    function onDocumentKeyUp(event) {
        var keyCode = event.which;
        
        if(keyCode == 90) {
            isPano = !isPano;
        } 
        else if (keyCode == 87) {
            camera.position.z -= 0.5;
            isPano = true;
        }
        else if (keyCode == 65) {
            camera.position.x -= 0.5;
            isPano = true;
        }
        else if (keyCode == 83) {
            camera.position.z += 0.5;
            isPano = true;
        }
        else if (keyCode == 68) {
            camera.position.x += 0.5;
            isPano = true;
        }
        render();
    };

    function movement() {

    }

    function render() {

        

        if(isPano == true) {
    
            
            //object[0].visible = false;
            mesh.material.opacity = 255;
            mesh.material.transparent = false;
        }
        else if(isPano == false) {
            
            //object[0].visible = true;
            mesh.material.opacity = 0;
            mesh.material.transparent = true;
        }

        renderer.render( scene, camera );

    }
