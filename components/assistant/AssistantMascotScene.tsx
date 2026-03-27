'use client';

import { Float } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import AssistantGLTFModel from './AssistantGLTFModel';

type Props = {
  hovered: boolean;
  guiding: boolean;
  variant: 'storefront' | 'admin';
};

const MODEL_PATHS = {
  storefront: '/models/assistant-storefront.glb',
  admin: '/models/assistant-admin.glb',
} as const;

function StorefrontMascot({ hovered, guiding }: Props) {
  const groupRef = useRef<Group>(null);
  const targetScale = useMemo(
    () => ({ value: hovered ? 1.08 : guiding ? 1.05 : 1 }),
    [guiding, hovered],
  );

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const elapsed = state.clock.getElapsedTime();
    group.position.y = Math.sin(elapsed * 2.1) * 0.08;
    group.rotation.y = Math.sin(elapsed * 1.2) * 0.18;
    group.rotation.z = hovered ? Math.sin(elapsed * 5) * 0.06 : Math.sin(elapsed) * 0.02;
    const nextScale = group.scale.x + (targetScale.value - group.scale.x) * 0.14;
    group.scale.setScalar(nextScale);
  });

  return (
    <Float speed={2.5} rotationIntensity={0.15} floatIntensity={0.2}>
      <group ref={groupRef} position={[0, -0.44, 0]}>
        <mesh position={[0.02, 0.52, -0.02]}>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial color="#5d314a" roughness={0.8} metalness={0.02} />
        </mesh>

        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.34, 32, 32]} />
          <meshStandardMaterial color="#ffd8d6" roughness={0.48} metalness={0.03} />
        </mesh>

        <mesh position={[-0.14, 0.62, 0.27]}>
          <sphereGeometry args={[0.036, 16, 16]} />
          <meshStandardMaterial color="#2d2330" />
        </mesh>
        <mesh position={[0.14, 0.62, 0.27]}>
          <sphereGeometry args={[0.036, 16, 16]} />
          <meshStandardMaterial color="#2d2330" />
        </mesh>

        <mesh position={[0, 0.46, 0.28]}>
          <torusGeometry args={[0.06, 0.014, 12, 24, Math.PI]} />
          <meshStandardMaterial color="#a95a7f" />
        </mesh>

        <mesh position={[0, -0.2, 0]} rotation={[0, 0, 0]}>
          <capsuleGeometry args={[0.32, 0.72, 10, 18]} />
          <meshStandardMaterial color="#8f2c5b" roughness={0.34} metalness={0.05} />
        </mesh>

        <mesh position={[0, -0.08, 0.28]}>
          <capsuleGeometry args={[0.18, 0.16, 6, 12]} />
          <meshStandardMaterial color="#f8f1f6" roughness={0.4} metalness={0.02} />
        </mesh>

        <mesh position={[-0.44, -0.14, 0.02]} rotation={[0, 0, hovered ? -0.74 : -0.38]}>
          <capsuleGeometry args={[0.055, 0.38, 8, 12]} />
          <meshStandardMaterial color="#d184a8" roughness={0.4} />
        </mesh>
        <mesh position={[0.44, -0.14, 0.02]} rotation={[0, 0, hovered ? 0.92 : 0.38]}>
          <capsuleGeometry args={[0.055, 0.38, 8, 12]} />
          <meshStandardMaterial color="#d184a8" roughness={0.4} />
        </mesh>

        <mesh position={[-0.14, -0.9, 0]} rotation={[0, 0, 0.07]}>
          <capsuleGeometry args={[0.06, 0.32, 8, 12]} />
          <meshStandardMaterial color="#70567f" roughness={0.35} />
        </mesh>
        <mesh position={[0.14, -0.9, 0]} rotation={[0, 0, -0.07]}>
          <capsuleGeometry args={[0.06, 0.32, 8, 12]} />
          <meshStandardMaterial color="#70567f" roughness={0.35} />
        </mesh>

        <mesh position={[0.28, 0.18, 0.12]} rotation={[0, 0, Math.PI / 9]}>
          <planeGeometry args={[0.18, 0.22]} />
          <meshStandardMaterial
            color={guiding ? '#ffe6ef' : '#f7eef4'}
            emissive={guiding ? '#d16f9a' : '#7a3655'}
            emissiveIntensity={guiding ? 0.38 : 0.08}
            roughness={0.2}
          />
        </mesh>

        <mesh position={[0, -1.15, -0.18]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.42, 32]} />
          <meshStandardMaterial color="#dca9c0" transparent opacity={0.22} />
        </mesh>
      </group>
    </Float>
  );
}

function AdminMascot({ hovered, guiding }: Props) {
  const groupRef = useRef<Group>(null);
  const targetScale = useMemo(
    () => ({ value: hovered ? 1.08 : guiding ? 1.05 : 1 }),
    [guiding, hovered],
  );

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const elapsed = state.clock.getElapsedTime();
    group.position.y = Math.sin(elapsed * 2.2) * 0.07;
    group.rotation.y = Math.sin(elapsed * 1.1) * 0.14;
    const nextScale = group.scale.x + (targetScale.value - group.scale.x) * 0.14;
    group.scale.setScalar(nextScale);
  });

  return (
    <Float speed={2.2} rotationIntensity={0.18} floatIntensity={0.18}>
      <group ref={groupRef} position={[0, -0.3, 0]}>
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[0.68, 0.58, 0.52]} />
          <meshStandardMaterial color="#dce6f6" roughness={0.22} metalness={0.45} />
        </mesh>
        <mesh position={[0, 0.3, 0.27]}>
          <boxGeometry args={[0.5, 0.18, 0.06]} />
          <meshStandardMaterial
            color="#84d6ff"
            emissive="#4aa6d6"
            emissiveIntensity={guiding ? 0.9 : 0.45}
            roughness={0.18}
            metalness={0.5}
          />
        </mesh>
        <mesh position={[0, -0.34, 0]}>
          <capsuleGeometry args={[0.26, 0.64, 8, 16]} />
          <meshStandardMaterial color="#394e73" roughness={0.26} metalness={0.55} />
        </mesh>
        <mesh position={[0, -0.1, 0.23]}>
          <boxGeometry args={[0.34, 0.2, 0.05]} />
          <meshStandardMaterial color="#9ad0ff" roughness={0.16} metalness={0.4} />
        </mesh>
        <mesh position={[-0.42, -0.2, 0]} rotation={[0, 0, hovered ? -0.7 : -0.35]}>
          <capsuleGeometry args={[0.05, 0.42, 8, 12]} />
          <meshStandardMaterial color="#6982ad" roughness={0.25} metalness={0.48} />
        </mesh>
        <mesh position={[0.42, -0.2, 0]} rotation={[0, 0, hovered ? 0.78 : 0.35]}>
          <capsuleGeometry args={[0.05, 0.42, 8, 12]} />
          <meshStandardMaterial color="#6982ad" roughness={0.25} metalness={0.48} />
        </mesh>
        <mesh position={[-0.16, -0.98, 0]} rotation={[0, 0, 0.08]}>
          <capsuleGeometry args={[0.06, 0.32, 8, 12]} />
          <meshStandardMaterial color="#2d3e60" roughness={0.28} metalness={0.46} />
        </mesh>
        <mesh position={[0.16, -0.98, 0]} rotation={[0, 0, -0.08]}>
          <capsuleGeometry args={[0.06, 0.32, 8, 12]} />
          <meshStandardMaterial color="#2d3e60" roughness={0.28} metalness={0.46} />
        </mesh>
        <mesh position={[0.3, 0.62, 0]} rotation={[0, 0, Math.PI / 4]}>
          <octahedronGeometry args={[0.12, 0]} />
          <meshStandardMaterial
            color="#dceeff"
            emissive="#7fd4ff"
            emissiveIntensity={guiding ? 0.8 : 0.34}
            roughness={0.2}
            metalness={0.4}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function AssistantMascotScene(props: Props) {
  const [hasModel, setHasModel] = useState(false);

  useEffect(() => {
    let active = true;
    const path = MODEL_PATHS[props.variant];

    fetch(path, { method: 'HEAD' })
      .then((response) => {
        if (active) {
          setHasModel(response.ok);
        }
      })
      .catch(() => {
        if (active) {
          setHasModel(false);
        }
      });

    return () => {
      active = false;
    };
  }, [props.variant]);

  return (
    <Canvas camera={{ position: [0, 0, 3.4], fov: 30 }} dpr={[1, 1.5]} gl={{ alpha: true }}>
      <ambientLight intensity={1.2} />
      <directionalLight
        position={[2.4, 3.2, 2]}
        intensity={1.5}
        color={props.variant === 'admin' ? '#eef6ff' : '#fff4fb'}
      />
      <pointLight
        position={[-2, 1.8, 2]}
        intensity={0.75}
        color={props.variant === 'admin' ? '#a2d8ff' : '#f5c2d9'}
      />
      <Suspense fallback={null}>
        {hasModel ? (
          <AssistantGLTFModel
            path={MODEL_PATHS[props.variant]}
            hovered={props.hovered}
            guiding={props.guiding}
            scale={props.variant === 'admin' ? 0.88 : 0.92}
            position={props.variant === 'admin' ? [0, -0.76, 0] : [0, -0.8, 0]}
          />
        ) : props.variant === 'admin' ? (
          <AdminMascot {...props} />
        ) : (
          <StorefrontMascot {...props} />
        )}
      </Suspense>
    </Canvas>
  );
}
