import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// A single pepperoni disc
function Pepperoni({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <cylinderGeometry args={[0.42, 0.42, 0.08, 24]} />
      <meshStandardMaterial color="#9c2a14" roughness={0.7} metalness={0.05} />
    </mesh>
  );
}

// A basil leaf
function Basil({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <sphereGeometry args={[0.18, 12, 8]} />
      <meshStandardMaterial color="#2d6a3e" roughness={0.6} />
    </mesh>
  );
}

// Cheese blob for stretch effect
function CheeseBlob({ position, scale }: { position: [number, number, number]; scale: [number, number, number] }) {
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[0.15, 12, 12]} />
      <meshStandardMaterial color="#ffd45e" roughness={0.4} metalness={0.1} emissive="#ffaa00" emissiveIntensity={0.05} />
    </mesh>
  );
}

// Steam particle system
function SteamParticles() {
  const points = useRef<THREE.Points>(null);
  const count = 60;

  const { positions, velocities, lifetimes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const lifetimes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = Math.random() * 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = Math.random() * 0.03 + 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
      lifetimes[i] = Math.random();
    }
    return { positions, velocities, lifetimes };
  }, []);

  useFrame((_, delta) => {
    if (!points.current) return;
    const geom = points.current.geometry as THREE.BufferGeometry;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3];
      arr[i * 3 + 1] += velocities[i * 3 + 1];
      arr[i * 3 + 2] += velocities[i * 3 + 2];
      lifetimes[i] += delta * 0.3;
      if (lifetimes[i] > 1) {
        arr[i * 3] = (Math.random() - 0.5) * 4;
        arr[i * 3 + 1] = 0.2;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 4;
        lifetimes[i] = 0;
      }
    }
    posAttr.needsUpdate = true;
    if (points.current.material instanceof THREE.PointsMaterial) {
      const mat = points.current.material;
      // fade based on average lifetime
      mat.opacity = 0.5;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.18}
        color="#ffffff"
        transparent
        opacity={0.35}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

interface PizzaModelProps {
  autoRotate: boolean;
  dragRotation: { x: number; y: number };
  isDragging: boolean;
  slicePulled: number;
}

export function PizzaModel({ autoRotate, dragRotation, isDragging, slicePulled }: PizzaModelProps) {
  const group = useRef<THREE.Group>(null);
  const { mouse } = useThree();
  const targetRotY = useRef(0);
  const targetRotX = useRef(0.35);

  const pepperonis: [number, number, number][] = useMemo(() => [
    [1.1, 0.18, 0.3], [-0.9, 0.18, 0.7], [0.4, 0.18, -1.1], [-1.2, 0.18, -0.5],
    [0.2, 0.18, 1.2], [1.3, 0.18, -0.8], [-0.3, 0.18, -0.2], [0.8, 0.18, 0.9],
  ], []);

  const basils: { position: [number, number, number]; rotation: [number, number, number] }[] = useMemo(() => [
    { position: [0.6, 0.2, 0.5], rotation: [0.3, 0.5, 0.2] },
    { position: [-0.7, 0.2, -0.8], rotation: [0.2, 0.8, 0.4] },
    { position: [1.0, 0.2, -0.3], rotation: [0.5, 0.2, 0.6] },
  ], []);

  const cheeseBlobs: { position: [number, number, number]; scale: [number, number, number] }[] = useMemo(() => [
    { position: [0.5, 0.16, 0.4], scale: [1.5, 0.6, 1.5] },
    { position: [-0.6, 0.16, 0.6], scale: [1.2, 0.5, 1.2] },
    { position: [0.2, 0.16, -0.7], scale: [1.8, 0.7, 1.4] },
  ], []);

  useFrame((_, delta) => {
    if (!group.current) return;

    // mouse-based tilt
    targetRotX.current = 0.35 + mouse.y * 0.25;
    const mouseRotY = mouse.x * 0.5;

    if (autoRotate && !isDragging) {
      targetRotY.current += delta * 0.3;
    }

    group.current.rotation.x += (targetRotX.current - group.current.rotation.x) * 0.05;
    group.current.rotation.y += (targetRotY.current + mouseRotY + dragRotation.y - group.current.rotation.y) * 0.08;
    group.current.rotation.z += (dragRotation.x - group.current.rotation.z) * 0.08;
  });

  return (
    <group ref={group} position={[0, -0.3, 0]}>
      {/* pizza base (cylinder) */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[2.2, 2.2, 0.25, 64]} />
        <meshStandardMaterial color="#e8b87a" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* crust ring (torus) */}
      <mesh castShadow position={[0, 0.05, 0]}>
        <torusGeometry args={[2.1, 0.22, 16, 64]} />
        <meshStandardMaterial color="#c98a4a" roughness={0.9} />
      </mesh>

      {/* sauce layer */}
      <mesh position={[0, 0.14, 0]} receiveShadow>
        <cylinderGeometry args={[1.95, 1.95, 0.04, 64]} />
        <meshStandardMaterial color="#b82828" roughness={0.7} />
      </mesh>

      {/* cheese layer */}
      <mesh position={[0, 0.17, 0]} receiveShadow>
        <cylinderGeometry args={[1.9, 1.9, 0.06, 64]} />
        <meshStandardMaterial color="#ffd45e" roughness={0.45} metalness={0.1} emissive="#ffaa00" emissiveIntensity={0.08} />
      </mesh>

      {/* cheese blobs */}
      {cheeseBlobs.map((c, i) => (
        <CheeseBlob key={i} position={c.position} scale={c.scale} />
      ))}

      {/* pepperonis */}
      {pepperonis.map((p, i) => (
        <Pepperoni key={i} position={p} />
      ))}

      {/* basil */}
      {basils.map((b, i) => (
        <Basil key={i} position={b.position} rotation={b.rotation} />
      ))}

      {/* the draggable slice — pulled out based on slicePulled */}
      <group position={[slicePulled * 2.6, slicePulled * 0.4, 0]} rotation={[0, 0, 0]}>
        {/* slice base (wedge) */}
        <mesh castShadow position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.25, 3, 1, false, 0, Math.PI / 3]} />
          <meshStandardMaterial color="#e8b87a" roughness={0.85} />
        </mesh>
        {/* slice cheese */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.65, 0.65, 0.06, 3, 1, false, 0, Math.PI / 3]} />
          <meshStandardMaterial color="#ffd45e" roughness={0.45} emissive="#ffaa00" emissiveIntensity={0.08} />
        </mesh>
        {/* stretch cheese strands */}
        {slicePulled > 0.1 && (
          <>
            <mesh position={[-0.3, 0.3 * slicePulled, 0.1]}>
              <cylinderGeometry args={[0.04, 0.06, 0.6 * slicePulled, 8]} />
              <meshStandardMaterial color="#ffd45e" roughness={0.4} />
            </mesh>
            <mesh position={[0.2, 0.35 * slicePulled, -0.1]}>
              <cylinderGeometry args={[0.03, 0.05, 0.7 * slicePulled, 8]} />
              <meshStandardMaterial color="#ffd45e" roughness={0.4} />
            </mesh>
          </>
        )}
        {/* slice pepperoni */}
        <Pepperoni position={[0.2, 0.18, 0.1]} />
        <Pepperoni position={[-0.1, 0.18, -0.15]} />
      </group>

      {/* steam */}
      <group position={[0, 0.3, 0]}>
        <SteamParticles />
      </group>
    </group>
  );
}
