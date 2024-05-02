import React from "react";

const AboutUs: React.FC = () => {
  const style: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "88vh",
    width: "auto",
    backgroundColor: "white",
    color: "grey",
    fontFamily: "Courier New",
    padding: "0 20px",
    boxSizing: "border-box",
    textAlign: "center",
  };

  const headerStyle: React.CSSProperties = {
    color: "black",
    marginBottom: "20px",
  };

  const textStyle: React.CSSProperties = {
    width: "700px",
    fontSize: "1.5rem",
  };

  const footerStyle: React.CSSProperties = {
    marginTop: "20px",
  };

  const spanStyle: React.CSSProperties = { color: "black" };

  return (
    <div style={style}>
      <h1 style={headerStyle}>About the MarketPlace</h1>
      <p style={textStyle}>
        This is a web development project presenting a website for an online
        marketplace. The page is made with TypeScript, React and a Node backend.
      </p>
      <p style={footerStyle}>
        <span style={spanStyle}>Made by</span> Matias Frimodig
      </p>
    </div>
  );
};

export default AboutUs;
