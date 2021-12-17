import React from 'react';
import './backdrop.css'
import { UseAppContext } from '../../Contexts/app-context';

const Backdrop =()=>{
     const { openSidebar, sidebarOpen} = UseAppContext()

    return <div className={ sidebarOpen ? `backdrop1` : `backdrop2`}  onClick={openSidebar}>
        
    </div>
}

export default Backdrop
