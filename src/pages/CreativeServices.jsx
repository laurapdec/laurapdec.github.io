import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, useTexture, Environment, Center, Bounds } from '@react-three/drei'
import Navbar from '../components/Navbar'
import { useTranslation } from 'react-i18next'
import * as THREE from 'three'

function Model({ url, materialType = 'standard', textureUrl, initialRotation, onLoad }) {
  const { scene } = useGLTF(url)
  const texture = useTexture(textureUrl || '')
  
  // Add frame update for material animation
  useFrame((state, delta) => {
    scene?.traverse((child) => {
      if (child.isMesh && child.material?.userData?.update) {
        child.material.userData.update(delta);
      }
    });
  });
  
  useEffect(() => {
    // Call onLoad when both scene and texture (if any) are ready
    if (scene && (!textureUrl || texture)) {
      onLoad?.();
    }
  }, [scene, texture, textureUrl, onLoad]);
  
  useEffect(() => {
    if (!texture) {
      return;
    }
    
    // Update texture properties without using deprecated features
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    
    // Ensure proper texture orientation without using flipY
    if (texture.transformation) {
      texture.transformation.makeRotationX(Math.PI);
    }
  }, [texture])

  useEffect(() => {
    if (!scene) return
    if (initialRotation) scene.rotation.set(...initialRotation)

    scene.traverse((child) => {
      if (!child.isMesh) return
      const m = child.material

      // Enhanced geometry processing for better normal mapping
      if (child.geometry) {
        // Clone geometry to avoid modifying shared data
        child.geometry = child.geometry.clone();
        
        // Ensure proper index buffer for normal computation
        if (!child.geometry.index) {
          child.geometry.index = THREE.BufferGeometryUtils.mergeVertices(child.geometry).index;
        }
        
        // Compute vertex normals with better precision
        child.geometry.computeVertexNormals();
        child.geometry.normalizeNormals();
        
        // Force attributes update
        child.geometry.attributes.normal.needsUpdate = true;
        if (child.geometry.attributes.uv) {
          child.geometry.attributes.uv.needsUpdate = true;
        }
      }

      // Ensure sRGB base color
      if (m?.map) m.map.colorSpace = THREE.SRGBColorSpace

      if (materialType === 'saturnV') {
        // Create material with procedural pattern
        const newMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          metalness: 0.1,
          roughness: 0.9,
          envMapIntensity: 0.3,
          side: THREE.DoubleSide,
          onBeforeCompile: (shader) => {
            shader.uniforms.time = { value: 0 };
            
            // Add varying for position only (normal is already available)
            shader.vertexShader = shader.vertexShader.replace(
              'void main() {',
              `
              varying vec3 vModelPos;
              void main() {
                vModelPos = position;
              `
            );
            
            // Add noise functions and pattern to fragment shader
            shader.fragmentShader = `
              uniform float time;
              varying vec3 vModelPos;
              // vNormal is already provided by MeshStandardMaterial
              
              // Improved noise function
              float hash(vec3 p) {
                p = fract(p * vec3(443.8975,397.2973, 491.1871));
                p += dot(p.xyz, p.yzx + 19.19);
                return fract(p.x * p.y * p.z);
              }
              
              ${shader.fragmentShader.replace(
                'vec4 diffuseColor = vec4( diffuse, opacity );',
                `
                  // Create multi-scale pattern with better contrast
                  vec3 p = vModelPos * 0.5; // Scale factor for pattern size
                  float n1 = hash(p * 20.0); // Base frequency
                  float n2 = hash(p * 40.0); // Detail frequency
                  float n3 = hash(p * 80.0); // Fine detail frequency
                  
                  // Combine noise with more pronounced effect
                  float pattern = mix(n1, n2, 0.6) + n3 * 0.3;
                  
                  // Use vNormal from Three.js MeshStandardMaterial
                  float normalEffect = dot(normalize(vNormal), vec3(0.0, 1.0, 0.0)) * 0.7 + 0.3;
                  pattern = mix(pattern, normalEffect, 0.5);
                  
                  // Create final color with more contrast
                  vec3 baseColor = vec3(0.85, 0.85, 0.87); // Lighter base
                  vec3 patternColor = vec3(0.65, 0.65, 0.67); // Darker pattern
                  vec3 color = mix(baseColor, patternColor, pattern);
                  
                  vec4 diffuseColor = vec4(color, opacity);
                `
              )}
            `;
            
            // Update time uniform
            newMaterial.userData.shader = shader;
          }
        });
        
        // Add update function to animate pattern
        newMaterial.userData.update = (delta) => {
          if (newMaterial.userData.shader) {
            newMaterial.userData.shader.uniforms.time.value += delta;
          }
        };
        
        child.material = newMaterial;
        child.material.needsUpdate = true;
        
        // Force geometry update if UV coordinates exist
        if (child.geometry) {
          if (child.geometry.attributes.uv) {
            child.geometry.attributes.uv.needsUpdate = true;
          }
          if (child.geometry.attributes.normal) {
            child.geometry.attributes.normal.needsUpdate = true;
          }
        }
      } else if (materialType === 'metal') {
        if (texture) {
          child.material = new THREE.MeshStandardMaterial({
            map: texture,
            metalness: 0.8,
            roughness: 0.55,
            envMapIntensity: 0.25,
          });
        }
      } else if (materialType === 'carbon') {
        if (texture) {
          child.material = new THREE.MeshPhysicalMaterial({
            map: texture,
            clearcoat: 1.0,
            clearcoatRoughness: 0.2,
            roughness: 0.5,
            envMapIntensity: 0.25,
          });
        }
      } else {
        // Handle default case or existing materials
        if (texture) {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = true;
          texture.needsUpdate = true;

          // Create new material with texture
          child.material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.6,
            metalness: 0.1,
            envMapIntensity: 0.25,
          });
          child.material.needsUpdate = true;
        } else if (child.material && child.material.isMeshStandardMaterial) {
          // Keep original, just tone it down
          child.material.roughness = Math.min(0.7, (child.material.roughness ?? 0.5) + 0.1);
          child.material.metalness = Math.max(0.6, (child.material.metalness ?? 0.8) - 0.1);
          child.material.envMapIntensity = 0.3;
          child.material.needsUpdate = true;
        }
      }
    })
  }, [scene, texture, materialType, initialRotation])

  return <primitive object={scene} />
}


function ControlsHelper() {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  return (
    <div
      className="absolute top-2 right-2 p-2 bg-black/20 backdrop-blur-sm rounded text-white/80 text-xs select-none pointer-events-none"
    >
      <div className="space-y-1">
        <div>
          <span className="font-medium">Rotate:</span> Click + Drag
        </div>
        <div>
          <span className="font-medium">Pan:</span> {isMac ? '⌥' : 'Alt'} + Drag
        </div>
        <div>
          <span className="font-medium">Zoom:</span> Scroll
        </div>
      </div>
    </div>
  );
}

function ModelViewer({ url, materialType, textureUrl, initialRotation }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const controlsRef = useRef();
  
  const handleCenterView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };
  
  return (
    <div 
      className="relative w-full h-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-zinc-50 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <Canvas
        dpr={[1, 2]}
        shadows
        camera={{ 
          position: [0, 5, 10],
          fov: 45,
          near: 0.1,
          far: 1000,
          up: [0, 1, 0]
        }}
        gl={{
          physicallyCorrectLights: true,
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.9,
        }}
        onCreated={({ scene, camera }) => {
          scene.background = null;
          // Set camera to final position and ensure it's looking at center
          camera.position.set(0, 5, 10);
          camera.lookAt(0, 0, 0);
          camera.updateProjectionMatrix();
        }}
      >
        {/* Improved environment lighting */}
        <Environment preset="studio" intensity={0.3} />

        {/* Enhanced lighting setup for better detail visibility */}
        <ambientLight intensity={0.2} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.8}
          castShadow
        />
        <directionalLight
          position={[-5, 5, -5]}
          intensity={0.4}
        />
        <pointLight position={[0, 10, 0]} intensity={0.3} />

        <Suspense fallback={null}>
          <Bounds fit clip observe damping={0.2} margin={1.2}>
            <Center>
              <Model
                url={url}
                materialType={materialType}
                textureUrl={textureUrl}
                initialRotation={initialRotation}
                onLoad={() => setIsLoading(false)}
              />
            </Center>
          </Bounds>
        </Suspense>

        {!isLoading && (
          <OrbitControls
            ref={controlsRef}
            makeDefault
            enableDamping
            dampingFactor={0.05}
            target={[0, 0, 0]}
            minDistance={2}
            maxDistance={20}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            rotateSpeed={0.5}
            maxPolarAngle={Math.PI * 0.8}
            minPolarAngle={Math.PI * 0.2}
            doubleClickZoomSpeed={1}
            zoomSpeed={0.5}
            // Start with the final position
            position={[0, 5, 10]}
          />
        )}
      </Canvas>
      {isHovered && <ControlsHelper />}
    </div>
  );
}

export default function CreativeServices() {
  const { t, i18n } = useTranslation();
  const contentRef = useRef(null);
  const [mediaCategories, setMediaCategories] = useState([]);
  const [showFullPoem, setShowFullPoem] = useState(false);
  const [poems, setPoems] = useState({});
  const [selectedPoem, setSelectedPoem] = useState(null);
  
  useEffect(() => {
    if (!i18n.isInitialized) return   // wait until translations loaded

    const loadPoems = async () => {
      const poemKeys = ['orlando', 'sonho', 'incapaz', 'amor']
      const loaded = {}
      for (const key of poemKeys) {
        const file = t(`creative.poem_${key}.file`, { defaultValue: '' })
        if (!file) continue                      // skip missing key
        try {
          const res = await fetch(file.startsWith('/')
            ? file
            : `/${file}`)                        // ensure absolute path
          if (!res.ok) throw new Error(res.statusText)
          loaded[key] = await res.text()
        } catch (e) {
          console.warn('Poem fetch failed:', key, file, e)
        }
      }
      setPoems(loaded)
    }
    loadPoems()
  }, [i18n.isInitialized, i18n.language, t])

  useEffect(() => {
    const folders = [
      { title: 'Photos', items: [
        'DSC00068.JPG',
        'DSC00092.JPG',
        'DSC00127.JPG',
        'DSC00304.JPG',
        'DSC00455.JPG',
        'DSC00581.JPG',
      ]},
      { title: '3D Designs', items: [
        'droney.glb',
        'F1.glb',
        'SaturnV.glb',
      ]},
      { title: 'Videos', items: [
        'video1.mp4',
        'video2.mp4',
      ]},
    ]
    setMediaCategories(folders)
  }, [])

  const [isMuted, setIsMuted] = useState(false)
  const videoRef = useRef(null)

  const handleVideoEnd = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!isMuted)
    }
  }

  useEffect(() => {
    if (!videoRef.current) return;
    
    // Try to play unmuted first
    videoRef.current.muted = false;
    const playPromise = videoRef.current.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Auto-play was prevented, try again with muted
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play();
          setIsMuted(true);
        }
      });
    }
  }, [])

  return (
    <div className="site-scroll">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="w-full max-w-6xl mx-auto px-6 py-16"
      >
        <div className="video-container w-full aspect-video relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            preload="auto"
            webkit-playsinline="true"
            className="w-full h-full"
            onEnded={handleVideoEnd}
            style={{ 
              objectFit: 'cover',
              objectPosition: 'center',
              background: '#f9f9fc'
            }}
          >
            <source src="/media/videos/alchemicprod.mp4" type="video/mp4" />
          </video>
          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          >
            {isMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </div>
      </motion.div>

      {/* Portfolio Content */}
      <div ref={contentRef}>
        {/* Gallery Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-6xl mx-auto px-6 py-16"
        >
          <h2 className="text-3xl font-bold mb-8">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaCategories[0]?.items.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative aspect-square group"
              >
                <img
                  src={`/media/photos/${photo}`}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 3D Animation & Motion Design */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-6xl mx-auto px-6 py-16 bg-zinc-50"
        >
          <h2 className="text-3xl font-bold mb-8">3D Animation & Motion Design</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { 
                name: "Droney", 
                model: "/media/3d-designs/droney.glb", 
                description: "Project, design and 3D modeling for autonomous drone project",
                materialType: "carbon",
                textureUrl: "/media/textures/carbon-fiber.png",
                cameraPosition: [100, -200, 10],
                initialRotation: [- Math.PI*1.01 / 2 , 0, 0]
              },
              { 
                name: "Saturn V", 
                model: "/media/3d-designs/SaturnV.glb", 
                description: "3D modeling of historic rocket assembly",
                materialType: "saturnV",
                textureUrl: "/media/textures/saturnV.png", // Make sure this file exists in public folder
                initialRotation: [-Math.PI / 2, 0, Math.PI / 2]
              },
              { 
                name: "F1 Engine", 
                model: "/media/3d-designs/F1.glb", 
                description: "3D modeling of F1 engine used in Saturn V",
                materialType: "metal",
                textureUrl: "/media/textures/metal.jpg",
                initialRotation: [0, 0, Math.PI / 2]
              }
            ].map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="aspect-video relative">
                  <div className="w-full h-full">
                    <ModelViewer 
                      url={project.model}
                      materialType={project.materialType}
                      textureUrl={project.textureUrl}
                      initialRotation={project.initialRotation}
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                  <p className="text-gray-600 text-sm">{project.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Content Creation & Writing */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-6xl mx-auto px-6 py-16"
        >
          <h2 className="text-3xl font-bold mb-8">Content Creation & Writing</h2>
          <div className="space-y-12">
            {/* Writing Gallery */}
            <div>
              <h2 className="text-2xl font-semibold mb-8">Additional Writing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[
                  {
                    title: "Screenplays",
                    description: "Original screenplays and script adaptations",
                    icon: "📝"
                  },
                  {
                    title: "Technical Writing",
                    description: "Documentation, research papers, and technical guides",
                    icon: "📊"
                  },
                  {
                    title: "Creative Writing",
                    description: "Short stories, creative non-fiction, and prose",
                    icon: "✍️"
                  },
                  {
                    title: "Get in Touch",
                    description: "Interested in my writing? Let's connect and discuss potential collaborations",
                    icon: "✉️",
                    isContact: true
                  }
                ].map((category, index) => (
                  <div
                    key={index}
                    className="transform transition-all duration-200 hover:scale-102"
                  >
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 hover:shadow-md transition-all h-full">
                      <div className="text-3xl mb-4">{category.icon}</div>
                      <h4 className="font-medium mb-2">{category.title}</h4>
                      <p className="text-gray-600 text-sm">{category.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Writing Gallery */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-8">Writing Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['orlando', 'sonho', 'incapaz', 'amor'].map((poem) => {
                  const isSelected = selectedPoem === poem;
                  return (
                    <div
                      key={poem}
                      className={`bg-white/60 backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-200 ${
                        isSelected ? 'shadow-lg ring-2 ring-blue-500/20' : 'hover:shadow-md'
                      }`}
                    >
                      <div className="p-6">
                        <button 
                          className="w-full flex items-center justify-between cursor-pointer"
                          onClick={() => setSelectedPoem(isSelected ? null : poem)}
                        >
                          <div className="text-left">
                            <h3 className="text-lg font-medium">
                              {t(`creative.poem_${poem}.title`)}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              {t(`creative.poem_${poem}.date`)}
                            </p>
                          </div>
                          <div className={`text-blue-500 transform transition-transform duration-200 ${isSelected ? 'rotate-180' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                            </svg>
                          </div>
                        </button>
                        
                        <div 
                          className={`mt-4 transition-all duration-200 ease-in-out overflow-hidden ${
                            isSelected ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="prose prose-sm max-w-none">
                            <p className="text-gray-600 whitespace-pre-line">
                              {poems[poem]}
                            </p>
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">About this piece</h4>
                            <p className="text-sm text-gray-600">
                              {t(`creative.poem_${poem}.context`)}
                            </p>
                          </div>
                        </div>

                        {!isSelected && (
                          <div className="mt-4">
                            <p className="text-gray-600 text-sm line-clamp-3">
                              {poems[poem]?.split('\n')[0]}...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}