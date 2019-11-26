import React, { useState } from 'react';
import { ConditionGenerator } from '@deer-ui/core/form-generator';
import { setLangTranslate, setUILang } from '../../utils';

const E = () => {
  let domRef;
  const [lang, setLang] = useState('zh-CN');
  const langMapper = {
    'en-US': {
      时间: 'Date',
      单选控件: 'Radio',
      范围: 'range'
    },
    'zh-CN': {
      value1: '值1',
    },
  };
  return (
    <div>
      <span className="btn theme" onClick={(e) => {
        const nextLang = lang == 'zh-CN' ? 'en-US' : 'zh-CN';
        setLangTranslate(langMapper);
        setUILang(nextLang);
        setLang(nextLang);
      }}>{lang}</span>
      <hr />
      <ConditionGenerator
        ref={(e) => domRef = e}
        onChange={(values, ref, val) => {
          console.log(values);
          if (ref === 'ref1') {
            domRef.changeValue(val, 'ref_for_input');
          }
        }}
        onSubmit={(value) => {
          console.log(value);
        }}
        conditionConfig={[
          {
            refs: ['startDate', 'endDate'],
            type: 'datetimeRange',
            needTime: true,
            title: '带默认时间',
            range: [
              '2019-05-05 00:00:00',
              '2019-05-06 00:00:00',
            ],
          },
          {
            refs: ['startDate3', 'endDate3'],
            type: 'datetimeRange',
            needTime: false,
            outputAsString: true,
            title: '时间',
            range: [],
          },
          {
            refs: ['startDate2', 'endDate2'],
            type: 'datetimeRange',
            needTime: true,
            title: '时间',
            range: [],
          },
          {
            ref: 'ref1',
            tips: [123, 321, 222],
            type: 'radio',
            title: '单选控件',
            values: {
              value1: 'value1',
              value2: 'value2',
              value3: 'value3',
            }
          },
          {
            ref: 'input',
            type: 'input',
            title: '输入',
          },
          {
            ref: 'refSelector',
            type: 'select',
            title: '多选控件',
            isMultiple: true,
            isNum: true,
            defaultValue: [1, 2],
            values: {
              1: 'value1',
              2: 'value2',
              3: 'value3',
            }
          },
          {
            ref: 'ref_for_input',
            refForS: 'ref_for_selector',
            type: 'input-selector-s',
            title: '选择输入框',
            values: {
              value1: 'value1',
              value2: 'value2',
              value3: 'value3',
            }
          },
          {
            ref: 'ref2',
            type: 'select',
            title: '选择控件',
            values: {
              value1: 'value1',
              value2: 'value2',
              value3: 'value3',
            }
          },
          {
            refs: ['s', 'e'],
            type: 'input-range',
            title: '范围',
            range: [0, 10]
          },
        ]}>
        <div>
          <hr />
          <button type="submit" className="theme btn mr10">查看查询条件的值</button>
          <span onClick={(e) => domRef.clearValue()} className="theme btn red">清空条件</span>
        </div>
      </ConditionGenerator>
    </div>
  );
};
