import * as THREE from 'three'
import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'


function CenterCylinder(props: ThreeElements['mesh']) {
  const scene = useGLTF("CenterCylinder.glb").scene;
  const clone = useMemo(() => scene.clone(), [scene]);
  return <primitive {...props} object={clone} />
}

function Arm(props: ThreeElements['mesh']) {
  const scene = useGLTF("Arm.glb").scene;
  const clone = useMemo(() => scene.clone(), [scene]);
  return <primitive {...props} object={clone} />
}

function Stand(props: ThreeElements['mesh']) {
  const scene = useGLTF("Stand.glb").scene;
  const clone = useMemo(() => scene.clone(), [scene]);
  return <primitive {...props} object={clone} />
}

function Capsule(props: ThreeElements['mesh']) {
  const scene = useGLTF("Capsule.glb").scene;
  const clone = useMemo(() => scene.clone(), [scene]);
  return <primitive {...props} object={clone} />
}

interface StandWithCapsulesProps {

  capsuleNumber: number
  position: THREE.Vector3
  key: number
}

function StandWithCapsules(props: StandWithCapsulesProps) {

  var [position, setPosition] = useState(new THREE.Vector3(0, 0, 0))

  var [capsulePositions, setCapsulePositions] = useState(Array<THREE.Vector3>(props.capsuleNumber).fill(new THREE.Vector3(0, 0, 0)).map((_, i) => {
    const gap = 19 / (props.capsuleNumber - 1);
    const start = -10;
    return new THREE.Vector3(start + i * gap, 1, 0);
  }))

  useFrame((state, delta) => {
    setPosition(new THREE.Vector3(props.position.x, props.position.y, props.position.z))
  })

  function generateCapsules() {
    return Array(props.capsuleNumber).fill(0).map((_, i) => {
      return <Capsule key={i} position={capsulePositions[i]} />
    })
  }

  return <group position={position}>
    <Stand />
    {generateCapsules()}
  </group>

}

interface ArmStructProps {
  scrollDeltaY: number
  armsNumber: number
}

function ArmStuct(props: ArmStructProps) {
  const ref = useRef<THREE.Group>(null!)
  var [deltaY, setDeltaY] = useState(0)
  var [velocity, setVelocity] = useState(0)
  const stopForce = 0.001
  const maxVelocity = 0.1
  var [standsPosition, setStandsPosition] = useState(Array<THREE.Vector3>(props.armsNumber).fill(new THREE.Vector3(0, 0, 0)).map((_, i) => {
    var position = new THREE.Vector3(0, -1.5, 10);
    position.applyAxisAngle(new THREE.Vector3(1, 0, 0), i * (2 * Math.PI / props.armsNumber))
    return position;
  }))

  function moveStands() {
    setStandsPosition((prevStandsPositions) => {
      prevStandsPositions.forEach((e, i) => {
        var position = new THREE.Vector3(0, -1.5, 10);
        position.applyAxisAngle(new THREE.Vector3(1, 0, 0), ref.current.rotation.x + i * (2 * Math.PI / props.armsNumber))
        e.copy(position)
      })
      return prevStandsPositions
    })
  }

  useFrame((state, delta) => {
    var currentVelocity = velocity
    currentVelocity += Math.sign(deltaY - props.scrollDeltaY) * 0.02
    Math.abs(currentVelocity) > maxVelocity ? currentVelocity = Math.sign(velocity) * maxVelocity : currentVelocity = currentVelocity
    ref.current.rotation.x += currentVelocity
    var velocitySign = Math.sign(currentVelocity)
    currentVelocity -= velocitySign * stopForce
    Math.sign(currentVelocity) != velocitySign ? currentVelocity = 0 : currentVelocity = currentVelocity
    moveStands()
    setVelocity(currentVelocity)
    setDeltaY(props.scrollDeltaY)
  })

  function generateArms() {
    return Array(props.armsNumber).fill(0).map((_, i) => {
      var rotation_x = i * (2 * Math.PI / props.armsNumber);
      var position = new THREE.Vector3(0, 0, 3);
      position.applyAxisAngle(new THREE.Vector3(1, 0, 0), rotation_x);
      return <Arm key={i} position={position} rotation={[rotation_x, 0, 0]} />;
    })
  }

  function generateStands() {
    return Array(props.armsNumber).fill(0).map((_, i) => {
      return <StandWithCapsules key={i} position={standsPosition[i]} capsuleNumber={4} />;
    })
  }

  return <group>
    <group ref={ref} position={[0, 0, 0]}>
      <CenterCylinder position={[0, 0, 0]} />
      {generateArms()}
    </group>
    {generateStands()}
  </group>

}


function App() {

  const [scrollDeltaY, setScroll] = useState(0)

  return (
    <Canvas onWheel={(e) => setScroll(scrollDeltaY + e.deltaY)} camera={{ fov: 75, position: [10, 10, -20] }}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <ArmStuct scrollDeltaY={scrollDeltaY} armsNumber={8} />
    </Canvas >
  )
}

export default App
