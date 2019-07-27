import React from 'react';

import Menu, { MenuProps } from './menu';
import { DivideType } from '../utils/props';

export interface MenuItemData extends MenuProps {
  /** 点击 Menu 的回调 */
  action?: Function;
}

export interface MenusProps {
  /** Menus 数据，可以为对象，如果为 '-' 或 'hr'，则渲染分隔线 */
  data: (MenuItemData & DivideType)[];
}

const menuDividGroup = ['-', 'hr'];

const Menus: React.SFC<MenusProps> = (props) => {
  const { data, children } = props;
  return (
    <span className="uke-menus">
      {
        data ? data.map((item, idx) => {
          if (menuDividGroup.indexOf(item) !== -1) {
            return (
              <hr key={idx} />
            );
          }
          const { action, id, ...other } = item;
          return (
            <Menu key={id || idx} onClick={action} {...other} />
          );
        }) : children
      }
    </span>
  );
};

export default Menus;
