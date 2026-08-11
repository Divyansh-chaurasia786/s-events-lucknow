/**
 * S. EVENTS & WEDDING DESIGN STUDIO — 3D VENUE & STAGE VISUALIZER ENGINE
 * Built using Three.js & WebGL for real-time 3D architectural pre-visualization.
 */

let scene, camera, renderer, controls;
let stageGroup, mandapGroup, concertGroup, crystalGroup, haldiGroup;
let lightsGroup, laserBeams = [];
let isNightMode = false;
let isAutoRotating = true;
let animFrameId = null;

function init3DVisualizer() {
  const container = document.getElementById('canvas3d-container');
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight || 380;

  // 1. Scene Setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1715);
  scene.fog = new THREE.FogExp2(0x1a1715, 0.035);

  // 2. Camera Setup
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 5, 14);

  // 3. Renderer Setup
  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // 4. Orbit Controls
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below floor
    controls.minDistance = 6;
    controls.maxDistance = 22;
    controls.target.set(0, 1.5, 0);
  }

  // 5. Build Environment & Base Platform
  buildVenueEnvironment();

  // 6. Build Modular Event Sets
  buildStageBase();
  buildMandapSet();
  buildConcertSet();
  buildCrystalSet();
  buildHaldiSet();

  // 7. Setup Lighting
  setupLighting();

  // 8. Event Listeners for 3D UI
  setup3DControls();

  // 9. Initial View Mode based on current state
  update3DSceneByTheme(window.eventState ? window.eventState.theme : 'Royal Rajwada & Marigold Grandeur');

  // 10. Start Animation Loop
  animate3D();

  // Handle Resize
  window.addEventListener('resize', onWindowResize3D);
}

// -------------------------------------------------------------------------
// VENUE & FLOORING
// -------------------------------------------------------------------------
function buildVenueEnvironment() {
  // Marble/Reflective Luxury Floor
  const floorGeo = new THREE.PlaneGeometry(35, 35);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x141210,
    roughness: 0.2,
    metalness: 0.4
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Backdrop Wall / Venue Pillars
  const wallGeo = new THREE.PlaneGeometry(35, 12);
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x1c1917,
    roughness: 0.8
  });
  const wall = new THREE.Mesh(wallGeo, wallMat);
  wall.position.set(0, 6, -10);
  scene.add(wall);
}

// -------------------------------------------------------------------------
// BASE STAGE & RUNWAY
// -------------------------------------------------------------------------
function buildStageBase() {
  stageGroup = new THREE.Group();

  // Main Raised Stage
  const stageGeo = new THREE.BoxGeometry(10, 0.8, 6);
  const stageMat = new THREE.MeshStandardMaterial({
    color: 0x24201d,
    roughness: 0.3,
    metalness: 0.2
  });
  const stage = new THREE.Mesh(stageGeo, stageMat);
  stage.position.set(0, 0.4, -2);
  stage.receiveShadow = true;
  stage.castShadow = true;
  stageGroup.add(stage);

  // Gold Trim Border along stage
  const trimGeo = new THREE.BoxGeometry(10.2, 0.1, 6.2);
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xC5A880, metalness: 0.8, roughness: 0.2 });
  const trim = new THREE.Mesh(trimGeo, trimMat);
  trim.position.set(0, 0.82, -2);
  stageGroup.add(trim);

  // Red/Gold Carpet Aisle Runway
  const aisleGeo = new THREE.PlaneGeometry(2.4, 10);
  const aisleMat = new THREE.MeshStandardMaterial({
    color: 0x78121d, // Royal Velvet Crimson
    roughness: 0.7
  });
  const aisle = new THREE.Mesh(aisleGeo, aisleMat);
  aisle.rotation.x = -Math.PI / 2;
  aisle.position.set(0, 0.02, 4);
  aisle.receiveShadow = true;
  stageGroup.add(aisle);

  // Side Aisle Candle Lights / Planters
  for (let z = 0; z <= 8; z += 2) {
    const urnGeo = new THREE.CylinderGeometry(0.18, 0.25, 0.5, 12);
    const urnMat = new THREE.MeshStandardMaterial({ color: 0xDFBA6D, metalness: 0.9, roughness: 0.1 });
    
    const urnLeft = new THREE.Mesh(urnGeo, urnMat);
    urnLeft.position.set(-1.4, 0.25, z);
    stageGroup.add(urnLeft);

    const urnRight = new THREE.Mesh(urnGeo, urnMat);
    urnRight.position.set(1.4, 0.25, z);
    stageGroup.add(urnRight);
  }

  scene.add(stageGroup);
}

// -------------------------------------------------------------------------
// 1. ROYAL RAJWADA MANDAP ARCHITECTURE
// -------------------------------------------------------------------------
function buildMandapSet() {
  mandapGroup = new THREE.Group();

  const pillarMat = new THREE.MeshStandardMaterial({ color: 0xDFBA6D, metalness: 0.85, roughness: 0.25 });
  const flowerMat = new THREE.MeshStandardMaterial({ color: 0xE67E22, roughness: 0.6 }); // Marigold
  const redFloralMat = new THREE.MeshStandardMaterial({ color: 0xB03A2E, roughness: 0.5 }); // Red Rose

  // 4 Golden Carved Pillars
  const pillarPositions = [
    [-3.2, -3.8],
    [3.2, -3.8],
    [-3.2, -0.2],
    [3.2, -0.2]
  ];

  pillarPositions.forEach(pos => {
    // Pillar Column
    const colGeo = new THREE.CylinderGeometry(0.2, 0.24, 4.2, 16);
    const col = new THREE.Mesh(colGeo, pillarMat);
    col.position.set(pos[0], 2.9, pos[1]);
    col.castShadow = true;
    mandapGroup.add(col);

    // Pillar Base
    const baseGeo = new THREE.BoxGeometry(0.7, 0.4, 0.7);
    const base = new THREE.Mesh(baseGeo, pillarMat);
    base.position.set(pos[0], 1.0, pos[1]);
    mandapGroup.add(base);

    // Floral Wrap around Pillar
    const wrapGeo = new THREE.TorusGeometry(0.3, 0.08, 8, 16);
    for (let y = 1.6; y <= 4.5; y += 0.8) {
      const wrap = new THREE.Mesh(wrapGeo, flowerMat);
      wrap.rotation.x = Math.PI / 2;
      wrap.position.set(pos[0], y, pos[1]);
      mandapGroup.add(wrap);
    }
  });

  // Top Dome Canopy Arch
  const domeGeo = new THREE.SphereGeometry(3.6, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.5);
  const domeMat = new THREE.MeshStandardMaterial({
    color: 0xC5A880,
    metalness: 0.7,
    roughness: 0.3,
    wireframe: false,
    side: THREE.DoubleSide
  });
  const dome = new THREE.Mesh(domeGeo, domeMat);
  dome.position.set(0, 5.0, -2.0);
  mandapGroup.add(dome);

  // Marigold Hanging Cascades from Dome
  for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
    const x = Math.cos(angle) * 3.4;
    const z = Math.sin(angle) * 3.4 - 2.0;
    const strandGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8);
    const strand = new THREE.Mesh(strandGeo, flowerMat);
    strand.position.set(x, 4.1, z);
    mandapGroup.add(strand);
  }

  // Center Havankund / Varmala Throne Area
  const havanGeo = new THREE.BoxGeometry(1.2, 0.3, 1.2);
  const havanMat = new THREE.MeshStandardMaterial({ color: 0x935116, metalness: 0.9 });
  const havan = new THREE.Mesh(havanGeo, havanMat);
  havan.position.set(0, 0.95, -2.0);
  mandapGroup.add(havan);

  scene.add(mandapGroup);
}

// -------------------------------------------------------------------------
// 2. CONCERT SANGEET & TRUSS LIGHTING SET
// -------------------------------------------------------------------------
function buildConcertSet() {
  concertGroup = new THREE.Group();

  const trussMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.95, roughness: 0.2 });

  // Overhead Box Truss Rigging
  const topBarGeo = new THREE.BoxGeometry(9.6, 0.25, 0.25);
  const topBar = new THREE.Mesh(topBarGeo, trussMat);
  topBar.position.set(0, 5.8, -1.8);
  concertGroup.add(topBar);

  const leftPillarGeo = new THREE.BoxGeometry(0.25, 5.0, 0.25);
  const leftPillar = new THREE.Mesh(leftPillarGeo, trussMat);
  leftPillar.position.set(-4.6, 3.3, -1.8);
  concertGroup.add(leftPillar);

  const rightPillar = new THREE.Mesh(leftPillarGeo, trussMat);
  rightPillar.position.set(4.6, 3.3, -1.8);
  concertGroup.add(rightPillar);

  // Curved LED Wall Backdrop (P3 Visual Screen)
  const ledGeo = new THREE.CylinderGeometry(8.5, 8.5, 3.8, 32, 1, true, -Math.PI / 4.5, Math.PI / 2.25);
  const ledMat = new THREE.MeshBasicMaterial({
    color: 0x2A1545, // Dynamic purple/blue glow
    side: THREE.DoubleSide
  });
  const ledScreen = new THREE.Mesh(ledGeo, ledMat);
  ledScreen.position.set(0, 2.7, 3.5);
  concertGroup.add(ledScreen);

  // DJ Console in Center
  const djDeskGeo = new THREE.BoxGeometry(2.4, 0.9, 0.8);
  const djDeskMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 });
  const djDesk = new THREE.Mesh(djDeskGeo, djDeskMat);
  djDesk.position.set(0, 1.25, -2.5);
  concertGroup.add(djDesk);

  // DJ Screen Glow Strip
  const djGlowGeo = new THREE.PlaneGeometry(2.2, 0.7);
  const djGlowMat = new THREE.MeshBasicMaterial({ color: 0xDFBA6D });
  const djGlow = new THREE.Mesh(djGlowGeo, djGlowMat);
  djGlow.position.set(0, 1.25, -2.09);
  concertGroup.add(djGlow);

  // Line-Array Speaker Stacks Left & Right
  for (let side of [-4.2, 4.2]) {
    for (let h = 0; h < 3; h++) {
      const spkGeo = new THREE.BoxGeometry(0.6, 0.35, 0.5);
      const spkMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
      const spk = new THREE.Mesh(spkGeo, spkMat);
      spk.position.set(side, 3.6 + h * 0.45, -1.8);
      concertGroup.add(spk);
    }
  }

  // Sharpy Moving Head Laser Beams
  laserBeams = [];
  const beamColors = [0x00E5FF, 0xFF007F, 0xDFBA6D, 0x00FF88, 0x9900FF];
  
  for (let i = -3.5; i <= 3.5; i += 1.75) {
    const beamGeo = new THREE.ConeGeometry(0.35, 7.5, 16, 1, true);
    const col = beamColors[Math.abs(Math.round(i)) % beamColors.length];
    const beamMat = new THREE.MeshBasicMaterial({
      color: col,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(i, 2.2, -1.8);
    beam.rotation.x = Math.PI - 0.25;
    beam.rotation.z = (i / 5);
    concertGroup.add(beam);
    laserBeams.push(beam);
  }

  scene.add(concertGroup);
}

// -------------------------------------------------------------------------
// 3. CRYSTAL & CANDLELIGHT GLAMOUR SET
// -------------------------------------------------------------------------
function buildCrystalSet() {
  crystalGroup = new THREE.Group();

  const crystalMat = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: 0.85
  });

  // Hanging Grand Chandeliers
  for (let x of [-2.4, 0, 2.4]) {
    const chGeo = new THREE.ConeGeometry(0.9, 1.4, 16, 3);
    const ch = new THREE.Mesh(chGeo, crystalMat);
    ch.rotation.x = Math.PI;
    ch.position.set(x, 5.0, -2.0);
    crystalGroup.add(ch);

    // Chandelier Light Glow Point
    const chLight = new THREE.PointLight(0xFFE4B5, 0.8, 4);
    chLight.position.set(x, 4.4, -2.0);
    crystalGroup.add(chLight);
  }

  // Mirrored Runway Backboard
  const mirrGeo = new THREE.PlaneGeometry(8, 4);
  const mirrMat = new THREE.MeshStandardMaterial({ color: 0xEEEEEE, metalness: 0.95, roughness: 0.05 });
  const mirr = new THREE.Mesh(mirrGeo, mirrMat);
  mirr.position.set(0, 2.8, -4.8);
  crystalGroup.add(mirr);

  scene.add(crystalGroup);
}

// -------------------------------------------------------------------------
// 4. HALDI SUNFLOWER & MEHENDI CANOPY SET
// -------------------------------------------------------------------------
function buildHaldiSet() {
  haldiGroup = new THREE.Group();

  const yellowMat = new THREE.MeshStandardMaterial({ color: 0xF1C40F, roughness: 0.4 });
  const orangeMat = new THREE.MeshStandardMaterial({ color: 0xE67E22, roughness: 0.4 });

  // Bohemian Cane Umbrellas / Canopies
  for (let pos of [[-3, -2.5], [3, -2.5], [0, -3.2]]) {
    const poleGeo = new THREE.CylinderGeometry(0.06, 0.06, 4.0);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x8D6E63 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(pos[0], 2.8, pos[1]);
    haldiGroup.add(pole);

    const umbGeo = new THREE.ConeGeometry(1.6, 0.8, 16);
    const umb = new THREE.Mesh(umbGeo, yellowMat);
    umb.position.set(pos[0], 4.7, pos[1]);
    haldiGroup.add(umb);
  }

  // Yellow & Orange Backdrop Cabana
  const cabGeo = new THREE.BoxGeometry(6.5, 3.2, 0.2);
  const cab = new THREE.Mesh(cabGeo, orangeMat);
  cab.position.set(0, 2.4, -4.5);
  haldiGroup.add(cab);

  scene.add(haldiGroup);
}

// -------------------------------------------------------------------------
// LIGHTING SETUP
// -------------------------------------------------------------------------
function setupLighting() {
  lightsGroup = new THREE.Group();

  // Ambient Fill
  const ambient = new THREE.AmbientLight(0xFFF8EE, 0.6);
  lightsGroup.add(ambient);

  // Main Warm Key Spotlight
  const keyLight = new THREE.DirectionalLight(0xFFE5B4, 1.2);
  keyLight.position.set(5, 12, 10);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  lightsGroup.add(keyLight);

  // Stage Floor Uplights (Gold Glow)
  const upLight1 = new THREE.PointLight(0xDFBA6D, 1.5, 8);
  upLight1.position.set(-3, 0.5, 0);
  lightsGroup.add(upLight1);

  const upLight2 = new THREE.PointLight(0xDFBA6D, 1.5, 8);
  upLight2.position.set(3, 0.5, 0);
  lightsGroup.add(upLight2);

  scene.add(lightsGroup);
}

// -------------------------------------------------------------------------
// THEME SWITCHER CONTROLLER
// -------------------------------------------------------------------------
function update3DSceneByTheme(themeName) {
  if (!mandapGroup || !concertGroup || !crystalGroup || !haldiGroup) return;

  // Hide all groups first
  mandapGroup.visible = false;
  concertGroup.visible = false;
  crystalGroup.visible = false;
  haldiGroup.visible = false;

  const t = (themeName || '').toLowerCase();

  if (t.includes('sangeet') || t.includes('concert') || t.includes('dj')) {
    concertGroup.visible = true;
    setNightLighting(true);
  } else if (t.includes('crystal') || t.includes('candlelight') || t.includes('cocktail')) {
    crystalGroup.visible = true;
    mandapGroup.visible = true;
    setNightLighting(true);
  } else if (t.includes('haldi') || t.includes('carnival') || t.includes('sunflower')) {
    haldiGroup.visible = true;
    setNightLighting(false);
  } else {
    // Default: Royal Rajwada Mandap
    mandapGroup.visible = true;
    setNightLighting(false);
  }
}

function setNightLighting(isNight) {
  isNightMode = isNight;
  const btnNight = document.getElementById('btn-3d-night-toggle');

  if (isNight) {
    scene.background = new THREE.Color(0x0a0808);
    scene.fog.color = new THREE.Color(0x0a0808);
    if (btnNight) btnNight.innerHTML = '<i class="fa-solid fa-moon text-gold"></i> Party Night';
  } else {
    scene.background = new THREE.Color(0x1a1715);
    scene.fog.color = new THREE.Color(0x1a1715);
    if (btnNight) btnNight.innerHTML = '<i class="fa-solid fa-sun text-gold"></i> Golden Daylight';
  }
}

// -------------------------------------------------------------------------
// 3D UI CONTROLS (BUTTONS)
// -------------------------------------------------------------------------
function setup3DControls() {
  // 1. Day / Night Toggle
  const btnNight = document.getElementById('btn-3d-night-toggle');
  if (btnNight) {
    btnNight.addEventListener('click', () => {
      setNightLighting(!isNightMode);
    });
  }

  // 2. Auto-Rotate Toggle
  const btnRotate = document.getElementById('btn-3d-rotate-toggle');
  if (btnRotate) {
    btnRotate.addEventListener('click', () => {
      isAutoRotating = !isAutoRotating;
      btnRotate.classList.toggle('active', isAutoRotating);
    });
  }

  // 3. Preset Angles
  const btnFront = document.getElementById('btn-3d-cam-front');
  if (btnFront) {
    btnFront.addEventListener('click', () => {
      isAutoRotating = false;
      camera.position.set(0, 3.2, 13);
      controls.target.set(0, 1.5, 0);
    });
  }

  const btnAerial = document.getElementById('btn-3d-cam-aerial');
  if (btnAerial) {
    btnAerial.addEventListener('click', () => {
      isAutoRotating = false;
      camera.position.set(0, 12, 14);
      controls.target.set(0, 1, -1);
    });
  }

  // 4. Download Snapshot
  const btnSnapshot = document.getElementById('btn-3d-snapshot');
  if (btnSnapshot) {
    btnSnapshot.addEventListener('click', () => {
      try {
        const dataUrl = renderer.domElement.toDataURL('image/jpeg', 0.9);
        const link = document.createElement('a');
        link.download = 'S-Events-3D-Event-Blueprint.jpg';
        link.href = dataUrl;
        link.click();
      } catch (e) {
        alert('3D Blueprint Snapshot ready!');
      }
    });
  }
}

// -------------------------------------------------------------------------
// ANIMATION LOOP (60 FPS)
// -------------------------------------------------------------------------
function animate3D() {
  animFrameId = requestAnimationFrame(animate3D);

  if (controls) controls.update();

  // Slow Elegant Orbit Rotation
  if (isAutoRotating && controls) {
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
  } else if (controls) {
    controls.autoRotate = false;
  }

  // Animate Laser Beams during Sangeet / Night Mode
  if (concertGroup && concertGroup.visible) {
    const time = Date.now() * 0.002;
    laserBeams.forEach((beam, idx) => {
      beam.rotation.z = Math.sin(time + idx) * 0.45 + (idx - 2) * 0.15;
    });
  }

  renderer.render(scene, camera);
}

function onWindowResize3D() {
  const container = document.getElementById('canvas3d-container');
  if (!container || !renderer || !camera) return;

  const width = container.clientWidth;
  const height = container.clientHeight || 380;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

// Attach listener to window
window.init3DVisualizer = init3DVisualizer;
window.update3DSceneByTheme = update3DSceneByTheme;
