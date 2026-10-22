"use client"

import { useEffect, useRef, useState } from "react";
import { Fn, instanceIndex, uniform, vec2, hash, vec3, float, color, smoothstep, uv, PI2, cos, sin } from "three/tsl";
import * as THREE from "three/webgpu";

const QUOTE_DELAY = 1.2;
const QUOTE_STAGGER = 0.15;

const NUM_PARTICLES = 50000;
const NUM_ARMS = 5;
const TWIST = 6.0;
const ARM_WIDTH = 0.08;
const SPAWN_TIME = 0.3;
const SPAWN_DURATION = 2.0;
const EDGE = 0.08;

const quoteElements = ["Through design.", "Composition.", "Balance.", "Light.", "And harmony."];

const FULL_RADIUS = 0.85;

const galaxyLayout = (a: number) => a >= 1
  ? { x: a * 0.3, y: 0, radius: Math.min(a * 0.5, 1) * FULL_RADIUS }
  : { x: 0, y: 0.55, radius: Math.min(a * 0.7, 0.3) };

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mountTime = performance.now();
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let disposed = false;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const aspectRatio = width / height;

    const renderer = new THREE.WebGPURenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    let onResize: (() => void) | null = null;

    (async () => {
      try {
        await renderer.init();
      } catch {
        if (!disposed) setFailed(true);
        return;
      }
      if (disposed) return;

      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0);
      const camera = new THREE.OrthographicCamera(-aspectRatio, aspectRatio, 1, -1, 0.1, 10);
      camera.position.z = 1;

      const layout = galaxyLayout(aspectRatio);
      const center = uniform(new THREE.Vector2(layout.x, layout.y));
      const maxRadius = uniform(layout.radius);
      const scale = uniform(layout.radius / FULL_RADIUS);

      const galaxyPosition = Fn(() => {
        const i = instanceIndex;

        const arm = float(i.mod(NUM_ARMS));
        const t = hash(i);

        const radius = t.mul(maxRadius);
        const angle = arm.mul(PI2.div(NUM_ARMS)).add(t.mul(TWIST));

        const randomDisplacement = vec2(
          hash(i.add(NUM_PARTICLES)).sub(0.5),
          hash(i.add(NUM_PARTICLES * 2)).sub(0.5),
        ).mul(ARM_WIDTH).mul(scale).mul(t.mul(0.8).add(0.2));

        return center.add(vec2(cos(angle), sin(angle)).mul(radius).add(randomDisplacement));
      });

      const t = hash(instanceIndex);
      const progress = uniform(reducedMotion ? 1 + EDGE : 0);
      const reveal = float(1).sub(smoothstep(progress.sub(EDGE), progress, t));

      const material = new THREE.SpriteNodeMaterial({ transparent: true, depthWrite: false });
      material.positionNode = vec3(galaxyPosition(), 0);
      material.scaleNode = float(0.008).mul(scale).mul(reveal);
      material.colorNode = color(0x0EA5E9);
      const distance = uv().sub(0.5).length();
      material.opacityNode = float(1).sub(smoothstep(0.35, 0.5, distance));

      const particles = new THREE.Sprite(material);
      particles.count = NUM_PARTICLES;
      particles.frustumCulled = false;
      scene.add(particles);


      onResize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        const a = w / h;
        camera.left = -a;
        camera.right = a;
        camera.updateProjectionMatrix();
        const next = galaxyLayout(a);
        center.value.set(next.x, next.y);
        maxRadius.value = next.radius;
        scale.value = next.radius / FULL_RADIUS;
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      let introDone = reducedMotion;

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
    <div className="relative w-full min-h-svh overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />
      {failed && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(14,165,233,0.25),transparent_45%)]" />
      )}
      <div className="relative flex min-h-svh flex-col">
        <main className="flex flex-1 flex-col px-[4vw] pt-20 pb-12 portrait:justify-end landscape:justify-center landscape:max-w-[min(40rem,40vw)]">
          <h1 className="fade-in font-serif text-6xl md:text-7xl leading-none tracking-tight" style={{ animationDelay: "0.1s" }}>
            Martin Angell
          </h1>
          <p className="fade-in mt-5 text-lg md:text-xl leading-relaxed text-fg/90" style={{ animationDelay: "0.3s" }}>
            Undergraduate computer graphics researcher driven by making virtual worlds that realistically mirror ours.
          </p>
          <p className="fade-in mt-3 text-sm text-accent-text" style={{ animationDelay: "0.45s" }}>
            Computer Science and Mathematics at NYU Courant, Class of 2027
          </p>
          <div className="fade-in mt-7 flex flex-wrap gap-3" style={{ animationDelay: "0.6s" }}>
            <a href="/about" className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-bg transition hover:bg-accent-soft">
              About me
            </a>
            <a href="/resume" target="_blank" rel="noopener noreferrer" className="rounded-full border border-fg/30 px-5 py-2.5 text-sm font-medium transition hover:border-fg">
              Resume
            </a>
          </div>

          <figure className="mt-12 border-l border-dg pl-5">
            <blockquote>
              <p className="fade-in font-serif text-2xl leading-tight" style={{ animationDelay: `${QUOTE_DELAY}s` }}>
                The challenge: <span className="italic text-accent">bring order to the whole.</span>
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-accent-text">
                {quoteElements.map((text, i) => (
                  <span key={i}
                    className="fade-in inline-block mr-2"
                    style={{ animationDelay: `${QUOTE_DELAY + 0.2 + i * QUOTE_STAGGER}s` }}>{text}</span>
                ))}
              </p>
            </blockquote>
            <figcaption className="fade-in mt-2 font-serif text-sm text-accent-text" style={{ animationDelay: `${QUOTE_DELAY + 1.1}s` }}>
              Stephen Sondheim, <i>Sunday in the Park with George</i>
            </figcaption>
          </figure>
        </main>
      </div >
    </div>
  )
}

export default Hero
