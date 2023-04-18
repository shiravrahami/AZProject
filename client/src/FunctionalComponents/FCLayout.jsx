import React from 'react';
import FCHeader from './FCHeader';
import FCMenu from './FCMenu';
import FCFooter from './FCFooter';

export default function FCLayout({children}) {
    return (
        <div>
            <FCHeader />
            <div className="content">
                <FCMenu />
                <div className="main">
                     {children}
                </div>
            </div>
            <FCFooter />
        </div>
    )
}
