<a href="https://github.com/NpoolPlatform/smoketest-webui/actions/workflows/ci.yml"><img src="https://github.com/NpoolPlatform/smoketest-webui/workflows/test/badge.svg" alt="build status"></a>

# smoketest webui v1 (smoketest-webui-v1)

vue3 framework use quasar ui and pinia manage store


## 用例添加原则
### create
- 所有参数齐全且正确，创建成功，接口返回参数齐全且正确
- 确定不可重复的参数，重复创建接口返回正确（根据情况报错或返回数据）
- 特定场景下，不同APP，允许相同值
- 必填参数缺失
- 必填参数值为空
- 可选参数缺失
- 可选参数值为空
- 存在固定值的参数，需要覆盖全部值（如used_for）
- 固定type类型的值不存在
- UUID类型字段不存在
- UUID类型字段存在但与AppID不匹配
- UUID类型字段非UUID
- grpc -d参数缺失
- grpc -d '{}'

### update
- 所有参数齐全且正确，更新成功，接口返回参数齐全且正确
- 不同APP，允许更新为相同值
- 更新参数值与当前值相同，更新成功
- 更新参数值与数据库其他记录相同，更新失败
- 更新时，必填参数为空，更新失败
- 更新时，必填参数值为空，更新失败
- 更新时，不传可选参数，更新成功
- UUID类型字段不存在
- UUID类型字段存在但与AppID不匹配
- UUID类型字段非UUID
- ID已被删除，更新失败
- 存在固定值的参数，需要覆盖全部值（如used_for）
- grpc -d参数缺失
- grpc -d '{}'

### get
- 不传offset,limit，返回默认前100条，且数据正确
- offset=0 limit=0，返回默认前100条，且数据正确
- offset=0 limit=1，返回数据正确
- offset=99 limit=1，返回数据正确
- 不同APP，get返回数据正确
- limit > 100，返回数据正确
- limit > 全部数据，返回正确
- UUID类型字段不存在
- UUID类型字段存在但与AppID不匹配
- UUID类型字段非UUID
- 必填参数缺失
- 数据记录已被deleted，返回数据正确
- 数据库无数据，返回数据正确

### delete
- 所有参数齐全且正确，删除成功
- 重复删除，能正确处理
- UUID类型字段不存在/非UUID
- 各字段组合关系不存在
- 必填参数缺失，删除失败
- 必填参数值为空，删除失败
- 可选参数缺失，删除成功
- 可选参数值为空，删除成功

## Install the dependencies
```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
yarn lint
```

### Build the app for production
```bash
quasar build
```

### compatible babel

> yarn add @babel/preset-env babel-jest @babel/core --dev

### practice of unit test link

+ [Vue Test Utils](https://test-utils.vuejs.org/guide/)
+ [Pinia Test](https://pinia.vuejs.org/cookbook/testing.html)
+ [Pinia Test Example](https://github.com/vuejs/pinia/blob/v2/packages/testing/src/testing.spec.ts)
+ [Quasar Test Example](https://github.com/quasarframework/quasar-testing/blob/dev/packages/unit-jest/src/templates/typescript/test/jest/___tests__/MyButton.spec.ts)

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
