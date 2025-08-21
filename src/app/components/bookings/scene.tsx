'use client';

import React, { Suspense, useEffect, useRef } from 'react';
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

    return <primitive ref={modelRef} object={scene} scale={3} />;
}

function RoomViewer({ roomUrl }: RoomProps) {
    useEffect(() => {
        if (roomUrl) useGLTF.preload(roomUrl);
      }, [roomUrl]);
      
    return (
        <Canvas camera={{ fov: 34, position: [7.5, 2, 7.5] }}>
            <Suspense fallback={null}>
                <ambientLight intensity={1.5} />
                <directionalLight position={[10, 10, 5]} intensity={1.2} />
                <Scene roomUrl={roomUrl} />
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI / 2}
                    minAzimuthAngle={-Math.PI / 18}
                    maxAzimuthAngle={Math.PI / 2}
                />
            </Suspense>
        </Canvas>
    );
}

function SceneComponent({ roomUrl }: RoomProps) {
    return <RoomViewer roomUrl={roomUrl} />;
}

export default SceneComponent;
