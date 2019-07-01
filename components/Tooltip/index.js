import React, { memo, useState, useRef, Fragment } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './Tooltip.less';
export default memo(({ position, content }) => {
    const [displayTooltip, setDisplayTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const tooltipElement = useRef(null);
    const handleMouseOver = (e) => {
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
                top: target.offsetTop -
                    tooltipElement.current.clientHeight / 2 +
                    target.clientHeight / 2,
                left
            });
        });
    };
    const handleMouseLeave = () => setDisplayTooltip(!displayTooltip);
    return (React.createElement(Fragment, null,
        React.createElement("div", { className: "tip-trigger", onMouseOver: handleMouseOver, onMouseLeave: handleMouseLeave }, "[?]"),
        React.createElement(ReactCSSTransitionGroup, { transitionName: "fade", transitionEnterTimeout: 250, transitionLeaveTimeout: 250 }, displayTooltip && (React.createElement("div", { ref: tooltipElement, className: "tip", style: {
                top: `${tooltipPosition.top}px`,
                left: `${tooltipPosition.left}px`
            } }, content)))));
}, (prevProps, nextProps) => prevProps.position === nextProps.position && prevProps.content === nextProps.content);
//# sourceMappingURL=index.js.map