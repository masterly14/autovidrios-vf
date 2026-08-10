"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const GLASS_THICKNESS = 0.042;
const CYL_BEND = 0.22;
const CROSS_BEND = 0.07;
const REVEAL_DURATION = 3.2;

const BOUNDS = {
  minX: 0,
  maxX: 2.28,
  minY: -0.28,
  maxY: 1.52,
};

function easeOutExpo(t: number) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function softbox(
  envScene: THREE.Scene,
  w: number,
  h: number,
  x: number,
  y: number,
  z: number,
  ry: number,
  rx: number,
  color: number,
  intensity: number
) {
  const geo = new THREE.PlaneGeometry(w, h);
  const mat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
  mat.color.multiplyScalar(intensity);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, 0);
  envScene.add(mesh);
}

function createDoorGlassShape() {
  const shape = new THREE.Shape();
  shape.moveTo(0.12, 0.0);
  shape.lineTo(0.72, 0.0);
  shape.quadraticCurveTo(0.82, 0.0, 0.86, -0.04);
  shape.lineTo(0.92, -0.22);
  shape.quadraticCurveTo(0.95, -0.28, 1.02, -0.28);
  shape.lineTo(1.48, -0.28);
  shape.quadraticCurveTo(1.55, -0.28, 1.58, -0.22);
  shape.lineTo(1.64, -0.04);
  shape.quadraticCurveTo(1.68, 0.0, 1.78, 0.0);
  shape.lineTo(2.16, 0.0);
  shape.quadraticCurveTo(2.28, 0.0, 2.28, 0.12);
  shape.lineTo(2.12, 1.38);
  shape.quadraticCurveTo(2.1, 1.5, 1.96, 1.52);
  shape.quadraticCurveTo(1.2, 1.58, 0.52, 1.42);
  shape.quadraticCurveTo(0.28, 1.34, 0.14, 1.18);
  shape.lineTo(0.0, 0.22);
  shape.quadraticCurveTo(0.0, 0.0, 0.12, 0.0);

  const holeR = 0.055;
  const holeY = -0.14;
  for (const hx of [1.12, 1.38]) {
    const hole = new THREE.Path();
    hole.absarc(hx, holeY, holeR, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }
  return shape;
}

function applyAutomotiveCurve(geo: THREE.BufferGeometry) {
  const pos = geo.attributes.position;
  const { minX, maxX, minY, maxY } = BOUNDS;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const halfW = (maxX - minX) / 2;
  const halfH = (maxY - minY) / 2;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const nx = (x - cx) / halfW;
    const ny = (y - cy) / halfH;
    const cyl = CYL_BEND * (1 - nx * nx);
    const cross = CROSS_BEND * (1 - ny * ny) * (1 - Math.abs(nx) * 0.35);
    const temper =
      0.004 *
      Math.sin(nx * 9.2 + ny * 3.1) *
      Math.cos(ny * 7.4 - nx * 2.2);
    pos.setXYZ(i, x, y, z + cyl + cross + temper);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
}

function buildGlassNormalMap(size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const img = ctx.createImageData(size, size);
  const heightAt = (x: number, y: number) =>
    Math.sin(x * 0.014 + y * 0.02) * 0.55 +
    Math.sin(x * 0.028 - y * 0.011) * 0.3 +
    Math.sin((x + y) * 0.008) * 0.4 +
    Math.sin(x * 0.06) * 0.12;
  const eps = 1.2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nxp = (heightAt(x - eps, y) - heightAt(x + eps, y)) * 0.65;
      const nyp = (heightAt(x, y - eps) - heightAt(x, y + eps)) * 0.65;
      const nzp = 8.5;
      const len = Math.sqrt(nxp * nxp + nyp * nyp + nzp * nzp);
      const idx = (y * size + x) * 4;
      img.data[idx] = ((nxp / len) * 0.5 + 0.5) * 255;
      img.data[idx + 1] = ((nyp / len) * 0.5 + 0.5) * 255;
      img.data[idx + 2] = ((nzp / len) * 0.5 + 0.5) * 255;
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

function buildSafetyBugTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  ctx.clearRect(0, 0, 512, 512);
  ctx.fillStyle = "rgba(12, 18, 22, 0.85)";
  ctx.font = "700 34px Arial";
  ctx.textAlign = "left";
  ctx.fillText("WCG", 48, 120);
  ctx.font = "600 22px Arial";
  ctx.fillText("TEMPERED", 48, 168);
  ctx.font = "500 18px Arial";
  ctx.fillStyle = "rgba(12, 18, 22, 0.72)";
  ctx.fillText("AS2  ·  DOT-214", 48, 210);
  ctx.fillText("LAMINATED SAFETY", 48, 248);
  ctx.fillText("MADE FOR OEM", 48, 286);
  ctx.beginPath();
  ctx.arc(280, 140, 36, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(12, 18, 22, 0.75)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.font = "700 16px Arial";
  ctx.textAlign = "center";
  ctx.fillText("V&F", 280, 146);
  return canvas;
}

type GlassCanvasProps = {
  onRevealComplete?: () => void;
};

export default function GlassCanvas({ onRevealComplete }: GlassCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onRevealComplete);
  onCompleteRef.current = onRevealComplete;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(obj: T) => {
      disposables.push(obj);
      return obj;
    };

    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      32,
      wrap.clientWidth / wrap.clientHeight,
      0.1,
      100
    );
    camera.position.set(0.15, 0.05, reduceMotion ? 5.6 : 9.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    renderer.setClearColor(0x000000, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = reduceMotion ? 1.08 : 0.15;
    wrap.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x000000);
    softbox(envScene, 8, 12, -7, 1.5, 1, Math.PI / 3, 0, 0x8ec8ff, 2.6);
    softbox(envScene, 5, 8, 7.5, 0, -1.5, -Math.PI / 2.4, 0, 0xffffff, 1.8);
    softbox(envScene, 14, 4, 0, 9, 0, 0, Math.PI / 2.2, 0xf5f9ff, 1.5);
    softbox(envScene, 10, 3, 0, -7, 2, 0, -Math.PI / 2.4, 0x1a3a5c, 0.85);
    softbox(envScene, 6, 6, 0, 1, -8, 0, 0, 0xd0e6ff, 1.2);
    softbox(envScene, 3, 10, 2, 2, 7, Math.PI, 0, 0xffffff, 0.7);
    softbox(envScene, 4, 5, -3, 0, 6, Math.PI * 0.85, 0, 0x4aa3ff, 0.9);

    const envMap = track(pmrem.fromScene(envScene, 0.04).texture);
    scene.environment = envMap;
    scene.environmentIntensity = 1.35;
    pmrem.dispose();

    scene.add(new THREE.AmbientLight(0x1a2a3a, 0.35));
    const key = new THREE.DirectionalLight(0xe8f4ff, 1.7);
    key.position.set(-3.5, 4.5, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x7eb8ff, 0.55);
    fill.position.set(4, 1, 2);
    scene.add(fill);
    const rim = new THREE.PointLight(0xa8d4ff, 1.5, 24);
    rim.position.set(4.5, -0.5, -3.5);
    scene.add(rim);
    const edgeCatch = new THREE.SpotLight(0xffffff, 2.4, 18, 0.45, 0.55);
    edgeCatch.position.set(-1, 3.5, 4);
    edgeCatch.target.position.set(0, 0.2, 0);
    scene.add(edgeCatch);
    scene.add(edgeCatch.target);

    const group = new THREE.Group();
    scene.add(group);
    const glassGroup = new THREE.Group();

    const glassGeo = track(
      new THREE.ExtrudeGeometry(createDoorGlassShape(), {
        depth: GLASS_THICKNESS,
        bevelEnabled: true,
        bevelThickness: 0.012,
        bevelSize: 0.01,
        bevelSegments: 5,
        curveSegments: 48,
      })
    );
    applyAutomotiveCurve(glassGeo);

    const glassNormalTex = track(
      new THREE.CanvasTexture(buildGlassNormalMap(512))
    );
    glassNormalTex.wrapS = glassNormalTex.wrapT = THREE.RepeatWrapping;
    glassNormalTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const glassFaceMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xf2f7ff,
        metalness: 0,
        roughness: 0.015,
        transmission: 1,
        thickness: 1.05,
        ior: 1.52,
        clearcoat: 1,
        clearcoatRoughness: 0.025,
        attenuationColor: new THREE.Color(0xb8d4f0),
        attenuationDistance: 1.2,
        normalMap: glassNormalTex,
        normalScale: new THREE.Vector2(0.14, 0.14),
        envMapIntensity: 2.35,
        transparent: true,
        opacity: 1,
      })
    );

    const glassEdgeMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xc8dff5,
        metalness: 0,
        roughness: 0.18,
        transmission: 0.62,
        thickness: 0.32,
        ior: 1.52,
        clearcoat: 0.9,
        clearcoatRoughness: 0.1,
        attenuationColor: new THREE.Color(0x6a9fd4),
        attenuationDistance: 0.22,
        envMapIntensity: 1.25,
        transparent: true,
        opacity: 0.97,
      })
    );

    glassGroup.add(new THREE.Mesh(glassGeo, [glassFaceMat, glassEdgeMat]));

    const bugTex = track(new THREE.CanvasTexture(buildSafetyBugTexture()));
    const bugMat = track(
      new THREE.MeshBasicMaterial({
        map: bugTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.88,
      })
    );
    const bugMesh = new THREE.Mesh(
      track(new THREE.PlaneGeometry(0.38, 0.38)),
      bugMat
    );
    const bugX = 1.95;
    const bugY = 0.22;
    const nxBug =
      (bugX - (BOUNDS.minX + BOUNDS.maxX) / 2) /
      ((BOUNDS.maxX - BOUNDS.minX) / 2);
    const nyBug =
      (bugY - (BOUNDS.minY + BOUNDS.maxY) / 2) /
      ((BOUNDS.maxY - BOUNDS.minY) / 2);
    bugMesh.position.set(
      bugX,
      bugY,
      GLASS_THICKNESS +
        0.006 +
        CYL_BEND * (1 - nxBug * nxBug) +
        CROSS_BEND * (1 - nyBug * nyBug) * (1 - Math.abs(nxBug) * 0.35)
    );
    glassGroup.add(bugMesh);

    const cx = (BOUNDS.minX + BOUNDS.maxX) / 2;
    const cy = (BOUNDS.minY + BOUNDS.maxY) / 2;
    glassGroup.position.set(-cx, -cy, -GLASS_THICKNESS / 2);
    group.add(glassGroup);

    const shCanvas = document.createElement("canvas");
    shCanvas.width = shCanvas.height = 512;
    const sctx = shCanvas.getContext("2d");
    if (sctx) {
      const g = sctx.createRadialGradient(256, 280, 20, 256, 280, 240);
      g.addColorStop(0, "rgba(8, 16, 32, 0.55)");
      g.addColorStop(0.35, "rgba(20, 40, 70, 0.2)");
      g.addColorStop(1, "rgba(0, 0, 0, 0)");
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, 512, 512);
    }
    const shTex = track(new THREE.CanvasTexture(shCanvas));
    const shMat = track(
      new THREE.MeshBasicMaterial({
        map: shTex,
        transparent: true,
        depthWrite: false,
      })
    );
    const shMesh = new THREE.Mesh(
      track(new THREE.PlaneGeometry(3.1, 1.55)),
      shMat
    );
    shMesh.rotation.x = -Math.PI / 2;
    shMesh.position.set(0.05, -(cy - BOUNDS.minY) - 0.02, 0.05);
    group.add(shMesh);

    const FINAL_ROT_Y = -0.72;
    const FINAL_ROT_X = 0.18;
    const isTouch =
      window.matchMedia?.("(hover: none), (pointer: coarse)").matches ??
      "ontouchstart" in window;
    // En móvil el giro debe notarse siempre; en desktop un poco más lento
    const AUTO_SPIN = isTouch ? 0.0048 : 0.0032;

    let baseRotY = FINAL_ROT_Y;
    let dragOffsetY = 0;
    let dragOffsetX = 0;
    let currentRotY = reduceMotion ? FINAL_ROT_Y : -2.45;
    let currentRotX = reduceMotion ? FINAL_ROT_X : 0.55;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let mouseNX = 0;
    let mouseNY = 0;
    let scrollT = 0;
    let revealDone = reduceMotion;
    let completedFired = false;
    let resumeSpinTimer: number | null = null;

    if (reduceMotion) {
      group.scale.setScalar(1);
      group.position.y = 0;
      group.rotation.set(FINAL_ROT_X, FINAL_ROT_Y, 0.04);
      queueMicrotask(() => onCompleteRef.current?.());
      completedFired = true;
    } else {
      group.scale.setScalar(0.28);
      group.position.y = -1.35;
      group.rotation.set(0.55, -2.45, 0.12);
    }

    const onDown = (x: number, y: number) => {
      if (!revealDone) return;
      dragging = true;
      if (resumeSpinTimer !== null) {
        window.clearTimeout(resumeSpinTimer);
        resumeSpinTimer = null;
      }
      lastX = x;
      lastY = y;
    };
    const onMove = (x: number, y: number) => {
      if (!dragging) {
        if (!isTouch) {
          mouseNX = (x / window.innerWidth) * 2 - 1;
          mouseNY = (y / window.innerHeight) * 2 - 1;
        }
        return;
      }
      dragOffsetY += (x - lastX) * 0.006;
      dragOffsetX += (y - lastY) * 0.004;
      dragOffsetX = Math.max(-0.55, Math.min(0.55, dragOffsetX));
      lastX = x;
      lastY = y;
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!revealDone) return;
      renderer.domElement.style.cursor = "grabbing";
      onDown(e.clientX, e.clientY);
    };
    const onPointerMove = (e: PointerEvent) => onMove(e.clientX, e.clientY);
    const onPointerUp = () => {
      renderer.domElement.style.cursor = revealDone ? "grab" : "default";
      dragging = false;
      // En móvil, vuelve al giro automático tras soltar
      if (resumeSpinTimer !== null) window.clearTimeout(resumeSpinTimer);
      resumeSpinTimer = window.setTimeout(() => {
        // Integra el arrastre al giro base y suaviza el offset
        baseRotY += dragOffsetY;
        dragOffsetY = 0;
        dragOffsetX *= 0.35;
        resumeSpinTimer = null;
      }, isTouch ? 120 : 400);
    };
    const onWheel = (e: WheelEvent) => {
      if (!revealDone) return;
      scrollT = Math.max(0, Math.min(1, scrollT + e.deltaY * 0.0006));
    };
    const onResize = () => {
      camera.aspect = wrap.clientWidth / wrap.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    };

    renderer.domElement.style.cursor = "default";
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    const animate = () => {
      if (disposed) return;
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (!revealDone) {
        const raw = Math.min(1, elapsed / REVEAL_DURATION);
        const e = easeOutExpo(raw);
        const spin = easeInOutCubic(raw);

        group.scale.setScalar(0.28 + e * 0.72);
        group.position.y = -1.35 * (1 - e);
        currentRotY = -2.45 + spin * (FINAL_ROT_Y + 2.45);
        currentRotX = 0.55 + spin * (FINAL_ROT_X - 0.55);
        group.rotation.z = 0.12 * (1 - e) + 0.04 * e;
        camera.position.z = 9.2 - e * 3.6;
        renderer.toneMappingExposure = 0.15 + e * 0.93;

        group.rotation.y = currentRotY;
        group.rotation.x = currentRotX;

        if (raw >= 1) {
          revealDone = true;
          baseRotY = FINAL_ROT_Y;
          currentRotY = FINAL_ROT_Y;
          currentRotX = FINAL_ROT_X;
          renderer.domElement.style.cursor = "grab";
          if (!completedFired) {
            completedFired = true;
            onCompleteRef.current?.();
          }
        }
      } else {
        // Giro continuo obligatorio (también en móvil)
        if (!dragging) {
          baseRotY += AUTO_SPIN;
        }

        const targetY =
          baseRotY + dragOffsetY + (isTouch ? 0 : mouseNX * 0.1);
        const targetX =
          FINAL_ROT_X +
          dragOffsetX +
          Math.sin(elapsed * 0.35) * 0.045 +
          (isTouch ? 0 : -mouseNY * 0.06);

        currentRotY += (targetY - currentRotY) * 0.08;
        currentRotX += (targetX - currentRotX) * 0.08;

        group.rotation.y = currentRotY;
        group.rotation.x = currentRotX;
        group.rotation.z = 0.04 + Math.sin(elapsed * 0.18) * 0.015;
        const s = 1 - scrollT * 0.22;
        group.scale.setScalar(s);
        camera.position.z = 5.6 + scrollT * 1.4;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      disposed = true;
      if (resumeSpinTimer !== null) window.clearTimeout(resumeSpinTimer);
      cancelAnimationFrame(frameId);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === wrap) {
        wrap.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={wrapRef} className="absolute inset-0" aria-hidden />;
}
