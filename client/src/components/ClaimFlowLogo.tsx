import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const ClaimFlowLogo: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 100 100">
      {/* Background circle */}
      <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.1" />
      
      {/* Main shield shape */}
      <path
        d="M50 10 L75 25 L75 50 Q75 70 50 85 Q25 70 25 50 L25 25 Z"
        fill="currentColor"
        opacity="0.8"
      />
      
      {/* Inner checkmark */}
      <path
        d="M35 45 L45 55 L65 35"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Flow lines */}
      <path
        d="M20 75 Q30 70 40 75 Q50 80 60 75 Q70 70 80 75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </SvgIcon>
  );
};

export default ClaimFlowLogo;
