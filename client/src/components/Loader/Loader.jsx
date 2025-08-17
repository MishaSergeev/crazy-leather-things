import logo from './logo192.png'
import classes from './Loader.module.css'

const Loader = () => {
  return (
    <div className={classes.loader_backdrop}>
      <div className={classes.loader_wrapper}>
        <img
          src={logo}
          alt="Loading..."
          className={classes.loader_logo}
        />
        <div className={classes.loader_glow}></div>
      </div>
    </div>
  )
}

export default Loader