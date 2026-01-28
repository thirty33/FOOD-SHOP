import React, { useState } from 'react';

interface CompactPreviousOrderButtonsProps {
  onRepeat: (e: React.MouseEvent) => void;
  onViewPrevious: (e: React.MouseEvent) => void;
  onRepeatInfo: (e: React.MouseEvent) => void;
  onViewInfo: (e: React.MouseEvent) => void;
}

const CompactInfoIcon: React.FC<{ onClick: (e: React.MouseEvent) => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-state text-green-100 text-[9px] font-cera-bold hover:bg-green-100 hover:text-white transition-colors"
    aria-label="Informacion"
  >
    ?
  </button>
);

export const CompactPreviousOrderButtons: React.FC<CompactPreviousOrderButtonsProps> = ({
  onRepeat: _onRepeat,
  onViewPrevious,
  onRepeatInfo: _onRepeatInfo,
  onViewInfo,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownOpen((prev) => !prev);
  };

  /* DISABLED: Used by commented Repetir button
  const handleDropdownRepeat = (e: React.MouseEvent) => {
    setDropdownOpen(false);
    _onRepeat(e);
  };
  */

  const handleDropdownView = (e: React.MouseEvent) => {
    setDropdownOpen(false);
    onViewPrevious(e);
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {/* Mobile: dropdown */}
      <div className="md:hidden">
        <button
          onClick={toggleDropdown}
          className="w-5 h-5 flex items-center justify-center rounded-full bg-white bg-opacity-90 text-green-100 text-[10px] font-cera-bold shadow-sm"
        >
          ⋯
        </button>
        {dropdownOpen && (
          <div className="absolute top-7 left-0 bg-white rounded-lg shadow-lg py-1 z-20 w-[100px]">
            {/* DISABLED: Repetir button
            <div className="flex items-center justify-between px-2 py-2 hover:bg-gray-100">
              <button
                onClick={handleDropdownRepeat}
                className="text-[11px] text-green-100 font-cera-medium"
              >
                Repetir
              </button>
              <CompactInfoIcon onClick={onRepeatInfo} />
            </div>
            */}
            <div className="flex items-center justify-between px-2 py-2 hover:bg-gray-100">
              <button
                onClick={handleDropdownView}
                className="text-[11px] text-green-100 font-cera-medium"
              >
                Repetir
              </button>
              <CompactInfoIcon onClick={onViewInfo} />
            </div>
          </div>
        )}
      </div>

      {/* Desktop: inline buttons */}
      <div className="hidden md:flex items-center gap-1">
        {/* DISABLED: Repetir button
        <div className="flex items-center gap-0.5">
          <button
            onClick={onRepeat}
            className="py-0.5 px-1.5 bg-white bg-opacity-90 text-green-100 font-cera-medium text-[9px] rounded-full hover:bg-yellow-active hover:text-white transition-colors leading-tight"
          >
            Repetir
          </button>
          <CompactInfoIcon onClick={onRepeatInfo} />
        </div>
        */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={onViewPrevious}
            className="py-0.5 px-1.5 bg-white bg-opacity-90 text-green-100 font-cera-medium text-[9px] md:text-xs rounded-full hover:bg-yellow-active hover:text-white transition-colors leading-tight"
          >
            Repetir
          </button>
          <CompactInfoIcon onClick={onViewInfo} />
        </div>
      </div>
    </div>
  );
};