import React from 'react';
import { IconButton } from '@material-ui/core';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import { getTarget } from '../core/utils';

const ImageButton = ({ onSelectFile }) => {
  const inputRef = React.useRef();

  const handleOpen = () => {
    inputRef.current.click();
  };

  const handleFileChange = ev => {
    if (ev.type === 'input') {
      return;
    }

    const target = getTarget(ev);
    const file = target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function() {
        onSelectFile(reader.result);
      };
      reader.readAsDataURL(file);
      target.value = '';
    }
  };

  return (
    <>
      <IconButton size="small" onClick={handleOpen}>
        <AddPhotoAlternateIcon />
      </IconButton>
      <input
        className="hidden"
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
      />
    </>
  );
};

export default ImageButton;
