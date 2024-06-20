import * as THREE from "three";
import { FontLoader } from "fontLoader";
import { TextGeometry } from "textGeometry";
import { GUI } from "gui";

// ページの読み込みを待ってから実行
window.addEventListener("DOMContentLoaded", init);

function init() {
  // 描画サイズ
  const width = window.innerWidth;
  const height = window.innerHeight;

  // 背景色
  const bgColor = 0x000000;

  const canvas = document.querySelector("#canvas");

  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    devicePixelRatio: window.devicePixelRatio,
  });
  renderer.setSize(width, height);
  renderer.setClearColor(bgColor, 0);

  // シーンを作成
  const scene = new THREE.Scene();

  // 光源
  const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
  directionalLight.position.set(0, 2, 3);
  scene.add(directionalLight); // 平行光源

  scene.add(new THREE.AmbientLight(0xffffff, 1)); // 環境光源

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height); // 視野角, アスペクト比
  camera.position.set(0, 0, +60); // 最後の引数は距離

  // メッシュ
  const geometry = new THREE.TorusGeometry(10, 5, 24, 130);

  const params = {
    color: 0xffffff,
    transmission: 1.3,
    opacity: 1,
    metalness: 0,
    roughness: 0,
    ior: 1.6,
    thickness: 5,
    specularIntensity: 1,
    specularColor: 0xffffff,
    dispersion: 5,
  };

  const material = new THREE.MeshPhysicalMaterial({
    color: params.color,
    metalness: params.metalness,
    roughness: params.roughness,
    ior: params.ior,
    thickness: params.thickness,
    transmission: params.transmission, // use material.transmission for glass materials
    specularIntensity: params.specularIntensity,
    specularColor: params.specularColor,
    opacity: params.opacity,
    side: THREE.DoubleSide,
    dispersion: params.dispersion,
  });

  const torus = new THREE.Mesh(geometry, material);
  torus.rotateY(0.6);

  // GUI
  const gui = new GUI();

  gui.addColor(params, "color").onChange(function () {
    material.color.set(params.color);
    render();
  });

  gui.add(params, "transmission", 0, 1.5, 0.01).onChange(function () {
    material.transmission = params.transmission;
    render();
  });

  gui.add(params, "metalness", 0, 1, 0.01).onChange(function () {
    material.metalness = params.metalness;
    render();
  });

  gui.add(params, "roughness", 0, 1, 0.01).onChange(function () {
    material.roughness = params.roughness;
    render();
  });

  gui.add(params, "ior", 1, 2, 0.01).onChange(function () {
    material.ior = params.ior;
    render();
  });

  gui.add(params, "thickness", 0, 5, 0.01).onChange(function () {
    material.thickness = params.thickness;
    render();
  });

  gui.add(params, "specularIntensity", 0, 1, 0.01).onChange(function () {
    material.specularIntensity = params.specularIntensity;
    render();
  });

  gui.addColor(params, "specularColor").onChange(function () {
    material.specularColor.set(params.specularColor);
    render();
  });

  gui.add(params, "dispersion", 0, 5, 0.01).onChange(function () {
    material.dispersion = params.dispersion;
    render();
  });

  gui.open();

  // テキスト
  const fontLoader = new FontLoader();
  fontLoader.load("../fonts/Roboto_Condensed_Bold.json", function (font) {
    const textGeometry = new TextGeometry("MAVERICKS", {
      font: font,
      size: 10,
      depth: 1,
    });
    textGeometry.center();

    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.z = -10;

    scene.add(textMesh);
  });

  // マウス連動
  renderer.domElement.addEventListener("mousemove", function (e) {
    group.rotation.x = e.pageY / 100.0;
    group.rotation.y = e.pageX / 100.0;
  });

  const group = new THREE.Group();
  group.add(torus);
  scene.add(group);

  // 毎フレーム時に実行されるループイベント
  animate();

  function animate() {
    torus.rotation.x += 0.02;

    render(); // レンダリング
    requestAnimationFrame(animate);
  }

  function render() {
    renderer.render( scene, camera );
  }
}
