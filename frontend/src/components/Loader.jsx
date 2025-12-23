import React from 'react'
import { Blocks } from 'react-loader-spinner'

const Loader = () => {
    return (
        <div style={{ position: "absolute" , height:"110vh" , width:"80vw" , zIndex:"0" , backdropFilter:"blur(1px)"}}
        >
            <Blocks
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="blocks-loading"
                wrapperStyle={{position: "absolute",left:"45%" , top:"40%" , zIndex:"10"}}
                wrapperClass="blocks-wrapper"
                visible={true}

            />
        </div>
    )
}

export default Loader