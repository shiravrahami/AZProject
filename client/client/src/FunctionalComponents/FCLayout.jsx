import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FCHeader from './FCHeader';
import FCMenu from './FCMenu';
import FCFooter from './FCFooter';
import FCProfile from './FCProfile';    

export default function FCLayout({ children }) {
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
