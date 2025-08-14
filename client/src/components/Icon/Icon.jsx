import { NavLink } from "react-router-dom";

import logo from './Icon.png';

import './Icon.css'

export default function Icon({onClick}) {
    return (      
      <NavLink onClick={onClick} to="/">
        <img src={logo} alt="" className="img-logo" />
      </NavLink>
    )
  }