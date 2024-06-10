import React from 'react'
import ReactDOM from 'react-dom/client'
import Scene3D from './scene3D.tsx'
import Informations from './informations.tsx'
import { Suspense } from 'react'
import "./styles.css"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Suspense fallback={null}>
    <Informations />
    <Scene3D />

  </Suspense>
)
