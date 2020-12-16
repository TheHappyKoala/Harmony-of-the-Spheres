// Then import it with 'import MyForm from "./myform.js"'.
// Finally, add a <MyForm/> element whereever you wish to display the form.

import React from "react";

export default class MyForm extends React.Component {
  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.state = {
      status: ""
    };
  }

  render() {
    const { status } = this.state;
    return (
      <form
        onSubmit={this.submitForm}
        action="https://formspree.io/f/mjvbdard"
        method="POST"
      >
        <h2>Contact</h2>
        <p>
          If you have feedback, want to report a bug, say hi or suggest a
          feature, feel free to send us a message by using the contact form
          below.
        </p>
        <label className="top">Email:</label>
        <input type="email" name="email" />
        <label className="top">Message:</label>
        <textarea name="message" />
        {status === "SUCCESS" ? (
          <p>Thanks. We will get in touch with you as soon as possible.</p>
        ) : (
          <button className="button box top">Submit</button>
        )}
        {status === "ERROR" && <p>Ooops! There was an error.</p>}
      </form>
    );
  }

  submitForm(ev) {
    ev.preventDefault();
    const form = ev.target;
    const data = new FormData(form);
    const xhr = new XMLHttpRequest();
    xhr.open(form.method, form.action);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;
      if (xhr.status === 200) {
        form.reset();
        this.setState({ status: "SUCCESS" });
      } else {
        this.setState({ status: "ERROR" });
      }
    };
    xhr.send(data);
  }
}
