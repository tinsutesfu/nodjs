// components/LoadingSpinner.jsx
import '../styles/shared/loadingspinner.css';

const LoadingSpinner = ({ size = 40, color = '#4CAF50' }) => {
  const spinnerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderColor: color,
  };

  return (
    <div className="spinner-container" aria-label="Loading">
      <div 
        className="loading-spinner" 
        style={spinnerStyle}
        role="status"
        aria-live="polite"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;