import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import characterControls from './CSM/CC'; // default export assumed
import playerInput from './CSM/BCCI'; // renamed for clarity

const ThreejsWrapper = () => {
  const canvasRef = useRef(null); // single source of truth
  const rendererRef = useRef(null); // let us dispose on unmount
  const clock = useRef(new THREE.Clock());
  const frameId = useRef(null); // store rAF id for cleanup

  /* ─────────────────────────── EFFECT ─────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const sizes = { width: window.innerWidth, height: window.innerHeight };

    /* --- Scene & Lights --- */
    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(1, 1, 1);
    scene.add(dirLight);

    /* --- Camera & Controls --- */
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.001,
      100
    );
    camera.position.set(0, 2, 3);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    /* --- Ground Plane --- */
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.MeshStandardMaterial({
        color: 0x125c15,
        side: THREE.DoubleSide,
      })
    );
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    /* --- Renderer --- */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(sizes.width, sizes.height);
    // renderer.outputEncoding = THREE.sRGBEncoding; // nicer colours
    rendererRef.current = renderer;

    /* --- Resize Handling --- */
    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    /* --- Model & Animations --- */
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load(
      'cop.glb',
      (gltf) => {
        gltf.scene.scale.set(0.5, 0.5, 0.5);
        scene.add(gltf.scene);

        /* mixer + clip map */
        const mixer = new THREE.AnimationMixer(gltf.scene);
        const animMap = new Map();
        gltf.animations.forEach((clip) =>
          animMap.set(clip.name, mixer.clipAction(clip))
        );
        console.log(
          gltf.scene,
          mixer,
          animMap,
          controls,
          camera,
          'Breathing Idle'
        );
        characterControls._init(
          gltf.scene,
          mixer,
          animMap,
          controls,
          camera,
          'Breathing Idle'
        );
      },
      undefined,
      (err) => console.error('GLB load error ▶', err)
    );

    /* --- Keyboard Events --- */
    const onKeyDown = (e) => {
      playerInput._onKeyDown(e);
      if (e.shiftKey && !characterControls.isRunning)
        characterControls._toggleRun = true;
    };
    const onKeyUp = (e) => {
      playerInput._onKeyUp(e);
      if (e.key === 'Shift') characterControls._toggleRun = false;
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    /* --- Animation Loop --- */
    const animate = () => {
      const delta = clock.current.getDelta();
      characterControls.update(delta, playerInput._keys);
      controls.update();
      renderer.render(scene, camera);
      frameId.current = requestAnimationFrame(animate);
    };
    animate();

    /* ──────────────── CLEAN-UP ──────────────── */
    return () => {
      cancelAnimationFrame(frameId.current);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      controls.dispose();
      renderer.dispose();
      plane.geometry.dispose();
      plane.material.dispose();
    };
  }, []);

  return (
    <div className='threejs_wrapper'>
      <canvas
        ref={canvasRef}
        className='webgl'
      />
    </div>
  );
};

export default ThreejsWrapper;
