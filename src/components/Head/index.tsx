import React, { ReactElement } from "react";
import Helmet from "react-helmet";

export default (): ReactElement => (
  <Helmet>
    <link
      rel="stylesheet"
      type="text/css"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    />
    <link
      href="https://fonts.googleapis.com/css?family=Rubik+Mono+One&display=swap"
      rel="stylesheet"
    />
  </Helmet>
);
