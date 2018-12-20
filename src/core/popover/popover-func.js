import React, {Component, PureComponent} from 'react';
import ReactDOM from 'react-dom';

import Popover from './popover';

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
  show(elem, isShow, children) {
    const _isShow = typeof isShow !== 'undefined' ? isShow : !this.state.open;
    this.setState(prevState => {
      return {
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
      width = 400, onClose, elem, children, open, props = this.prevProps
    } = _options;
    this.prevProps = props;
    this.prevOptions = _options;

    let topPopoverDOM = document.querySelector('#' + this.id);
    if(!topPopoverDOM) {
      topPopoverDOM = document.createElement('div');
      topPopoverDOM.id = this.id;
      document.body.appendChild(topPopoverDOM);
    }

    const popoverWrapper = (
      <PopoverWrapper
        {...props}
        ref={_popoverEntity => {
          if(!_popoverEntity) return;
          this.popoverEntity = _popoverEntity;
          this.popoverEntity.show(elem, open, children);
        }}/>
    );
    ReactDOM.render(
      popoverWrapper,
      topPopoverDOM,
    );
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
