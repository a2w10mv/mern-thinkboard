import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";

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
      args={[1.5, 1.5, 1.5]}
      radius={0.3}
      smoothness={4}
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

const MascotScene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <BoxMascot />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
};

export default MascotScene;
