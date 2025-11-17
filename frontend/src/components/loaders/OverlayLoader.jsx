// src/components/loaders/OverlayLoader.jsx
import Spinner from "./Spinner";

/**
 * OverlayLoader — a full-screen loading overlay with blur and optional text.
 * 
 * @param {string} [text="Loading..."] - Custom message to display under the spinner.
 */
const OverlayLoader = ({ text = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
      <Spinner size={36} />
      <p className="text-white text-sm">{text}</p>
    </div>
  );
};

export default OverlayLoader;
