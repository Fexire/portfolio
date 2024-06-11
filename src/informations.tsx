import { useContext } from 'react';
import './styles.css'
import { CapsuleLookingContext } from './main';

function Informations() {
    const { element } = useContext(CapsuleLookingContext)
    return <div className="container">
        {element}
    </div>
}

export default Informations;