/**
 * ==============================================================================
 * YASHVEER SINGH PRAJAPATI — 3D GRAPHIC DESIGNER & MOTION PORTFOLIO
 * Three.js Interactive Hero Experience (scene3d.js)
 * Procedural Creative Workspace, Floating Motion Sculptures & Interactive Parallax
 * ==============================================================================
 */

(function () {
  'use strict';

  // Palette constants: Exact Redoyanul Haque Signature Colors & Warm Editorial Tones
  const PALETTE = {
    obsidian: 0x0B080C,
    darkMatte: 0x140F1A,
    lilacAccent: 0xC2A4FF,    // Exact signature lilac from redoyanulhaque.me
    violetSecondary: 0xC481FF,// Vibrant violet from redoyanulhaque.me
    magentaRim: 0xFB8DFF,     // Backlight rim magenta
    ultraviolet: 0x5400FF,    // Deep UV glow
    chromeGlow: 0xEAE5EC,     // Specular highlights
    warmBronze: 0xC08457,     // Warm bronze highlight
    lightCream: 0xFAF7F2
  };

  let container, canvas, scene, camera, renderer;
  let mainGroup;
  let floatingObjects = [];
  let timelineTextureContext, timelineTexture;
  let animationFrameId;
  let isSceneVisible = true;
  let prefersReducedMotion = false;

  // Scene lights reference for dynamic Dark/Light theme switching
  let ambientLight, mainKeyLight, lilacRimLight, magentaRimLight, uvFillLight;

  // Mouse interaction state
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const raycaster = new THREE.Raycaster();
  const mouseCoords = new THREE.Vector2(-1000, -1000);
  let hoveredObject = null;

  /**
   * Check WebGL support
   */
  function isWebGLAvailable() {
    try {
      const testCanvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  }

  /**
   * Render graceful fallback if WebGL is unavailable
   */
  function renderFallback() {
    if (!container) return;
    container.innerHTML = `
      <div class="d-flex flex-column align-items-center justify-content-center text-center p-4 h-100" style="background-color: #140F1A; border: 1px solid rgba(194, 164, 255, 0.25); border-radius: 20px;">
        <div class="mb-3" style="width: 80px; height: 80px; border-radius: 50%; background: #0B080C; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: #C2A4FF; border: 1.5px solid #FB8DFF;">
          <i class="bi bi-layers-half"></i>
        </div>
        <h3 style="font-size: 1.4rem; font-weight: 800; color: #EAE5EC; margin-bottom: 0.5rem;">Interactive 3D Art Studio</h3>
        <p style="font-size: 0.92rem; color: #AFA7BA; max-width: 320px; margin-bottom: 1rem;">
          Procedural 3D motion composition and creative workspace preview.
        </p>
        <span class="badge-editorial"><i class="bi bi-check-circle-fill"></i> Optimized Fallback Mode</span>
      </div>
    `;
  }

  /**
   * Generate dynamic canvas texture for the motion graphics monitor screen
   * Uses Redoyanul Haque neon lilac (#C2A4FF) & neon magenta (#FB8DFF) styling
   */
  function createTimelineCanvasTexture() {
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 512;
    texCanvas.height = 340;
    const ctx = texCanvas.getContext('2d');

    function drawScreen(time) {
      // Deep obsidian screen background
      ctx.fillStyle = '#0E0A14';
      ctx.fillRect(0, 0, texCanvas.width, texCanvas.height);

      // Top title bar / timeline header
      ctx.fillStyle = '#161120';
      ctx.fillRect(0, 0, texCanvas.width, 32);

      // Modern neon dots
      ctx.fillStyle = '#FB8DFF';
      ctx.beginPath();
      ctx.arc(20, 16, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#C2A4FF';
      ctx.beginPath();
      ctx.arc(34, 16, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#5400FF';
      ctx.beginPath();
      ctx.arc(48, 16, 4, 0, Math.PI * 2);
      ctx.fill();

      // Title typography (Strictly Roboto)
      ctx.fillStyle = '#EAE5EC';
      ctx.font = '600 11px Roboto, sans-serif';
      ctx.fillText('YASHVEER // MOTION REEL — 4K 60FPS COMPOSITION', 64, 20);

      // Main video preview viewport
      ctx.fillStyle = '#08050B';
      ctx.fillRect(16, 42, texCanvas.width - 32, 162);
      ctx.strokeStyle = 'rgba(194, 164, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.strokeRect(16, 42, texCanvas.width - 32, 162);

      // 1st animated wave: Electric Lilac #C2A4FF
      ctx.beginPath();
      ctx.strokeStyle = '#C2A4FF';
      ctx.lineWidth = 3;
      for (let x = 16; x < texCanvas.width - 16; x += 4) {
        const y = 122 + Math.sin(x * 0.03 + time * 0.003) * 32 + Math.cos(x * 0.015 - time * 0.002) * 16;
        if (x === 16) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 2nd glowing wave: Neon Magenta #FB8DFF
      ctx.beginPath();
      ctx.strokeStyle = '#FB8DFF';
      ctx.lineWidth = 2.5;
      for (let x = 16; x < texCanvas.width - 16; x += 4) {
        const y = 122 + Math.sin(x * 0.022 - time * 0.0025) * 22;
        if (x === 16) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Lower timeline panel
      ctx.fillStyle = '#130E1C';
      ctx.fillRect(16, 214, texCanvas.width - 32, 110);
      ctx.strokeStyle = 'rgba(194, 164, 255, 0.2)';
      ctx.strokeRect(16, 214, texCanvas.width - 32, 110);

      // Timeline tracks with Redoyanul Haque colors
      const trackColors = ['#C2A4FF', '#C481FF', '#FB8DFF', '#5400FF'];
      for (let i = 0; i < 4; i++) {
        const trackY = 222 + i * 22;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(24, trackY, texCanvas.width - 48, 16);

        ctx.fillStyle = trackColors[i];
        const clipX = 60 + i * 35;
        const clipW = 140 + ((i * 45) % 180);
        ctx.fillRect(clipX, trackY, clipW, 16);

        // Keyframe diamond marks
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        const kfX = clipX + 30;
        const kfY = trackY + 8;
        ctx.moveTo(kfX, kfY - 4);
        ctx.lineTo(kfX + 4, kfY);
        ctx.lineTo(kfX, kfY + 4);
        ctx.lineTo(kfX - 4, kfY);
        ctx.fill();
      }

      // Neon Magenta Playhead
      const playheadX = 30 + ((time * 0.08) % (texCanvas.width - 60));
      ctx.strokeStyle = '#FB8DFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(playheadX, 214);
      ctx.lineTo(playheadX, 324);
      ctx.stroke();
    }

    drawScreen(0);
    const texture = new THREE.CanvasTexture(texCanvas);
    texture.minFilter = THREE.LinearFilter;
    timelineTextureContext = { canvas: texCanvas, ctx: ctx, drawScreen: drawScreen };
    return texture;
  }

  /**
   * Helper to create canvas texture for 3D typography cubes
   */
  function createTypographyTexture(letter, subtext, isMagenta) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Obsidian background
    ctx.fillStyle = '#140F1A';
    ctx.fillRect(0, 0, 256, 256);

    // Glowing border in Lilac or Magenta
    ctx.strokeStyle = isMagenta ? '#FB8DFF' : '#C2A4FF';
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, 236, 236);

    // Corner accents
    ctx.fillStyle = isMagenta ? '#FB8DFF' : '#C2A4FF';
    ctx.fillRect(16, 16, 8, 8);
    ctx.fillRect(232, 16, 8, 8);
    ctx.fillRect(16, 232, 8, 8);
    ctx.fillRect(232, 232, 8, 8);

    // Large letter (strictly Roboto)
    ctx.fillStyle = '#FAF7F2';
    ctx.font = '900 110px Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, 128, 115);

    // Subtext
    if (subtext) {
      ctx.fillStyle = isMagenta ? '#FB8DFF' : '#C2A4FF';
      ctx.font = '700 18px Roboto, sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText(subtext, 128, 195);
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  /**
   * Initialize Three.js Scene
   */
  function initScene() {
    container = document.getElementById('hero-3d-stage');
    canvas = document.getElementById('hero-3d-canvas');

    if (!container || !canvas) return;

    if (!isWebGLAvailable()) {
      renderFallback();
      return;
    }

    // Check user preference for motion
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Create Scene with transparent background to blend with theme/videos
    scene = new THREE.Scene();
    scene.background = null;

    // Camera setup
    const aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 1000);
    camera.position.set(0, 0.8, 11.5);
    camera.lookAt(0, 0, 0);

    // WebGL Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting setup (Redoyanul Haque Signature Dual-Tone Cinematic Lighting)
    // 1. Soft indigo-violet ambient fill
    ambientLight = new THREE.AmbientLight(0x1A1226, 1.2);
    scene.add(ambientLight);

    // 2. Main Key Light (soft cool lavender)
    mainKeyLight = new THREE.DirectionalLight(0xF5E8FF, 1.8);
    mainKeyLight.position.set(6, 9, 7);
    mainKeyLight.castShadow = true;
    mainKeyLight.shadow.mapSize.width = 1024;
    mainKeyLight.shadow.mapSize.height = 1024;
    mainKeyLight.shadow.bias = -0.001;
    scene.add(mainKeyLight);

    // 3. Electric Lilac Rim Light (exact redoyanulhaque.me #C2A4FF accent)
    lilacRimLight = new THREE.PointLight(PALETTE.lilacAccent, 3.2, 35);
    lilacRimLight.position.set(-7, 4, -4);
    scene.add(lilacRimLight);

    // 4. Neon Magenta Rim Light (exact redoyanulhaque.me #FB8DFF backlight)
    magentaRimLight = new THREE.DirectionalLight(PALETTE.magentaRim, 2.6);
    magentaRimLight.position.set(8, 2, -4);
    scene.add(magentaRimLight);

    // 5. Deep Ultraviolet Fill Light (exact redoyanulhaque.me #5400FF glow)
    uvFillLight = new THREE.PointLight(PALETTE.ultraviolet, 2.0, 25);
    uvFillLight.position.set(0, -6, 2);
    scene.add(uvFillLight);

    // Root Group
    mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Build the 3D Composition
    buildCreativeComposition();

    // Event listeners
    setupEventListeners();

    // Visibility Observer to save performance
    setupIntersectionObserver();

    // Start Animation Loop
    animate(0);
  }

  /**
   * Build procedural creative workspace sculpture
   */
  function buildCreativeComposition() {
    // 1. FLOATING EDITORIAL DESIGN MONITOR / ARTWORK DISPLAY
    timelineTexture = createTimelineCanvasTexture();
    const monitorGroup = new THREE.Group();

    // Screen Bezel - Sleek dark obsidian with chamfered sheen
    const screenGeometry = new THREE.BoxGeometry(4.2, 2.8, 0.14);
    const bezelMaterial = new THREE.MeshStandardMaterial({
      color: PALETTE.darkMatte,
      metalness: 0.85,
      roughness: 0.22
    });
    const monitorBezel = new THREE.Mesh(screenGeometry, bezelMaterial);
    monitorBezel.castShadow = true;
    monitorBezel.receiveShadow = true;
    monitorGroup.add(monitorBezel);

    // Screen Front Display with timeline texture
    const displayGeometry = new THREE.PlaneGeometry(3.95, 2.55);
    const displayMaterial = new THREE.MeshBasicMaterial({
      map: timelineTexture
    });
    const monitorDisplay = new THREE.Mesh(displayGeometry, displayMaterial);
    monitorDisplay.position.z = 0.075;
    monitorGroup.add(monitorDisplay);

    // Monitor Stand / Arm in Electric Lilac chrome
    const standNeckGeom = new THREE.CylinderGeometry(0.09, 0.09, 1.4, 16);
    const standMat = new THREE.MeshStandardMaterial({
      color: PALETTE.lilacAccent,
      metalness: 0.88,
      roughness: 0.16
    });
    const standNeck = new THREE.Mesh(standNeckGeom, standMat);
    standNeck.position.set(0, -1.8, -0.2);
    monitorGroup.add(standNeck);

    const standBaseGeom = new THREE.CylinderGeometry(0.9, 0.9, 0.08, 32);
    const standBase = new THREE.Mesh(standBaseGeom, standMat);
    standBase.position.set(0, -2.5, -0.2);
    standBase.castShadow = true;
    monitorGroup.add(standBase);

    monitorGroup.position.set(0.3, 0.3, 0);
    monitorGroup.rotation.y = -0.12;
    mainGroup.add(monitorGroup);

    floatingObjects.push({
      mesh: monitorGroup,
      baseY: 0.3,
      speed: 1.1,
      amplitude: 0.12,
      rotSpeedY: 0.04,
      name: 'Creative Timeline Interface'
    });

    // 2. 3D TYPOGRAPHY BLOCKS ('Y' in Lilac & 'M' in Magenta)
    const typeTextureY = createTypographyTexture('Y', 'YASHVEER', false);
    const typeTextureM = createTypographyTexture('M', 'MOTION', true);

    const cubeMatBody = new THREE.MeshStandardMaterial({
      color: PALETTE.darkMatte,
      metalness: 0.85,
      roughness: 0.2
    });

    const cubeGeom = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const cubeMatY = [
      cubeMatBody,
      cubeMatBody,
      new THREE.MeshStandardMaterial({ color: PALETTE.lilacAccent, metalness: 0.85, roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: PALETTE.ultraviolet, metalness: 0.85, roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ map: typeTextureY, roughness: 0.15, metalness: 0.5 }),
      cubeMatBody
    ];

    const typeCubeY = new THREE.Mesh(cubeGeom, cubeMatY);
    typeCubeY.position.set(-2.8, 1.6, 1.0);
    typeCubeY.rotation.set(0.4, 0.6, -0.2);
    typeCubeY.castShadow = true;
    mainGroup.add(typeCubeY);

    floatingObjects.push({
      mesh: typeCubeY,
      baseY: 1.6,
      speed: 1.4,
      amplitude: 0.16,
      rotX: 0.25,
      rotY: 0.35,
      name: '3D Typographic Block (Y)'
    });

    const typeCubeM = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.95, 0.95),
      [
        cubeMatBody,
        new THREE.MeshStandardMaterial({ color: PALETTE.magentaRim, metalness: 0.85, roughness: 0.2 }),
        cubeMatBody,
        new THREE.MeshStandardMaterial({ color: PALETTE.lilacAccent, metalness: 0.85, roughness: 0.2 }),
        new THREE.MeshStandardMaterial({ map: typeTextureM, roughness: 0.15, metalness: 0.5 }),
        cubeMatBody
      ]
    );
    typeCubeM.position.set(3.2, -1.2, 0.8);
    typeCubeM.rotation.set(-0.3, -0.5, 0.3);
    typeCubeM.castShadow = true;
    mainGroup.add(typeCubeM);

    floatingObjects.push({
      mesh: typeCubeM,
      baseY: -1.2,
      speed: 1.7,
      amplitude: 0.18,
      rotX: -0.3,
      rotY: 0.4,
      name: 'Motion Block (M)'
    });

    // 3. FLUID MOTION BEZIER CURVE / SCULPTURAL RIBBON
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.0, -2.0, -1.0),
      new THREE.Vector3(-2.0, -0.5, 1.2),
      new THREE.Vector3(0.0, 2.2, 0.5),
      new THREE.Vector3(2.5, 0.8, -0.8),
      new THREE.Vector3(4.2, 2.0, 1.0)
    ]);
    const ribbonGeom = new THREE.TubeGeometry(curve, 80, 0.09, 16, false);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: PALETTE.lilacAccent,
      roughness: 0.18,
      metalness: 0.85,
      emissive: PALETTE.ultraviolet,
      emissiveIntensity: 0.2
    });
    const ribbonMesh = new THREE.Mesh(ribbonGeom, ribbonMat);
    ribbonMesh.castShadow = true;
    mainGroup.add(ribbonMesh);

    floatingObjects.push({
      mesh: ribbonMesh,
      baseY: 0,
      speed: 0.8,
      amplitude: 0.08,
      rotY: 0.08,
      name: 'Kinetic Motion Curve'
    });

    // 4. FLOATING TORUS KNOT (Abstract Motion Geometry with Violet Sheen)
    const knotGeom = new THREE.TorusKnotGeometry(0.65, 0.18, 100, 16, 2, 3);
    const knotMat = new THREE.MeshStandardMaterial({
      color: PALETTE.violetSecondary,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0x7928CA,
      emissiveIntensity: 0.22
    });
    const knotMesh = new THREE.Mesh(knotGeom, knotMat);
    knotMesh.position.set(2.9, 1.6, -0.5);
    knotMesh.castShadow = true;
    mainGroup.add(knotMesh);

    floatingObjects.push({
      mesh: knotMesh,
      baseY: 1.6,
      speed: 1.3,
      amplitude: 0.14,
      rotX: 0.5,
      rotY: 0.6,
      name: 'Sculptural Torus Knot'
    });

    // 5. ANIMATION KEYFRAME DIAMONDS (Octahedrons with Emissive Glow)
    const diamondGeom = new THREE.OctahedronGeometry(0.38, 0);
    const diamondMatPrimary = new THREE.MeshStandardMaterial({
      color: PALETTE.lilacAccent,
      metalness: 0.7,
      roughness: 0.12,
      emissive: PALETTE.lilacAccent,
      emissiveIntensity: 0.35
    });
    const diamondMatAccent = new THREE.MeshStandardMaterial({
      color: PALETTE.magentaRim,
      metalness: 0.7,
      roughness: 0.12,
      emissive: PALETTE.magentaRim,
      emissiveIntensity: 0.35
    });

    const diamond1 = new THREE.Mesh(diamondGeom, diamondMatPrimary);
    diamond1.position.set(-1.8, -1.7, 1.4);
    diamond1.castShadow = true;
    mainGroup.add(diamond1);

    floatingObjects.push({
      mesh: diamond1,
      baseY: -1.7,
      speed: 2.1,
      amplitude: 0.15,
      rotX: 0.8,
      rotY: 0.9,
      name: 'Keyframe Anchor 01'
    });

    const diamond2 = new THREE.Mesh(diamondGeom, diamondMatAccent);
    diamond2.position.set(1.6, -1.9, 1.2);
    diamond2.castShadow = true;
    mainGroup.add(diamond2);

    floatingObjects.push({
      mesh: diamond2,
      baseY: -1.9,
      speed: 1.9,
      amplitude: 0.14,
      rotX: -0.7,
      rotY: 0.8,
      name: 'Keyframe Anchor 02'
    });

    // 6. FILM REEL / LENS APERTURE DISC
    const reelGroup = new THREE.Group();
    const outerRingGeom = new THREE.TorusGeometry(0.7, 0.08, 16, 32);
    const outerRingMat = new THREE.MeshStandardMaterial({
      color: 0xE0AAFF,
      metalness: 0.88,
      roughness: 0.18
    });
    const outerRing = new THREE.Mesh(outerRingGeom, outerRingMat);
    reelGroup.add(outerRing);

    const innerCenterGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.06, 16);
    const innerCenterMat = new THREE.MeshStandardMaterial({
      color: PALETTE.ultraviolet,
      metalness: 0.75,
      roughness: 0.25
    });
    const innerCenter = new THREE.Mesh(innerCenterGeom, innerCenterMat);
    innerCenter.rotation.x = Math.PI / 2;
    reelGroup.add(innerCenter);

    reelGroup.position.set(-3.2, -0.4, -0.6);
    reelGroup.rotation.set(0.3, 0.4, 0);
    reelGroup.castShadow = true;
    mainGroup.add(reelGroup);

    floatingObjects.push({
      mesh: reelGroup,
      baseY: -0.4,
      speed: 1.2,
      amplitude: 0.12,
      rotZ: 0.4,
      name: 'Cinematography Reel'
    });

    // 7. BRAND PALETTE SPHERES (High-Gloss Iridescent)
    const sphereColors = [PALETTE.magentaRim, PALETTE.lilacAccent, PALETTE.violetSecondary];
    const spherePositions = [
      [-1.2, 2.2, -1.0],
      [1.4, 2.3, 0.5],
      [-3.6, 0.8, 1.2]
    ];

    spherePositions.forEach((pos, idx) => {
      const sphereGeom = new THREE.SphereGeometry(0.24, 32, 32);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: sphereColors[idx],
        roughness: 0.14,
        metalness: 0.85
      });
      const sphere = new THREE.Mesh(sphereGeom, sphereMat);
      sphere.position.set(pos[0], pos[1], pos[2]);
      sphere.castShadow = true;
      mainGroup.add(sphere);

      floatingObjects.push({
        mesh: sphere,
        baseY: pos[1],
        speed: 1.5 + idx * 0.3,
        amplitude: 0.15,
        rotY: 0.5,
        name: `Palette Orb 0${idx + 1}`
      });
    });

    // 8. Soft Ground Plane for realistic shadow catch
    const groundGeom = new THREE.PlaneGeometry(30, 30);
    const groundMat = new THREE.ShadowMaterial({
      opacity: 0.12
    });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.position.y = -3.2;
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
  }

  /**
   * Setup Event Listeners (Parallax, Resize, Raycasting)
   */
  function setupEventListeners() {
    // Parallax mouse movement
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Touch movement for mobile devices
    if (container) {
      container.addEventListener('touchmove', onTouchMove, { passive: true });
    }

    // Debounced Resize
    window.addEventListener('resize', onWindowResize);

    // Reduced motion preference changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      prefersReducedMotion = e.matches;
    });
  }

  function onMouseMove(e) {
    // Normalized coordinates (-1 to 1)
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;

    // Raycast coordinates for container bounds
    if (container) {
      const rect = container.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mouseCoords.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseCoords.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      } else {
        mouseCoords.x = -1000;
        mouseCoords.y = -1000;
      }
    }
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      mouse.targetX = (touch.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(touch.clientY / window.innerHeight) * 2 + 1;
    }
  }

  function onWindowResize() {
    if (!container || !camera || !renderer) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;

    // Adjust camera distance for mobile screens
    if (width < 600) {
      camera.position.z = 15;
    } else if (width < 992) {
      camera.position.z = 13;
    } else {
      camera.position.z = 11.5;
    }

    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  /**
   * Intersection Observer to stop rendering when scrolled out of view
   */
  function setupIntersectionObserver() {
    const heroSection = document.getElementById('hero');
    if (!heroSection || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isSceneVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(heroSection);
  }

  /**
   * Animation & Render Loop
   */
  function animate(time) {
    animationFrameId = requestAnimationFrame(animate);

    if (!isSceneVisible) return;

    // Smooth mouse lerp interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Redraw dynamic timeline monitor screen texture
    if (timelineTextureContext && timelineTexture) {
      timelineTextureContext.drawScreen(time);
      timelineTexture.needsUpdate = true;
    }

    // Apply Parallax and gentle floating if reduced-motion is not requested
    if (!prefersReducedMotion) {
      const seconds = time * 0.001;

      // Gentle parallax tilt on main group
      if (mainGroup) {
        mainGroup.rotation.y = mouse.x * 0.35;
        mainGroup.rotation.x = -mouse.y * 0.22;
      }

      // Animate floating items
      floatingObjects.forEach((obj, idx) => {
        const floatOffset = Math.sin(seconds * obj.speed + idx) * obj.amplitude;
        obj.mesh.position.y = obj.baseY + floatOffset;

        if (obj.rotX) obj.mesh.rotation.x += obj.rotX * 0.008;
        if (obj.rotY) obj.mesh.rotation.y += obj.rotY * 0.008;
        if (obj.rotZ) obj.mesh.rotation.z += obj.rotZ * 0.008;
      });
    }

    // Interactive Raycasting on mouse hover
    if (mouseCoords.x > -100 && mouseCoords.x < 100) {
      raycaster.setFromCamera(mouseCoords, camera);
      const intersects = raycaster.intersectObjects(mainGroup.children, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hoveredObject !== hit) {
          hoveredObject = hit;
          if (canvas) canvas.style.cursor = 'pointer';
        }
      } else {
        if (hoveredObject) {
          hoveredObject = null;
          if (canvas) canvas.style.cursor = 'default';
        }
      }
    }

    renderer.render(scene, camera);
  }

  /**
   * ==============================================================================
   * 3D BACKGROUND MOTION UNIVERSE & SCULPTURAL KINETIC MODELS
   * Large interactive 3D Graphic Design & Motion sculptures drifting in depth,
   * responding with dynamic rotational momentum and parallax to page scroll and mouse.
   * ==============================================================================
   */
  let bgScene, bgCamera, bgRenderer;
  let bgStars, bgSculptures = [];
  let bgAmbientLight, bgKeyLight, bgLilacLight, bgMagentaLight, bgSunLight;
  let scrollState = {
    current: 0,
    target: 0,
    velocity: 0,
    maxScroll: 1
  };

  // Background Materials Reference for Theme Switching
  let bgMatPrimary, bgMatAccent, bgMatGold, bgMatWireframe, bgMatChrome;

  function initBackgroundUniverse() {
    const bgCanvas = document.getElementById('space-stars-canvas');
    if (!bgCanvas || !isWebGLAvailable()) return;

    bgScene = new THREE.Scene();
    bgCamera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    bgCamera.position.set(0, 0, 16);

    bgRenderer = new THREE.WebGLRenderer({
      canvas: bgCanvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    bgRenderer.setSize(window.innerWidth, window.innerHeight);
    bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --------------------------------------------------------------------------
    // 1. DYNAMIC LIGHTING RIG FOR BACKGROUND 3D SCULPTURES
    // --------------------------------------------------------------------------
    bgAmbientLight = new THREE.AmbientLight(0x181024, 1.4);
    bgScene.add(bgAmbientLight);

    bgSunLight = new THREE.DirectionalLight(0xFFFFFF, 1.8);
    bgSunLight.position.set(12, 18, 15);
    bgScene.add(bgSunLight);

    bgKeyLight = new THREE.PointLight(PALETTE.lilacAccent, 4.5, 60);
    bgKeyLight.position.set(10, 8, 8);
    bgScene.add(bgKeyLight);

    bgLilacLight = new THREE.PointLight(PALETTE.violetSecondary, 3.8, 55);
    bgLilacLight.position.set(-12, -8, 6);
    bgScene.add(bgLilacLight);

    bgMagentaLight = new THREE.PointLight(PALETTE.magentaRim, 4.0, 50);
    bgMagentaLight.position.set(8, -20, 8);
    bgScene.add(bgMagentaLight);

    // --------------------------------------------------------------------------
    // 2. SCULPTURAL 3D GRAPHIC DESIGN & MOTION MATERIALS
    // --------------------------------------------------------------------------
    bgMatPrimary = new THREE.MeshStandardMaterial({
      color: 0x9D72FF,
      metalness: 0.88,
      roughness: 0.16,
      emissive: 0x3D1A7A,
      emissiveIntensity: 0.4
    });

    bgMatAccent = new THREE.MeshStandardMaterial({
      color: 0xFB8DFF,
      metalness: 0.85,
      roughness: 0.18,
      emissive: 0x6A1B7A,
      emissiveIntensity: 0.35
    });

    bgMatGold = new THREE.MeshStandardMaterial({
      color: 0xE8C194,
      metalness: 0.92,
      roughness: 0.22,
      emissive: 0x54361C,
      emissiveIntensity: 0.25
    });

    bgMatChrome = new THREE.MeshStandardMaterial({
      color: 0xF0EBF8,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0x241D30,
      emissiveIntensity: 0.2
    });

    bgMatWireframe = new THREE.MeshBasicMaterial({
      color: 0xC2A4FF,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });

    // --------------------------------------------------------------------------
    // 3. BACKGROUND CELESTIAL STARFIELD & FLOATING DUST PARTICLES
    // --------------------------------------------------------------------------
    const starCount = 3800;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 2.2;

      const sinPhi = Math.sin(phi);
      positions[i * 3] = r * sinPhi * Math.cos(theta) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = r * Math.cos(phi) * 12 - 4;

      const seed = Math.random();
      if (seed > 0.7) {
        colors[i * 3] = 0.98; colors[i * 3 + 1] = 0.55; colors[i * 3 + 2] = 1.0; // Magenta
      } else if (seed > 0.35) {
        colors[i * 3] = 0.76; colors[i * 3 + 1] = 0.64; colors[i * 3 + 2] = 1.0; // Lilac
      } else {
        colors[i * 3] = 0.96; colors[i * 3 + 1] = 0.94; colors[i * 3 + 2] = 0.98; // White
      }
    }

    const starGeom = new THREE.BufferGeometry();
    starGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });

    bgStars = new THREE.Points(starGeom, starMat);
    bgScene.add(bgStars);

    // --------------------------------------------------------------------------
    // 4. BIG PROCEDURAL 3D MOTION SCULPTURES (HERO -> ABOUT -> WORK -> FOOTER)
    // --------------------------------------------------------------------------
    const sculpturesGroup = new THREE.Group();
    bgScene.add(sculpturesGroup);

    // A. GIANT KINETIC TORUS KNOT (Hero / About Upper Right)
    const knotGeom = new THREE.TorusKnotGeometry(2.4, 0.65, 120, 24, 2, 3);
    const knotMesh = new THREE.Mesh(knotGeom, bgMatPrimary);
    knotMesh.position.set(7.5, 4.0, -4.5);
    sculpturesGroup.add(knotMesh);

    bgSculptures.push({
      mesh: knotMesh,
      baseY: 4.0,
      rotX: 0.006,
      rotY: 0.009,
      rotZ: 0.004,
      scrollMultiplier: 0.004,
      amplitude: 0.3,
      speed: 1.2
    });

    // Outer Glowing Wireframe Cage for Torus Knot
    const knotWireGeom = new THREE.TorusKnotGeometry(2.48, 0.68, 60, 16, 2, 3);
    const knotWireMesh = new THREE.Mesh(knotWireGeom, bgMatWireframe);
    knotMesh.add(knotWireMesh);

    // B. PRISMATIC HOLOGRAPHIC ICOSAHEDRON (Featured Work / Archive Mid Left)
    const icoGroup = new THREE.Group();
    icoGroup.position.set(-8.5, -4.5, -3.5);

    const icoCoreGeom = new THREE.IcosahedronGeometry(2.0, 0);
    const icoCoreMesh = new THREE.Mesh(icoCoreGeom, bgMatAccent);
    icoGroup.add(icoCoreMesh);

    const icoWireGeom = new THREE.IcosahedronGeometry(2.25, 0);
    const icoWireMesh = new THREE.Mesh(icoWireGeom, bgMatWireframe);
    icoGroup.add(icoWireMesh);

    sculpturesGroup.add(icoGroup);

    bgSculptures.push({
      mesh: icoGroup,
      baseY: -4.5,
      rotX: -0.008,
      rotY: 0.012,
      rotZ: 0.006,
      scrollMultiplier: 0.005,
      amplitude: 0.35,
      speed: 1.5
    });

    // C. MULTI-AXIS GYROSCOPIC GIMBAL RINGS (Services / Skills Zone Mid Right)
    const gimbalGroup = new THREE.Group();
    gimbalGroup.position.set(8.0, -12.5, -3.0);

    const ringOuterGeom = new THREE.TorusGeometry(2.8, 0.08, 16, 64);
    const ringOuter = new THREE.Mesh(ringOuterGeom, bgMatGold);
    gimbalGroup.add(ringOuter);

    const ringMidGeom = new THREE.TorusGeometry(2.0, 0.07, 16, 64);
    const ringMid = new THREE.Mesh(ringMidGeom, bgMatPrimary);
    ringMid.rotation.x = Math.PI / 3;
    gimbalGroup.add(ringMid);

    const ringInnerGeom = new THREE.TorusGeometry(1.2, 0.06, 16, 48);
    const ringInner = new THREE.Mesh(ringInnerGeom, bgMatAccent);
    ringInner.rotation.y = Math.PI / 2.5;
    gimbalGroup.add(ringInner);

    // Center glowing diamond node
    const nodeGeom = new THREE.OctahedronGeometry(0.55, 0);
    const nodeMesh = new THREE.Mesh(nodeGeom, bgMatChrome);
    gimbalGroup.add(nodeMesh);

    sculpturesGroup.add(gimbalGroup);

    bgSculptures.push({
      mesh: gimbalGroup,
      baseY: -12.5,
      rotX: 0.01,
      rotY: -0.007,
      rotZ: 0.008,
      scrollMultiplier: 0.006,
      amplitude: 0.25,
      speed: 1.4,
      subRings: [ringOuter, ringMid, ringInner, nodeMesh]
    });

    // D. KINETIC VECTOR BEZIER KEYFRAME DIAMONDS (Scattered through depth planes)
    const diamondPositions = [
      [-6.5, 8.5, -6.0, bgMatPrimary, 1.2],
      [5.5, -0.5, -5.0, bgMatAccent, 0.9],
      [-5.5, -17.5, -4.5, bgMatGold, 1.4],
      [6.5, -20.0, -5.5, bgMatPrimary, 1.1],
      [-4.0, -26.5, -4.0, bgMatAccent, 1.3],
      [4.5, -28.0, -5.0, bgMatGold, 1.0]
    ];

    diamondPositions.forEach((dp, idx) => {
      const dGeom = new THREE.OctahedronGeometry(0.7 * dp[4], 0);
      const dMesh = new THREE.Mesh(dGeom, dp[3]);
      dMesh.position.set(dp[0], dp[1], dp[2]);
      sculpturesGroup.add(dMesh);

      bgSculptures.push({
        mesh: dMesh,
        baseY: dp[1],
        rotX: (idx % 2 === 0 ? 1 : -1) * 0.014,
        rotY: 0.012,
        rotZ: 0.008,
        scrollMultiplier: 0.003 + (idx * 0.0008),
        amplitude: 0.2 + (idx * 0.04),
        speed: 1.6 + (idx * 0.2)
      });
    });

    // E. KINETIC CHROMATIC FLOATING SPHERE & ORBITAL DISC (Footer / Contact Zone)
    const sphereGroup = new THREE.Group();
    sphereGroup.position.set(-6.5, -23.0, -4.0);

    const bigSphereGeom = new THREE.SphereGeometry(1.8, 32, 32);
    const bigSphere = new THREE.Mesh(bigSphereGeom, bgMatChrome);
    sphereGroup.add(bigSphere);

    const orbitHaloGeom = new THREE.TorusGeometry(2.6, 0.05, 16, 64);
    const orbitHalo = new THREE.Mesh(orbitHaloGeom, bgMatPrimary);
    orbitHalo.rotation.x = Math.PI / 2.3;
    sphereGroup.add(orbitHalo);

    sculpturesGroup.add(sphereGroup);

    bgSculptures.push({
      mesh: sphereGroup,
      baseY: -23.0,
      rotX: 0.008,
      rotY: 0.014,
      rotZ: 0.005,
      scrollMultiplier: 0.005,
      amplitude: 0.3,
      speed: 1.3
    });

    // --------------------------------------------------------------------------
    // 5. SCROLL & MOUSE MOMENTUM LISTENER
    // --------------------------------------------------------------------------
    function updateMaxScroll() {
      scrollState.maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
    }
    updateMaxScroll();
    window.addEventListener('resize', updateMaxScroll);

    window.addEventListener('scroll', () => {
      scrollState.target = window.scrollY;
    }, { passive: true });

    // --------------------------------------------------------------------------
    // 6. ANIMATION & PARALLAX RENDER LOOP
    // --------------------------------------------------------------------------
    function animateUniverse(time) {
      requestAnimationFrame(animateUniverse);

      const seconds = time * 0.001;

      // Smooth scroll interpolation (damping physics)
      const prevScroll = scrollState.current;
      scrollState.current += (scrollState.target - scrollState.current) * 0.065;
      scrollState.velocity = (scrollState.current - prevScroll);

      const scrollFraction = scrollState.current / scrollState.maxScroll;

      // Travel Camera through the 3D Motion Universe as page scrolls
      bgCamera.position.y = -scrollFraction * 28.0;
      bgCamera.position.x = Math.sin(scrollFraction * Math.PI * 2) * 1.8 + (mouse.x * 0.8);
      bgCamera.position.z = 16.0 + Math.cos(scrollFraction * Math.PI * 3) * 1.5;

      // Mouse Parallax on Scene
      bgScene.rotation.y = mouse.x * 0.08;
      bgScene.rotation.x = -mouse.y * 0.05;

      // Animate background starfield
      if (bgStars && !prefersReducedMotion) {
        bgStars.rotation.y = -seconds * 0.02;
        bgStars.rotation.x = -seconds * 0.01 + (scrollFraction * 0.4);
      }

      // Animate 3D Sculptures with Scroll Momentum
      const scrollBoost = Math.abs(scrollState.velocity) * 0.08;

      bgSculptures.forEach((item, i) => {
        // Floating sinusoidal bobbing
        const floatY = Math.sin(seconds * item.speed + i) * item.amplitude;
        item.mesh.position.y = item.baseY + floatY;

        // Dynamic rotation accelerated by scroll velocity
        item.mesh.rotation.x += item.rotX + (scrollBoost * item.scrollMultiplier * 4);
        item.mesh.rotation.y += item.rotY + (scrollBoost * item.scrollMultiplier * 6);
        item.mesh.rotation.z += item.rotZ + (scrollBoost * item.scrollMultiplier * 3);

        // Nested gimbal counter-rotation if present
        if (item.subRings) {
          item.subRings[0].rotation.z += 0.015 + scrollBoost * 0.02;
          item.subRings[1].rotation.x -= 0.012 + scrollBoost * 0.02;
          item.subRings[2].rotation.y += 0.018 + scrollBoost * 0.02;
          item.subRings[3].rotation.y += 0.025;
        }
      });

      bgRenderer.render(bgScene, bgCamera);
    }
    requestAnimationFrame(animateUniverse);

    window.addEventListener('resize', () => {
      if (!bgCamera || !bgRenderer) return;
      bgCamera.aspect = window.innerWidth / window.innerHeight;
      bgCamera.updateProjectionMatrix();
      bgRenderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // Dynamic 3D lighting & starfield theme adapter (Dark / Light)
  window.update3DTheme = function(theme) {
    if (theme === 'light') {
      // Light Mode adjustments for Hero canvas
      if (ambientLight) {
        ambientLight.color.setHex(0xFFF6EE);
        ambientLight.intensity = 1.6;
      }
      if (mainKeyLight) {
        mainKeyLight.color.setHex(0xFFEEDD);
        mainKeyLight.intensity = 1.8;
      }
      if (lilacRimLight) {
        lilacRimLight.color.setHex(0xC08457);
        lilacRimLight.intensity = 1.6;
      }
      if (magentaRimLight) {
        magentaRimLight.color.setHex(0x8B5E3C);
        magentaRimLight.intensity = 1.4;
      }
      if (uvFillLight) {
        uvFillLight.color.setHex(0xD4A373);
        uvFillLight.intensity = 1.0;
      }

      // Light Mode adjustments for Background 3D Universe
      if (bgAmbientLight) {
        bgAmbientLight.color.setHex(0xFFF8F0);
        bgAmbientLight.intensity = 2.0;
      }
      if (bgSunLight) {
        bgSunLight.color.setHex(0xFFECD6);
        bgSunLight.intensity = 2.2;
      }
      if (bgKeyLight) {
        bgKeyLight.color.setHex(0xC08457);
        bgKeyLight.intensity = 3.5;
      }
      if (bgLilacLight) {
        bgLilacLight.color.setHex(0x8B5E3C);
        bgLilacLight.intensity = 3.0;
      }
      if (bgMagentaLight) {
        bgMagentaLight.color.setHex(0xD4A373);
        bgMagentaLight.intensity = 2.5;
      }

      // Materials to rich metallic bronze, warm cream & terracotta
      if (bgMatPrimary) {
        bgMatPrimary.color.setHex(0x8B5E3C);
        bgMatPrimary.emissive.setHex(0x3B2011);
      }
      if (bgMatAccent) {
        bgMatAccent.color.setHex(0xC08457);
        bgMatAccent.emissive.setHex(0x4A2810);
      }
      if (bgMatChrome) {
        bgMatChrome.color.setHex(0xEFE7DA);
      }
      if (bgMatWireframe) {
        bgMatWireframe.color.setHex(0x8B5E3C);
        bgMatWireframe.opacity = 0.35;
      }
      if (bgStars && bgStars.material) {
        bgStars.material.opacity = 0.25;
      }
    } else {
      // Dark Mode adjustments for Hero canvas
      if (ambientLight) {
        ambientLight.color.setHex(0x1A1226);
        ambientLight.intensity = 1.2;
      }
      if (mainKeyLight) {
        mainKeyLight.color.setHex(0xF5E8FF);
        mainKeyLight.intensity = 1.8;
      }
      if (lilacRimLight) {
        lilacRimLight.color.setHex(PALETTE.lilacAccent);
        lilacRimLight.intensity = 3.2;
      }
      if (magentaRimLight) {
        magentaRimLight.color.setHex(PALETTE.magentaRim);
        magentaRimLight.intensity = 2.6;
      }
      if (uvFillLight) {
        uvFillLight.color.setHex(PALETTE.ultraviolet);
        uvFillLight.intensity = 2.0;
      }

      // Dark Mode adjustments for Background 3D Universe
      if (bgAmbientLight) {
        bgAmbientLight.color.setHex(0x181024);
        bgAmbientLight.intensity = 1.4;
      }
      if (bgSunLight) {
        bgSunLight.color.setHex(0xFFFFFF);
        bgSunLight.intensity = 1.8;
      }
      if (bgKeyLight) {
        bgKeyLight.color.setHex(PALETTE.lilacAccent);
        bgKeyLight.intensity = 4.5;
      }
      if (bgLilacLight) {
        bgLilacLight.color.setHex(PALETTE.violetSecondary);
        bgLilacLight.intensity = 3.8;
      }
      if (bgMagentaLight) {
        bgMagentaLight.color.setHex(PALETTE.magentaRim);
        bgMagentaLight.intensity = 4.0;
      }

      // Materials to electric lilac, neon magenta & chrome
      if (bgMatPrimary) {
        bgMatPrimary.color.setHex(0x9D72FF);
        bgMatPrimary.emissive.setHex(0x3D1A7A);
      }
      if (bgMatAccent) {
        bgMatAccent.color.setHex(0xFB8DFF);
        bgMatAccent.emissive.setHex(0x6A1B7A);
      }
      if (bgMatChrome) {
        bgMatChrome.color.setHex(0xF0EBF8);
      }
      if (bgMatWireframe) {
        bgMatWireframe.color.setHex(0xC2A4FF);
        bgMatWireframe.opacity = 0.45;
      }
      if (bgStars && bgStars.material) {
        bgStars.material.opacity = 0.85;
      }
    }
  };

  // Initialize once DOM is ready
  function startAll() {
    initScene();
    initBackgroundUniverse();

    // Check if initial theme is light
    const currentTheme = document.body.getAttribute('data-theme');
    if (currentTheme === 'light') {
      window.update3DTheme('light');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAll);
  } else {
    startAll();
  }
})();
