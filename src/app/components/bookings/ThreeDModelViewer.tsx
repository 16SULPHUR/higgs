// 'use client';

// import React, { useRef, useEffect, useState } from 'react';
// import { Users, MapPin } from 'lucide-react';
// import * as THREE from 'three';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// // --- 3D Model Viewer Component ---
// // This component is responsible for rendering the 3D model.
// // It sets up a Three.js scene and loads a model.
// const ThreeDModelViewer = ({ modelUrl }) => {
//     const mountRef = useRef(null);

//     useEffect(() => {
//         if (!mountRef.current) return;

//         // Scene setup
//         const scene = new THREE.Scene();
//         scene.background = new THREE.Color(0xf1f5f9); // A light gray background

//         // Camera setup
//         const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
//         camera.position.z = 5;

//         // Renderer setup
//         const renderer = new THREE.WebGLRenderer({ antialias: true });
//         renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
//         mountRef.current.appendChild(renderer.domElement);
        
//         // Lighting
//         const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//         scene.add(ambientLight);
//         const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//         directionalLight.position.set(5, 10, 7.5);
//         scene.add(directionalLight);

//         // Controls
//         const controls = new OrbitControls(camera, renderer.domElement);
//         controls.enableDamping = true;  
//         controls.dampingFactor = 0.05;
//         controls.screenSpacePanning = false;
//         controls.minDistance = 2;
//         controls.maxDistance = 10;
         
//         const geometry = new THREE.TorusKnotGeometry(1.5, 0.5, 100, 16);
//         const material = new THREE.MeshStandardMaterial({ color: 0x60a5fa, metalness: 0.5, roughness: 0.5 });
//         const torusKnot = new THREE.Mesh(geometry, material);
//         scene.add(torusKnot);
        
        
//         // --- OBJ Loader Logic (Commented Out) ---
//         // Uncomment this block and comment out the "Placeholder Geometry" block above
//         // to load your own .obj file.
//         // IMPORTANT: The modelUrl must be accessible via CORS.
//         const loader = new OBJLoader();
//         loader.load(
//             modelUrl,
//             (object) => {
//                 // Center the object and scale it to fit the scene
//                 const box = new THREE.Box3().setFromObject(object);
//                 const center = box.getCenter(new THREE.Vector3());
//                 object.position.sub(center); // center the model
//                 scene.add(object);
//             },
//             (xhr) => {
//                 console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//             },
//             (error) => {
//                 console.error('An error happened while loading the model:', error);
//                 // Fallback to placeholder if model fails to load
//                 const fallbackGeometry = new THREE.BoxGeometry(2, 2, 2);
//                 const fallbackMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
//                 const fallbackCube = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
//                 scene.add(fallbackCube);
//             }
//         );
        

//         // Animation loop
//         const animate = () => {
//             requestAnimationFrame(animate);
//             controls.update();
//             // Optional: add rotation to the object
//             if (torusKnot) {
//                  torusKnot.rotation.y += 0.005;
//             }
//             renderer.render(scene, camera);
//         };
//         animate();

//         // Handle resize
//         const handleResize = () => {
//             if (mountRef.current) {
//                 const width = mountRef.current.clientWidth;
//                 const height = mountRef.current.clientHeight;
//                 camera.aspect = width / height;
//                 camera.updateProjectionMatrix();
//                 renderer.setSize(width, height);
//             }
//         };
//         window.addEventListener('resize', handleResize);

//         // Cleanup on component unmount
//         return () => {
//             window.removeEventListener('resize', handleResize);
//             if(mountRef.current) {
//                 mountRef.current.removeChild(renderer.domElement);
//             }
//         };
//     }, [modelUrl]);

//     return <div ref={mountRef} className="w-full h-full rounded-t-lg md:rounded-l-lg md:rounded-t-none" />;
// };


// // --- Updated Room Type Result Card ---
// // This is your original component, now using Tailwind CSS for styling
// // and incorporating the new ThreeDModelViewer.
// function RoomTypeResultCard({ roomType, searchCriteria }) {
//     const isReschedule = !!searchCriteria.rescheduleBookingId;

//     const params = new URLSearchParams({
//         date: searchCriteria.date,
//         startTime: searchCriteria.startTime,
//         endTime: searchCriteria.endTime,
//     });

//     let confirmationUrl;

//     if (isReschedule) {
//         params.set('originalBookingId', searchCriteria.rescheduleBookingId);
//         params.set('newTypeOfRoomId', roomType.id);
//         confirmationUrl = `/dashboard/reschedule/confirm`;
//     } else {
//         params.set('typeOfRoomId', roomType.id);
//         confirmationUrl = `/dashboard/book`;
//     }

//     const finalUrl = `${confirmationUrl}?${params.toString()}`;

//     return (
//         <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row max-w-2xl mx-auto my-4 border border-gray-200">
//             {/* 3D Model Viewer Wrapper */}
//             <div className="w-full md:w-1/3 h-48 md:h-auto">
//                 <ThreeDModelViewer modelUrl={roomType.room_icon} />
//             </div>

//             {/* Content Wrapper */}
//             <div className="p-4 flex flex-col justify-between flex-grow w-full md:w-2/3">
//                 {/* Info Section */}
//                 <div>
//                     <h3 className="text-xl font-bold text-gray-800">{roomType.name}</h3>
//                     <p className="text-sm text-gray-500 flex items-center mt-1">
//                         <MapPin size={14} className="mr-1" /> {roomType.location_name}
//                     </p>
//                     <div className="mt-3 bg-blue-100 text-blue-800 text-sm font-medium inline-flex items-center px-2.5 py-1 rounded-full">
//                         <Users size={16} className="mr-1.5" />
//                         <span>Up to {roomType.capacity} People</span>
//                     </div>
//                 </div>

//                 {/* Pricing and Actions */}
//                 <div className="flex items-end justify-between mt-4">
//                     <div className="text-right">
//                         <span className="text-2xl font-bold text-gray-900">{roomType.credits_per_booking}</span>
//                         <span className="text-sm text-gray-500 ml-1">credits/slot</span>
//                     </div>
                    
//                     <a href={finalUrl} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-transform transform hover:scale-105">
//                         {isReschedule ? 'Select' : 'See Availability'}
//                     </a>
//                 </div>
//             </div>
//         </div>
//     );
// }


// // --- Main App Component for Demonstration ---
// export default function App() {
//     // Mock data to make the component runnable
//     const mockRoomType = {
//         id: 'room-type-123',
//         name: 'Synergy Pod',
//         location_name: 'Innovation Hub, 3rd Floor',
//         capacity: 6,
//         credits_per_booking: 25,
//         // This URL should point to your .obj file.
//         // Since finding a reliable, CORS-enabled .obj URL is tricky,
//         // the viewer uses a placeholder shape by default.
//         room_icon: 'path/to/your/model.obj',
//     };

//     const mockSearchCriteria = {
//         date: '2025-08-15',
//         startTime: '14:00',
//         endTime: '15:00',
//         // rescheduleBookingId: 'booking-abc-456' // Uncomment to test reschedule flow
//     };

//     return (
//         <div className="bg-slate-50 min-h-screen p-4 sm:p-8 font-sans">
//              <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold text-gray-800">Find a Room</h1>
//                 <p className="text-gray-600">Select a room type to see availability.</p>
//             </div>
//             <RoomTypeResultCard roomType={mockRoomType} searchCriteria={mockSearchCriteria} />
//         </div>
//     );
// }
