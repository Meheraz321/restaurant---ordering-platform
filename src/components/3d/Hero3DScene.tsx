import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Compass, Eye, RotateCw } from 'lucide-react';

interface Hero3DSceneProps {
  onExploreClick?: () => void;
}

export const Hero3DScene: React.FC<Hero3DSceneProps> = ({ onExploreClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteractive, setIsInteractive] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch (e) {
      setWebglSupported(false);
      return;
    }

    let animationFrameId: number;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 550;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 3.6, 6.2);
    camera.lookAt(0, 0.2, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Group for the entire table arrangement
    const tableGroup = new THREE.Group();
    scene.add(tableGroup);

    // 1. Dining Table Surface (Dark Slate / Walnut finish)
    const tableGeo = new THREE.CylinderGeometry(4.2, 4.2, 0.15, 64);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x141210,
      roughness: 0.7,
      metalness: 0.1,
    });
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.position.y = -0.08;
    tableMesh.receiveShadow = true;
    tableGroup.add(tableMesh);

    // Subtle table runner / place mat (woven dark charcoal)
    const matGeo = new THREE.CylinderGeometry(2.3, 2.3, 0.02, 64);
    const matMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e1b18,
      roughness: 0.9,
    });
    const placeMat = new THREE.Mesh(matGeo, matMaterial);
    placeMat.position.y = 0.01;
    placeMat.receiveShadow = true;
    tableGroup.add(placeMat);

    // 2. Ceramic Porcelain Plate with Gold Leaf Gilded Rim
    const plateGroup = new THREE.Group();
    plateGroup.position.set(0, 0.02, 0);

    // Outer Plate Base
    const plateGeo = new THREE.CylinderGeometry(1.5, 1.1, 0.12, 64);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x181716, // Matte Obsidian Ceramic
      roughness: 0.3,
      metalness: 0.15,
    });
    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    plateMesh.castShadow = true;
    plateMesh.receiveShadow = true;
    plateGroup.add(plateMesh);

    // Inner Plate Well
    const innerWellGeo = new THREE.CylinderGeometry(1.25, 1.05, 0.04, 64);
    const innerWellMat = new THREE.MeshStandardMaterial({
      color: 0x0f0e0d,
      roughness: 0.25,
      metalness: 0.05,
    });
    const innerWell = new THREE.Mesh(innerWellGeo, innerWellMat);
    innerWell.position.y = 0.06;
    plateGroup.add(innerWell);

    // Gold Rim Ring
    const goldRimGeo = new THREE.TorusGeometry(1.48, 0.035, 16, 64);
    const goldRimMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Amber Gold
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0xb45309,
      emissiveIntensity: 0.25,
    });
    const goldRim = new THREE.Mesh(goldRimGeo, goldRimMat);
    goldRim.rotation.x = Math.PI / 2;
    goldRim.position.y = 0.065;
    plateGroup.add(goldRim);

    // 3. Signature Dish (Gourmet Pan-Seared Wagyu Medallion)
    const steakGeo = new THREE.CylinderGeometry(0.55, 0.6, 0.32, 32);
    const steakMat = new THREE.MeshStandardMaterial({
      color: 0x3d1c14, // Charred crusted beef
      roughness: 0.6,
      metalness: 0.1,
    });
    const steakMesh = new THREE.Mesh(steakGeo, steakMat);
    steakMesh.position.set(-0.05, 0.22, 0.05);
    steakMesh.castShadow = true;
    steakMesh.receiveShadow = true;
    plateGroup.add(steakMesh);

    // Truffle Compound Butter Medallion on top of steak
    const butterGeo = new THREE.CylinderGeometry(0.2, 0.22, 0.08, 24);
    const butterMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.4,
      metalness: 0.05,
    });
    const butterMesh = new THREE.Mesh(butterGeo, butterMat);
    butterMesh.position.set(-0.05, 0.4, 0.05);
    butterMesh.castShadow = true;
    plateGroup.add(butterMesh);

    // Micro herbs & Rosemary sprig
    const herbGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const leafGeo = new THREE.BoxGeometry(0.04, 0.015, 0.16);
      const leafMat = new THREE.MeshStandardMaterial({
        color: 0x3f6212, // Fresh garden thyme / rosemary green
        roughness: 0.5,
      });
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set(
        -0.05 + (Math.random() - 0.5) * 0.25,
        0.45 + i * 0.015,
        0.05 + (Math.random() - 0.5) * 0.25
      );
      leaf.rotation.set(Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.5);
      herbGroup.add(leaf);
    }
    plateGroup.add(herbGroup);

    // Roasted Cherry Tomatoes on the side
    const tomatoGeo = new THREE.SphereGeometry(0.13, 24, 24);
    const tomatoMat = new THREE.MeshStandardMaterial({
      color: 0xbe123c, // Rich heirloom red
      roughness: 0.25,
      metalness: 0.1,
    });
    const tomato1 = new THREE.Mesh(tomatoGeo, tomatoMat);
    tomato1.position.set(0.55, 0.18, -0.15);
    tomato1.scale.set(1, 0.85, 1);
    tomato1.castShadow = true;
    plateGroup.add(tomato1);

    const tomato2 = new THREE.Mesh(tomatoGeo, tomatoMat);
    tomato2.position.set(0.68, 0.18, 0.05);
    tomato2.scale.set(0.85, 0.75, 0.85);
    tomato2.castShadow = true;
    plateGroup.add(tomato2);

    // Balsamic / Truffle Glaze Drops on the plate
    for (let i = 0; i < 7; i++) {
      const dropGeo = new THREE.SphereGeometry(0.04 + Math.random() * 0.02, 16, 16);
      const dropMat = new THREE.MeshStandardMaterial({
        color: 0x18100c,
        roughness: 0.1,
        metalness: 0.3,
      });
      const drop = new THREE.Mesh(dropGeo, dropMat);
      const angle = (i / 7) * Math.PI * 1.6 + 0.3;
      drop.position.set(Math.cos(angle) * 0.88, 0.08, Math.sin(angle) * 0.88);
      drop.scale.set(1, 0.3, 1);
      plateGroup.add(drop);
    }

    tableGroup.add(plateGroup);

    // 4. Polished Silver Cutlery
    const cutleryMat = new THREE.MeshStandardMaterial({
      color: 0xe4e4e7,
      metalness: 0.95,
      roughness: 0.1,
    });

    // Fork (Left)
    const forkGroup = new THREE.Group();
    forkGroup.position.set(-1.85, 0.05, 0.1);
    const forkHandleGeo = new THREE.BoxGeometry(0.09, 0.03, 1.5);
    const forkHandle = new THREE.Mesh(forkHandleGeo, cutleryMat);
    forkHandle.castShadow = true;
    forkGroup.add(forkHandle);

    for (let t = -2; t <= 2; t++) {
      const tineGeo = new THREE.BoxGeometry(0.018, 0.02, 0.45);
      const tine = new THREE.Mesh(tineGeo, cutleryMat);
      tine.position.set(t * 0.028, 0.02, -0.9);
      forkGroup.add(tine);
    }
    tableGroup.add(forkGroup);

    // Knife (Right)
    const knifeGroup = new THREE.Group();
    knifeGroup.position.set(1.85, 0.05, 0.1);
    const knifeHandleGeo = new THREE.BoxGeometry(0.09, 0.03, 1.4);
    const knifeHandle = new THREE.Mesh(knifeHandleGeo, cutleryMat);
    knifeHandle.castShadow = true;
    knifeGroup.add(knifeHandle);

    const bladeGeo = new THREE.BoxGeometry(0.025, 0.07, 0.65);
    const blade = new THREE.Mesh(bladeGeo, cutleryMat);
    blade.position.set(-0.02, 0.02, -0.85);
    blade.castShadow = true;
    knifeGroup.add(blade);
    tableGroup.add(knifeGroup);

    // 5. Crystal Wine Glass (Top Right)
    const glassGroup = new THREE.Group();
    glassGroup.position.set(1.65, 0.05, -1.25);

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 0.85,
      transparent: true,
      roughness: 0.05,
      ior: 1.5,
      thickness: 0.5,
    });

    // Glass Base
    const glassBaseGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.03, 32);
    const glassBase = new THREE.Mesh(glassBaseGeo, glassMat);
    glassGroup.add(glassBase);

    // Stem
    const glassStemGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.85, 16);
    const glassStem = new THREE.Mesh(glassStemGeo, glassMat);
    glassStem.position.y = 0.44;
    glassGroup.add(glassStem);

    // Bowl
    const glassBowlGeo = new THREE.SphereGeometry(0.42, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.68);
    const glassBowl = new THREE.Mesh(glassBowlGeo, glassMat);
    glassBowl.rotation.x = Math.PI;
    glassBowl.position.y = 1.25;
    glassGroup.add(glassBowl);

    // Wine Liquid inside glass (Deep Bordeaux Cabernet)
    const wineGeo = new THREE.SphereGeometry(0.35, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.45);
    const wineMat = new THREE.MeshStandardMaterial({
      color: 0x581c87, // Deep Pinot / Cabernet
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.85,
    });
    const wine = new THREE.Mesh(wineGeo, wineMat);
    wine.rotation.x = Math.PI;
    wine.position.y = 1.08;
    glassGroup.add(wine);

    tableGroup.add(glassGroup);

    // 6. Floating Aromatic Ember Particles & Spices
    const particleCount = 45;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.2 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      particlePositions[i * 3] = Math.cos(theta) * radius;
      particlePositions[i * 3 + 1] = 0.3 + Math.random() * 2.2;
      particlePositions[i * 3 + 2] = Math.sin(theta) * radius;

      particleScales[i] = 0.02 + Math.random() * 0.04;
      particleSpeeds[i] = 0.003 + Math.random() * 0.008;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xf59e0b, // Warm Amber Ember
      size: 0.06,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 7. Cinematic Studio Lighting
    // Ambient Light (deep moody base)
    const ambientLight = new THREE.AmbientLight(0xffedd5, 0.65);
    scene.add(ambientLight);

    // Warm Key Spotlight focused on plate
    const spotLight = new THREE.SpotLight(0xffedd5, 4.5);
    spotLight.position.set(2, 6, 3);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.5;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    scene.add(spotLight);

    // Amber Rim / Hearth Light from behind
    const hearthLight = new THREE.PointLight(0xf97316, 3.2, 8);
    hearthLight.position.set(-3, 2.5, -2);
    scene.add(hearthLight);

    // Candle fill light
    const candleLight = new THREE.PointLight(0xfbbf24, 1.8, 5);
    candleLight.position.set(1.5, 1.8, 1.5);
    scene.add(candleLight);

    // Interactive mouse / tilt tracking
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (!isDragging) {
        targetRotationY = x * 0.35;
        targetRotationX = y * 0.2;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      setIsInteractive(true);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleDragMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);

    // Resize Observer for responsive canvas
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle auto-spin if not actively dragging
      if (!isDragging) {
        tableGroup.rotation.y += (targetRotationY + Math.sin(elapsedTime * 0.4) * 0.15 - tableGroup.rotation.y) * 0.05;
        tableGroup.rotation.x += (targetRotationX + Math.cos(elapsedTime * 0.3) * 0.08 - tableGroup.rotation.x) * 0.05;
      } else {
        tableGroup.rotation.y += (targetRotationY - tableGroup.rotation.y) * 0.1;
        tableGroup.rotation.x += (targetRotationX - tableGroup.rotation.x) * 0.1;
      }

      // Constrain tilt angle
      tableGroup.rotation.x = Math.max(-0.4, Math.min(0.5, tableGroup.rotation.x));

      // Floating particles motion
      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleSpeeds[i];
        if (positions[i * 3 + 1] > 2.8) {
          positions[i * 3 + 1] = 0.2;
        }
      }
      particleGeometry.attributes.position.needsUpdate = true;
      particles.rotation.y = elapsedTime * 0.05;

      // Candle flicker
      candleLight.intensity = 1.6 + Math.sin(elapsedTime * 6) * 0.2 + Math.cos(elapsedTime * 11) * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      resizeObserver.disconnect();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[480px] md:h-[580px] lg:h-[640px] flex items-center justify-center select-none overflow-hidden">
      {/* Three.js Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
        title="Interactive 3D Table - Click and Drag to Rotate"
      />

      {/* Fallback visual if WebGL is disabled or on ultra low spec */}
      {!webglSupported && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center bg-stone-900/60 rounded-2xl border border-amber-500/20">
          <img
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
            alt="Ember & Spice Signature Steak"
            className="w-80 h-80 object-cover rounded-full shadow-2xl border-4 border-amber-600/40"
          />
        </div>
      )}

      {/* 3D Scene Controls & Floating Badge */}
      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-20 flex items-center gap-2 bg-stone-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/20 text-xs text-amber-200 shadow-xl pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span className="font-medium tracking-wide">Interactive 3D Plate Experience</span>
        <span className="hidden sm:inline text-stone-400">• Drag to rotate 360°</span>
      </div>

      {/* Quick Dish Overlay Badge */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20 hidden sm:flex items-center gap-3 bg-stone-950/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-amber-500/30 text-left shadow-2xl">
        <div className="w-10 h-10 rounded-lg overflow-hidden border border-amber-500/30 flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80"
            alt="A5 Wagyu"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Chef's Masterwork</div>
          <div className="text-xs font-semibold text-stone-100">A5 Miyazaki Wagyu Ribeye</div>
          <div className="text-xs font-bold text-amber-300">$68.00</div>
        </div>
      </div>
    </div>
  );
};
