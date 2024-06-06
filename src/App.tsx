import * as THREE from 'three'
import { useRef, useState, useEffect, forwardRef } from 'react'
import { Canvas, useFrame, ThreeElements, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


function CenterCylinder(props: ThreeElements['mesh']) {
  const scene = useLoader(GLTFLoader, "CenterCylinder.glb").scene;
  return <primitive {...props} object={scene} />
}

function Arm(props: ThreeElements['mesh']) {
  const scene = useLoader(GLTFLoader, "Arm.glb").scene;

  return <primitive {...props} object={scene} />
}

const Plop = forwardRef(function Stand(props: ThreeElements['mesh'], ref) {
  const scene = useLoader(GLTFLoader, "Stand.glb").scene;

  return <primitive ref={ref} {...props} object={scene} />
})

function ArmStuct() {
  const ref = useRef<THREE.Group>(null!)
  const standRef = useRef<typeof Plop>(null!)

  useFrame((state, delta) => {
    ref.current.rotation.x += delta
    var oldPosition = new THREE.Vector3(0, -1.5, 10)
    oldPosition.applyAxisAngle(new THREE.Vector3(1, 0, 0), ref.current.rotation.x)
    console.log(oldPosition)
    standRef.current.position.x = oldPosition.x
    standRef.current.position.y = oldPosition.y
    standRef.current.position.z = oldPosition.z
  })

  return <group><group ref={ref} position={[0, 0, 0]}>
    <CenterCylinder position={[0, 0, 0]} />
    <Arm position={[0, 0, 0]} />
  </group><Plop ref={standRef} position={[0, 0, 0]}></Plop></group>

}


function App() {

  return (
    <Canvas camera={{ fov: 75, position: [0, 10, -20] }}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <ArmStuct />
    </Canvas >
  )
}

export default App
