import React from 'react';

const MainScreen = ({ title, children }) => {
    return (
        <div className="mainback p-4 w-full">
            {title && (
                <>
                    <h1 className="heading text-2xl font-bold mb-2">{title}</h1>
                    <hr className="mb-4" />
                </>
            )}
            <div>
                {children}
            </div>
        </div>
    );
};

export default MainScreen;
