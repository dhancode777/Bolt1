import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Interactive visual section scene.
 * - Abstract geometric objects (X-inspired forms) that transform with scroll
 * - Scroll-responsive camera dolly + rotation
 * - Dynamic object transformations (scale, rotation, position)
 * - Distinctive geometric forms inspired by the WaxX double-X identity
 */
export class VisualScene {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private container: HTMLElement;
  private clock = new THREE.Clock();
  private rafId = 0;
  private disposed = false;

  private objects: THREE.Mesh[] = [];
  private particles!: THREE.Points;

  private scrollProgress = 0;
  private scrollTrigger?: ScrollTrigger;
  private isMobile = false;
  private prefersReduced = false;
  private isVisible = false;
  private observer?: IntersectionObserver;

  constructor(container: HTMLElement) {
    this.container = container;
    this.isMobile = window.innerWidth < 768;
    this.prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x080808, 8, 22);

    this.camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    this.camera.position.set(0, 0, 12);

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    container.appendChild(this.renderer.domElement);

    this.buildObjects();
    this.buildLights();
    this.buildParticles();
    this.buildEnvironment();
    this.bindEvents();
    this.setupScroll();

    this.animate();
  }

  /** Build two crossed torus knots forming an X — the WaxX identity in 3D. */
  private buildObjects() {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.18,
      envMapIntensity: 1.3,
      flatShading: true,
    });

    const limeMat = new THREE.MeshStandardMaterial({
      color: 0xd7ff3f,
      metalness: 0.8,
      roughness: 0.25,
      emissive: 0xd7ff3f,
      emissiveIntensity: 0.15,
      flatShading: true,
    });

    const knotGeo = new THREE.TorusKnotGeometry(1.4, 0.34, this.isMobile ? 80 : 180, this.isMobile ? 10 : 24, 2, 3);
    const icoGeo = new THREE.IcosahedronGeometry(0.7, 1);
    const octGeo = new THREE.OctahedronGeometry(0.6, 0);

    const knotA = new THREE.Mesh(knotGeo, mat);
    knotA.position.set(-3.5, 0.5, 0);
    knotA.rotation.z = Math.PI / 4;

    const knotB = new THREE.Mesh(knotGeo.clone(), limeMat);
    knotB.position.set(3.5, -0.5, 0);
    knotB.rotation.z = -Math.PI / 4;

    const ico = new THREE.Mesh(icoGeo, mat);
    ico.position.set(0, 2.2, -1);

    const oct = new THREE.Mesh(octGeo, limeMat);
    oct.position.set(0, -2.4, 1);

    this.objects = [knotA, knotB, ico, oct];
    this.objects.forEach((o) => this.scene.add(o));
  }

  private buildEnvironment() {
    const envScene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(this.renderer);

    const g = new THREE.IcosahedronGeometry(0.5, 0);
    const m1 = new THREE.MeshBasicMaterial({ color: 0xd7ff3f });
    const m2 = new THREE.MeshBasicMaterial({ color: 0xf4f4f0 });
    const orbs = [new THREE.Mesh(g, m1), new THREE.Mesh(g, m2)];
    orbs[0].position.set(5, 3, 3);
    orbs[1].position.set(-5, -3, -3);
    orbs.forEach((o) => envScene.add(o));

    const envRT = pmrem.fromScene(envScene, 0.04);
    this.scene.environment = envRT.texture;
    orbs.forEach((o) => {
      o.geometry.dispose();
      (o.material as THREE.Material).dispose();
    });
    pmrem.dispose();
  }

  private buildLights() {
    const key = new THREE.PointLight(0xd7ff3f, 40, 50);
    key.position.set(4, 3, 5);
    const rim = new THREE.PointLight(0xf4f4f0, 25, 50);
    rim.position.set(-5, -2, 3);
    const dir = new THREE.DirectionalLight(0xffffff, 0.5);
    dir.position.set(0, 5, 2);
    this.scene.add(key, rim, dir);
  }

  private buildParticles() {
    const count = this.isMobile ? 80 : 220;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xf4f4f0,
      size: 0.025,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);
  }

  private setupScroll() {
    const st = ScrollTrigger.create({
      trigger: this.container,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        this.scrollProgress = self.progress;
      },
    });
    this.scrollTrigger = st;
  }

  private bindEvents() {
    window.addEventListener('resize', this.onResize);

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          this.isVisible = e.isIntersecting;
        });
      },
      { threshold: 0.05 },
    );
    this.observer.observe(this.container);
  }

  private onResize = () => {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
  };

  private animate = () => {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.animate);
    if (!this.isVisible) return;

    const t = this.clock.getElapsedTime();
    const p = this.scrollProgress; // 0 → 1 across the section

    // Camera dolly + orbit driven by scroll
    this.camera.position.z = 12 - p * 4;
    this.camera.position.x = Math.sin(p * Math.PI) * 3;
    this.camera.position.y = p * 2 - 1;
    this.camera.lookAt(0, 0, 0);

    if (!this.prefersReduced) {
      // Object transformations driven by scroll
      this.objects.forEach((o, i) => {
        const phase = i * 0.5;
        o.rotation.x = t * 0.2 + p * Math.PI + phase;
        o.rotation.y = t * 0.15 + p * Math.PI * 1.5;
        const scale = 1 + Math.sin(p * Math.PI + phase) * 0.3;
        o.scale.setScalar(scale);
      });

      // X-form: drift the two knots toward center and back
      if (this.objects[0]) {
        this.objects[0].position.x = -3.5 + Math.sin(p * Math.PI) * 3;
      }
      if (this.objects[1]) {
        this.objects[1].position.x = 3.5 - Math.sin(p * Math.PI) * 3;
      }
    }

    this.particles.rotation.y = t * 0.03 + p * 0.5;

    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    this.observer?.disconnect();
    this.scrollTrigger?.kill();

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
