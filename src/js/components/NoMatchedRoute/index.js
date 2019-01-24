import React from 'react';
import './NoMatchedRoute.less';

//import pagenotfoundIMG from IMGURL}

// If NoMatchedRoute, App may not be (properly) called... React hates that? Might need some tweaks

// Problem: this code doesn't get reached at the moment, thanks to bad URLs throwing errors from JSON.parse()
export default function() {
  return (
    <div >
      {/*<img src={pagenotfoundIMG} alt="404" />*/}
    </div>
    console.log("No matching route!");
  );
}

{/* normal class declaration
    class NoMatchedRoute extends React.Component {
    render() {
        return (
            <div>
                <h3>404 - Page not found</h3>
            </div>
        );
    }
}

export default NoMatchedRoute; */}
