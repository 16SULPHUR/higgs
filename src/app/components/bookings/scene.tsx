'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Group } from 'three';

interface RoomProps {
    roomUrl: string;
}

function Scene({ roomUrl }: RoomProps) {
    const modelRef = useRef<Group>(null);
    const { scene } = useGLTF(roomUrl);

    // useFrame(() => {
    //     if (modelRef.current) {
    //         modelRef.current.rotation.y += 0.005;
    //     }
    // });

    return <primitive ref={modelRef} object={scene} scale={2.2} />;
}

function RoomViewer({ roomUrl }: RoomProps) {
    return (
        <Canvas camera={{ fov: 34, position: [7.5, 2, 7.5] }}>
            <Suspense fallback={null}>
                <ambientLight intensity={1.5} />
                <directionalLight position={[10, 10, 5]} intensity={1.2} />
                <Scene roomUrl={roomUrl} />
                <OrbitControls
                    enableZoom={true}
                    minPolarAngle={Math.PI / 3.5}
                    maxPolarAngle={Math.PI / 2}
                    minAzimuthAngle={-Math.PI / 12}
                    maxAzimuthAngle={Math.PI / 1.8}
                />
            </Suspense>
        </Canvas>
    );
}

function SceneComponent({ roomUrl }: RoomProps) {
    return <RoomViewer roomUrl={roomUrl} />;
}

export default SceneComponent;
