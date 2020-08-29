import React, {
  memo,
  ReactElement,
  useState,
  useEffect,
  useRef,
  Fragment
} from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import "./Tooltip.less";

interface TooltipProps {
  position: string;
  content: string;
}

export default memo(
  ({ position, content }: TooltipProps): ReactElement => {
    const [displayTooltip, setDisplayTooltip] = useState<boolean>(false);

    const [tooltipPosition, setTooltipPosition] = useState<{
      top: number;
      left: number;
    }>({ top: 0, left: 0 });
    const tooltipElement = useRef<HTMLDivElement>(null);
    const tooltipTrigger = useRef<HTMLDivElement>(null);

    const handleMouseLeave = (): void => setDisplayTooltip(!displayTooltip);

    useEffect(() => {
      const trigger = tooltipTrigger.current;
      const tip = tooltipElement.current;

      if (tip === null || trigger === null) return;

      let left;

      const leftOffset = trigger.offsetLeft;
      const targetOffsetWidth = trigger.offsetWidth;
      const targetOffsetWidthHalf = targetOffsetWidth / 2;

      switch (position) {
        case "right":
          left = leftOffset + targetOffsetWidth + targetOffsetWidthHalf;

          break;
        case "left":
          left = leftOffset - tip.clientWidth - targetOffsetWidthHalf;

          break;

        default:
          left = 0;
      }

      setTooltipPosition({
        top:
          trigger.offsetTop - tip.clientHeight / 2 + trigger.clientHeight / 2,
        left
      });
    }, [displayTooltip]);

    return (
      <Fragment>
        <div
          className="tip-trigger"
          onMouseOver={() => setDisplayTooltip(true)}
          onMouseLeave={handleMouseLeave}
          ref={tooltipTrigger}
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
  },
  (prevProps, nextProps) =>
    prevProps.position === nextProps.position &&
    prevProps.content === nextProps.content
);
