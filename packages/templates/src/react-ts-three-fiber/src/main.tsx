import { events, render, useFrame } from '@react-three/fiber'
import { Suspense, useRef, useState } from 'react'
import * as THREE from 'three'

function Box(props: JSX.IntrinsicElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!)
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  useFrame(() => (ref.current.rotation.x += 0.01))
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={() => click(!clicked)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

const Root = () => (
  <mesh>
    <ambientLight />
    <pointLight position={[10, 10, 10]} />
    <Box position={[-4, 0, -10]} />
    <Box position={[4, 0, -10]} />
  </mesh>
)

window.addEventListener('resize', () =>
  render(
    <Root />,
    document.querySelector('canvas'),
    {
      events,
      size: { width: window.innerWidth, height: window.innerHeight }
    }
  )
)

window.dispatchEvent(new Event('resize'))
