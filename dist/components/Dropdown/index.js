import React, { memo, Fragment, useState, useRef, Children, useEffect } from 'react';
import './Dropdown.less';
export default memo(({ children, selectedOption, tabs, dropdownWrapperCssClassName, optionsWrapperCssClass, selectedOptionCssClassName }) => {
    const [options, setOptions] = useState(false);
    const [selectedTab, setSelectedTab] = useState('');
    const tabsLabels = [];
    if (tabs) {
        Children.toArray(children).forEach((entry) => tabsLabels.indexOf(entry.props.identifier) === -1 &&
            tabsLabels.push(entry.props.identifier));
        useEffect(() => setSelectedTab(tabsLabels[0]), []);
    }
    const optionsWrapper = useRef(null);
    const optionsWithTabs = useRef(null);
    const dropdownTabs = useRef(null);
    const handleOpenOptions = () => {
        if (options)
            return;
        setOptions(true);
        document.addEventListener('click', handleClickWhenOptionsAreOpen);
    };
    const handleClickWhenOptionsAreOpen = (e) => {
        if ((tabs !== undefined && dropdownTabs.current.contains(e.target)) ||
            e.target === optionsWrapper.current ||
            e.target === optionsWithTabs.current)
            return;
        setOptions(false);
        document.removeEventListener('click', handleClickWhenOptionsAreOpen);
    };
    return (React.createElement("div", { className: dropdownWrapperCssClassName },
        React.createElement("div", { onClick: handleOpenOptions, className: selectedOptionCssClassName },
            selectedOption,
            React.createElement("i", { className: `fa fa-chevron-circle-${options ? 'up' : 'down'} fa-lg` })),
        options && (React.createElement("div", { ref: optionsWrapper, className: optionsWrapperCssClass },
            tabs && (React.createElement(Fragment, null,
                React.createElement("ul", { ref: dropdownTabs, className: tabs.cssClass }, tabsLabels.map(tabLabel => (React.createElement("li", { key: tabLabel, onClick: () => setSelectedTab(tabLabel), className: selectedTab === tabLabel ? tabs.activeCssClass : '' }, tabLabel)))),
                React.createElement("div", { className: tabs.optionsCssClass, ref: optionsWithTabs }, Children.map(children, (option) => {
                    if (option.props.identifier === selectedTab)
                        return option;
                })))),
            !tabs && children))));
}, (prevProps, nextProps) => prevProps.selectedOption === nextProps.selectedOption);
//# sourceMappingURL=index.js.map