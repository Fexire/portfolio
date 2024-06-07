import * as THREE from 'three'
import { useRef, useState, useEffect, forwardRef, useMemo } from 'react'
import { Canvas, useFrame, ThreeElements, useLoader, ThreeEvent } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'


function CenterCylinder(props: ThreeElements['mesh']) {
  const scene = useGLTF("CenterCylinder.glb").scene;
  return <primitive {...props} object={scene} />
}

function Arm(props: ThreeElements['mesh']) {
  const scene = useGLTF("Arm.glb").scene;

  return <primitive {...props} object={scene.clone()} />
}

const Plop = forwardRef(function Stand(props: ThreeElements['mesh'], ref) {
  const scene = useGLTF("Stand.glb").scene;

  return <primitive ref={ref} {...props} object={scene} />
})


interface ArmStructPropos {
  scrollDeltaY: number
  armsNumber: number
}

function ArmStuct(props: ArmStructPropos) {
  const ref = useRef<THREE.Group>(null!)
  const standRef = useRef<THREE.Mesh>(null!)
  var [deltaY, setDeltaY] = useState(0)
  var [velocity, setVelocity] = useState(0)
  const stopForce = 0.001
  const maxVelocity = 0.1


  useFrame((state, delta) => {
    var currentVelocity = velocity
    currentVelocity += Math.sign(deltaY - props.scrollDeltaY) * 0.02
    Math.abs(currentVelocity) > maxVelocity ? currentVelocity = Math.sign(velocity) * maxVelocity : currentVelocity = currentVelocity
    ref.current.rotation.x += currentVelocity
    var velocitySign = Math.sign(currentVelocity)
    currentVelocity -= velocitySign * stopForce
    Math.sign(currentVelocity) != velocitySign ? currentVelocity = 0 : currentVelocity = currentVelocity

    var oldPosition = new THREE.Vector3(0, -1.5, 10)
    oldPosition.applyAxisAngle(new THREE.Vector3(1, 0, 0), ref.current.rotation.x)
    standRef.current.position.x = oldPosition.x
    standRef.current.position.y = oldPosition.y
    standRef.current.position.z = oldPosition.z

    setVelocity(currentVelocity)
    setDeltaY(props.scrollDeltaY)
  })

  return <group><group ref={ref} position={[0, 0, 0]}>
    <CenterCylinder position={[0, 0, 0]} />
    {Array(props.armsNumber).fill(0).map((_, i) => { var rotation_x = i * (2 * Math.PI / props.armsNumber); var position = new THREE.Vector3(0, 0, 3); position.applyAxisAngle(new THREE.Vector3(1, 0, 0), rotation_x); console.log(position); return <Arm key={i} position={position} rotation={[rotation_x, 0, 0]} />; })}


  </group><Plop ref={standRef} position={[0, 0, 0]}></Plop></group>

}


function App() {

  const [scrollDeltaY, setScroll] = useState(0)

  return (
    <Canvas onWheel={(e) => setScroll(scrollDeltaY + e.deltaY)} camera={{ fov: 75, position: [0, 10, -20] }}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <ArmStuct scrollDeltaY={scrollDeltaY} armsNumber={7} />
    </Canvas >
  )
}

export default App
