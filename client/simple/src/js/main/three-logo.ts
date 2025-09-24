import * as THREE from 'three';

export class ThreeLogo {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private textGroup: THREE.Group;
  private animationId: number | null = null;
  private container: HTMLElement;

  constructor(containerId: string) {
    this.container = document.getElementById(containerId)!;
    this.init();
    this.createLogo();
    this.animate();
  }

  private init(): void {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xfafafa); // Match background color

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 100);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00acc1, 1);
    directionalLight.position.set(10, 10, 5);
    this.scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x00acc1, 0.5);
    pointLight.position.set(-10, -10, 10);
    this.scene.add(pointLight);

    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private createLogo(): void {
    this.textGroup = new THREE.Group();

    // Create 3D text for each letter
    const letters = ['Z', 'H', 'E', 'N', 'S', 'A'];
    const spacing = 25;

    letters.forEach((letter, index) => {
      this.createLetter(letter, index * spacing - (letters.length - 1) * spacing / 2);
    });

    this.scene.add(this.textGroup);

    // Add some floating geometric shapes
    this.addFloatingShapes();
  }

  private createLetter(letter: string, xPosition: number): void {
    // Create 3D text using extruded geometry
    const textGeometry = this.createTextGeometry(letter);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00acc1,
      shininess: 100,
      specular: 0x111111
    });

    const mesh = new THREE.Mesh(textGeometry, material);
    mesh.position.set(xPosition, 0, 0);

    // Add animation
    mesh.userData = {
      originalY: 0,
      phase: Math.random() * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.01
    };

    this.textGroup.add(mesh);
  }

  private createTextGeometry(letter: string): THREE.ExtrudeGeometry {
    // Create simple letter shapes using basic geometries
    let shape: THREE.Shape;

    switch (letter.toUpperCase()) {
      case 'Z':
        shape = new THREE.Shape();
        shape.moveTo(-8, 8);
        shape.lineTo(8, 8);
        shape.lineTo(-8, -8);
        shape.lineTo(8, -8);
        break;
      case 'H':
        shape = new THREE.Shape();
        shape.moveTo(-6, 8);
        shape.lineTo(-6, -8);
        shape.moveTo(-6, 0);
        shape.lineTo(6, 0);
        shape.moveTo(6, 8);
        shape.lineTo(6, -8);
        break;
      case 'E':
        shape = new THREE.Shape();
        shape.moveTo(6, 8);
        shape.lineTo(-6, 8);
        shape.lineTo(-6, 0);
        shape.lineTo(4, 0);
        shape.moveTo(-6, 0);
        shape.lineTo(-6, -8);
        shape.lineTo(6, -8);
        break;
      case 'N':
        shape = new THREE.Shape();
        shape.moveTo(-6, -8);
        shape.lineTo(-6, 8);
        shape.lineTo(6, -8);
        shape.lineTo(6, 8);
        break;
      case 'S':
        shape = new THREE.Shape();
        shape.moveTo(6, 8);
        shape.lineTo(-6, 8);
        shape.lineTo(-6, 0);
        shape.lineTo(6, 0);
        shape.lineTo(6, -8);
        shape.lineTo(-6, -8);
        break;
      case 'A':
        shape = new THREE.Shape();
        shape.moveTo(0, 8);
        shape.lineTo(-6, -8);
        shape.lineTo(-3, -8);
        shape.lineTo(0, 2);
        shape.lineTo(3, -8);
        shape.lineTo(6, -8);
        break;
      default:
        // Fallback to simple rectangle
        shape = new THREE.Shape();
        shape.moveTo(-6, 8);
        shape.lineTo(6, 8);
        shape.lineTo(6, -8);
        shape.lineTo(-6, -8);
    }

    const extrudeSettings = {
      depth: 4,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 1,
      bevelThickness: 1
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }

  private addFloatingShapes(): void {
    // Add some floating geometric shapes around the text
    const shapes = [
      { geometry: new THREE.OctahedronGeometry(8), color: 0x26c6da },
      { geometry: new THREE.TetrahedronGeometry(6), color: 0x4dd0e1 },
      { geometry: new THREE.IcosahedronGeometry(5), color: 0x00acc1 }
    ];

    shapes.forEach((shape, index) => {
      const material = new THREE.MeshPhongMaterial({
        color: shape.color,
        transparent: true,
        opacity: 0.7,
        shininess: 100
      });

      const mesh = new THREE.Mesh(shape.geometry, material);

      // Position around the text
      const angle = (index / shapes.length) * Math.PI * 2;
      const radius = 80;
      mesh.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.5,
        Math.sin(angle) * 30
      );

      mesh.userData = {
        originalPosition: mesh.position.clone(),
        phase: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.005,
        radius: radius
      };

      this.scene.add(mesh);
    });
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);

    const time = Date.now() * 0.001;

    // Animate text letters
    this.textGroup.children.forEach((child, index) => {
      if (child.userData && child.userData.originalY !== undefined) {
        const mesh = child as THREE.Mesh;
        const data = mesh.userData;

        // Floating animation
        mesh.position.y = data.originalY + Math.sin(time * data.speed + data.phase) * 5;

        // Slight rotation
        mesh.rotation.x = Math.sin(time * 0.5 + index) * 0.1;
        mesh.rotation.y = Math.cos(time * 0.3 + index) * 0.1;
      }
    });

    // Animate floating shapes
    this.scene.children.forEach((child) => {
      if (child.userData && child.userData.originalPosition) {
        const mesh = child as THREE.Mesh;
        const data = mesh.userData;

        // Orbital motion
        const angle = time * data.speed + data.phase;
        mesh.position.x = data.originalPosition.x + Math.cos(angle) * 10;
        mesh.position.y = data.originalPosition.y + Math.sin(angle) * 5;
        mesh.position.z = data.originalPosition.z + Math.sin(angle * 0.5) * 5;

        // Rotation
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.015;
      }
    });

    // Camera subtle movement
    this.camera.position.x = Math.sin(time * 0.1) * 5;
    this.camera.position.y = Math.cos(time * 0.1) * 3;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  };

  private onWindowResize(): void {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  public dispose(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    this.renderer.dispose();
  }
}

// Initialize the logo when DOM is loaded
export function initThreeLogo(): void {
  const logoContainer = document.getElementById('three-logo-container');
  if (logoContainer) {
    new ThreeLogo('three-logo-container');
  }
}