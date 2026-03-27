'use client';

import { Float, useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { Group, Object3D } from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

type Props = {
  path: string;
  hovered: boolean;
  guiding: boolean;
  scale?: number;
  position?: [number, number, number];
};

function cloneScene(scene: Object3D) {
  return clone(scene);
}

export default function AssistantGLTFModel({
  path,
  hovered,
  guiding,
  scale = 1,
  position = [0, -0.58, 0],
}: Props) {
  const { scene, animations } = useGLTF(path);
  const instance = useMemo(() => cloneScene(scene), [scene]);
  const groupRef = useRef<Group>(null);
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    const firstAction = Object.values(actions)[0];
    if (!firstAction) return;

    firstAction.reset().fadeIn(0.35).play();
    return () => {
      firstAction.fadeOut(0.2);
    };
  }, [actions]);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const elapsed = state.clock.getElapsedTime();
    group.position.y = position[1] + Math.sin(elapsed * 2.2) * 0.06;
    group.rotation.y = Math.sin(elapsed * 0.9) * 0.18;
    group.rotation.z = hovered ? Math.sin(elapsed * 5.2) * 0.03 : 0;
    const targetScale = hovered ? scale * 1.06 : guiding ? scale * 1.03 : scale;
    const nextScale = group.scale.x + (targetScale - group.scale.x) * 0.14;
    group.scale.setScalar(nextScale);
  });

  return (
    <Float speed={2.2} rotationIntensity={0.14} floatIntensity={0.16}>
      <group ref={groupRef} position={position} scale={scale}>
        <primitive object={instance} />
      </group>
    </Float>
  );
}
