/**
 * This file serves as an alias for Analyse.jsx to fix import path inconsistencies
 * Some components reference Analyze.jsx while the actual implementation is in Analyse.jsx
 */

import React from 'react';
import Analyse from './Analyse';

// This component is an alias for Analyse.jsx to prevent import errors
const Analyze = () => {
  return <Analyse />;
};

export default Analyze;