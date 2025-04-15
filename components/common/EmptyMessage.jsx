import React from 'react'

const EmptyMessage = ({ title = "Oops! Empty!", message = "It seems there are no items available at the moment.", titleComponent = "", footerComponent = "", className = "" }) => {
    return (
        <div className={`flex flex-col justify-center items-center text-center mt-6 md:p-6 p-4 ${className}`}>
            {!titleComponent ? <h1 className="text-xl font-bold text-gray-800 border-b-1 border-gray-300 pb-2">{title}</h1> : titleComponent}
            <p className="mt-2 text-gray-600">{message}</p>
            {footerComponent && footerComponent}
        </div>
    )
}

export default EmptyMessage
