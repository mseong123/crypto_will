import React, { useState } from 'react';

function Tooltip({ text, children }) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const showTooltip = () => setIsTooltipVisible(true);
  const hideTooltip = () => setIsTooltipVisible(false);

  return (
    <div className="tooltip-container" onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
      {children}
      {isTooltipVisible && <div className="tooltip-text">{text}</div>}
    </div>
  );
}

export default Tooltip;