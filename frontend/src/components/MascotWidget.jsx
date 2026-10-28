import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import { SmileIcon } from "lucide-react";

function BoxMascot() {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);
  const [clicked, setClick] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * (hovered ? 2 : 0.5);

      // Gentle bounce
      if (!clicked) {
          meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2;
      } else {
          meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 10) * 0.5;
      }
    }
  });

  return (
    <RoundedBox
      ref={meshRef}
      args={[1.5, 1.5, 1.5]} // Width, height, depth.
      radius={0.3} // Radius of the rounded corners. Default is 0.05
      smoothness={4} // The number of curve segments. Default is 4
      scale={clicked ? 1.2 : 1}
      onClick={() => {
        setClick(true);
        setTimeout(() => setClick(false), 500);
      }}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </RoundedBox>
  );
}

const MascotWidget = () => {
  return (
    <div className="card bg-base-100 shadow-md border border-base-300 h-full w-full overflow-hidden relative cursor-pointer">
      <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-base-100/80 p-1 rounded backdrop-blur-sm">
        <SmileIcon className="size-4 text-warning" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/70">Mascot</span>
      </div>
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          <BoxMascot />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
    </div>
  );
};

export default MascotWidget;
