import logo from "./logo192.png";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-backdrop">
      <div className="loader-wrapper">
        <img
          src={logo}
          alt="Loading..."
          className="loader-logo"
        />
        <div className="loader-glow"></div>
      </div>
    </div>
  );
};

export default Loader;
