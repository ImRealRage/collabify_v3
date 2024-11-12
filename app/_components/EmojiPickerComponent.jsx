import EmojiPicker from 'emoji-picker-react';
import { useState, useEffect, useRef } from 'react';

function EmojiPickerComponent({ children, setEmojiIcon }) {
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const pickerRef = useRef(null);  // Reference to the EmojiPicker component
  const containerRef = useRef(null); // Reference to the container (button, etc.)

  // Close the picker when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current && !containerRef.current.contains(event.target) && 
        pickerRef.current && !pickerRef.current.contains(event.target)
      ) {
        setOpenEmojiPicker(false); // Close the picker if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div ref={containerRef} onClick={() => setOpenEmojiPicker(true)}>
        {children}
      </div>
      {openEmojiPicker && (
        <div ref={pickerRef} className="absolute z-10">
          <EmojiPicker
            emojiStyle="facebook"
            onEmojiClick={(e) => {
              setEmojiIcon(e.emoji);
              setOpenEmojiPicker(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default EmojiPickerComponent;
