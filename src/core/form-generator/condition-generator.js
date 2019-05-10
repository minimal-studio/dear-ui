import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';

import { UUID, Call } from 'basic-helper';
import FormFilterHelper from './form-filter';
import FormTypes from './form-filter-types';

/**
 * 查询条件生成器
 *
 * @export
 * @class ConditionGenerator
 * @extends {FormFilterHelper}
 */
export default class ConditionGenerator extends FormFilterHelper {
  static propTypes = {
    /** 查询条件的配置 */
    conditionConfig: PropTypes.arrayOf(
      PropTypes.shape({
        /** 该项的引用 ID */
        ref: PropTypes.string,
        /** 范围类的 ref 组合 */
        refs: PropTypes.array,
        /** 输入选择器的 ref 值，一个控件需要有变换 ref 的时候使用 */
        refu: PropTypes.object,
        /** 是否必填 */
        required: PropTypes.bool,
        /** 控件的类型 */
        type: PropTypes.oneOf(FormTypes),
      })
    ).isRequired,
    /** 查询条件变化时的回调 */
    onChange: PropTypes.func,
    /** className */
    className: PropTypes.string
  };
  static defaultProps = {
    className: "condition-group"
  }
  titleDisplayFilter(config) {
    const { type, title } = config;
    return ('input,password'.split(',').indexOf(type) == -1) && title;
  }
  renderWrapper = () => {
    const { conditionConfig, className, children, onSubmit } = this.props;
    const Wrapper = onSubmit ? 'form' : 'div';
  }
  render() {
    const { conditionConfig, className, children, onSubmit } = this.props;
    const Wrapper = onSubmit ? 'form' : 'div';

    return (
      <Wrapper
        className={className} 
        onSubmit={(e) => {
          e.preventDefault();
          Call(onSubmit, this.value);
        }}>
        {
          conditionConfig.map((condition, idx) => {
            if(!condition || typeof condition === 'string') return;
            let _con = this.wrapConditionTitle(condition);
            const { ref, refs = [], refu = [] } = _con;
            let itemKey = ref || refs[0] || JSON.stringify(refu);
            let showTitle = this.titleDisplayFilter(_con);
            
            let titleDOM = showTitle && (
              <span className="title">
                {_con.tipsDOM}
                {_con.title}
              </span>
            );

            return (
              <span key={itemKey} className={"item " + _con.type + (_con.className ? ' ' + _con.className : '')}>
                {titleDOM}
                {this.greneratFormDOM(_con)}
              </span>
            );
          })
        }
        {children}
      </Wrapper>
    );
  }
}
