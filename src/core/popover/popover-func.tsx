import React, {Component, PureComponent} from 'react';
import ReactDOM from 'react-dom';

import Popover from './popover';
import setDOMById from '../set-dom';

export class PopoverHelper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      relativeElem: null,
      open: false,
      children: null
    };
  }
  closePopover() {
    console.warn('closePopover 要被废弃了，请使用 close');
    this.close();
  }
  close() { 
    this.setState({
      open: false
    });
  }
  showPopover() {
    this.show(...arguments);
  }
  show(elem, isShow, children, props) {
    const _isShow = typeof isShow !== 'undefined' ? isShow : !this.state.open;
    this.setState(prevState => {
      return {
        ...props,
        relativeElem: elem || prevState.relativeElem,
        open: _isShow,
        children: children || prevState.children
      };
    });
  }
}

class PopoverWrapper extends PopoverHelper {
  render() {
    return (
      <Popover
        {...this.props}
        {...this.state}
        onClose={e => this.close()} />
    );
  }
}

class PopoverEntity {
  constructor(options = {}) {
    const { id = 'topPopover', fixed = false } = options;
    this.id = id;
    this.prevProps = {fixed};
    this.popoverEntity = {};
    this.prevOptions = {};

    this.lifeTimer = null;

    this.initDOM({});
  }
  savePopWrapper = e => {
    if(!e) return;
    this.popoverEntity = e;
  }
  initDOM(props) {
    let topPopoverDOM = setDOMById(this.id);

    const popoverWrapper = (
      <PopoverWrapper
        {...props}
        ref={this.savePopWrapper}/>
    );
    ReactDOM.render(
      popoverWrapper,
      topPopoverDOM,
    );
  }
  showPopover() {
    console.warn('showPopover 要被废弃了，请使用 show 或者 set');
    this.show(...arguments);
  }
  setPopover() {
    console.warn('setPopover 要被废弃了，请使用 show 或者 set');
    this.show(...arguments);
  }
  show(options) {
    options.open = true;
    this.set(options);
  }
  set(options) {
    const _options = Object.assign({}, this.prevOptions, options);
    const {
      elem, children, open, props = this.prevProps
    } = _options;
    this.prevProps = props;
    this.prevOptions = _options;

    this.popoverEntity.show(elem, open, children, props);
  }
  close() {
    const nextState = {
      open: false
    };
    this.set(nextState);
  }
  delayClose(timer = 5000) {
    if(this.lifeTimer) clearTimeout(this.lifeTimer);
    this.lifeTimer = setTimeout(() => {
      this.close();
    }, timer);
  }
}

const GlobalPopover = new PopoverEntity();
const Pop = GlobalPopover;

/**
 * 例子
 * GlobalPopover.setPopover({
 *   position, width = 400, onClose, elem, children, open, props = prevProps, id = 'topPopover'
 * })
 * id: 用于区分不同的 popover ，避免关闭错误
 */


export {
  Pop, GlobalPopover, PopoverEntity
};
