// Import necessary modules from jsDelivr CDN
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer, clock, mixer;
const animations = [];
let controls;
let isAnimationLoaded = false;

function init() {
    scene = new THREE.Scene();
    clock = new THREE.Clock();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(100, 50, 200);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color('grey'));
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    setupLighting();
    loadStaticModel();

    document.getElementById('playButton').addEventListener('click', loadAndPlayAnimations);

    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(-300, 150, 300);
    scene.add(directionalLight);
}

function loadStaticModel() {
    const loader = new GLTFLoader();
    loader.load('models/Animations.gltf', (gltf) => {
        scene.add(gltf.scene);
        console.log('Static model loaded.');
    }, undefined, (error) => {
        console.error('Error loading the static model:', error);
    });
}

function loadAndPlayAnimations() {
    if (!isAnimationLoaded) {
        const loader = new GLTFLoader();
        loader.load('models/Animations.gltf', (gltf) => {
            mixer = new THREE.AnimationMixer(gltf.scene);
            gltf.animations.forEach((clip) => {
                const action = mixer.clipAction(clip);
                animations.push(action);
            });
            isAnimationLoaded = true;
            console.log('Animation file loaded and mixer initialized.');
            playAnimations();
        }, undefined, (error) => {
            console.error('Error loading the animation file:', error);
        });
    } else {
        playAnimations();
    }
}

function playAnimations() {
    animations.forEach((anim) => {
        anim.stop();
        anim.play();
    });
    console.log('Animations played.');
}

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (mixer) {
        mixer.update(delta);
    }
    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.update();
}

init();


