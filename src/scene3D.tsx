import * as THREE from 'three'
import React, { useRef, useState, useMemo, createContext, useContext } from 'react'
import { Canvas, useFrame, ThreeElements, ThreeEvent } from '@react-three/fiber'
import { useGLTF, useAnimations, Environment, Text } from '@react-three/drei'
import cv from "./cv.json"
import { element } from 'three/examples/jsm/nodes/Nodes.js'


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

function Pipe(props: ThreeElements['mesh']) {
    const scene = useGLTF("Pipe.glb").scene;
    const clone = useMemo(() => scene.clone(), [scene]);
    return <primitive {...props} object={clone} />
}

interface CapsuleLoookingContextValue {
    isLookingAtCapsule: boolean;
    setIsLookingAtCapsule: React.Dispatch<React.SetStateAction<boolean>>;
}

const CapsuleLookingContext = createContext<CapsuleLoookingContextValue>({} as CapsuleLoookingContextValue)

interface CapsuleProps {
    key: number
    position: THREE.Vector3
    element: any
}

function Capsule(props: CapsuleProps) {
    const capsuleFile = useGLTF("Capsule.glb");
    const capsuleClone = useMemo(() => capsuleFile.scene.clone(), [capsuleFile.scene]);
    const objectFile = useGLTF(props.element.path3D);
    const objectClone = useMemo(() => objectFile.scene.clone(), [objectFile.scene]);
    const capsulePrimRef = useRef<THREE.Mesh>(null!)
    const { actions, mixer } = useAnimations(capsuleFile.animations, capsulePrimRef);
    const objectRef = useRef<ThreeElements['primitive']>(null!)
    const capsuleRef = useRef<THREE.Group>(null!)
    var [nextPosition, setNextPosition] = useState(new THREE.Vector3(0, 0.7, 3))
    const moveSpeed = 0.01
    var [isMoving, setIsMoving] = useState(false)
    var [isLooking, setIsLooking] = useState(false)
    const [previousPosition, setPreviousPosition] = useState(new THREE.Vector3())
    const { isLookingAtCapsule, setIsLookingAtCapsule } = useContext(CapsuleLookingContext)


    function runOpenCapsuleAnimation() {
        actions.ClosingBot?.stop()
        actions.ClosingTop?.stop()
        actions.ClosingBot?.reset()
        actions.ClosingTop?.reset()
        actions.OpeningBot!.clampWhenFinished = true;
        actions.OpeningBot?.setLoop(THREE.LoopOnce, 0)
        actions.OpeningBot?.play()
        actions.OpeningTop!.clampWhenFinished = true;
        actions.OpeningTop?.setLoop(THREE.LoopOnce, 0)
        actions.OpeningTop?.play()
    }

    function runCloseCapsuleAnimation() {
        actions.OpeningBot?.stop()
        actions.OpeningTop?.stop()
        actions.OpeningBot?.reset()
        actions.OpeningTop?.reset()
        actions.ClosingBot!.clampWhenFinished = false;
        actions.ClosingBot?.setLoop(THREE.LoopOnce, 0)
        actions.ClosingBot?.play()
        actions.ClosingTop!.clampWhenFinished = false;
        actions.ClosingTop?.setLoop(THREE.LoopOnce, 0)
        actions.ClosingTop?.play()
        const fn = () => {
            setIsMoving(true);
            mixer.removeEventListener('finished', fn)
        };
        mixer.addEventListener('finished', fn)
    }


    function move(e: ThreeEvent<MouseEvent>) {
        e.stopPropagation()
        if (!isMoving) {
            if (!isLookingAtCapsule) {
                var worldPos = new THREE.Vector3()
                capsuleRef.current.getWorldPosition(worldPos)
                setPreviousPosition(worldPos)
                setIsLookingAtCapsule(true)
                setIsMoving(true)
            } else if (isLookingAtCapsule && isLooking) {
                var worldPos = new THREE.Vector3()
                capsuleRef.current.getWorldPosition(worldPos)
                setPreviousPosition(worldPos)
                if (isLooking) {
                    runCloseCapsuleAnimation();
                } else {
                    setIsMoving(true)
                }
            }

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
            setNextPosition(new THREE.Vector3().copy(previousPosition))
            if (!isLooking) {
                runOpenCapsuleAnimation()
                setIsLooking(!isLooking)
            } else {
                setIsLookingAtCapsule(false)
                setIsLooking(!isLooking)
            }
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
        <primitive ref={capsulePrimRef} object={capsuleClone} scale={[1.5, 1.5, 1.5]} />
        <primitive ref={objectRef} scale={[0.15, 0.15, 0.15]} object={objectClone} />
    </group>
}

interface StandWithCapsulesProps {

    capsuleNumber: number
    position: THREE.Vector3
    name: string
    elements: any
    key: number
}

function StandWithCapsules(props: StandWithCapsulesProps) {

    var [position, setPosition] = useState(new THREE.Vector3(0, 0, 0))



    var [capsulePositions, setCapsulePositions] = useState(Array<THREE.Vector3>(props.capsuleNumber).fill(new THREE.Vector3(0, 0, 0)).map((_, i) => {
        if (props.capsuleNumber > 1) {
            const gap = 2 / (props.capsuleNumber - 1);
            const start = -1;
            return new THREE.Vector3(start + i * gap, 0.3, 0);
        } else {
            return new THREE.Vector3(0, 0.3, 0);
        }
    }))

    useFrame((state, delta) => {
        setPosition(new THREE.Vector3(props.position.x, props.position.y, props.position.z))
    })

    function generateCapsules() {
        return Array(props.capsuleNumber).fill(0).map((_, i) => {
            return <Capsule key={i} position={capsulePositions[i]} element={props.elements[i]} />
        })
    }

    return <group position={position}>
        <Stand onClick={(e) => { e.stopPropagation() }} />
        {generateCapsules()}
        <Text scale={0.2} position={[0, 0.02, 0.4]} color={"white"} font={"fonts/impact.ttf"} >
            {props.name}
        </Text>
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
    const stopForce = 0.0002
    const maxVelocity = 0.05
    var [standsPosition, setStandsPosition] = useState(Array<THREE.Vector3>(props.armsNumber).fill(new THREE.Vector3(0, 0, 0)).map((_, i) => {
        var position = new THREE.Vector3(0, 0, 2);
        position.applyAxisAngle(new THREE.Vector3(1, 0, 0), -i * (2 * Math.PI / props.armsNumber))
        return position;
    }))

    function moveStands() {
        setStandsPosition((prevStandsPositions) => {
            prevStandsPositions.forEach((e, i) => {
                var position = new THREE.Vector3(0, 0, 2.05);
                position.applyAxisAngle(new THREE.Vector3(1, 0, 0), ref.current.rotation.x + i * (2 * Math.PI / props.armsNumber))
                e.copy(position)
            })
            return prevStandsPositions
        })
    }

    useFrame((state, delta) => {
        var currentVelocity = velocity
        currentVelocity += Math.sign(deltaY - props.scrollDeltaY) * 0.01
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
            var position = new THREE.Vector3(0, 0, 1);
            position.applyAxisAngle(new THREE.Vector3(1, 0, 0), rotation_x);
            return <Arm onClick={(e) => { e.stopPropagation() }} key={i} position={position} rotation={[rotation_x, 0, 0]} />;
        })
    }

    function generateStands() {
        return Array(props.armsNumber).fill(0).map((_, i) => {
            var elements = cv[Object.keys(cv)[i]]
            return <StandWithCapsules key={i} elements={elements} name={Object.keys(cv)[i]} position={standsPosition[i]} capsuleNumber={elements.length} />;
        })
    }

    return <group>
        <group ref={ref} position={[0, 0, 0]}>
            <CenterCylinder onClick={(e) => { e.stopPropagation() }} position={[0, 0, 0]} />
            <Pipe onClick={(e) => { e.stopPropagation() }} position={[0, 0, 0]} />
            {generateArms()}
        </group>
        {generateStands()}
    </group>

}


function Scene3D() {

    const [scrollDeltaY, setScroll] = useState(0)
    const [isLookingAtCapsule, setIsLookingAtCapsule] = useState(false)

    return (
        <Canvas shadows onWheel={(e) => isLookingAtCapsule ? 0 : setScroll(scrollDeltaY + -e.deltaY)} camera={{ fov: 75, position: [0, 1, 4] }}>
            <Environment files="wasteland_clouds_puresky_1k.exr" background backgroundRotation={[0, .5, 0]} />
            <CapsuleLookingContext.Provider value={{ isLookingAtCapsule, setIsLookingAtCapsule }}>
                <ArmStuct scrollDeltaY={scrollDeltaY} armsNumber={Object.keys(cv).length} />
            </CapsuleLookingContext.Provider>
        </Canvas >
    )
}

export default Scene3D