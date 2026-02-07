// src/components/loaders/Spinner.jsx

/**
 * Spinner — a simple customizable circular loading indicator.
 * 
 * @param {number} [size=20] - Size of the spinner in pixels.
 * @param {string} [className=""] - Additional Tailwind or custom classes.
 */
const Spinner = ({ size = 20, className = "" }) => {
  return (
    <div
      className={`loader-spinner ${className}`}
      style={{
        width: size,
        height: size,
      }}
      aria-label="Loading"
    />
  );
};

export default Spinner;
