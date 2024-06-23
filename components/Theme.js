import React, { createContext, useState, useContext } from 'react';
import { commonColors, darkColors, lightColors } from '../utils/colors';

const Theme = createContext();

export const useTheme = () => useContext(Theme);

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [colors, setColors] = useState({...lightColors})

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);
    if(isDarkTheme){
      setColors(lightColors)
    }else{
      setColors(darkColors)
      
    }
  };

  return (
    <Theme.Provider value={{ isDarkTheme, toggleTheme, colors }}>
      {children}
    </Theme.Provider>
  );
};