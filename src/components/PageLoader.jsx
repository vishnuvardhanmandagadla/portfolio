import React from "react";
import "./PageLoader.css";

const PageLoader = ({ phase, progress }) => {
  const isActive = phase !== "done";
  const isRevealing = phase === "reveal";

  if (!isActive) {
    return null;
  }

  return (
    <div
      className={`page-loader ${isActive ? "page-loader--visible" : ""} ${
        isRevealing ? "page-loader--reveal" : ""
      }`}
      aria-hidden={isRevealing ? "true" : "false"}
    >
      <div className="page-loader__background">
        <div className="page-loader__amoeba page-loader__amoeba--1"></div>
        <div className="page-loader__amoeba page-loader__amoeba--2"></div>
        <div className="page-loader__amoeba page-loader__amoeba--3"></div>
        <div className="page-loader__amoeba page-loader__amoeba--4"></div>
        <div className="page-loader__amoeba page-loader__amoeba--5"></div>
        <div className="page-loader__amoeba page-loader__amoeba--6"></div>
      </div>
      <div className="page-loader__glass"></div>
      <div className="page-loader__content">
        <div className="page-loader__percentage">{progress}%</div>
      </div>
    </div>
  );
};

export default PageLoader;