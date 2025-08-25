'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Group } from 'three';
import Image from 'next/image';

interface RoomProps {
    roomUrl: string;
    roomIcon?: string;
}

function Scene({ roomUrl, onLoad }: { roomUrl: string; onLoad: () => void }) {
    const modelRef = useRef<Group>(null);
    const { scene } = useGLTF(roomUrl);

    useEffect(() => {
        if (scene) {
            onLoad();
        }
    }, [scene, onLoad]);

    return <primitive ref={modelRef} object={scene} scale={3} />;
}

function RoomViewer({ roomUrl, roomIcon }: RoomProps) {
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [isModelLoading, setIsModelLoading] = useState(true);

    useEffect(() => {
        if (roomUrl) {
            setIsModelLoading(true);
            setIsModelLoaded(false);
            useGLTF.preload(roomUrl);
        }
    }, [roomUrl]);

    const handleModelLoad = () => {
        setIsModelLoaded(true);
        setIsModelLoading(false);
    };
      
    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Show PNG image while 3D model is loading */}
            {isModelLoading && roomIcon && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'hsl(var(--card))',
                    borderRadius: 'var(--radius)',
                    zIndex: 1
                }}>
                    <Image
                        src={roomIcon}
                        alt="Room preview"
                        fill
                        style={{
                            objectFit: 'contain',
                            padding: '1rem'
                        }}
                        priority={false}
                    />
                </div>
            )}
            
            {/* 3D Canvas */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: isModelLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out'
            }}>
                <Canvas camera={{ fov: 34, position: [7.5, 1, 7.5] }}>
                    <Suspense fallback={null}>
                        <ambientLight intensity={1.5} />
                        <directionalLight position={[10, 10, 5]} intensity={1.2} />
                        <Scene roomUrl={roomUrl} onLoad={handleModelLoad} />
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
            </div>
        </div>
    );
}

function SceneComponent({ roomUrl, roomIcon }: RoomProps) {
    return <RoomViewer roomUrl={roomUrl} roomIcon={roomIcon} />;
}

export default SceneComponent;
