# @deer-ui

基于 React 的可扩展的 UI 库，用最简单的方式开发 web 应用。

## Feature

- [x] 基于 Flex 布局系统
- [x] 表单控制器（FormController）
  - [x] 声明式表单逻辑
- [x] 功能 Table
  - [x] 固定表头
  - [x] 固定前后列（Fixed Column）
- [x] 设备支持
  - [x] Desktop
  - [x] Mobile
- [x] 代码提示（code hint）
- [x] 服务端渲染（SSR）
  - [x] Gatsby
  - [x] Next

## Usage

> @deer-ui/core

```shell
yarn add @deer-ui/core @mini-code/base-func unistore
```

> @deer-ui/core 扩展 UI 库，可选

```shell
yarn add @deer-ui/enhance-ui @deer-ui/core @mini-code/base-func unistore
```

## FormController quick start

```js
import React, { useState } from 'react';
import {
  FormLayout, Button, Radio,
  FormOptions, FormLayoutBtnsConfig
} from '@deer-ui/core';

const FormLayoutDemo = () => {
  const [layout, setLayout] = useState('horizontal');
  const [resDesc, setResDesc] = useState('');

  const submit = (formData, actingRef) => {
    // 模拟获取数据
    setTimeout(() => {
      setResDesc({
        hasErr: false,
        resDesc: '成功'
      });
    }, 800);
  }

  const formBtns: FormLayoutBtnsConfig = [
    {
      action: (formRef, actingRef) => {
        submit(formRef.value, actingRef);
      },
      type: 'submit',
      text: 'Button',
      actingRef: 'forTest'
    },
  ];

  const formOptions: FormOptions = [
    {
      type: 'input',
      ref: 'InputField',
      defaultValue: '123',
    },
    {
      type: 'radio',
      ref: "RadioField",
      values: {
        radioValue1: 'radioText1',
        radioValue2: 'radioText2',
      }
    }
  ];

  return (
    <>
      <Radio
        onChange={nextLayout => setLayout(nextLayout)}
        defaultValue="horizontal"
        values={{
          'horizontal': '水平布局',
          'vertical': '垂直布局',
          'flow': '流布局',
        }} />
      <FormLayout
        layout={layout}
        formBtns={formBtns}
        onChange={(changedValues, ref, currChangeValue) => {

        }}
        formOptions={formOptions}/>
    </>
  );
}
ReactDOM.render(
  <FormLayoutDemo />,
  document.querySelector('#Main')
);
```

## Local dev

```shell
git clone https://github.com/minimal-studio/deer-ui
cd deer-ui
yarn; yarn dev:doc
```

## Reference

- [Online Doc](https://ui.thinkmore.xyz/)
- [CHANGELOG](./CHANGELOG.md)
