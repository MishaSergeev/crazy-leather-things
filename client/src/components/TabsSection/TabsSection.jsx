import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUserData } from '@nhost/react';

import { useGlobalData } from '../../context/GlobalDataContext'
import Button from '../Button/Button'

import './TabsSection.css'

export default function TabsSection({ active, onChange, space, direction = 'horizontal', onClose }) {
  const { globalData } = useGlobalData();
  const navigate = useNavigate();
  const user = useUserData();
  const ref = useRef();
  const data = {
    'Main': globalData.tabs_section,
    'User': globalData.tabs_section_user,
    'UserPage': globalData.user_tabs,
  }
  useEffect(() => {
    if (direction !== 'vertical') return;

    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [direction, onClose]);

  const tabSectionContainer = data[space]?.map((el) => {
    if (el.id === 'AddItem' && user?.defaultRole !== 'admin') {
      return null;
    }
    const handleClick = () => {
      onChange(el.id);
      if (space === "Main") {
        navigate("/", { state: { tabId: el.id } });
      }
    };

    return (
      <Button
        key={el.id}
        isActive={active === el.id}
        onClick={handleClick}
      >
        {el.desc}
      </Button>
    );
  })

  return (
    <section
      ref={ref}
      className={`tabs-section ${direction === 'vertical' ? 'vertical' : ''}`}
    >
      {tabSectionContainer}
    </section>
  );
}
