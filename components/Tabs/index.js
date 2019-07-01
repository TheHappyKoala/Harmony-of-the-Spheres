import React, { Fragment, useState, Children, isValidElement } from 'react';
export default ({ initTab, tabsWrapperClassName, tabsContentClassName, children, noCloseButton }) => {
    const [selectedTabIndex, setSelectedTabIndex] = useState(initTab === undefined ? -1 : initTab);
    const panes = Children.toArray(children);
    return (React.createElement("div", { className: tabsWrapperClassName },
        React.createElement("ul", null, panes.map((child, i) => (React.createElement("li", { key: i, onClick: () => setSelectedTabIndex(i), className: i === selectedTabIndex ? 'active-sidebar-tab' : '' }, isValidElement(child) && (React.createElement(Fragment, null,
            child.props['data-icon'] !== undefined && (React.createElement("i", { className: child.props['data-icon'] })),
            React.createElement("p", null, child.props['data-label']))))))),
        selectedTabIndex !== -1 && (React.createElement("div", { className: tabsContentClassName },
            panes[selectedTabIndex],
            !noCloseButton && (React.createElement("i", { className: "fa fa-window-close fa-2x tabs-close-button", onClick: () => setSelectedTabIndex(-1) }))))));
};
//# sourceMappingURL=index.js.map