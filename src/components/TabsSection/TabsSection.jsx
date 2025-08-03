import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

import { useGlobalData } from '../../context/GlobalDataContext'
import Button from '../Button/Button'

import './TabsSection.css'

export default function TabsSection({ active, onChange, space, direction = 'horizontal', onClose }) {
  const { globalData } = useGlobalData();
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

  return (
    <section
      ref={ref}
      className={`tabs-section ${direction === 'vertical' ? 'vertical' : ''}`}
    >
      {data[space]?.map((el) => (
        <NavLink key={el.id + '-tab'} to={space==='UserPage'?"/UserPage":"/"}>
          <Button
            key={el.id}
            isActive={active === el.id}
            onClick={() => onChange(el.id)}
          >
            {el.desc}
          </Button>
        </NavLink>
      ))}
    </section>
  );
}
