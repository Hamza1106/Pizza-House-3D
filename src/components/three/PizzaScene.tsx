import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { PizzaModel } from './PizzaModel';

interface PizzaSceneProps {
  className?: string;
}

export function PizzaScene({ className }: PizzaSceneProps) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [dragRotation, setDragRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [slicePulled, setSlicePulled] = useState(0);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const rotVel = useRef({ x: 0, y: 0 });
  const targetSlice = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;
    const animate = () => {
      // inertia for drag rotation
      if (!dragging.current) {
        setDragRotation((prev) => ({
          x: prev.x + rotVel.current.x,
          y: prev.y + rotVel.current.y,
        }));
        rotVel.current.x *= 0.92;
        rotVel.current.y *= 0.92;

        // slice spring back when not dragging
        targetSlice.current *= 0.9;
        setSlicePulled((prev) => prev + (targetSlice.current - prev) * 0.1);
      }
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    setIsDragging(true);
    setAutoRotate(false);
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };

    // rotate
    rotVel.current.y = dx * 0.005;
    rotVel.current.x = dy * 0.003;
    setDragRotation((prev) => ({
      x: prev.x + dy * 0.003,
      y: prev.y + dx * 0.005,
    }));

    // dragging outward pulls the slice
    if (dx > 2) {
      targetSlice.current = Math.min(1, targetSlice.current + dx * 0.008);
      setSlicePulled((prev) => Math.min(1, prev + dx * 0.008));
    }
  };

  const onPointerUp = () => {
    dragging.current = false;
    setIsDragging(false);
  };

  const onDoubleClick = () => {
    // toggle slice pull on double click
    targetSlice.current = targetSlice.current > 0.5 ? 0 : 1;
    setSlicePulled(targetSlice.current);
  };

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full ${className ?? ''}`}
      style={{ touchAction: 'none' }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 3.5, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onDoubleClick={onDoubleClick}
      >
        <Suspense fallback={null}>
          {/* lighting */}
          <ambientLight intensity={0.35} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={2.2}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-far={20}
            shadow-camera-left={-8}
            shadow-camera-right={8}
            shadow-camera-top={8}
            shadow-camera-bottom={-8}
          />
          <pointLight position={[-5, 4, -3]} intensity={1.5} color="#ff4d00" />
          <pointLight position={[3, 2, 4]} intensity={1} color="#ffb100" />

          <PizzaModel autoRotate={autoRotate} dragRotation={dragRotation} isDragging={isDragging} slicePulled={slicePulled} />

          <ContactShadows
            position={[0, -1.6, 0]}
            opacity={0.5}
            scale={12}
            blur={2.8}
            far={4}
            color="#000000"
          />

          <Environment preset="sunset" />
        </Suspense>
      </Canvas>

      {/* hint overlay */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/40">
          {isDragging ? 'Dragging…' : 'Drag to rotate · Pull right for a slice'}
        </p>
      </div>
    </div>
  );
}
