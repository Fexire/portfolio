import { useContext } from 'react';
import styles from './styles.module.css'
import { CapsuleLookingContext } from './main';

function Informations() {
    const { element } = useContext(CapsuleLookingContext)
    return <div className={styles.container}>
        {element}
    </div>
}

export default Informations;