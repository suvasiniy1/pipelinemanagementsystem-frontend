import React, { useEffect, useRef } from 'react'

type params = {
    noteDetails: any;
}
const DealNoteDetails = (props: params) => {
    const { noteDetails, ...others } = props;
    const divRef = useRef();

    useEffect(()=>{
        if(divRef){
            (divRef.current as any).innerHTML = noteDetails;
        }
    },[props])

    return (
        <div ref={divRef as any} style={{maxHeight:"200px", overflow:'auto'}}></div>
    )
}

export default DealNoteDetails