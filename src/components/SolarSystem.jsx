import { useEffect, useRef, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import { usePageTransition } from '../App';
import './SolarSystem.css';

const SolarSystem = () => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const animationFrameRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const isVisibleRef = useRef(true);
  const transition = usePageTransition();

  // Expansion state - initially collapsed
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Cinematic intro state
  const [introComplete, setIntroComplete] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const skipIntroRef = useRef(false);

  // Handle ESC key to exit CSS fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        // Exit CSS fullscreen mode
        setIsFullscreen(false);
        setIsExpanded(false);
        setIsAnimating(false);
        setIntroComplete(false);
        setShowTitle(false);
        skipIntroRef.current = false;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Handle expand button click - with fog transition
  const handleExpand = () => {
    if (transition?.triggerTransition) {
      transition.triggerTransition(() => {
        // This runs when fog is solid - launch the experience
        setIsFullscreen(true);
        setIsAnimating(true);
        setTimeout(() => {
          setIsExpanded(true);
          clockRef.current = new THREE.Clock();
        }, 100);
      });
    } else {
      // Fallback without transition
      setIsFullscreen(true);
      setIsAnimating(true);
      setTimeout(() => {
        setIsExpanded(true);
        clockRef.current = new THREE.Clock();
      }, 100);
    }
  };

  // Handle exit fullscreen - with fog transition
  const handleExitFullscreen = () => {
    if (transition?.triggerTransition) {
      transition.triggerTransition(() => {
        setIsFullscreen(false);
        setIsExpanded(false);
        setIsAnimating(false);
        setIntroComplete(false);
        setShowTitle(false);
        skipIntroRef.current = false;
      });
    } else {
      setIsFullscreen(false);
      setIsExpanded(false);
      setIsAnimating(false);
      setIntroComplete(false);
      setShowTitle(false);
      skipIntroRef.current = false;
    }
  };

  // Theme colors from your portfolio
  const themeColors = useMemo(() => ({
    primary: '#63133b',      // Dark Purple/Maroon
    secondary: '#802754',    // Medium Purple
    accent: '#994D74',       // Light Purple
    highlight: '#8a2b5a',    // Dark Pink
    light: '#f8d7e6',        // Very Light Pink
    white: '#ffffff',
  }), []);

  useEffect(() => {
    if (!containerRef.current || !isExpanded) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(themeColors.white);

    // Camera - start with cinematic FOV
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);

    // Renderer - optimized settings
    const isMobile = width < 768;
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.shadowMap.enabled = false;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(themeColors.light, 0.3);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(themeColors.light, 2.5, 200);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const dirLight = new THREE.DirectionalLight(themeColors.white, 0.5);
    dirLight.position.set(50, 50, 50);
    scene.add(dirLight);

    // Ultra smooth cinematic easing - very slow start, gentle middle, slow end
    const cinematicEase = (t) => {
      // Custom easing: slow start, smooth middle, very slow end (no jerk)
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    // Intro config - Hollywood cinematic timing
    const introConfig = {
      duration: isMobile ? 16 : 24, // Epic slow cinematic
      titleDelay: isMobile ? 8 : 12, // Title appears during the reveal
    };

    // Final camera state (shared between intro end and interactive start)
    // Neptune is at distance 56, so we need ~70 to see all planets
    const finalCamera = {
      distance: 70,
      height: 28,
      fov: 48
    };

    // Intro state
    let introStartTime = null;
    let isIntroActive = true;
    let introProgress = 0;

    // Create realistic Sun
    const createSun = () => {
      const sunGroup = new THREE.Group();

      const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
      const sunMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(themeColors.primary) },
          color2: { value: new THREE.Color(themeColors.secondary) },
          color3: { value: new THREE.Color(themeColors.accent) },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec2 vUv;

          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 color1;
          uniform vec3 color2;
          uniform vec3 color3;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec2 vUv;

          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
          vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

          float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            i = mod289(i);
            vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            float n_ = 0.142857142857;
            vec3 ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            vec4 x = x_ * ns.x + ns.yyyy;
            vec4 y = y_ * ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            vec4 s0 = floor(b0) * 2.0 + 1.0;
            vec4 s1 = floor(b1) * 2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
          }

          void main() {
            float noise1 = snoise(vPosition * 2.0 + time * 0.3);
            float noise2 = snoise(vPosition * 4.0 - time * 0.2);

            float combinedNoise = noise1 * 0.6 + noise2 * 0.4;
            combinedNoise = combinedNoise * 0.5 + 0.5;

            vec3 color = mix(color1, color2, combinedNoise);
            color = mix(color, color3, pow(combinedNoise, 2.0) * 0.5);

            float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
            color += color3 * fresnel * 0.5;

            float core = 1.0 - length(vUv - 0.5) * 2.0;
            core = max(0.0, core);
            color += vec3(1.0, 0.9, 0.95) * core * 0.3;

            gl_FragColor = vec4(color, 1.0);
          }
        `,
      });

      const sun = new THREE.Mesh(sunGeometry, sunMaterial);
      sunGroup.add(sun);

      const glowGeometry = new THREE.SphereGeometry(3.5, 16, 16);
      const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(themeColors.accent) },
          time: { value: 0 }
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          uniform float time;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            float pulse = 0.8 + sin(time * 2.0) * 0.2;
            gl_FragColor = vec4(color, intensity * 0.6 * pulse);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      });

      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      sunGroup.add(glow);

      const coronaGeometry = new THREE.SphereGeometry(4.5, 16, 16);
      const coronaMaterial = new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(themeColors.light) }
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
            gl_FragColor = vec4(color, intensity * 0.3);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      });

      const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
      sunGroup.add(corona);

      return { group: sunGroup, materials: [sunMaterial, glowMaterial] };
    };

    // Planet data with gentle motion
    const planetData = [
      { name: 'Mercury', radius: 0.4, distance: 8, speed: 2.0, color: themeColors.accent, tilt: 0.03 },
      { name: 'Venus', radius: 0.9, distance: 11, speed: 1.2, color: themeColors.secondary, tilt: 177.4 * Math.PI / 180 },
      { name: 'Earth', radius: 1.0, distance: 15, speed: 0.8, color: themeColors.primary, tilt: 23.4 * Math.PI / 180, hasMoon: true },
      { name: 'Mars', radius: 0.5, distance: 20, speed: 0.5, color: themeColors.highlight, tilt: 25.2 * Math.PI / 180 },
      { name: 'Jupiter', radius: 2.2, distance: 28, speed: 0.3, color: themeColors.accent, tilt: 3.1 * Math.PI / 180 },
      { name: 'Saturn', radius: 1.8, distance: 38, speed: 0.2, color: themeColors.secondary, tilt: 26.7 * Math.PI / 180, hasRings: true },
      { name: 'Uranus', radius: 1.2, distance: 48, speed: 0.15, color: themeColors.light, tilt: 97.8 * Math.PI / 180 },
      { name: 'Neptune', radius: 1.1, distance: 56, speed: 0.1, color: themeColors.primary, tilt: 28.3 * Math.PI / 180 },
    ];

    // Store Earth reference for cinematic intro
    let earthOrbitContainer = null;
    let earthPlanetGroup = null;
    let moonMesh = null;

    // Create a realistic planet
    const createPlanet = (data) => {
      const planetGroup = new THREE.Group();

      const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          baseColor: { value: new THREE.Color(data.color) },
          lightPosition: { value: new THREE.Vector3(0, 0, 0) },
          time: { value: 0 }
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec3 vWorldPosition;

          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPos.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 baseColor;
          uniform vec3 lightPosition;
          uniform float time;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec3 vWorldPosition;

          void main() {
            vec3 lightDir = normalize(lightPosition - vWorldPosition);
            float diff = max(dot(vNormal, lightDir), 0.0);
            diff = pow(diff, 0.8);
            float ambient = 0.15;
            float variation = sin(vPosition.x * 10.0 + time * 0.1) *
                             sin(vPosition.y * 10.0 + time * 0.15) *
                             sin(vPosition.z * 10.0 + time * 0.12) * 0.1 + 0.9;
            vec3 color = baseColor * variation;
            color = color * (ambient + diff * 0.85);
            float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
            rim = pow(rim, 3.0);
            color += baseColor * rim * 0.3;
            float nightGlow = max(0.0, -dot(vNormal, lightDir)) * 0.1;
            color += baseColor * nightGlow * 0.5;
            gl_FragColor = vec4(color, 1.0);
          }
        `,
      });

      const planet = new THREE.Mesh(geometry, material);
      planet.rotation.z = data.tilt;
      planetGroup.add(planet);

      const atmosphereGeometry = new THREE.SphereGeometry(data.radius * 1.1, 16, 16);
      const atmosphereMaterial = new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(data.color) }
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            gl_FragColor = vec4(color, intensity * 0.25);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      });

      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      planetGroup.add(atmosphere);

      if (data.hasRings) {
        const ringGeometry = new THREE.RingGeometry(data.radius * 1.4, data.radius * 2.5, 64);
        const ringMaterial = new THREE.ShaderMaterial({
          uniforms: {
            color1: { value: new THREE.Color(themeColors.light) },
            color2: { value: new THREE.Color(themeColors.accent) },
            innerRadius: { value: data.radius * 1.4 },
            outerRadius: { value: data.radius * 2.5 }
          },
          vertexShader: `
            varying vec2 vUv;
            varying float vRadius;
            void main() {
              vUv = uv;
              vRadius = length(position.xy);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
            uniform float innerRadius;
            uniform float outerRadius;
            varying vec2 vUv;
            varying float vRadius;

            void main() {
              float t = (vRadius - innerRadius) / (outerRadius - innerRadius);
              float bands = sin(t * 40.0) * 0.5 + 0.5;
              bands *= sin(t * 80.0) * 0.3 + 0.7;
              vec3 color = mix(color1, color2, t);
              float alpha = smoothstep(0.0, 0.1, t) * smoothstep(1.0, 0.9, t);
              alpha *= bands * 0.7;
              gl_FragColor = vec4(color, alpha);
            }
          `,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false
        });

        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = Math.PI / 2 + data.tilt;
        planetGroup.add(rings);

        // Create meteoroids/granules orbiting within the rings
        const meteoroidGroup = new THREE.Group();
        const meteoroidCount = 40; // Number of meteoroids
        const innerRadius = data.radius * 1.4;
        const outerRadius = data.radius * 2.5;

        for (let i = 0; i < meteoroidCount; i++) {
          // Random size for each meteoroid (small rocks)
          const size = 0.03 + Math.random() * 0.08;

          // Create irregular rock shapes using icosahedron with some distortion
          const meteoroidGeometry = new THREE.IcosahedronGeometry(size, 0);

          // Distort vertices to make them look like irregular rocks
          const positions = meteoroidGeometry.attributes.position;
          for (let j = 0; j < positions.count; j++) {
            const x = positions.getX(j);
            const y = positions.getY(j);
            const z = positions.getZ(j);
            const distortion = 0.7 + Math.random() * 0.6;
            positions.setXYZ(j, x * distortion, y * distortion, z * distortion);
          }
          meteoroidGeometry.computeVertexNormals();

          const meteoroidMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(themeColors.accent).lerp(new THREE.Color(themeColors.light), Math.random() * 0.5),
            roughness: 0.8,
            metalness: 0.2,
          });

          const meteoroid = new THREE.Mesh(meteoroidGeometry, meteoroidMaterial);

          // Position randomly within the ring area (XY plane, same as ring geometry)
          const angle = Math.random() * Math.PI * 2;
          const radiusPos = innerRadius + Math.random() * (outerRadius - innerRadius);
          const heightOffset = (Math.random() - 0.5) * 0.15; // Slight vertical variation

          meteoroid.position.set(
            Math.cos(angle) * radiusPos,
            Math.sin(angle) * radiusPos,
            heightOffset
          );

          // Random rotation
          meteoroid.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
          );

          // Store orbital data for animation
          meteoroid.userData.orbitAngle = angle;
          meteoroid.userData.orbitRadius = radiusPos;
          meteoroid.userData.orbitSpeed = 0.1 + Math.random() * 0.15; // Varying speeds
          meteoroid.userData.rotationSpeed = {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
            z: (Math.random() - 0.5) * 2
          };
          meteoroid.userData.heightOffset = heightOffset;

          meteoroidGroup.add(meteoroid);
        }

        // Apply the same tilt as the rings
        meteoroidGroup.rotation.x = Math.PI / 2 + data.tilt;
        meteoroidGroup.userData.isMeteoroidGroup = true;
        planetGroup.add(meteoroidGroup);
      }

      if (data.hasMoon) {
        // Moon orbit ring
        const moonOrbitRadius = 2;
        const moonOrbitPoints = [];
        const moonOrbitSegments = 64;

        for (let i = 0; i <= moonOrbitSegments; i++) {
          const angle = (i / moonOrbitSegments) * Math.PI * 2;
          moonOrbitPoints.push(new THREE.Vector3(
            Math.cos(angle) * moonOrbitRadius,
            0,
            Math.sin(angle) * moonOrbitRadius
          ));
        }

        const moonOrbitGeometry = new THREE.BufferGeometry().setFromPoints(moonOrbitPoints);
        const moonOrbitMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color(themeColors.light),
          transparent: true,
          opacity: 0.3
        });

        const moonOrbitRing = new THREE.Line(moonOrbitGeometry, moonOrbitMaterial);
        planetGroup.add(moonOrbitRing);

        // Moon
        const moonGeometry = new THREE.SphereGeometry(0.27, 16, 16);
        const moonMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(themeColors.light),
          roughness: 0.9,
          metalness: 0.1
        });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.position.set(2, 0, 0);
        moon.userData.moonAngle = 0;
        planetGroup.add(moon);
      }

      return { group: planetGroup, material, data };
    };

    // Create orbit path
    const createOrbitPath = (distance) => {
      const points = [];
      const segments = 64;

      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(
          Math.cos(angle) * distance,
          0,
          Math.sin(angle) * distance
        ));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color(themeColors.accent),
        transparent: true,
        opacity: 0.15
      });

      return new THREE.Line(geometry, material);
    };

    // Create starfield
    const createStars = () => {
      const geometry = new THREE.BufferGeometry();
      const count = isMobile ? 500 : 1000;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const sizes = new Float32Array(count);

      const color1 = new THREE.Color(themeColors.accent);
      const color2 = new THREE.Color(themeColors.secondary);
      const color3 = new THREE.Color(themeColors.primary);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const radius = 80 + Math.random() * 120;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        const colorChoice = Math.random();
        let starColor;
        if (colorChoice < 0.33) starColor = color1;
        else if (colorChoice < 0.66) starColor = color2;
        else starColor = color3;

        colors[i3] = starColor.r;
        colors[i3 + 1] = starColor.g;
        colors[i3 + 2] = starColor.b;

        sizes[i] = 0.5 + Math.random() * 1.5;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }
        },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          uniform float time;

          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            float twinkle = sin(time * 2.0 + position.x * 0.1) * 0.3 + 0.7;
            gl_PointSize = size * twinkle * (200.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;

          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
            alpha *= 0.8;
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      return new THREE.Points(geometry, material);
    };

    // Create all objects
    const sun = createSun();
    scene.add(sun.group);

    const planets = planetData.map((data, index) => {
      const planet = createPlanet(data);
      const orbit = createOrbitPath(data.distance);
      scene.add(orbit);

      const orbitContainer = new THREE.Group();
      orbitContainer.add(planet.group);
      planet.group.position.x = data.distance;
      scene.add(orbitContainer);

      // Store Earth reference
      if (data.name === 'Earth') {
        earthOrbitContainer = orbitContainer;
        earthPlanetGroup = planet.group;
        // Get moon reference
        if (planet.group.children.length > 2) {
          moonMesh = planet.group.children[planet.group.children.length - 1];
        }
      }

      return { ...planet, orbitContainer, orbit };
    });

    const stars = createStars();
    scene.add(stars);

    // ============================================
    // CINEMATIC CAMERA SYSTEM - Moon Pullback Shot
    // ============================================

    // Get moon's world position
    const getMoonWorldPosition = () => {
      if (moonMesh && earthPlanetGroup && earthOrbitContainer) {
        const moonWorldPos = new THREE.Vector3();
        moonMesh.getWorldPosition(moonWorldPos);
        return moonWorldPos;
      }
      // Fallback: calculate approximate position
      const earthAngle = clockRef.current.getElapsedTime() * 0.1;
      const earthX = Math.cos(earthAngle) * 15;
      const earthZ = Math.sin(earthAngle) * 15;
      return new THREE.Vector3(earthX + 2, 0.5, earthZ);
    };

    // Store initial moon position (locked on first frame)
    let initialMoonPos = null;
    let pullbackDirection = null;
    let finalCameraPos = null;
    let finalAngle = null;

    // Hollywood cinematic camera - epic moon to solar system reveal
    const updateCinematicCamera = (progress) => {
      const moonPos = getMoonWorldPosition();
      const time = clockRef.current.getElapsedTime();

      // On first frame, lock the initial moon position
      if (initialMoonPos === null) {
        initialMoonPos = moonPos.clone();
        pullbackDirection = initialMoonPos.clone().normalize();
        const startAngle = Math.atan2(pullbackDirection.x, pullbackDirection.z);
        finalAngle = startAngle - Math.PI * 0.25;
      }

      // === HOLLYWOOD 3-ACT STRUCTURE ===
      // Act 1 (0-15%): Intimate moon shot with subtle drift
      // Act 2 (15-75%): Epic pullback revealing the solar system
      // Act 3 (75-100%): Majestic settle into final position

      let cameraPos = new THREE.Vector3();
      let lookTarget = new THREE.Vector3();
      let currentFov;
      const moonDist = initialMoonPos.length();
      const startAngle = Math.atan2(pullbackDirection.x, pullbackDirection.z);

      if (progress < 0.15) {
        // === ACT 1: Intimate Moon Shot ===
        const actProgress = progress / 0.15;

        // Subtle breathing motion - very cinematic
        const breathe = Math.sin(time * 0.5) * 0.05;
        const drift = actProgress * 0.02;

        // Very close to moon, slight movement
        const dist = moonDist + 1.2 + breathe;
        const angle = startAngle + drift;
        const height = 0.2 + actProgress * 0.3;

        cameraPos.set(
          Math.sin(angle) * dist,
          height,
          Math.cos(angle) * dist
        );

        // Focus locked on moon
        lookTarget.copy(initialMoonPos);
        currentFov = 20 + actProgress * 2; // Very tight

      } else if (progress < 0.75) {
        // === ACT 2: The Epic Pullback ===
        const actProgress = (progress - 0.15) / 0.6;
        const eased = cinematicEase(actProgress);

        // Dramatic distance increase
        const startDist = moonDist + 1.5;
        const endDist = moonDist + finalCamera.distance * 0.85;
        const currentDist = startDist + (endDist - startDist) * eased;

        // Sweeping rotation
        const rotationAmount = -Math.PI * 0.2;
        const currentAngle = startAngle + 0.02 + eased * rotationAmount;

        // Rising crane shot
        const startHeight = 0.5;
        const endHeight = finalCamera.height * 0.8;
        const currentHeight = startHeight + (endHeight - startHeight) * Math.pow(eased, 0.6);

        // Subtle breathing continues
        const breathe = Math.sin(time * 0.3) * (1 - eased) * 0.1;

        cameraPos.set(
          Math.sin(currentAngle) * (currentDist + breathe),
          currentHeight,
          Math.cos(currentAngle) * (currentDist + breathe)
        );

        // Gradual focus shift from moon to sun
        const focusShift = cinematicEase(actProgress);
        lookTarget.copy(initialMoonPos).multiplyScalar(1 - focusShift * 0.85);

        // FOV opens up dramatically
        currentFov = 22 + eased * 20;

      } else {
        // === ACT 3: Majestic Settle ===
        const actProgress = (progress - 0.75) / 0.25;
        const eased = cinematicEase(actProgress);

        // Smooth settle to final position
        const settleDist = moonDist + finalCamera.distance * 0.85 +
                          (finalCamera.distance * 0.15 + 17) * eased;
        const settleAngle = startAngle - Math.PI * 0.2 - Math.PI * 0.05 * eased;
        const settleHeight = finalCamera.height * 0.8 +
                            (finalCamera.height * 0.2) * eased;

        cameraPos.set(
          Math.sin(settleAngle) * settleDist,
          settleHeight,
          Math.cos(settleAngle) * settleDist
        );

        // Final focus on center
        const remainingOffset = initialMoonPos.clone().multiplyScalar(0.15 * (1 - eased));
        lookTarget.copy(remainingOffset);

        currentFov = 42 + eased * (finalCamera.fov - 42);

        // Update final angle for handoff
        finalAngle = settleAngle;
      }

      // Apply camera
      camera.position.copy(cameraPos);
      camera.lookAt(lookTarget);
      camera.fov = currentFov;
      camera.updateProjectionMatrix();

      return {
        angle: finalAngle,
        position: cameraPos
      };
    };

    // Mouse interaction for camera (disabled during intro)
    // Will be set to match intro end position for seamless handoff
    let targetRotationY = 0;
    let targetRotationX = 0;
    let currentRotationY = 0;
    let currentRotationX = 0;
    let interactiveDistance = finalCamera.distance;
    let interactiveHeight = finalCamera.height;
    let isInteracting = false;
    let previousMouseX = 0;
    let previousMouseY = 0;

    const handleMouseDown = (e) => {
      if (isIntroActive) return;
      isInteracting = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const handleMouseMove = (e) => {
      if (!isInteracting || isIntroActive) return;

      const deltaX = e.clientX - previousMouseX;
      const deltaY = e.clientY - previousMouseY;

      targetRotationY += deltaX * 0.005;
      targetRotationX += deltaY * 0.003;
      targetRotationX = Math.max(-0.5, Math.min(1.0, targetRotationX));

      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isInteracting = false;
    };

    const handleTouchStart = (e) => {
      if (isIntroActive) return;
      if (e.touches.length === 1) {
        isInteracting = true;
        previousMouseX = e.touches[0].clientX;
        previousMouseY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (!isInteracting || e.touches.length !== 1 || isIntroActive) return;
      e.preventDefault();

      const deltaX = e.touches[0].clientX - previousMouseX;
      const deltaY = e.touches[0].clientY - previousMouseY;

      targetRotationY += deltaX * 0.005;
      targetRotationX += deltaY * 0.003;
      targetRotationX = Math.max(-0.5, Math.min(1.0, targetRotationX));

      previousMouseX = e.touches[0].clientX;
      previousMouseY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      isInteracting = false;
    };

    // Add event listeners
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    renderer.domElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    renderer.domElement.addEventListener('touchend', handleTouchEnd);

    // Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0].isIntersecting;
        if (isVisibleRef.current) {
          clockRef.current.start();
        } else {
          clockRef.current.stop();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      const elapsedTime = clockRef.current.getElapsedTime();

      // Initialize intro start time
      if (introStartTime === null) {
        introStartTime = elapsedTime;
      }

      // Update sun
      sun.materials.forEach(mat => {
        if (mat.uniforms && mat.uniforms.time) {
          mat.uniforms.time.value = elapsedTime;
        }
      });
      sun.group.rotation.y = elapsedTime * 0.1;

      // Update planets
      planets.forEach((planet) => {
        const data = planet.data;
        planet.orbitContainer.rotation.y = elapsedTime * data.speed * 0.15;
        planet.group.children[0].rotation.y = elapsedTime * 0.5;

        if (planet.material.uniforms) {
          planet.material.uniforms.time.value = elapsedTime;
        }

        if (data.hasMoon && planet.group.children.length > 2) {
          const moon = planet.group.children[planet.group.children.length - 1];
          moon.userData.moonAngle += 0.02;
          moon.position.x = Math.cos(moon.userData.moonAngle) * 2;
          moon.position.z = Math.sin(moon.userData.moonAngle) * 2;
        }

        // Animate meteoroids in Saturn's rings
        if (data.hasRings) {
          planet.group.children.forEach(child => {
            if (child.userData && child.userData.isMeteoroidGroup) {
              child.children.forEach(meteoroid => {
                // Update orbit angle
                meteoroid.userData.orbitAngle += meteoroid.userData.orbitSpeed * 0.01;

                // Update position along orbit (XY plane, same as ring geometry)
                const angle = meteoroid.userData.orbitAngle;
                const radius = meteoroid.userData.orbitRadius;
                meteoroid.position.x = Math.cos(angle) * radius;
                meteoroid.position.y = Math.sin(angle) * radius;

                // Tumble rotation for realistic rock movement
                meteoroid.rotation.x += meteoroid.userData.rotationSpeed.x * 0.01;
                meteoroid.rotation.y += meteoroid.userData.rotationSpeed.y * 0.01;
                meteoroid.rotation.z += meteoroid.userData.rotationSpeed.z * 0.01;
              });
            }
          });
        }
      });

      // Update stars
      if (stars.material.uniforms) {
        stars.material.uniforms.time.value = elapsedTime;
      }
      stars.rotation.y = elapsedTime * 0.01;

      // ============================================
      // CINEMATIC INTRO LOGIC
      // ============================================
      if (isIntroActive && !skipIntroRef.current) {
        const introElapsed = elapsedTime - introStartTime;
        introProgress = Math.min(introElapsed / introConfig.duration, 1);

        // Update cinematic camera
        const cameraState = updateCinematicCamera(introProgress);

        // Trigger title appearance
        if (introElapsed >= introConfig.titleDelay && !showTitle) {
          setShowTitle(true);
        }

        // End intro
        if (introProgress >= 1) {
          isIntroActive = false;
          setIntroComplete(true);
          currentRotationY = cameraState.angle;
          targetRotationY = cameraState.angle;
        }
      } else if (skipIntroRef.current && isIntroActive) {
        // Skip was pressed
        isIntroActive = false;
        setIntroComplete(true);
        setShowTitle(true);
      } else {
        // Interactive camera - responds to mouse/touch
        if (!isInteracting) {
          targetRotationY += 0.0002; // Slow auto-rotation when not interacting
        }

        // Smooth camera movement
        currentRotationY += (targetRotationY - currentRotationY) * 0.05;
        currentRotationX += (targetRotationX - currentRotationX) * 0.05;

        // Camera position based on rotation
        const dist = finalCamera.distance + 17;
        camera.position.x = Math.sin(currentRotationY) * dist * Math.cos(currentRotationX);
        camera.position.y = finalCamera.height + Math.sin(currentRotationX) * 20;
        camera.position.z = Math.cos(currentRotationY) * dist * Math.cos(currentRotationX);
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;

      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('touchstart', handleTouchStart);
      renderer.domElement.removeEventListener('touchmove', handleTouchMove);
      renderer.domElement.removeEventListener('touchend', handleTouchEnd);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(mat => mat.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [themeColors, isExpanded]);

  // Fullscreen content rendered via portal to body
  const fullscreenContent = isAnimating ? createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        minHeight: '100vh',
        zIndex: 99998,
        background: '#ffffff',
        overflow: 'hidden',
        margin: 0,
        padding: 0
      }}
    >
      {/* 3D Canvas */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          background: '#ffffff',
          overflow: 'hidden'
        }}
      />

      {/* Cinematic letterbox bars */}
      <div className={`letterbox letterbox-top ${introComplete ? 'letterbox-hidden' : ''}`} />
      <div className={`letterbox letterbox-bottom ${introComplete ? 'letterbox-hidden' : ''}`} />

      {/* Title overlay */}
      <div className="solar-system-overlay">
        <div className={`solar-system-title ${showTitle ? 'title-visible' : ''}`}>
          <span className="title-light">Exploring the</span>
          <span className="title-bold">UNIVERSE</span>
        </div>
      </div>

      {/* Skip intro button */}
      {!introComplete && isExpanded && (
        <button
          className="skip-intro-btn"
          onClick={() => {
            skipIntroRef.current = true;
            setIntroComplete(true);
            setShowTitle(true);
          }}
        >
          Skip
        </button>
      )}

      {/* Exit button */}
      <button
        className="exit-fullscreen-btn"
        onClick={handleExitFullscreen}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
        </svg>
      </button>
    </div>,
    document.body
  ) : null;

  return (
    <div className="solar-system-container collapsed">
      {/* Fullscreen via portal */}
      {fullscreenContent}

      {/* Initial collapsed state - Explore button */}
      {!isAnimating && (
        <div className="solar-system-intro">
          <div className="intro-content">
            <div className="intro-text">
              <span className="intro-title">Explore My</span>
              <h1 className="intro-title-main">3D UNIVERSE</h1>
              <p className="intro-subtitle">An interactive journey through space</p>
              <button className="explore-btn" onClick={handleExpand}>
                <span className="btn-text">Launch Experience</span>
                <span className="btn-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </div>
            <div className="intro-icon earth-moon-system">
              <svg viewBox="0 0 200 200" className="earth-moon-icon">
                <defs>
                  <linearGradient id="earthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#802754" />
                    <stop offset="50%" stopColor="#63133b" />
                    <stop offset="100%" stopColor="#994D74" />
                  </linearGradient>
                  <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f8d7e6" />
                    <stop offset="50%" stopColor="#e8c4d4" />
                    <stop offset="100%" stopColor="#d4a8bc" />
                  </linearGradient>
                  <radialGradient id="earthShine" cx="30%" cy="30%" r="60%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="moonShine" cx="30%" cy="30%" r="60%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </radialGradient>
                  <filter id="earthGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="glow" />
                    <feMerge>
                      <feMergeNode in="glow" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Orbit ring */}
                <ellipse
                  cx="100"
                  cy="100"
                  rx="85"
                  ry="35"
                  fill="none"
                  stroke="#994D74"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                  strokeDasharray="8 4"
                  transform="rotate(-20 100 100)"
                  className="orbit-ring"
                />

                {/* Earth */}
                <circle cx="100" cy="100" r="40" fill="url(#earthGrad)" filter="url(#earthGlow)" className="earth" />
                <circle cx="100" cy="100" r="40" fill="url(#earthShine)" />

                {/* Moon on orbit */}
                <g className="moon-group">
                  <circle cx="180" cy="71" r="12" fill="url(#moonGrad)" className="moon" />
                  <circle cx="180" cy="71" r="12" fill="url(#moonShine)" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SolarSystem;
