import React from 'react';
import { styled } from '@mui/material/styles';

const Separator = styled('div')(
    ({ theme }) => `
    height: ${theme.spacing(3)};
    `,
);
  
function MySeparator() {
  return (
    <Separator />
  )
}

export default MySeparator;