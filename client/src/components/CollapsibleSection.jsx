import { useId } from 'react';
import './CollapsibleSection.css';

export default function CollapsibleSection({
  icon,
  title,
  count,
  previewContent,
  isExpanded,
  onToggle,
  isEmpty = false,
  emptyMessage = 'No data available',
  children,
  className = '',
  showEmptyCount = false,
}) {
  // Generate unique IDs for ARIA attributes
  const uniqueId = useId();
  const headerId = `section-header-${uniqueId}`;
  const contentId = `section-content-${uniqueId}`;

  // Handle keyboard events for accessibility
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div
      className={`collapsible-section ${isExpanded ? 'expanded' : 'collapsed'} ${className}`}
    >
      <button
        id={headerId}
        className="section-header"
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${title} section`}
        type="button"
      >
        <div className="section-header-left">
          <span className="section-icon" aria-hidden="true">
            {icon}
          </span>
          <h5 className="section-title">{title}</h5>
          {(count > 0 || showEmptyCount) && (
            <span
              className={`section-count-badge ${count === 0 ? 'empty' : ''}`}
              aria-label={`${count} ${count === 1 ? 'item' : 'items'}`}
            >
              {count}
            </span>
          )}
        </div>
        <div className="section-header-right">
          {!isExpanded && previewContent && (
            <span className="section-preview">{previewContent}</span>
          )}
          <span
            className={`chevron ${isExpanded ? 'down' : 'right'}`}
            aria-hidden="true"
          >
            {isExpanded ? '▼' : '▶'}
          </span>
        </div>
      </button>

      <div
        id={contentId}
        className={`section-content ${isExpanded ? 'visible' : 'hidden'}`}
        role="region"
        aria-labelledby={headerId}
        aria-hidden={!isExpanded}
      >
        {isExpanded && (
          <>
            {isEmpty ? (
              <p className="empty-state">{emptyMessage}</p>
            ) : (
              children
            )}
          </>
        )}
      </div>
    </div>
  );
}
