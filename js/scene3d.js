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

  // Mouse & 360-degree rotation interaction state
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let rotTargetY = 0;
  let rotCurrentY = 0;
  let rotTargetX = 0;
  let rotCurrentX = 0;
  let dragAngleY = 0;
  let dragAngleX = 0;
  let isPointerDown = false;
  let lastPointerX = 0;
  let lastPointerY = 0;
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

    // Trigger immediate responsive framing
    onWindowResize();

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
   * Setup Event Listeners (Parallax, 360 Drag & Rotation, Resize, Raycasting)
   */
  function setupEventListeners() {
    // Parallax & 360-degree mouse movement tracking across window
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Pointer / Drag events for continuous 360° rotational control
    window.addEventListener('mousedown', onPointerDown, { passive: true });
    window.addEventListener('mouseup', onPointerUp, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onPointerUp, { passive: true });

    // Debounced Resize
    window.addEventListener('resize', onWindowResize);

    // Reduced motion preference changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      prefersReducedMotion = e.matches;
    });
  }

  function onPointerDown(e) {
    if (e.target && (e.target.closest('a') || e.target.closest('button') || e.target.closest('.theme-toggle-btn'))) {
      return;
    }
    isPointerDown = true;
    lastPointerX = e.clientX || 0;
    lastPointerY = e.clientY || 0;
    if (container) container.style.cursor = 'grabbing';
  }

  function onTouchStart(e) {
    if (e.touches.length > 0) {
      if (e.target && (e.target.closest('a') || e.target.closest('button'))) {
        return;
      }
      isPointerDown = true;
      lastPointerX = e.touches[0].clientX;
      lastPointerY = e.touches[0].clientY;
    }
  }

  function onPointerUp() {
    isPointerDown = false;
    if (container) container.style.cursor = 'grab';
  }

  function onMouseMove(e) {
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (isPointerDown) {
      const deltaX = clientX - lastPointerX;
      const deltaY = clientY - lastPointerY;
      dragAngleY += deltaX * 0.015;
      dragAngleX += deltaY * 0.008;
      dragAngleX = Math.max(-0.6, Math.min(0.6, dragAngleX));
      lastPointerX = clientX;
      lastPointerY = clientY;
    }

    // Normalized coordinates (-1 to 1)
    mouse.targetX = (clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(clientY / window.innerHeight) * 2 + 1;

    // 360-degree rotation target calculation
    rotTargetY = dragAngleY + (mouse.targetX * Math.PI * 2);
    rotTargetX = dragAngleX + (-mouse.targetY * 0.45);

    // Raycast coordinates for container bounds
    if (container) {
      const rect = container.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        mouseCoords.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouseCoords.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      } else {
        mouseCoords.x = -1000;
        mouseCoords.y = -1000;
      }
    }
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const clientX = touch.clientX;
      const clientY = touch.clientY;

      if (isPointerDown) {
        const deltaX = clientX - lastPointerX;
        const deltaY = clientY - lastPointerY;
        dragAngleY += deltaX * 0.015;
        dragAngleX += deltaY * 0.008;
        dragAngleX = Math.max(-0.6, Math.min(0.6, dragAngleX));
        lastPointerX = clientX;
        lastPointerY = clientY;
      }

      mouse.targetX = (clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(clientY / window.innerHeight) * 2 + 1;

      rotTargetY = dragAngleY + (mouse.targetX * Math.PI * 2);
      rotTargetX = dragAngleX + (-mouse.targetY * 0.45);
    }
  }

  function onWindowResize() {
    if (!container || !camera || !renderer) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || (window.innerHeight * 0.85);

    camera.aspect = width / height;

    // Responsive scaling and camera framing on mobile, tablet & desktop
    if (width < 480) {
      camera.position.set(0, 0.4, 16.5);
      if (mainGroup) {
        mainGroup.scale.set(0.72, 0.72, 0.72);
        mainGroup.position.set(0, 0, 0);
      }
    } else if (width < 768) {
      camera.position.set(0, 0.5, 14.5);
      if (mainGroup) {
        mainGroup.scale.set(0.82, 0.82, 0.82);
        mainGroup.position.set(0, 0, 0);
      }
    } else if (width < 992) {
      camera.position.set(0, 0.6, 13.0);
      if (mainGroup) {
        mainGroup.scale.set(0.92, 0.92, 0.92);
        mainGroup.position.set(0, 0, 0);
      }
    } else {
      camera.position.set(0, 0.65, 11.5);
      if (mainGroup) {
        mainGroup.scale.set(1.0, 1.0, 1.0);
        mainGroup.position.set(0.5, 0, 0);
      }
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

    // Smooth interpolation with silky damping
    mouse.x += (mouse.targetX - mouse.x) * 0.06;
    mouse.y += (mouse.targetY - mouse.y) * 0.06;

    rotCurrentY += (rotTargetY - rotCurrentY) * 0.065;
    rotCurrentX += (rotTargetX - rotCurrentX) * 0.065;

    // Redraw dynamic timeline monitor screen texture
    if (timelineTextureContext && timelineTexture) {
      timelineTextureContext.drawScreen(time);
      timelineTexture.needsUpdate = true;
    }

    // Apply 360-degree rotation and floating kinematics
    if (!prefersReducedMotion) {
      const seconds = time * 0.001;

      // Full 360-degree rotation driven by mouse & drag + subtle organic breathing
      if (mainGroup) {
        const idleFloatY = Math.sin(seconds * 0.7) * 0.05;
        const idleFloatX = Math.cos(seconds * 0.5) * 0.03;
        mainGroup.rotation.y = rotCurrentY + idleFloatY;
        mainGroup.rotation.x = rotCurrentX + idleFloatX;
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
   * CINEMATIC SECTION-BY-SECTION 3D MOTION UNIVERSE (SCROLL-TRANSFORMATIVE)
   * Transforms smoothly across 7 distinct 3D cinematic stages tailored to each
   * section's discipline (About, Work, Archive, Services, Skills, Experience, Contact).
   * Hero (Home) remains dedicated to the interactive 3D hero canvas.
   * ==============================================================================
   */
  let bgScene, bgCamera, bgRenderer;
  let bgStars, bgStages = [];
  let bgAmbientLight, bgKeyLight, bgLilacLight, bgMagentaLight, bgSunLight;
  let scrollState = {
    current: 0,
    target: 0,
    velocity: 0,
    maxScroll: 1
  };

  // Background Materials Reference for Theme Switching
  let bgMatPrimary, bgMatAccent, bgMatGold, bgMatWireframe, bgMatChrome, bgMatDarkBezel;

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
    // 1. DYNAMIC LIGHTING RIG FOR 3D BACKGROUND STAGES
    // --------------------------------------------------------------------------
    bgAmbientLight = new THREE.AmbientLight(0x181024, 1.5);
    bgScene.add(bgAmbientLight);

    bgSunLight = new THREE.DirectionalLight(0xFFFFFF, 1.8);
    bgSunLight.position.set(12, 18, 15);
    bgScene.add(bgSunLight);

    bgKeyLight = new THREE.PointLight(PALETTE.lilacAccent, 4.5, 70);
    bgKeyLight.position.set(10, 8, 8);
    bgScene.add(bgKeyLight);

    bgLilacLight = new THREE.PointLight(PALETTE.violetSecondary, 3.8, 65);
    bgLilacLight.position.set(-12, -8, 6);
    bgScene.add(bgLilacLight);

    bgMagentaLight = new THREE.PointLight(PALETTE.magentaRim, 4.0, 60);
    bgMagentaLight.position.set(8, -25, 8);
    bgScene.add(bgMagentaLight);

    // --------------------------------------------------------------------------
    // 2. SCULPTURAL 3D GRAPHIC DESIGN & MOTION MATERIALS
    // --------------------------------------------------------------------------
    bgMatPrimary = new THREE.MeshStandardMaterial({
      color: 0x9D72FF,
      metalness: 0.88,
      roughness: 0.16,
      emissive: 0x3D1A7A,
      emissiveIntensity: 0.45
    });

    bgMatAccent = new THREE.MeshStandardMaterial({
      color: 0xFB8DFF,
      metalness: 0.85,
      roughness: 0.18,
      emissive: 0x6A1B7A,
      emissiveIntensity: 0.4
    });

    bgMatGold = new THREE.MeshStandardMaterial({
      color: 0xE8C194,
      metalness: 0.92,
      roughness: 0.22,
      emissive: 0x54361C,
      emissiveIntensity: 0.3
    });

    bgMatChrome = new THREE.MeshStandardMaterial({
      color: 0xF0EBF8,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0x241D30,
      emissiveIntensity: 0.25
    });

    bgMatWireframe = new THREE.MeshBasicMaterial({
      color: 0xC2A4FF,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });

    bgMatDarkBezel = new THREE.MeshStandardMaterial({
      color: 0x140F1A,
      metalness: 0.88,
      roughness: 0.22,
      emissive: 0x2A1A4A,
      emissiveIntensity: 0.35
    });

    // --------------------------------------------------------------------------
    // 3. BACKGROUND CELESTIAL STARFIELD & FLOATING COSMIC DUST
    // --------------------------------------------------------------------------
    const starCount = 4200;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 2.5;

      const sinPhi = Math.sin(phi);
      positions[i * 3] = r * sinPhi * Math.cos(theta) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 2] = r * Math.cos(phi) * 14 - 6;

      const seed = Math.random();
      if (seed > 0.68) {
        colors[i * 3] = 0.98; colors[i * 3 + 1] = 0.55; colors[i * 3 + 2] = 1.0; // Magenta
      } else if (seed > 0.32) {
        colors[i * 3] = 0.76; colors[i * 3 + 1] = 0.64; colors[i * 3 + 2] = 1.0; // Lilac
      } else {
        colors[i * 3] = 0.96; colors[i * 3 + 1] = 0.94; colors[i * 3 + 2] = 0.98; // White
      }
    }

    const starGeom = new THREE.BufferGeometry();
    starGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.052,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });

    bgStars = new THREE.Points(starGeom, starMat);
    bgScene.add(bgStars);

    // Master universe container for all section stages
    const universeGroup = new THREE.Group();
    bgScene.add(universeGroup);
    bgStages = [];

    // Helper to generate simple 3D typographic canvas badge
    function createMonolithTexture(text, sub) {
      const cv = document.createElement('canvas');
      cv.width = 512;
      cv.height = 160;
      const c = cv.getContext('2d');
      c.fillStyle = '#140F1A';
      c.fillRect(0, 0, 512, 160);
      c.strokeStyle = '#C2A4FF';
      c.lineWidth = 6;
      c.strokeRect(6, 6, 500, 148);
      c.fillStyle = '#FB8DFF';
      c.fillRect(12, 12, 8, 8);
      c.fillRect(492, 12, 8, 8);
      c.fillStyle = '#FAF7F2';
      c.font = '900 36px Roboto, sans-serif';
      c.textAlign = 'center';
      c.fillText(text, 256, 75);
      if (sub) {
        c.fillStyle = '#C2A4FF';
        c.font = '700 18px Roboto, sans-serif';
        c.letterSpacing = '3px';
        c.fillText(sub, 256, 120);
      }
      return new THREE.CanvasTexture(cv);
    }

    // ==========================================================================
    // STAGE 01: ABOUT ME SECTION (Y = -9.0)
    // Theme: Visual Storytelling, 11+ Years of Craft, Creative Mobius Flow
    // ==========================================================================
    const stageAbout = new THREE.Group();
    stageAbout.position.set(0, -9.0, -2.5);

    // 1. Kinetic Infinite Mobius Loop of Craft
    const mobiusGeom = new THREE.TorusKnotGeometry(2.7, 0.52, 120, 24, 1, 2);
    const mobiusMesh = new THREE.Mesh(mobiusGeom, bgMatPrimary);
    mobiusMesh.position.set(6.8, 0, -2.0);
    stageAbout.add(mobiusMesh);

    const mobiusWire = new THREE.Mesh(new THREE.TorusKnotGeometry(2.76, 0.55, 60, 16, 1, 2), bgMatWireframe);
    mobiusMesh.add(mobiusWire);

    // 2. Luminous Holographic Creative Core (Mid Left)
    const coreGroup = new THREE.Group();
    coreGroup.position.set(-7.5, 0.5, -2.0);

    const creativeCore = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8, 1), bgMatAccent);
    coreGroup.add(creativeCore);

    const coreHalo = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.06, 16, 64), bgMatGold);
    coreHalo.rotation.x = Math.PI / 2.5;
    coreGroup.add(coreHalo);
    stageAbout.add(coreGroup);

    // 3. Floating 3D Monolith Plates
    const plateTex1 = createMonolithTexture('11+ YEARS CRAFT', 'DESIGN & MOTION');
    const plate1 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.1, 0.12), [
      bgMatDarkBezel, bgMatDarkBezel, bgMatDarkBezel, bgMatDarkBezel,
      new THREE.MeshBasicMaterial({ map: plateTex1 }), bgMatDarkBezel
    ]);
    plate1.position.set(-6.5, -3.2, 0.5);
    plate1.rotation.set(0.15, 0.35, -0.05);
    stageAbout.add(plate1);

    const plateTex2 = createMonolithTexture('VISUAL STORYTELLING', 'NARRATIVE PACING');
    const plate2 = new THREE.Mesh(new THREE.BoxGeometry(3.8, 1.1, 0.12), [
      bgMatDarkBezel, bgMatDarkBezel, bgMatDarkBezel, bgMatDarkBezel,
      new THREE.MeshBasicMaterial({ map: plateTex2 }), bgMatDarkBezel
    ]);
    plate2.position.set(6.2, -3.5, 0.5);
    plate2.rotation.set(-0.12, -0.3, 0.05);
    stageAbout.add(plate2);

    universeGroup.add(stageAbout);
    bgStages.push({
      group: stageAbout,
      targetY: -9.0,
      name: 'About Section Stage',
      rotX: 0.008,
      rotY: 0.012,
      rotZ: 0.004,
      subMeshes: [mobiusMesh, coreGroup, creativeCore, coreHalo, plate1, plate2]
    });

    // ==========================================================================
    // STAGE 02: FEATURED WORK SECTION (Y = -19.0)
    // Theme: 3D Motion Graphics, Brand Films & Commercial Video Editing Rig
    // ==========================================================================
    const stageWork = new THREE.Group();
    stageWork.position.set(0, -19.0, -2.5);

    // 1. Giant Cinema Film Reel Disc (Right)
    const workReelGroup = new THREE.Group();
    workReelGroup.position.set(7.5, 0, -2.5);
    workReelGroup.rotation.set(0.25, -0.35, 0.15);

    const wReelOuter = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.22, 16, 64), bgMatPrimary);
    workReelGroup.add(wReelOuter);

    const wReelHub = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.25, 24), bgMatChrome);
    wReelHub.rotation.x = Math.PI / 2;
    workReelGroup.add(wReelHub);

    for (let s = 0; s < 6; s++) {
      const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.6, 8), bgMatGold);
      spoke.rotation.z = (s * Math.PI * 2) / 6;
      workReelGroup.add(spoke);
    }
    stageWork.add(workReelGroup);

    // 2. Optical Aperture Lens Rig (Left)
    const lensGroup = new THREE.Group();
    lensGroup.position.set(-7.5, 0.5, -2.0);
    lensGroup.rotation.set(-0.2, 0.4, -0.1);

    const lensAperture = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.14, 16, 48), bgMatGold);
    lensGroup.add(lensAperture);

    const lensInnerGlass = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.08, 32), bgMatChrome);
    lensInnerGlass.rotation.x = Math.PI / 2;
    lensGroup.add(lensInnerGlass);

    for (let b = 0; b < 5; b++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 0.04), bgMatAccent);
      blade.position.set(Math.cos(b * 1.25) * 0.9, Math.sin(b * 1.25) * 0.9, 0.06);
      blade.rotation.z = b * 1.25 + 0.5;
      lensGroup.add(blade);
    }
    stageWork.add(lensGroup);

    // 3. Continuous 3D Timeline Kinetic Bezier Waveform Track
    const workWaveCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-9.0, -2.8, -2.0),
      new THREE.Vector3(-4.5, 2.2, 0.5),
      new THREE.Vector3(0.0, -1.8, 1.5),
      new THREE.Vector3(4.5, 2.5, -0.5),
      new THREE.Vector3(9.0, -2.0, -2.0)
    ]);
    const workWaveMesh = new THREE.Mesh(new THREE.TubeGeometry(workWaveCurve, 80, 0.1, 16, false), bgMatPrimary);
    stageWork.add(workWaveMesh);

    // Keyframe diamonds on timeline curve
    [-4.5, 0.0, 4.5].forEach((kx, idx) => {
      const kf = new THREE.Mesh(new THREE.OctahedronGeometry(0.45, 0), idx % 2 === 0 ? bgMatAccent : bgMatGold);
      kf.position.set(kx, idx === 1 ? -1.8 : 2.35, idx === 1 ? 1.5 : 0.0);
      stageWork.add(kf);
    });

    universeGroup.add(stageWork);
    bgStages.push({
      group: stageWork,
      targetY: -19.0,
      name: 'Featured Work Stage',
      rotX: 0.007,
      rotY: 0.014,
      rotZ: 0.005,
      subMeshes: [workReelGroup, lensGroup, workWaveMesh]
    });

    // ==========================================================================
    // STAGE 03: COMPLETE ARCHIVE / GALLERY (Y = -29.0)
    // Theme: Multi-Disciplinary Design Archive, Prismatic Holographic Crystals
    // ==========================================================================
    const stageGallery = new THREE.Group();
    stageGallery.position.set(0, -29.0, -2.5);

    // 1. Centerpiece: Giant Prismatic Holographic Icosahedron
    const crystalGroup = new THREE.Group();
    crystalGroup.position.set(0, 0, -2.0);

    const crystalCore = new THREE.Mesh(new THREE.IcosahedronGeometry(2.8, 0), bgMatAccent);
    crystalGroup.add(crystalCore);

    const crystalWire = new THREE.Mesh(new THREE.IcosahedronGeometry(3.15, 0), bgMatWireframe);
    crystalGroup.add(crystalWire);
    stageGallery.add(crystalGroup);

    // 2. 8 Floating 3D Artwork Category Palette Swatches in Orbit
    const paletteDiscs = [];
    for (let p = 0; p < 8; p++) {
      const pAngle = (p * Math.PI * 2) / 8;
      const pRadius = 6.8;
      const pMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.7, 0.7, 0.08, 6), // Hexagonal swatch disc
        p % 2 === 0 ? bgMatPrimary : (p % 3 === 0 ? bgMatGold : bgMatChrome)
      );
      pMesh.position.set(Math.cos(pAngle) * pRadius, Math.sin(pAngle) * (pRadius * 0.45), Math.sin(pAngle) * 2.0);
      pMesh.rotation.set(0.3, pAngle, 0.2);
      stageGallery.add(pMesh);
      paletteDiscs.push(pMesh);
    }

    universeGroup.add(stageGallery);
    bgStages.push({
      group: stageGallery,
      targetY: -29.0,
      name: 'Creative Gallery Stage',
      rotX: 0.01,
      rotY: 0.012,
      rotZ: 0.008,
      subMeshes: [crystalGroup, crystalCore, crystalWire, ...paletteDiscs]
    });

    // ==========================================================================
    // STAGE 04: CREATIVE SERVICES (Y = -39.0)
    // Theme: 7 Creative Services, Multi-Axis Gyroscopic Gimbal & Orbital Gemstones
    // ==========================================================================
    const stageServices = new THREE.Group();
    stageServices.position.set(0, -39.0, -2.5);

    // 1. Triple Nesting Gyroscopic Gimbal Rings
    const sGimbalGroup = new THREE.Group();
    sGimbalGroup.position.set(6.8, 0.5, -2.0);

    const sRingOuter = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.1, 16, 64), bgMatGold);
    sGimbalGroup.add(sRingOuter);

    const sRingMid = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.08, 16, 64), bgMatPrimary);
    sRingMid.rotation.x = Math.PI / 3;
    sGimbalGroup.add(sRingMid);

    const sRingInner = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.07, 16, 48), bgMatAccent);
    sRingInner.rotation.y = Math.PI / 2.4;
    sGimbalGroup.add(sRingInner);

    const sCenterCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.75, 0), bgMatChrome);
    sGimbalGroup.add(sCenterCore);
    stageServices.add(sGimbalGroup);

    // 2. 7 Orbital Satellite Nodes (Representing the 7 Services) on the Left
    const satellitesGroup = new THREE.Group();
    satellitesGroup.position.set(-6.8, 0.5, -2.0);

    const satCenter = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), bgMatChrome);
    satellitesGroup.add(satCenter);

    const satHalo = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.06, 16, 64), bgMatPrimary);
    satHalo.rotation.x = Math.PI / 2.2;
    satellitesGroup.add(satHalo);

    const satNodes = [];
    for (let s = 0; s < 7; s++) {
      const sAngle = (s * Math.PI * 2) / 7;
      const node = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.4, 0),
        s % 2 === 0 ? bgMatAccent : bgMatGold
      );
      node.position.set(Math.cos(sAngle) * 2.8, Math.sin(sAngle) * 1.2, Math.sin(sAngle) * 1.5);
      satellitesGroup.add(node);
      satNodes.push(node);
    }
    stageServices.add(satellitesGroup);

    universeGroup.add(stageServices);
    bgStages.push({
      group: stageServices,
      targetY: -39.0,
      name: 'Creative Services Stage',
      rotX: 0.009,
      rotY: 0.015,
      rotZ: 0.006,
      subMeshes: [sGimbalGroup, sRingOuter, sRingMid, sRingInner, sCenterCore, satellitesGroup, ...satNodes]
    });

    // ==========================================================================
    // STAGE 05: SKILLS & CREATIVE TOOLS (Y = -49.0)
    // Theme: 3D Digital Stylus Pen, Precision Bezier Vectors & 6 Software Prisms
    // ==========================================================================
    const stageSkills = new THREE.Group();
    stageSkills.position.set(0, -49.0, -2.5);

    // 1. Massive 3D Digital Stylus Pen (Right)
    const penGroup = new THREE.Group();
    penGroup.position.set(7.0, 0.5, -2.0);
    penGroup.rotation.set(-0.35, -0.4, 0.5);

    const penBody = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.1, 4.4, 20), bgMatDarkBezel);
    penGroup.add(penBody);

    const penNib = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.75, 20), bgMatGold);
    penNib.position.y = 2.55;
    penGroup.add(penNib);

    const penRing = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.04, 12, 24), bgMatAccent);
    penRing.position.y = 1.3;
    penRing.rotation.x = Math.PI / 2;
    penGroup.add(penRing);

    // Bezier tangent crossbar
    const handleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.8, 12), bgMatWireframe);
    handleBar.position.set(0, 2.55, 0);
    handleBar.rotation.z = Math.PI / 2;
    penGroup.add(handleBar);

    const handleNode1 = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), bgMatPrimary);
    handleNode1.position.set(1.4, 2.55, 0);
    penGroup.add(handleNode1);

    const handleNode2 = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), bgMatAccent);
    handleNode2.position.set(-1.4, 2.55, 0);
    penGroup.add(handleNode2);

    stageSkills.add(penGroup);

    // 2. 6 Floating 3D Software Prisms / Tablets (Left)
    const softwareGroup = new THREE.Group();
    softwareGroup.position.set(-7.0, 0.5, -2.0);

    const softNames = ['AE', 'PR', 'PS', 'AI', '3D', 'FIGMA'];
    const softPrisms = [];

    softNames.forEach((name, idx) => {
      const tex = createMonolithTexture(name, 'TOOLKIT');
      const prism = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 1.6, 0.35),
        [
          bgMatDarkBezel, bgMatDarkBezel, bgMatDarkBezel, bgMatDarkBezel,
          new THREE.MeshBasicMaterial({ map: tex }), bgMatDarkBezel
        ]
      );
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      prism.position.set((col - 0.5) * 2.5, (1 - row) * 2.2, (idx % 2 === 0 ? 0.4 : -0.4));
      prism.rotation.set((idx % 2 === 0 ? 0.15 : -0.15), (idx % 2 === 0 ? 0.25 : -0.25), 0);
      softwareGroup.add(prism);
      softPrisms.push(prism);
    });

    stageSkills.add(softwareGroup);

    universeGroup.add(stageSkills);
    bgStages.push({
      group: stageSkills,
      targetY: -49.0,
      name: 'Skills & Toolkit Stage',
      rotX: 0.012,
      rotY: 0.01,
      rotZ: 0.007,
      subMeshes: [penGroup, penBody, penNib, softwareGroup, ...softPrisms]
    });

    // ==========================================================================
    // STAGE 06: CAREER EXPERIENCE & HONORS (Y = -59.0)
    // Theme: 11+ Years DNA Timeline & The Golden Innovator Award Trophy Star
    // ==========================================================================
    const stageExp = new THREE.Group();
    stageExp.position.set(0, -59.0, -2.5);

    // 1. The Golden 3D Innovator Award Star Trophy Sculpture (Right)
    const trophyGroup = new THREE.Group();
    trophyGroup.position.set(7.2, 0.5, -2.0);

    const trophyStar = new THREE.Mesh(new THREE.OctahedronGeometry(2.0, 0), bgMatGold);
    trophyGroup.add(trophyStar);

    const trophyHalo1 = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.08, 16, 64), bgMatPrimary);
    trophyHalo1.rotation.x = Math.PI / 2.3;
    trophyGroup.add(trophyHalo1);

    const trophyHalo2 = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.06, 16, 48), bgMatAccent);
    trophyHalo2.rotation.y = Math.PI / 2.6;
    trophyGroup.add(trophyHalo2);
    stageExp.add(trophyGroup);

    // 2. Ascending 3D Career Timeline Double Helix Spiral (Left)
    const helixGroup = new THREE.Group();
    helixGroup.position.set(-7.2, 0.5, -2.0);

    const helixPoints1 = [];
    const helixPoints2 = [];
    for (let h = 0; h <= 40; h++) {
      const hAngle = h * 0.35;
      const hY = (h - 20) * 0.28;
      helixPoints1.push(new THREE.Vector3(Math.cos(hAngle) * 1.5, hY, Math.sin(hAngle) * 1.5));
      helixPoints2.push(new THREE.Vector3(Math.cos(hAngle + Math.PI) * 1.5, hY, Math.sin(hAngle + Math.PI) * 1.5));

      // Milestone connector rungs
      if (h % 5 === 0) {
        const rungCurve = new THREE.LineCurve3(
          new THREE.Vector3(Math.cos(hAngle) * 1.5, hY, Math.sin(hAngle) * 1.5),
          new THREE.Vector3(Math.cos(hAngle + Math.PI) * 1.5, hY, Math.sin(hAngle + Math.PI) * 1.5)
        );
        const rungMesh = new THREE.Mesh(new THREE.TubeGeometry(rungCurve, 8, 0.05, 8, false), bgMatGold);
        helixGroup.add(rungMesh);
      }
    }

    const strand1 = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(helixPoints1), 60, 0.08, 12, false), bgMatPrimary);
    const strand2 = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(helixPoints2), 60, 0.08, 12, false), bgMatAccent);
    helixGroup.add(strand1);
    helixGroup.add(strand2);
    stageExp.add(helixGroup);

    universeGroup.add(stageExp);
    bgStages.push({
      group: stageExp,
      targetY: -59.0,
      name: 'Experience & Honors Stage',
      rotX: 0.008,
      rotY: 0.016,
      rotZ: 0.005,
      subMeshes: [trophyGroup, trophyStar, trophyHalo1, trophyHalo2, helixGroup]
    });

    // ==========================================================================
    // STAGE 07: CONTACT & COLLABORATION (Y = -69.0)
    // Theme: 3D Holographic Global Connection Sphere & Concentric Signal Waves
    // ==========================================================================
    const stageContact = new THREE.Group();
    stageContact.position.set(0, -69.0, -2.5);

    // 1. Holographic Global Connection Sphere (Center)
    const contactSphereGroup = new THREE.Group();
    contactSphereGroup.position.set(0, 0.5, -2.0);

    const cGlobe = new THREE.Mesh(new THREE.SphereGeometry(2.6, 32, 32), bgMatChrome);
    contactSphereGroup.add(cGlobe);

    const cWire = new THREE.Mesh(new THREE.SphereGeometry(2.72, 16, 16), bgMatWireframe);
    contactSphereGroup.add(cWire);

    // Concentric signal pulse rings
    const pulseRings = [];
    for (let r = 0; r < 3; r++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(3.6 + r * 1.2, 0.05, 16, 64),
        r === 0 ? bgMatAccent : (r === 1 ? bgMatPrimary : bgMatGold)
      );
      ring.rotation.x = Math.PI / (2.2 + r * 0.2);
      contactSphereGroup.add(ring);
      pulseRings.push(ring);
    }
    stageContact.add(contactSphereGroup);

    universeGroup.add(stageContact);
    bgStages.push({
      group: stageContact,
      targetY: -69.0,
      name: 'Contact Stage',
      rotX: 0.006,
      rotY: 0.014,
      rotZ: 0.008,
      subMeshes: [contactSphereGroup, cGlobe, cWire, ...pulseRings]
    });

    // --------------------------------------------------------------------------
    // 5. SCROLL STATE & DYNAMIC RESIZE TRACKER
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
    // 6. ANIMATION & SCROLL-TRANSFORMATIVE CINEMATIC RENDER LOOP
    // --------------------------------------------------------------------------
    function animateUniverse(time) {
      requestAnimationFrame(animateUniverse);

      const seconds = time * 0.001;

      // Smooth scroll interpolation (damping physics)
      const prevScroll = scrollState.current;
      scrollState.current += (scrollState.target - scrollState.current) * 0.055;
      scrollState.velocity = (scrollState.current - prevScroll);

      const scrollFraction = scrollState.current / scrollState.maxScroll;

      // Glide Camera through the 7 distinct 3D cinematic stages (Y = 0 to -69.0)
      const targetCamY = -scrollFraction * 69.0;
      bgCamera.position.y += (targetCamY - bgCamera.position.y) * 0.07;

      // Subtle cinematic S-curve sweep on X and Z
      bgCamera.position.x = Math.sin(scrollFraction * Math.PI * 4) * 1.8 + (mouse.x * 0.9);

      const baseZ = window.innerWidth < 480 ? 22.0 : (window.innerWidth < 768 ? 19.0 : 16.0);
      bgCamera.position.z = baseZ + Math.cos(scrollFraction * Math.PI * 6) * 1.2;

      // Mouse Parallax on Scene
      bgScene.rotation.y = mouse.x * 0.08;
      bgScene.rotation.x = -mouse.y * 0.05;

      // Animate background starfield
      if (bgStars && !prefersReducedMotion) {
        bgStars.rotation.y = -seconds * 0.018;
        bgStars.rotation.x = -seconds * 0.008 + (scrollFraction * 0.4);
      }

      // Dynamic Section Highlighting & Kinetic Momentum
      const scrollBoost = Math.abs(scrollState.velocity) * 0.08;

      bgStages.forEach((stage, i) => {
        // Distance between camera Y and this stage's center
        const dist = Math.abs(bgCamera.position.y - stage.targetY);
        const isActive = dist < 7.5;
        const proximity = Math.max(0, 1 - (dist / 12.0)); // 1 when centered, 0 when far

        // Dynamic scale and kinetic acceleration when active
        const targetScale = 0.85 + proximity * 0.15;
        stage.group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);

        // Sinusoidal floating
        const floatY = Math.sin(seconds * 1.3 + i) * 0.25;
        stage.group.position.y = stage.targetY + floatY;

        // Rotation acceleration on active section
        const activeSpeedMult = 1.0 + (proximity * 1.8) + (scrollBoost * 3.0);
        stage.group.rotation.x += stage.rotX * activeSpeedMult;
        stage.group.rotation.y += stage.rotY * activeSpeedMult;
        stage.group.rotation.z += stage.rotZ * activeSpeedMult;

        // Specific nested object counter-rotations
        if (i === 1) { // Work stage: rotate reel spokes & lens
          if (stage.subMeshes[0]) stage.subMeshes[0].rotation.z += 0.02 * activeSpeedMult;
          if (stage.subMeshes[1]) stage.subMeshes[1].rotation.z -= 0.015 * activeSpeedMult;
        } else if (i === 3) { // Services stage: gimbal nested counter-rotations
          if (stage.subMeshes[1]) stage.subMeshes[1].rotation.z += 0.02;
          if (stage.subMeshes[2]) stage.subMeshes[2].rotation.x -= 0.018;
          if (stage.subMeshes[3]) stage.subMeshes[3].rotation.y += 0.022;
        } else if (i === 5) { // Experience stage: trophy star spin & helix spin
          if (stage.subMeshes[1]) stage.subMeshes[1].rotation.y += 0.025 * activeSpeedMult;
          if (stage.subMeshes[4]) stage.subMeshes[4].rotation.y -= 0.015;
        } else if (i === 6) { // Contact stage: pulse rings expanding
          if (stage.subMeshes[1]) stage.subMeshes[1].rotation.y += 0.018;
          if (stage.subMeshes[3]) stage.subMeshes[3].rotation.z += 0.02;
          if (stage.subMeshes[4]) stage.subMeshes[4].rotation.z -= 0.015;
        }
      });

      bgRenderer.render(bgScene, bgCamera);
    }
    requestAnimationFrame(animateUniverse);

    function onBgResize() {
      if (!bgCamera || !bgRenderer) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      bgCamera.aspect = w / h;
      if (w < 480) {
        bgCamera.fov = 68;
        bgCamera.position.z = 22.0;
      } else if (w < 768) {
        bgCamera.fov = 62;
        bgCamera.position.z = 19.0;
      } else if (w < 992) {
        bgCamera.fov = 58;
        bgCamera.position.z = 17.5;
      } else {
        bgCamera.fov = 55;
        bgCamera.position.z = 16.0;
      }
      bgCamera.updateProjectionMatrix();
      bgRenderer.setSize(w, h);
    }

    window.addEventListener('resize', onBgResize);
    onBgResize();
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

    // Update About Energy Canvas theme
    aboutTheme = theme;
  };

  /**
   * ==============================================================================
   * PROCEDURAL 3D COSMIC ENERGY PARTICLE VORTEX CANVAS (ABOUT SECTION)
   * Replacing video with pure interactive procedural canvas animation
   * ==============================================================================
   */
  let aboutCanvas, aboutCtx;
  let aboutParticles = [];
  let aboutAnimFrameId;
  let isAboutVisible = true;
  let aboutTheme = 'dark';

  function initAboutEnergyCanvas() {
    aboutCanvas = document.getElementById('about-energy-canvas');
    if (!aboutCanvas) return;
    aboutCtx = aboutCanvas.getContext('2d');
    if (!aboutCtx) return;

    function resizeAboutCanvas() {
      const parent = aboutCanvas.parentElement;
      if (!parent) return;
      aboutCanvas.width = parent.clientWidth || 900;
      aboutCanvas.height = parent.clientHeight || 700;
    }

    resizeAboutCanvas();
    window.addEventListener('resize', resizeAboutCanvas);

    // Create 700 orbiting energy particles
    const particleCount = 700;
    aboutParticles = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 30 + Math.pow(Math.random(), 1.6) * 340;
      const speed = (0.003 + (1 / (radius + 20)) * 1.6) * (Math.random() > 0.15 ? 1 : -0.7);
      const size = Math.random() * 2.2 + 0.8;
      const ringTilt = (Math.random() - 0.5) * 0.4;
      const colorSeed = Math.random();

      aboutParticles.push({
        angle: angle,
        radius: radius,
        baseRadius: radius,
        speed: speed,
        size: size,
        ringTilt: ringTilt,
        colorSeed: colorSeed,
        alpha: Math.random() * 0.7 + 0.3
      });
    }

    // Observer to only animate when in view
    const aboutSection = document.getElementById('about');
    if (aboutSection && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          isAboutVisible = e.isIntersecting;
        });
      }, { threshold: 0.05 });
      observer.observe(aboutSection);
    }

    function renderAbout(time) {
      aboutAnimFrameId = requestAnimationFrame(renderAbout);
      if (!isAboutVisible) return;

      const w = aboutCanvas.width;
      const h = aboutCanvas.height;
      const cx = w / 2;
      const cy = h / 2;

      aboutCtx.clearRect(0, 0, w, h);

      // Core glowing energy gradient
      const coreGrad = aboutCtx.createRadialGradient(cx, cy, 0, cx, cy, 320);
      if (aboutTheme === 'light') {
        coreGrad.addColorStop(0, 'rgba(192, 132, 87, 0.22)');
        coreGrad.addColorStop(0.35, 'rgba(139, 94, 60, 0.12)');
        coreGrad.addColorStop(0.7, 'rgba(232, 193, 148, 0.04)');
        coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        coreGrad.addColorStop(0, 'rgba(194, 164, 255, 0.32)');
        coreGrad.addColorStop(0.3, 'rgba(84, 0, 255, 0.22)');
        coreGrad.addColorStop(0.65, 'rgba(251, 141, 255, 0.08)');
        coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }

      aboutCtx.fillStyle = coreGrad;
      aboutCtx.beginPath();
      aboutCtx.arc(cx, cy, 320, 0, Math.PI * 2);
      aboutCtx.fill();

      // Mouse influence on vortex center & tilt
      const mouseTiltX = mouse.x * 35;
      const mouseTiltY = mouse.y * 25;

      const t = time * 0.001;

      // Draw all cosmic energy particles
      for (let i = 0; i < aboutParticles.length; i++) {
        const p = aboutParticles[i];
        p.angle += p.speed;

        // Elliptical 3D orbit with perspective tilt
        const currentRadius = p.baseRadius + Math.sin(t * 1.5 + i) * 6;
        const x = cx + mouseTiltX + Math.cos(p.angle) * currentRadius;
        const y = cy + mouseTiltY + Math.sin(p.angle) * (currentRadius * 0.42) + Math.sin(p.angle + p.ringTilt) * 20;

        // Depth perspective scale & alpha
        const depth = (Math.sin(p.angle) + 1) / 2; // 0 (back) to 1 (front)
        const renderSize = p.size * (0.6 + depth * 0.7);
        const renderAlpha = p.alpha * (0.35 + depth * 0.65);

        let particleColor;
        if (aboutTheme === 'light') {
          if (p.colorSeed > 0.6) particleColor = `rgba(139, 94, 60, ${renderAlpha})`;
          else if (p.colorSeed > 0.25) particleColor = `rgba(192, 132, 87, ${renderAlpha})`;
          else particleColor = `rgba(232, 193, 148, ${renderAlpha})`;
        } else {
          if (p.colorSeed > 0.65) particleColor = `rgba(251, 141, 255, ${renderAlpha})`; // Magenta
          else if (p.colorSeed > 0.3) particleColor = `rgba(194, 164, 255, ${renderAlpha})`; // Lilac
          else particleColor = `rgba(255, 255, 255, ${renderAlpha})`; // White starlight
        }

        aboutCtx.fillStyle = particleColor;
        aboutCtx.beginPath();
        aboutCtx.arc(x, y, renderSize, 0, Math.PI * 2);
        aboutCtx.fill();
      }
    }

    renderAbout(0);
  }

  // Initialize once DOM is ready
  function startAll() {
    initScene();
    initBackgroundUniverse();
    initAboutEnergyCanvas();

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
