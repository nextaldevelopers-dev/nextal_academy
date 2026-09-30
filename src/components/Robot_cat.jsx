/*
  Robot Cat — Idle Character Animation
  Floating, mouse-head-tracking, blinking, arm wave, speech bubble
*/
import React, { useRef, useState, useEffect } from 'react'
import { useLoader, useGraph, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PerspectiveCamera } from '@react-three/drei/core/PerspectiveCamera'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export default function RobotCat(props) {
  const gltf = useLoader(GLTFLoader, '/robot_cat.glb', (loader) => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
    loader.setDRACOLoader(dracoLoader)
  })
  const scene = gltf.scene
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes } = useGraph(clone)

  // ── Materials ────────────────────────────────────────────────
  const customMaterial = React.useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#4B1D95',
    emissive: '#2E1A6B',
    emissiveIntensity: 0.5,
    roughness: 0.15,
    metalness: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    iridescence: 1.0,
    iridescenceIOR: 1.5,
    iridescenceThicknessRange: [100, 400],
  }), [])

  const eyeMaterial = React.useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffffff',
    emissive: '#00ffff',
    emissiveIntensity: 1.5,
    toneMapped: false,
  }), [])

  const accentMaterial = React.useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffb8d2',
    emissive: '#ff2a85',
    emissiveIntensity: 0.8,
  }), [])

  // ── Refs ─────────────────────────────────────────────────────
  const headRef     = useRef()
  const bodyRef     = useRef()
  const rightArmRef = useRef()
  const leftEyeRef  = useRef()
  const rightEyeRef = useRef()

  // ── Animation ────────────────────────────────────────────────
  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (bodyRef.current) {
      // Static pose - no floating or breathing
    }

    if (headRef.current) {
      const targetX = (state.mouse.y * Math.PI) / 8
      const targetY = (state.mouse.x * Math.PI) / 4
      headRef.current.rotation.x += (targetX - headRef.current.rotation.x) * 0.1
      headRef.current.rotation.y += (targetY - headRef.current.rotation.y) * 0.1
      headRef.current.rotation.z = Math.sin(t * 1.2) * 0.05
    }

    const blink = Math.sin(t * 3) > 0.95 ? 0.1 : 1
    if (leftEyeRef.current)  leftEyeRef.current.scale.y  = blink
    if (rightEyeRef.current) rightEyeRef.current.scale.y = blink

    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = Math.sin(t * 1.5) * 0.3 - 0.4
    }
  })

  // ── Render ────────────────────────────────────────────────────
  // IMPORTANT: All body parts (legs, arms, torso) live inside the
  // <group position={[19.364, 133.352, -1.729]}> group — this is the
  // correct parent from the original GLTFJSX export. Moving them out
  // of this group causes a 3+ world-unit gap between head and body.
  return (
    <group {...props} dispose={null}>
      <group scale={0.01}>
        <group ref={bodyRef}>

          {/* Tail / wool */}
          <group position={[2.565, 70.798, 46.595]} scale={[1.818, 1.507, 1.217]}>
            <mesh geometry={nodes.wool.geometry} material={customMaterial} position={[0.882, 0.514, -0.886]} scale={[0.154, 0.186, 0.23]} />
          </group>

          {/*
            ─────────────────────────────────────────────────────
            CRITICAL: Head, legs, arms, torso are ALL children of
            this group at y=133. Their local positions are relative
            to this parent offset. Do NOT move them out.
            ─────────────────────────────────────────────────────
          */}
          <group position={[19.364, 133.352, -1.729]}>

            {/* Head */}
            <group ref={headRef} position={[-18.971, -2.157, 0]}>

              {/* Whiskers / rods — pink accent */}
              <group position={[17.224, 22.877, -31.113]}>
                <mesh geometry={nodes.Cylinder_3.geometry}   material={accentMaterial} position={[0, 0.805, -4.603]}  rotation={[1.745, 0, -Math.PI]} />
              </group>
              <group position={[17.224, 17.906, -31.047]}>
                <mesh geometry={nodes.Cylinder_3_1.geometry} material={accentMaterial} position={[0, -1.071, -4.687]} rotation={[1.396, 0, -Math.PI]} />
              </group>
              <group position={[17.224, 22.873, 31.388]} rotation={[-0.021, 0, 0]}>
                <mesh geometry={nodes.Cylinder_2.geometry}   material={accentMaterial} position={[0, 0.809, 4.328]}   rotation={[1.396, 0, 0]} />
              </group>
              <group position={[17.224, 16.835, 31.597]}>
                <mesh geometry={nodes.Cylinder.geometry}     material={accentMaterial} position={[0, 0, 4.136]}       rotation={[1.745, 0, 0]} />
              </group>

              {/* Head body */}
              <group position={[-0.033, 25.88, 0.156]}>
                <mesh geometry={nodes.Boolean_3.geometry} material={customMaterial} position={[2.674, 0.003, 0.004]} scale={[0.956, 0.978, 0.956]} />
                <mesh geometry={nodes.Boolean.geometry}   material={customMaterial} position={[0.455, 0, 0]} />
                <mesh geometry={nodes.Rectangle.geometry} material={customMaterial} position={[22.215, 0.142, 0.095]} rotation={[0, Math.PI / 2, 0]} scale={[0.96, 0.96, 1]} />
              </group>

              {/* Face details */}
              <mesh geometry={nodes.Ellipse_3.geometry}      material={eyeMaterial}    position={[3.05, 53.72, 0.163]}     rotation={[-Math.PI / 2, 0, Math.PI / 2]} />
              <mesh geometry={nodes.Estrellas.geometry}       material={accentMaterial} position={[27.7, 25.645, 0.307]} />
              {/* Eyebrows — pink accent */}
              <mesh geometry={nodes.Merged_Geometry.geometry} material={accentMaterial} position={[27.65, 32.428, 0.266]} />
              <mesh geometry={nodes.Rectangle_4.geometry}     material={accentMaterial} position={[27.655, 40.256,  3.433]} rotation={[Math.PI / 2, Math.PI / 2, 0]} scale={[1.052, 1, 1]} />
              <mesh geometry={nodes.Rectangle_5.geometry}     material={accentMaterial} position={[27.655, 40.256, -2.567]} rotation={[Math.PI / 2, Math.PI / 2, 0]} scale={[1.052, 1, 1]} />
              <mesh geometry={nodes.Rectangle_3.geometry}     material={accentMaterial} position={[27.655, 40.256,  0.434]} rotation={[Math.PI / 2, Math.PI / 2, 0]} scale={[1.052, 1, 1]} />
              <mesh geometry={nodes.Rectangle_2.geometry}     material={eyeMaterial}    position={[27.655, 16.175, 0.176]}  rotation={[0, Math.PI / 2, 0]} />
              <mesh geometry={nodes.Triangle_3.geometry}      material={eyeMaterial}    position={[27.655, 20.542, 0.234]}  rotation={[-Math.PI, Math.PI / 2, 0]} />

              {/* Eyes (blink) */}
              <mesh ref={leftEyeRef}  geometry={nodes.Eye_2.geometry} material={eyeMaterial} position={[27.65, 25.607, -10.211]} rotation={[0, Math.PI / 2, 0]} />
              <mesh ref={rightEyeRef} geometry={nodes.Eye.geometry}   material={eyeMaterial} position={[27.65, 25.607,  10.869]} rotation={[0, Math.PI / 2, 0]} />

              {/* Ears */}
              <mesh geometry={nodes.Triangle_2.geometry} material={accentMaterial} position={[-1.554, 60.25, -19.529]} rotation={[-0.175, Math.PI / 2, 0]} />
              <mesh geometry={nodes.Triangle.geometry}   material={accentMaterial} position={[-1.554, 60.25,  19.625]} rotation={[ 0.175, Math.PI / 2, 0]} />
            </group>{/* end headRef */}

            {/* Left leg — inside the y=133 parent, so local y=-59 = absolute y=74 */}
            <mesh geometry={nodes.Cube_3.geometry} material={customMaterial} position={[-18.748, -59.574, -13.312]} rotation={[0, Math.PI / 2, 0]} />
            {/* Left arm */}
            <mesh geometry={nodes.Cube_6.geometry} material={customMaterial} position={[-19.111, -18.242, -23.788]} rotation={[0.578, Math.PI / 2, 0]} />
            {/* Right arm (has speech bubble) */}
            <group ref={rightArmRef} position={[-19.116, -18.008, 20.126]} rotation={[-0.578, Math.PI / 2, 0]}>
              <mesh geometry={nodes.Cube_5.geometry} material={customMaterial} position={[0, 0, 0]} rotation={[0, 0, 0]} />
            </group>
            {/* Right leg */}
            <mesh geometry={nodes.Cube_2.geometry} material={customMaterial} position={[-18.748, -59.574, 10.216]} rotation={[0, Math.PI / 2, 0]} />
            {/* Torso */}
            <mesh geometry={nodes.Cube.geometry} material={customMaterial} position={[-18.507, -22.607, -1.245]} rotation={[0, Math.PI / 2, 0]} />

          </group>{/* end y=133 parent — everything above must stay inside this */}

          {/* Lights */}
          <pointLight intensity={0.8} decay={2} distance={2000} position={[285.119, 111.528, 44.24]} rotation={[0, 0.036, 0]} />
          <spotLight intensity={1} angle={0.698} penumbra={1} decay={2} distance={200} position={[94.07, 296.421, 23.824]} rotation={[-3.059, 0.086, -2.798]} target={nodes.Spot_Light.target}>
            <primitive object={nodes.Spot_Light.target} position={[0, 0, -1]} />
          </spotLight>
          <PerspectiveCamera makeDefault={false} far={100000} near={70} fov={45} position={[394.706, 146.424, 4.52]} rotation={[0, Math.PI / 2, 0]} />

        </group>{/* end bodyRef */}
      </group>
    </group>
  )
}

