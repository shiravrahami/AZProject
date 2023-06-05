import React, { useState, useEffect, useContext } from 'react';
import FCHeader from './FCHeader';
import FCMenu from './FCMenu';
import FCFooter from './FCFooter';
import '../../Styles/Layout.css';


export default function FCLayout({ children }) {

    return (
        <div>
            <FCHeader />
            <div className="content">
                <div className="main" style={{ display: 'inline', padding:'20px' }}>
                    {children}
                </div>
                <FCMenu />
            </div>
            <FCFooter />
        </div>
    )
}