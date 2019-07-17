import React, {Component, PureComponent} from 'react';

export default function LoadingDOMSnip() {
  return (
    <div>
      <div className="loader1">
        <div className="block" />
        <div className="block" />
        <div className="block" />
        <div className="block" />
      </div>
      <div className="mask" />
    </div>
  );
}
