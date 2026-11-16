import * as THREE from 'three';

interface MouseTarget {
  x: number;
  y: number;
}

/**
 * Interactive chrome sculpture scene for the hero.
 * - Torus knot with reflective metal material
 * - Dynamic point + directional lighting
 * - Floating particle field
 * - Mouse-responsive rotation + idle drift
 * - Respects prefers-reduced-motion and pauses when off-screen
 */
export class HeroScene {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private container: HTMLElement;
  private clock = new THREE.Clock();
  private rafId = 0;
  private disposed = false;

  private sculpture!: THREE.Mesh;
  private particles!: THREE.Points;
  private lights: THREE.Light[] = [];

  private mouse: MouseTarget = { x: 0, y: 0 };
  private targetRot = { x: 0, y: 0 };
  private currentRot = { x: 0, y: 0 };

  private isVisible = true;
  private prefersReduced = false;
  private isMobile = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isMobile = window.innerWidth < 768;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x080808, 6, 18);

    this.camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    this.camera.position.set(0, 0, 6.5);

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    container.appendChild(this.renderer.domElement);

    this.buildSculpture();
    this.buildLights();
    this.buildParticles();
    this.buildEnvironment();

    this.bindEvents();
    this.animate();
  }

  private buildSculpture() {
    // Use an Icosahedron geometry for a faceted chrome look — distinctive and performant
    const detail = this.isMobile ? 1 : 3;
    const geo = new THREE.IcosahedronGeometry(2, detail);

    // Slight vertex displacement for an organic, sculptural silhouette
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const base = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      base[i * 3] = pos.getX(i);
      base[i * 3 + 1] = pos.getY(i);
      base[i * 3 + 2] = pos.getZ(i);
    }
    geo.userData.base = base;

    const mat = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      metalness: 1.0,
      roughness: 0.12,
      envMapIntensity: 1.4,
      flatShading: true,
    });

    this.sculpture = new THREE.Mesh(geo, mat);
    this.scene.add(this.sculpture);
  }

  private buildEnvironment() {
    // Simple gradient environment for reflections (cube render target)
    const envScene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    pmrem.compileEquirectangularShader();

    // Build a tiny scene with colored lights to bake an env map
    const envGeo = new THREE.IcosahedronGeometry(0.4, 0);
    const envMatA = new THREE.MeshBasicMaterial({ color: 0xd7ff3f });
    const envMatB = new THREE.MeshBasicMaterial({ color: 0x1a1a1a });
    const envMatC = new THREE.MeshBasicMaterial({ color: 0xf4f4f0 });
    const orbs = [
      new THREE.Mesh(envGeo, envMatA),
      new THREE.Mesh(envGeo, envMatB),
      new THREE.Mesh(envGeo, envMatC),
    ];
    orbs[0].position.set(4, 2, 2);
    orbs[1].position.set(-4, -2, -2);
    orbs[2].position.set(0, 4, -3);
    orbs.forEach((o) => envScene.add(o));

    const envRT = pmrem.fromScene(envScene, 0.04);
    this.scene.environment = envRT.texture;

    (this.sculpture.material as THREE.MeshStandardMaterial).envMap = envRT.texture;
    (this.sculpture.material as THREE.MeshStandardMaterial).needsUpdate = true;

    orbs.forEach((o) => {
      o.geometry.dispose();
      (o.material as THREE.Material).dispose();
    });
    pmrem.dispose();
  }

  private buildLights() {
    const key = new THREE.PointLight(0xd7ff3f, 60, 50);
    key.position.set(5, 4, 5);
    const rim = new THREE.PointLight(0xf4f4f0, 30, 50);
    rim.position.set(-6, -3, -4);
    const fill = new THREE.DirectionalLight(0xffffff, 0.6);
    fill.position.set(0, 5, 2);

    this.lights = [key, rim, fill];
    this.lights.forEach((l) => this.scene.add(l));
  }

  private buildParticles() {
    const count = this.isMobile ? 120 : 350;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xf4f4f0,
      size: 0.018,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);
  }

  private bindEvents() {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('resize', this.onResize);
    document.addEventListener('visibilitychange', this.onVisibility);
  }

  private onMouseMove = (e: MouseEvent) => {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    this.targetRot.y = this.mouse.x * 0.8;
    this.targetRot.x = this.mouse.y * 0.5;
  };

  private onResize = () => {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
  };

  private onVisibility = () => {
    this.isVisible = !document.hidden;
  };

  /** Pause rendering when the hero scrolls out of view (IntersectionObserver). */
  setInView(inView: boolean) {
    this.isVisible = inView;
  }

  private animate = () => {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.animate);

    if (!this.isVisible) return;

    const t = this.clock.getElapsedTime();

    // Idle rotation + mouse-driven rotation
    if (this.prefersReduced) {
      this.sculpture.rotation.y += 0.0015;
    } else {
      this.currentRot.x += (this.targetRot.x - this.currentRot.x) * 0.05;
      this.currentRot.y += (this.targetRot.y - this.currentRot.y) * 0.05;
      this.sculpture.rotation.x = this.currentRot.x + Math.sin(t * 0.3) * 0.08;
      this.sculpture.rotation.y = this.currentRot.y + t * 0.12;
      this.sculpture.rotation.z = Math.sin(t * 0.2) * 0.06;
    }

    // Subtle organic vertex wobble
    if (!this.prefersReduced) {
      const geo = this.sculpture.geometry;
      const pos = geo.attributes.position as THREE.BufferAttribute;
      const base = geo.userData.base as Float32Array;
      for (let i = 0; i < pos.count; i++) {
        const bx = base[i * 3];
        const by = base[i * 3 + 1];
        const bz = base[i * 3 + 2];
        const len = Math.sqrt(bx * bx + by * by + bz * bz);
        const n = 1 + Math.sin(t * 0.8 + len * 2.5) * 0.025;
        pos.setXYZ(i, bx * n, by * n, bz * n);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
    }

    // Camera parallax
    if (!this.prefersReduced) {
      this.camera.position.x += (this.mouse.x * 0.4 - this.camera.position.x) * 0.03;
      this.camera.position.y += (-this.mouse.y * 0.3 - this.camera.position.y) * 0.03;
      this.camera.lookAt(0, 0, 0);
    }

    // Particles drift
    this.particles.rotation.y = t * 0.02;
    this.particles.rotation.x = t * 0.01;

    // Light orbit
    if (this.lights[0]) {
      const l = this.lights[0] as THREE.PointLight;
      l.position.x = Math.cos(t * 0.4) * 6;
      l.position.z = Math.sin(t * 0.4) * 6;
    }

    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibility);

    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
        obj.geometry?.dispose();
        const m = obj.material;
        if (Array.isArray(m)) m.forEach((mm) => mm.dispose());
        else m?.dispose();
      }
    });

    if (this.scene.environment) {
      (this.scene.environment as THREE.Texture).dispose();
    }

    this.renderer.dispose();
    if (this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
