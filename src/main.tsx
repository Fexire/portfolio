import ReactDOM from 'react-dom/client'
import Scene3D from './scene3D.tsx'
import Informations from './informations.tsx'
import { Suspense, useState, createContext } from 'react'
import "./styles.css"
import { Void } from './elements.tsx'


interface CapsuleLoookingContextValue {
  isLookingAtCapsule: boolean;
  setIsLookingAtCapsule: React.Dispatch<React.SetStateAction<boolean>>;
  element: JSX.Element;
  setElement: React.Dispatch<React.SetStateAction<JSX.Element>>;
  blur: boolean;
  setBlur: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CapsuleLookingContext = createContext<CapsuleLoookingContextValue>({} as CapsuleLoookingContextValue)

function App() {
  const [isLookingAtCapsule, setIsLookingAtCapsule] = useState(false)
  const [blur, setBlur] = useState(false)
  const [element, setElement] = useState(<Void />)

  return <Suspense fallback={null}>
    <CapsuleLookingContext.Provider value={{ isLookingAtCapsule, setIsLookingAtCapsule, element, setElement, blur, setBlur }}>
      <Informations />
      <Scene3D />
    </CapsuleLookingContext.Provider>
  </Suspense>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)
