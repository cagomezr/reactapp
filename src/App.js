import React from "react";

import "./App.css";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import YoutubeEmbedVideo from "youtube-embed-video";
const needle = require("needle");

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: "login"
    };
    this.changeRoute = this.changeRoute.bind(this);
  }

  changeRoute = newRoute => {
    this.setState({
      route: newRoute
    });
  };

  render() {
    if (this.state.route !== "login" && !authService.isAuthenticated) {
      this.setState({ route: "login" });
    }
    switch (this.state.route) {
      case "login":
        return <LoginPage changeRoute={this.changeRoute} />;
      case "video":
        return <VideoPage changeRoute={this.changeRoute} />;
      case "pdf":
        return <PdfPage changeRoute={this.changeRoute} />;
      default:
        return null;
    }
  }
}

const authService = {
  isAuthenticated: false,
  authenticate: async password => {
    const res = await needle(
      "post",
      "https://secret-badlands-46682.herokuapp.com/securelogin",
      { username: "admin", password: password },
      { json: true }
    );

    if (res && res.body.pdf && res.body.video) {
      const { body } = res;
      authService.isAuthenticated = true;
      localStorage.setItem("pdf", body.pdf);
      localStorage.setItem("video", body.video);
      return true;
    } else {
      authService.isAuthenticated = false;
      alert("Invalid password!");
      return false;
    }
  },
  signout: () => {
    authService.isAuthenticated = false;
    localStorage.clear();
  }
};

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      redirect: false
    };
  }
  render() {
    return (
      <center>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h1>Assignment 1 - Group 1 - SQL Injection</h1>
          <h2>Please enter the password</h2>
          <TextField
            id="standard-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            margin="normal"
            onChange={(e, data) => {
              e.preventDefault();
              this.setState({
                password: e.target.value
              });
            }}
            style={{ width: 500, alignSelf: "center" }}
          />
          <Button
            variant="contained"
            style={{ width: 300, alignSelf: "center" }}
            onClick={async () => {
              await authService.authenticate(this.state.password);
              if (authService.isAuthenticated) {
                this.props.changeRoute("pdf");
              }
            }}
          >
            LOGIN
          </Button>
        </div>
      </center>
    );
  }
}

const VideoPage = props => {
  return (
    <div>
      <center>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Button
            variant="contained"
            style={{ width: 300, alignSelf: "center" }}
            onClick={async () => {
              authService.signout();
              props.changeRoute("login");
            }}
          >
            Logout
          </Button>
          <center>
            <YoutubeEmbedVideo
              videoId={
                localStorage
                  .getItem("video")
                  .split("https://www.youtube.com/watch?v=")[1]
              }
              suggestions={false}
            />
          </center>
          <Button
            variant="contained"
            style={{ width: 300, alignSelf: "center" }}
            onClick={async () => {
              if (authService.isAuthenticated) {
                props.changeRoute("pdf");
              }
            }}
          >
            BACK
          </Button>
        </div>
      </center>
    </div>
  );
};

const PdfPage = props => {
  return (
    <div>
      <center>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Button
            variant="contained"
            style={{ width: 300, alignSelf: "center" }}
            onClick={async () => {
              authService.signout();
              props.changeRoute("login");
            }}
          >
            Logout
          </Button>
          <center>
            <iframe
              title="pdf"
              src={localStorage.getItem("pdf")}
              width="640"
              height="480"
            ></iframe>
          </center>
          <Button
            variant="contained"
            style={{ width: 300, alignSelf: "center" }}
            onClick={async () => {
              if (authService.isAuthenticated) {
                props.changeRoute("video");
              }
            }}
          >
            VIEW VIDEO
          </Button>
        </div>
      </center>
    </div>
  );
};
export default App;
