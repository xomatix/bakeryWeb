import { useState } from "preact/hooks";


const ToggleComponentButton = ({ children, component }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleButtonClick = () => {
    setIsVisible(!isVisible);
  };

  const handleCloseButtonClick = () => {
    setIsVisible(false);
  };

  return (
    <div>
      <button onClick={handleButtonClick}>{children}</button>
      {isVisible && (
        <div style={{ display: 'block', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', background: '#131f29', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' }}>
          {component}
          <br></br>
          <button onClick={handleCloseButtonClick}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ToggleComponentButton;