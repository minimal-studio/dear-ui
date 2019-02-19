import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Call, IsFunc } from 'basic-helper';

import MapperFilter from './mapper-filter';
import { Icon } from '../icon';

const isStringNumRegex = /\d+,?/;

const tdSpecClassMapper = {
  checkbox: 'check-td'
};

const tdMaxWidth = 400;

// const excludeKey = (target, keys) => {
//   let res = Object.assign({}, target);
//   keys.forEach(item => {
//     res[item] = '';
//   });
//   return res;
// };

// const excludeKeys = ['records', 'keyMapper'];

/**
 * 提供一个快速的表格数据渲染容器，不需要关注具体如何渲染，只需要传入对应的数据和过滤器
 *
 * @export
 * @class Table
 * @extends {MapperFilter}
 */
export default class Table extends MapperFilter {
  static propTypes = {
    /** 表格渲染的核心配置，RecordRender 的机制是根据 keyMapper 配置遍历 records 中的每一个具体字段，找到对应的过滤器，实现通用的表格处理 */
    keyMapper: PropTypes.arrayOf(PropTypes.shape({
      /** 字段的 key */
      key: PropTypes.string.isRequired,
      /** 该字段的过滤器函数，可以返回任意类型 */
      filter: PropTypes.func,
      /** 是否日期+时分秒 */
      datetime: PropTypes.any,
      /** 是否日期 */
      date: PropTypes.any,
      /** 是否格式化成金钱 */
      money: PropTypes.any,
      /** 单个格子的宽度 */
      w: PropTypes.any,
      /** 是否以绝对值格式化成金钱 */
      abvMoney: PropTypes.any,
      /** 是否以绝对值格式化成金钱 */
      count: PropTypes.any,
      /** 该字段的值的映射 mapper */
      namesMapper: PropTypes.shape({
        key: PropTypes.string
      }),
    })).isRequired,
    /** 需要渲染的目标记录 */
    records: PropTypes.arrayOf(PropTypes.object).isRequired,
    /** 是否需要统计 */
    needCount: PropTypes.bool,
    /** 是否需要排序 */
    needSort: PropTypes.bool,
    /** 是否多选 */
    needCheck: PropTypes.bool,
    /** checkbox 的宽度 */
    checkWidth: PropTypes.number,
    /** 无视的排序字段 */
    sortIgnores: PropTypes.arrayOf(PropTypes.string),
    /** 当选中时往表格顶部嵌入的内容 */
    whenCheckAction: PropTypes.any,
  };
  static defaultProps = {
    sortIgnores: [],
    needCheck: false,
    needSort: true,
    checkWidth: 30,
    needCount: false,
  };
  excludeField = ['action', 'checkbox'];
  sortIgnores = ['action', 'checkbox'];
  constructor(props) {
    super(props);

    this.state = {
      headerWidthMapper: [],
      containerWidth: 'auto',
      sortField: '',
      isDesc: false,
      checkedItems: {},
    };

    this.firstTDDOMs = {};
    this.sameSortTime = 0;
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeCalcSize);
    this.calcSize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeCalcSize);
  }

  componentDidUpdate() {
    this.calcSize();
  }

  /**
   * 清除所有已选择的内容
   *
   * @memberof TableBody
   * @public
   */
  clearCheckeds = () => {
    this.toggleAllItems(false);
  }

  toggleSelectItem = (item, idx) => {
    const { checkedItems } = this.state;
    const nextCheckedItems = {...checkedItems};
    if(nextCheckedItems[idx]) {
      delete nextCheckedItems[idx];
    } else {
      nextCheckedItems[idx] = item;
    }
    this.selectItems(nextCheckedItems, idx);
  }

  toggleAllItems(allCheck) {
    const { checkedItems } = this.state;
    let nextCheckedItems = {...checkedItems};
    if(!allCheck) {
      nextCheckedItems = {};
    } else {
      this.props.records.forEach((item, idx) => nextCheckedItems[idx] = item);
    }
    this.selectItems(nextCheckedItems);
  }

  selectItems(nextState, idx) {
    const { onCheck } = this.props;
    this.checkedItems = nextState;
    this.setState({
      checkedItems: nextState
    });
    Call(onCheck, nextState, idx);
  }

  getCheckbox = (str, item, mapper, idx) => {
    const { checkedItems } = this.state;
    let checked = !!checkedItems[idx];
    return (
      <input type="checkbox"
        checked={checked} onChange={e => this.toggleSelectItem(item, idx)}/>
    );
  }
  
  getKeyMapper = () => {
    const { keyMapper = [], needCheck, checkWidth } = this.props;

    let result = keyMapper;

    if(needCheck) {
      const checkExtend = {
        key: 'checkbox',
        w: checkWidth,
        filter: this.getCheckbox
      };
      result = [checkExtend, ...keyMapper];
    }

    return result;
  }

  calcSize() {
    let nextHeaderWidthMapper = [];
    let nextContainerWidth = 0;
    const { headerWidthMapper } = this.state;
    const keyMapper = this.getKeyMapper();
    if(Object.keys(this.firstTDDOMs).length === 0) return;
    keyMapper.forEach((_, tdIdx) => {
      let currTDDOM = this.firstTDDOMs[tdIdx];
      let currWidth = currTDDOM.offsetWidth || headerWidthMapper[tdIdx];
      nextHeaderWidthMapper[tdIdx] = currWidth;
      nextContainerWidth += nextHeaderWidthMapper[tdIdx];
    });
    if(
      nextHeaderWidthMapper.join(',') !== headerWidthMapper.join(',')
    ) {
      const tableRenderWidth = this.tableRenderDOM.offsetWidth;
      this.setState({
        headerWidthMapper: nextHeaderWidthMapper,
        containerWidth: nextContainerWidth > tableRenderWidth ? nextContainerWidth : 'auto'
      });
    }
  }

  resizeCalcSize = () => {
    const {containerWidth} = this.state;
    if(containerWidth != 'auto' && containerWidth < this.tableRenderDOM.offsetWidth) {
      this.setState({
        containerWidth: 'auto'
      });
    }
    this.calcSize();
  }

  ignoreFilter(str) {
    return [...this.sortIgnores, ...this.props.sortIgnores].indexOf(str) !== -1;
  }

  getMapperItemsDOM(record, parentIdx, needCount, needAction = true) {
    if(!record) return;
    const keyMapper = this.getKeyMapper();
    const keyMapperLen = keyMapper.length;

    let result = [];

    for (let _idx = 0; _idx < keyMapperLen; _idx++) {
      const mapperItem = keyMapper[_idx];
      if(!mapperItem) continue;

      const { key, className, count = true } = mapperItem;
      const currText = record[key];
      const actionRes = (!needAction && this.excludeField.indexOf(key) !== -1) ? '-' : this.mapperFilter(mapperItem, record, parentIdx);

      if(needCount) {
        const isNum = !isNaN(+currText) || isStringNumRegex.test(currText);
        if(count && isNum) {
          // 这里是处理累加的逻辑，如果为字符串的字段，则先把逗号去除
          const isNumbTxt = +((currText + '').replace(',', ''));
          if(!isNaN(isNumbTxt) && typeof isNumbTxt === 'number') {
            this.statistics[key] = (this.statistics[key] || 0) + isNumbTxt;
          }
        }
      }

      const tdKey = key + '_' + currText;
      let style = {};
      let _className = className;
      
      result.push(
        <td
          ref={tdDOM => {
            if(parentIdx == 0 && tdDOM) {
              this.firstTDDOMs[_idx] = tdDOM;
            }
            if(tdDOM && tdDOM.offsetWidth >= tdMaxWidth) tdDOM.classList.add('break-word');
          }}
          style={mapperItem.w ? {width: mapperItem.w, whiteSpace: 'pre-wrap'} : style}
          className={(tdSpecClassMapper[key] || '') + (_className ? ' ' + _className : '')}
          key={tdKey}>
          {actionRes}
        </td>
      );
    }

    return result;
  }

  getStatisticDOM(record) {
    if(this.props.needCount && Object.keys(record).length > 0) return this.getMapperItemsDOM(record, 'statistics', false, false);
  }

  getHeaderWidth() {
    const { headerWidthMapper } = this.state;
    let result = 0;
    const keyMapper = this.getKeyMapper();
    keyMapper.forEach((item, idx) => {
      if(item) result += headerWidthMapper[idx];
    });
    return result;
  }

  recordDescFilter() {
    const { sortField, isDesc } = this.state;
    const { records } = this.props;
    if(!sortField) return records;
    let result = [...records];
    result.sort((itemPrev, itemNext) => {
      let sortTargetPrev = itemPrev[sortField];
      let sortTargetNext = itemNext[sortField];

      let res;

      switch (true) {
      case typeof sortTargetPrev == 'string':
        res = sortTargetPrev.localeCompare(sortTargetNext);
        break;
      case typeof sortTargetPrev == 'number':
        res = sortTargetPrev - sortTargetNext;
        break;
      }

      return isDesc ? res : res * -1;
    });
    return result;
  }

  orderRecord(orderKey) {
    if(this.ignoreFilter(orderKey)) return;
    this.setState(({isDesc, sortField}) => {
      let _isDesc = isDesc;
      if(sortField == orderKey) {
        this.sameSortTime += 1;
        if(this.sameSortTime === 2) {
          _isDesc = false;
          orderKey = '';
          this.sameSortTime = 0;
        } else {
          _isDesc = !_isDesc;
        }
      } else {
        this.sameSortTime = 0;
        _isDesc = false;
      }
      return {
        sortField: orderKey,
        isDesc: _isDesc
      };
    });
  }

  saveTable = e => {
    if(e) this.tableRenderDOM = e;
  }

  render() {
    const {
      needCount, height, whenCheckAction, needCheck, needSort
    } = this.props;
    const {
      headerWidthMapper, containerWidth, sortField, isDesc,
      checkedItems
    } = this.state;
    const records = this.recordDescFilter();
    const hasRecord = records.length > 0;
    const keyMapper = this.getKeyMapper();

    const checkedItemLen = Object.keys(checkedItems).length;
    const isAllCheck = hasRecord && (checkedItemLen == records.length);

    if(!Array.isArray(records)) {
      console.error('records 必须为 []');
      return <span/>;
    }

    /** 统计字段，每一次统计都是一个新对象 */
    this.statistics = {};

    const hasChecked = Object.keys(checkedItems).length != 0;

    const tableHeader = (
      <div className="table-body-scroll" style={{width: containerWidth}}>
        <table className="table nomargin table-header">
          <thead>
            <tr>
              {
                keyMapper.map((item, idx) => {
                  if(!item) return;
                  const { key, w } = item;
                  const currHeaderWidth = w || headerWidthMapper[idx];
                  
                  let title = '';
                  if(key !== 'checkbox') {
                    title = this.titleFilter(item, idx);
                    // currHeaderWidth = 
                  } else {
                    title = (
                      <input type="checkbox" checked={isAllCheck}
                        onChange={e => this.toggleAllItems(e.target.checked)}/>
                    );
                  }

                  const isOrdering = sortField == key;
                  const sortTip = isOrdering ? (
                    <span className="caret" style={{
                      transform: `rotate(${!isDesc ? '180deg' : '0deg'})`
                    }}/>
                  ) : null;
                  const clickHandlerForTh = needSort ? {
                    onClick: () => this.orderRecord(key)
                  } : {};
                  return (
                    <th 
                      className={`${isOrdering ? ('_order ' + (isDesc ? '_desc ' : '_asc ')) : ''}_btn`}
                      key={key} 
                      {...clickHandlerForTh}
                      style={{
                        width: currHeaderWidth
                      }}>
                      {title}
                      {sortTip}
                    </th>
                  );
                })
              }
            </tr>
          </thead>
        </table>
      </div>
    );

    const tableBody = hasRecord ? (
      <div className="table-body-scroll" style={{height, width: containerWidth}}>
        <table className="table nomargin table-body">
          <tbody>
            {
              records.map((record, _idx) => {
                if(!record) return;
                const { _highlight = '' } = record;
                let idx = _idx;
                return (
                  <tr
                    key={idx}
                    className={_highlight}>
                    {this.getMapperItemsDOM(record, idx, needCount)}
                  </tr>
                );
              })
            }
            {
              this.props.needCount ? (
                <tr className="theme">
                  {this.getStatisticDOM(this.statistics)}
                </tr>
              ) : null
            }
          </tbody>
        </table>
      </div>
    ) : (
      <span className="no-record-tip">
        <Icon n="noData"/>
        <span className="text">暂无记录</span>
      </span>
    );

    return (
      <div className={"table-render" + (hasChecked ? ' has-checked' : '')}
        ref={this.saveTable}>
        {
          needCheck && whenCheckAction ? (
            <div className={"checked-actions" + (hasChecked ? ' show' : '')}>
              <span className="mr10">已选 <span className="t_green">{checkedItemLen}</span> 项, 点击<span className="link" onClick={this.clearCheckeds}>取消</span>全部</span>
              {whenCheckAction}
            </div>
          ) : null
        }
        {tableHeader}
        {/* {hideTable} */}
        {tableBody}
      </div>
    );
  }
}
