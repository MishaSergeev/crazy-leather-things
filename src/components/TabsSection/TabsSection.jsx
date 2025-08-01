import { NavLink } from "react-router-dom";

import { useGlobalData } from '../../context/GlobalDataContext'
import Button from '../Button/Button'

import './TabsSection.css'

export default function TabsSection({ active, onChange, space }) {
  const { globalData } = useGlobalData()
  const buttonSection = space === 'User' ? globalData.tabs_section_user.map((el) =>
    <NavLink key={el.id + '-tab'} to="/">
      <Button key={el.id}
        isActive={active === el.id}
        onClick={() => onChange(el.id)} >
        {el.desc}
      </Button>
    </NavLink>
  ) : globalData.tabs_section.map((el) =>
    <NavLink key={el.id + '-tab'} to="/">
      <Button key={el.id}
        isActive={active === el.id}
        onClick={() => onChange(el.id)} >
        {el.desc}
      </Button>
    </NavLink>
  )
  return (
    <section className='section'>
      {buttonSection}
    </section>
  )
}
