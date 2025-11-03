/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

interface AdPlaceholderProps {
  width: number;
  height: number;
  label: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ width, height, label }) => {
  return (
    <div
      className="bg-slate-700/50 border border-slate-600 rounded-lg flex items-center justify-center text-slate-400 text-sm"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div className="text-center">
        <p>{label}</p>
        <p className="text-xs">({width}x{height})</p>
      </div>
    </div>
  );
};

export default AdPlaceholder;
