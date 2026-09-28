"use client"

import { useEffect, useRef } from "react";
import { Fn, instancedArray, instanceIndex, uniform, vec2, hash, vec3, float, color, smoothstep, uv, min, PI2, cos, sin } from "three/tsl";
import * as THREE from "three/webgpu";
import Nav from "./nav";
import { Instrument_Serif, Inter } from "next/font/google";

const QUOTE_DELAY = 2;
const QUOTE_STAGGER = 0.5;

const NUM_PARTICLES = 50000;
const NUM_ARMS = 5;
const TWIST = 6.0;
const ARM_WIDTH = 0.08;
const SPAWN_TIME = 6.0;
const SPAWN_DURATION = 2.0;
const EDGE = 0.08;

const instrument_serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"]
});

const inter = Inter({
  weight: "400",
  subsets: ["latin"]
})

const quoteElements = ["Through design.", "Composition.", "Balance.", "Light.", "And harmony."];

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mountTime = performance.now();
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

        const center = vec2(bounds.x.mul(0.2), 0);

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
      material.colorNode = color(0x0EA5E9);
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

      let introDone = false;

      renderer.setAnimationLoop(() => {
        if (!introDone) {
          const elapsed = (performance.now() - mountTime) / 1000 - SPAWN_TIME;
          const p = Math.min(Math.max(elapsed / SPAWN_DURATION, 0), 1);
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
      <div style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        display: "flex",
        flexDirection: "column"
      }}>
        <Nav />
        <div style={{
          width: "min(36rem, 42vw)",
          marginLeft: "4vw",
          paddingTop: "7rem"
        }}>
          <p style={{
            fontSize: "clamp(3.5rem, 4.25vw, 4.5rem)",
            lineHeight: "1",
            letterSpacing: "-0.015em",
            animationDelay: `0.4s`
          }} className={`${instrument_serif.className} fade-in`}>
            The challenge: <br />
            <span
              className="fade-in"
              style={{ color: "#0EA5E9", animationDelay: "1.2s" }}>
              bring order<br />to the whole.</span></p>
          <div style={{
            marginTop: "1rem",
            fontSize: "0.95rem",
            lineHeight: "1.65",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
            className={inter.className}>
            {quoteElements.map((text, i) => (
              <p key={i}
                className="fade-in"
                style={{ animationDelay: `${QUOTE_DELAY + i * QUOTE_STAGGER}s` }}>{text}</p>
            ))}
          </div>
          <p style={{
            marginTop: "0.5rem",
            fontSize: "1rem",
            lineHeight: "1.35",
            animationDelay: "5s"
          }}
            className={`${instrument_serif.className} fade-in`}>— Stephen Sondheim, <br /> <i>Sunday in the Park with George</i></p>
        </div>
      </div>
    </div >
  )
}

export default Hero
