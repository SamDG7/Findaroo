import React from 'react';
import { IoSettingsSharp } from 'react-icons/io5';

const SettingsButton = ({ onClick }) => {
  return (
    <button onClick={onClick}>
      <IoSettingsSharp size="24px" />
    </button>
  );
};

export default SettingsButton;
