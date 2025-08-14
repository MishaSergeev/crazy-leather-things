import { useState } from 'react'

import TabsSection from '../TabsSection/TabsSection';
import Registration from '../Registration/Registration';
import LogIn from '../LogIn/LogIn';

import './User.css'

export default function User({ onClose }) {
    const [tab, setTab] = useState('Login')
    return (
        <>
            <div className='div-user-container'>
                <TabsSection
                    active={tab}
                    onChange={(current) => setTab(current)}
                    space={'User'} />
                {tab === 'Login' && (
                    <LogIn onClose={onClose} />
                )}
                {tab === 'Registration' && (
                    <Registration onClose={onClose} />
                )}
            </div>
        </>
    );
}