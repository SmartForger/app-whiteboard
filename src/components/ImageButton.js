import React from 'react';
import { IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const ImageButton = ({ onSelectFile }) => {
  const inputRef = React.useRef();

  const handleOpen = () => {
    inputRef.current.click();
  };

  const handleFileChange = ev => {
    if (ev.type === 'input') {
      return;
    }

    const file = ev.path[0].files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function() {
        console.log(reader.result);
        onSelectFile(reader.result);
      };
      reader.readAsDataURL(file);
      ev.path[0].value = '';
    }
  };

  return (
    <>
      <IconButton size="small" onClick={handleOpen}>
        <AddIcon />
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
