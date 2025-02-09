// ListLayout.js
import React from 'react';

const ListLayout = ({ children, className = "" }) => {
    return (
        <div className={`${className}`}>
            <div className="flex flex-col">
                {children}
            </div>
        </div>
    );
};

export default ListLayout;