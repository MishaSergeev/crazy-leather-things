import { NavLink } from "react-router-dom"; 

import logo from './Icon.png';
import classes from './Icon.module.css';

export default function Icon({ onClick }) {
  return (      
    <NavLink onClick={onClick} to="/">
      <img src={logo} alt="" className={classes.img_logo} />
    </NavLink>
  );
}