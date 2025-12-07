import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

// Define R3F components as explicit any-typed variables
const Mesh = 'mesh' as any;
const SphereGeometry = 'sphereGeometry' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const Group = 'group' as any;
const AmbientLight = 'ambientLight' as any;
const PointLight = 'pointLight' as any;

// --- Types & Exports ---

export type Segment = 'Dad' | 'Kid' | 'Teen' | 'Family';

export interface DataPoint {
  id: number;
  segment: Segment;
  color: string;
  randomPos: THREE.Vector3;
  clusterPos: THREE.Vector3;
  label: string;
  type: 'TV' | 'Movie';
  episode?: string;
  stats: {
      timestamp: string;
      device: string;
      duration: string;
      completion: number;
  };
  aiAnalysis: {
      relatedTags: string[];
      bestTime: string;
      matchReason: string;
  }
}

export const SEGMENT_CONFIG: Record<Segment, { color: string; center: [number, number, number]; label: string }> = {
  Dad: { color: '#38BDF8', center: [-3, 2, 0], label: 'Dad (Solo)' },     // Sky Blue
  Kid: { color: '#FACC15', center: [3, 2, 0], label: 'Co-Viewing' },       // Bright Yellow
  Teen: { color: '#C084FC', center: [-3, -2, 0], label: 'Teen' },          // Bright Purple
  Family: { color: '#FB7185', center: [3, -2, 0], label: 'Date Night' }    // Bright Rose/Red
};

const MOCK_POOLS = {
  Dad: ["The Expanse", "Foundation", "Interstellar", "Dune", "Blade Runner 2049", "The Martian", "Cosmos", "Apollo 11"],
  Kid: ["Bluey", "PAW Patrol", "Peppa Pig", "SpongeBob", "Pokemon", "Minions", "Frozen", "Encanto"],
  Teen: ["Stranger Things", "Wednesday", "Euphoria", "Riverdale", "The Vampire Diaries", "Outer Banks", "Sex Education"],
  Family: ["The Notebook", "Love Actually", "Notting Hill", "About Time", "La La Land", "The Proposal"]
};

// --- Helper: Generate 50 Points (Exported) ---
export const generateData = (): DataPoint[] => {
  const points: DataPoint[] = [];
  const segments: Segment[] = ['Dad', 'Kid', 'Teen', 'Family'];
  
  // Weighted distribution
  const distribution = [25, 12, 8, 5];
  
  const devices = ["Living Room TV", "Bedroom iPad", "Kitchen Hub", "Mobile"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  let idCounter = 0;
  distribution.forEach((count, idx) => {
    const seg = segments[idx];
    if (!seg || !SEGMENT_CONFIG[seg]) return;

    const config = SEGMENT_CONFIG[seg];
    const pool = MOCK_POOLS[seg];
    
    for (let i = 0; i < count; i++) {
      // Random Chaos Position
      const rTheta = Math.random() * 2 * Math.PI;
      const rPhi = Math.acos(2 * Math.random() - 1);
      const rRadius = 4 + Math.random() * 4;
      const rx = rRadius * Math.sin(rPhi) * Math.cos(rTheta);
      const ry = rRadius * Math.sin(rPhi) * Math.sin(rTheta);
      const rz = rRadius * Math.cos(rPhi);

      // Clustered Position
      const cx = config.center[0] + (Math.random() - 0.5) * 2;
      const cy = config.center[1] + (Math.random() - 0.5) * 2;
      const cz = config.center[2] + (Math.random() - 0.5) * 2;

      // Content Logic
      const title = pool[Math.floor(Math.random() * pool.length)];
      
      // Determine Type (Simple heuristic based on pool knowledge, or random for this POC)
      // Family pool is mostly Movies in our mock. Others are TV mixes.
      let type: 'TV' | 'Movie' = 'TV';
      if (seg === 'Family' || title === 'Interstellar' || title === 'Dune' || title === 'The Martian' || title === 'Frozen' || title === 'Encanto' || title === 'Minions') {
          type = 'Movie';
      }

      let episode = undefined;
      if (type === 'TV') {
          episode = `Ep ${Math.floor(Math.random() * 8) + 1}`;
      }

      // Metadata Generation
      let relatedTags: string[] = [];
      let bestTime = "";
      let matchReason = "";

      if (seg === 'Family') { // Date Night Logic
        relatedTags = ["Date Night", "Romance Lovers", "Feelings"];
        bestTime = "Fri 6-10pm, Sat 6-10pm";
        matchReason = "Shared Profile Affinity";
      } else if (seg === 'Dad') {
        relatedTags = ["Hard Sci-Fi", "Physics", "Dystopian"];
        bestTime = "Weekdays 8pm-11pm";
        matchReason = "History: 50% Watch Time";
      } else if (seg === 'Kid') {
        relatedTags = ["Early Learning", "Cartoons", "Music"];
        bestTime = "Daily 6am-9am, Sat 8am-12pm";
        matchReason = "Device: Kitchen Hub";
      } else if (seg === 'Teen') {
        relatedTags = ["Coming of Age", "Drama", "Trending"];
        bestTime = "Daily 4pm-7pm, Late Night";
        matchReason = "Content Maturity Match";
      }

      points.push({
        id: idCounter++,
        segment: seg,
        color: config.color,
        randomPos: new THREE.Vector3(rx, ry, rz),
        clusterPos: new THREE.Vector3(cx, cy, cz),
        label: title,
        type,
        episode,
        stats: {
            timestamp: `${days[Math.floor(Math.random() * days.length)]} ${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')} PM`,
            device: devices[Math.floor(Math.random() * devices.length)],
            duration: type === 'Movie' ? `${Math.floor(Math.random() * 30) + 90} min` : `${Math.floor(Math.random() * 20) + 20} min`,
            completion: Math.floor(Math.random() * 40) + 60
        },
        aiAnalysis: {
            relatedTags,
            bestTime,
            matchReason
        }
      });
    }
  });

  return points;
};

// --- Component: Single Particle ---
const Particle = ({ 
    data, 
    mode, 
    isSelected,
    onSelect 
}: { 
    data: DataPoint, 
    mode: 'random' | 'cluster',
    isSelected: boolean,
    onSelect: (d: DataPoint) => void 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  // Animate position
  useFrame((state, delta) => {
    if (meshRef.current) {
      const target = mode === 'random' ? data.randomPos : data.clusterPos;
      meshRef.current.position.lerp(target, 0.1);
      
      const targetScale = isSelected ? 2.0 : (hovered ? 1.5 : 1.0);
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    
    if (textRef.current) {
        textRef.current.position.copy(meshRef.current!.position);
        textRef.current.position.y += (isSelected ? 0.6 : 0.4); 
        textRef.current.lookAt(state.camera.position);
    }
  });

  return (
    <>
      <Mesh 
        ref={meshRef}
        onClick={(e: any) => {
            e.stopPropagation();
            onSelect(data);
        }}
        onPointerOver={() => {
            setHovered(true);
            document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
        }}
      >
        <SphereGeometry args={[0.2, 16, 16]} />
        <MeshStandardMaterial 
            color={isSelected ? '#FFFFFF' : data.color} 
            emissive={data.color}
            emissiveIntensity={isSelected ? 2.0 : (hovered ? 1.0 : 0.6)}
            roughness={0.2} 
            metalness={0.1} 
        />
      </Mesh>
      
      {mode === 'cluster' && (
        <Group ref={textRef} scale={[0,0,0]}> 
            <Text
              color="white"
              fontSize={isSelected ? 0.4 : 0.25}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.02}
              outlineColor="#000000"
            >
              {data.label}
            </Text>
        </Group>
      )}
    </>
  );
};

// --- Component: Cluster Labels ---
const GroupLabels = ({ visible }: { visible: boolean }) => {
    if (!visible) return null;
    return (
        <>
            {Object.entries(SEGMENT_CONFIG).map(([key, config]) => (
                <Float key={key} speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
                    <Text
                        position={[config.center[0], config.center[1] + 2, config.center[2]]}
                        color={config.color}
                        fontSize={0.6}
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.05}
                        outlineColor="#000000"
                    >
                        {config.label}
                    </Text>
                </Float>
            ))}
        </>
    );
};

interface DataClusterSceneProps {
    data: DataPoint[];
    mode: 'random' | 'cluster';
    setMode: (m: 'random' | 'cluster') => void;
    selectedPoint: DataPoint | null;
    onSelectPoint: (p: DataPoint | null) => void;
}

// --- Main Scene Component ---
export const DataClusterScene = ({ data, mode, setMode, selectedPoint, onSelectPoint }: DataClusterSceneProps) => {
  return (
    <div className="w-full h-[600px] bg-slate-900 rounded-2xl overflow-hidden relative border border-slate-700 shadow-2xl">
      
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 12], fov: 50 }} onClick={() => onSelectPoint(null)}>
        <AmbientLight intensity={2.0} /> 
        <PointLight position={[10, 10, 10]} intensity={3} />
        <PointLight position={[-10, -10, -10]} intensity={2} />
        
        <Group>
            {data.map((point) => (
            <Particle 
                key={point.id} 
                data={point} 
                mode={mode} 
                isSelected={selectedPoint?.id === point.id}
                onSelect={onSelectPoint} 
            />
            ))}
        </Group>

        <GroupLabels visible={mode === 'cluster'} />
        <OrbitControls enableZoom={false} autoRotate={mode === 'random' && !selectedPoint} autoRotateSpeed={0.5} />
      </Canvas>

      {/* Control Switcher */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-in fade-in duration-500">
        <div className="flex bg-slate-900/90 backdrop-blur rounded-full p-1 border border-slate-600 shadow-xl">
            <button 
                onClick={(e) => { e.stopPropagation(); setMode('random'); }}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === 'random' ? 'bg-slate-700 text-white shadow-lg border border-slate-500' : 'text-slate-400 hover:text-white'}`}
            >
                Raw Data
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); setMode('cluster'); }}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === 'cluster' ? 'bg-tv5 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                AI Segments
            </button>
        </div>
      </div>
    </div>
  );
};