import { library } from '@fortawesome/fontawesome-svg-core';
// import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTrash, 
    faMagnifyingGlass,
    faList,
    faTableCells,
    faTableCellsLarge,
    faICursor,
    faBookOpenReader,
    faTrashCan,
    faLock,
    faGears,
    faChevronDown,
    faChevronUp,
    faPlay,
    faPause,
    faHamburger,
    faBars,
    faXmark,
    
 } from '@fortawesome/free-solid-svg-icons';

const Icons = () => {
    return (
        library.add(
            faTrash,
            faMagnifyingGlass,
            faList,
            faTableCells,
            faTableCellsLarge,
            faICursor,
            faBookOpenReader,
            faTrashCan,
            faLock,
            faGears,
            faChevronDown,
            faChevronUp,
            faPlay,
            faPause,
            faHamburger,
            faBars,
            faXmark,
      )
      )
 }


 export default Icons;