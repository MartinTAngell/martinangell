"use client"

import { useEffect, useRef } from "react";
import { Fn, instancedArray, instanceIndex, uniform, vec2, hash, vec3, float, color, smoothstep, uv, min, PI2, cos, sin } from "three/tsl";
import * as THREE from "three/webgpu";
import Nav from "./nav";

const NUM_PARTICLES = 50000;
const NUM_ARMS = 5;
const TWIST = 6.0;
const ARM_WIDTH = 0.08;

const INTRO_DURATION = 2.0;
const EDGE = 0.08;

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const aspectRatio = width / height;

    const renderer = new THREE.WebGPURenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    let onResize: (() => void) | null = null;

    (async () => {
      await renderer.init();
      if (disposed) return;

      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0);
      const camera = new THREE.OrthographicCamera(-aspectRatio, aspectRatio, 1, -1, 0.1, 10);
      camera.position.z = 1;

      const positions = instancedArray(NUM_PARTICLES, 'vec2');
      const bounds = uniform(new THREE.Vector2(aspectRatio, 1));

      const spawnParticles = Fn(() => {
        const i = instanceIndex;
        const p = positions.element(i);

        const arm = float(i.mod(NUM_ARMS));
        const t = hash(i);

        const center = vec2(bounds.x.mul(0.4), 0);

        const maxRadius = min(bounds.x.mul(0.5), bounds.y).mul(0.9);
        const radius = t.mul(maxRadius);

        const angle = arm.mul(PI2.div(NUM_ARMS)).add(t.mul(TWIST));

        const randomDisplacement = vec2(
          hash(i.add(NUM_PARTICLES)).sub(0.5),
          hash(i.add(NUM_PARTICLES * 2)).sub(0.5),
        ).mul(ARM_WIDTH).mul(t.mul(0.8).add(0.2));

        p.assign(center.add(vec2(cos(angle), sin(angle)).mul(radius).add(randomDisplacement)));
      })().compute(NUM_PARTICLES);

      const t = hash(instanceIndex);
      const progress = uniform(0);
      const reveal = float(1).sub(smoothstep(progress.sub(EDGE), progress, t));

      const material = new THREE.SpriteNodeMaterial({ transparent: true, depthWrite: false });
      material.positionNode = vec3(positions.element(instanceIndex), 0);
      material.scaleNode = float(0.008).mul(reveal);
      material.colorNode = color(0x66ccff);
      const distance = uv().sub(0.5).length();
      material.opacityNode = float(1).sub(smoothstep(0.35, 0.5, distance));

      const particles = new THREE.Sprite(material);
      particles.count = NUM_PARTICLES;
      particles.frustumCulled = false;
      scene.add(particles);

      renderer.compute(spawnParticles);

      onResize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        const a = w / h;
        camera.left = -a; camera.right = a;
        camera.updateProjectionMatrix();
        bounds.value.set(a, 1);
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      const start = performance.now();
      let introDone = false;

      renderer.setAnimationLoop(() => {
        if (!introDone) {
          const p = Math.min((performance.now() - start) / 1000 / INTRO_DURATION, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          progress.value = eased * (1 + EDGE);
          if (p >= 1) {
            introDone = true;
          }
        }
        renderer.render(scene, camera);
      });
    })();

    return () => {
      disposed = true;
      if (onResize) window.removeEventListener("resize", onResize);
      if (renderer) {
        renderer.setAnimationLoop(null);
        renderer.domElement.remove();
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
      <Nav />
    </div >
  )
}

export default Hero
