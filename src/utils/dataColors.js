import { rgbToHex } from '@mui/material';

export const getColor = (trafico) => {
  switch (trafico) {
    case 'Normal':
      return rgbToHex('rgb(146,208,80)');
    case 'Trafico Ligero':
      return rgbToHex('rgb(255,192,0)');
    case 'Trafico Moderado':
      return rgbToHex('rgb(255,0,0)');
    case 'Trafico Pesado':
      return rgbToHex('rgb(192,0,0)');
    case 'Embotellamiento':
      return rgbToHex('rgb(102,0,102)');
    default:
      return 'black';
  }
};
