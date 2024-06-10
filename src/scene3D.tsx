import * as THREE from 'three'
import React, { useRef, useState, useMemo, createContext, useContext } from 'react'
import { Canvas, useFrame, ThreeElements, ThreeEvent } from '@react-three/fiber'
import { useGLTF, Text3D, OrbitControls } from '@react-three/drei'


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

interface CapsuleLoookingContextValue {
    isLookingAtCapsule: boolean;
    setIsLookingAtCapsule: React.Dispatch<React.SetStateAction<boolean>>;
}

const CapsuleLookingContext = createContext<CapsuleLoookingContextValue>({} as CapsuleLoookingContextValue)



function Capsule(props: ThreeElements['group']) {
    const capsuleScene = useGLTF("Capsule.glb").scene;
    const capsuleClone = useMemo(() => capsuleScene.clone(), [capsuleScene]);
    const objectScene = useGLTF("Cube.glb").scene;
    const objectClone = useMemo(() => objectScene.clone(), [objectScene]);
    const objectRef = useRef<ThreeElements['primitive']>(null!)
    const capsuleRef = useRef<THREE.Group>(null!)
    var [nextPosition, setNextPosition] = useState(new THREE.Vector3(0, 7, 12))
    const moveSpeed = 0.1
    var [isMoving, setIsMoving] = useState(false)
    const [initialPosition, setInitialPosition] = useState(new THREE.Vector3())
    const { isLookingAtCapsule, setIsLookingAtCapsule } = useContext(CapsuleLookingContext)

    function move(e: ThreeEvent<MouseEvent>) {
        e.stopPropagation()
        if (!isMoving && !isLookingAtCapsule) {
            setIsMoving(true)
            var worldPos = new THREE.Vector3()
            capsuleRef.current.getWorldPosition(worldPos)
            setInitialPosition(worldPos)
            setIsLookingAtCapsule(false)
        }
    }

    function moveTo(position: THREE.Vector3) {
        var moveVector = new THREE.Vector3()
        var worldPos = new THREE.Vector3()
        capsuleRef.current.getWorldPosition(worldPos)
        moveVector.subVectors(position, worldPos)
        var distance = moveVector.length()
        moveVector.normalize()
        if (distance > moveSpeed) {
            capsuleRef.current.position.add(moveVector.multiplyScalar(moveSpeed))
            return true
        } else {
            capsuleRef.current.position.add(moveVector.multiplyScalar(distance))
            setNextPosition(new THREE.Vector3().copy(initialPosition))
            return false
        }
    }

    useFrame((state, delta) => {
        objectRef.current.rotation.y += delta
        if (isMoving) {
            setIsMoving(moveTo(nextPosition))
        }
    })

    return <group {...props} ref={capsuleRef} onClick={move}>
        <primitive object={capsuleClone} />
        <primitive ref={objectRef} scale={[0.7, 0.7, 0.7]} object={objectClone} />
    </group>
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
        <Stand onClick={(e) => { e.stopPropagation() }} />
        {generateCapsules()}
        <Text3D position={[-9, -0.5, 3]} font={"fonts/Impact_Regular.json"}>
            FORMATIONS
        </Text3D>
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
            return <Arm onClick={(e) => { e.stopPropagation() }} key={i} position={position} rotation={[rotation_x, 0, 0]} />;
        })
    }

    function generateStands() {
        return Array(props.armsNumber).fill(0).map((_, i) => {
            return <StandWithCapsules key={i} position={standsPosition[i]} capsuleNumber={4} />;
        })
    }

    return <group>
        <group ref={ref} position={[0, 0, 0]}>
            <CenterCylinder onClick={(e) => { e.stopPropagation() }} position={[0, 0, 0]} />
            {generateArms()}
        </group>
        {generateStands()}
    </group>

}


function Scene3D() {

    const [scrollDeltaY, setScroll] = useState(0)
    const [isLookingAtCapsule, setIsLookingAtCapsule] = useState(false)

    return (
        <Canvas onWheel={(e) => setScroll(scrollDeltaY + -e.deltaY)} camera={{ fov: 75, position: [0, 10, 20] }}>
            <ambientLight intensity={Math.PI / 2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            <CapsuleLookingContext.Provider value={{ isLookingAtCapsule, setIsLookingAtCapsule }}>
                <ArmStuct scrollDeltaY={scrollDeltaY} armsNumber={8} />
            </CapsuleLookingContext.Provider>

        </Canvas >
    )
}

export default Scene3D