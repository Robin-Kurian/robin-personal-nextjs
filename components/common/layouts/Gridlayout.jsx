import React from 'react'

const Gridlayout = ({ children, className = "", gridClassNames = "" }) => {
    return (
        <div className={`${className}`}>
            <div className={`grid ${gridClassNames}`}>
                {children}
            </div>
        </div>
    )
}

export default Gridlayout