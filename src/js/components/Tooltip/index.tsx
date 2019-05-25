import React, { memo, ReactElement, useState, useRef, Fragment } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './Tooltip.less';

interface TooltipProps {
  position: string;
  content: string;
}

export default memo(({ position, content }: TooltipProps): ReactElement => {
  const [displayTooltip, setDisplayTooltip] = useState<boolean>(false);

  const [tooltipPosition, setTooltipPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const tooltipElement = useRef(null);

  const handleMouseOver = (e: any) => {
    const target = e.target;

    Promise.resolve(setDisplayTooltip(!displayTooltip)).then(() => {
      let left;

      const leftOffset = target.offsetLeft;
      const targetOffsetWidth = target.offsetWidth;
      const targetOffsetWidthHalf = targetOffsetWidth / 2;

      switch (position) {
        case 'right':
          left = leftOffset + targetOffsetWidth + targetOffsetWidthHalf;

          break;
        case 'left':
          left =
            leftOffset -
            tooltipElement.current.clientWidth -
            targetOffsetWidthHalf;

          break;
      }

      setTooltipPosition({
        top:
          target.offsetTop -
          tooltipElement.current.clientHeight / 2 +
          target.clientHeight / 2,
        left
      });
    });
  };

  const handleMouseLeave = (): void => setDisplayTooltip(!displayTooltip);

  return (
    <Fragment>
      <div
        className="tip-trigger"
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
      >
        [?]
      </div>
      <ReactCSSTransitionGroup
        transitionName="fade"
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
      >
        {displayTooltip && (
          <div
            ref={tooltipElement}
            className="tip"
            style={{
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`
            }}
          >
            {content}
          </div>
        )}
      </ReactCSSTransitionGroup>
    </Fragment>
  );
}, (prevProps, nextProps) => prevProps.position === nextProps.position && prevProps.content === nextProps.content);
