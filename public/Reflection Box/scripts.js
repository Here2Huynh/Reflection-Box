// text and stats
let container, stats;

// threejs main 3 component
let camera, scene, renderer;

let cube1, cube2, cube3, cube4, cube5, cube6, cube7, cube8, cube9; 
let cubeList = [cube1, cube2, cube3, cube4, cube5, cube6, cube7, cube8, cube9];
let cubePositions = [ [250,-100], [250,0], [250,100], [150,-100], [150,null], [150,100], [50,100], [50,0], [50, -100] ]

let plane;

// up and down rotation
let targetYRotation = 0;
let targetYRotationOnMouseDown = 0;

// left and right rotation
let targetXRotation = 0;
let targetXRotationOnMouseDown = 0;

let mouseX = 0;
let mouseXOnMouseDown = 0;

let mouseY = 0;
let mouseYOnMouseDown = 0;

// rotation speed
let windowHalfX = window.innerWidth;
let windowHalfY = window.innerHeight;

// webcam
let video;

// ask to access web cam
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

const init = () => {
    
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    var info = document.createElement( 'div' );
    info.className = 'info'
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.style.marginBottom = '50px';
    info.innerHTML = 'Drag to spin the cube and please enable webcam for the best effect :]';
    container.appendChild( info );

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.y = 150;
    camera.position.z = 500;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );

    // video
    video = document.getElementById( 'video' );
    let texture = new THREE.VideoTexture( video );
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;

    if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {
        let constraints = { video: { width: 200, height: 200, facingMode: 'user' } };
        navigator.mediaDevices.getUserMedia( constraints )
            .then( function( stream ) {
                // apply the stream to the video element used in the texture
                // video.src = window.URL.createObjectURL( stream );
                video.srcObject = stream;
                video.play()
            })
            .catch( function( error ) {
                console.error( 'Unable to access the camera/webcam.', error );
            });
    } 
    else {
        console.error( 'MediaDevices interface not available.' );
    }


    // Cube
    var geometry = new THREE.BoxGeometry( 100, 100, 100 );

    // generate the sides
    for ( let i = 0; i < geometry.faces.length; i += 2 ) {
        let hex = Math.random() * 0xffffff;
        geometry.faces[ i ].color.setHex( hex );
        geometry.faces[ i + 1 ].color.setHex( hex );
    }

    // var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
    var material = new THREE.MeshBasicMaterial( { map: texture } );

    // create the cubes and assign its positions 
    for (let i = 0; i < cubeList.length; i++) {
        cubeList[i] = new THREE.Mesh( geometry, material );
        cubeList[i].position.y = cubePositions[i][0]
        cubeList[i].position.x = cubePositions[i][1]
        scene.add( cubeList[i] )
    }

    // Plane
    var geometry = new THREE.PlaneBufferGeometry( 200, 200 );
    geometry.rotateX( - Math.PI / 2 );
    
    var material = new THREE.MeshBasicMaterial( { color: 0xe0e0e0, overdraw: 0.5 } );

    plane = new THREE.Mesh( geometry, material );


    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    // stats = new Stats();
    // container.appendChild( stats.dom );

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );

    // window resizing
    window.addEventListener( 'resize', onWindowResize, false );

}

// window resize
const onWindowResize = () => {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

// mouse event listeners 
const onDocumentMouseDown = ( event ) => {

    event.preventDefault();

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'mouseout', onDocumentMouseOut, false );

    mouseXOnMouseDown = event.clientX - windowHalfX;
    mouseYOnMouseDown = event.clientY - windowHalfY;

    targetYRotationOnMouseDown = targetYRotation;
    targetXRotationOnMouseDown = targetXRotation;

}

const onDocumentMouseMove = ( event ) => {

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

    targetYRotation = targetYRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
    targetXRotation = targetXRotationOnMouseDown + ( mouseY - mouseYOnMouseDown ) * 0.02;

    }

    const onDocumentMouseUp = ( event ) => {

    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

}

const onDocumentMouseOut = ( event ) => {

    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

}

const onDocumentTouchStart = ( event ) => {

    if ( event.touches.length === 1 ) {

        event.preventDefault();

        mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
        targetYRotationOnMouseDown = targetYRotation;

        mouseYOnMouseDown = event.touches[ 0 ].pageY - windowHalfY;
        targetXRotationOnMouseDown = targeXYRotation;

    }
}

const onDocumentTouchMove = ( event ) => {

    if ( event.touches.length === 1 ) {

        event.preventDefault();

        mouseX = event.touches[ 0 ].pageX - windowHalfX;
        targetYRotation = targetYRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;

        mouseY = event.touches[ 0 ].pageY - windowHalfY;
        targetXRotation = targetXRotationOnMouseDown + ( mouseY - mouseYOnMouseDown ) * 0.05;

    }
}

// render everything
const animate = () => {

    requestAnimationFrame( animate );

    // stats.begin();
    render();
    // stats.end();
}

const render = () => {

    for (let i = 0; i < cubeList.length; i++) {
        plane.rotation.y = cubeList[i].rotation.y += ( targetYRotation - cubeList[i].rotation.y ) * 0.05;
        plane.rotation.x =  cubeList[i].rotation.x += ( targetXRotation - cubeList[i].rotation.x ) * 0.05;
    }

    renderer.render( scene, camera );
}


init();
animate();