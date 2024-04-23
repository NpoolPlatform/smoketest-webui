<a href="https://github.com/NpoolPlatform/smoketest-webui/actions/workflows/ci.yml"><img src="https://github.com/NpoolPlatform/smoketest-webui/workflows/test/badge.svg" alt="build status"></a>

# smoketest webui v1 (smoketest-webui-v1)

vue3 framework use quasar ui and pinia manage store

## middleware CRUD语义及规范
- Create语义：创建资源，需要检查api权限，创建成功返回空，创建错误返回错误信息；若携带ID创建，不会使用该ID，若携带EntID创建，需要使用携带的EntID创建
- Update语义：携带ID或EntID更新，或者携带ID和EntID更新，需要检查ID和EntID匹配以及资源有效性以及api权限，若找不到删除的对象，需要返回错误信息（由于现使用新的实现，当除了ID和EntID外，其他参数都未传的时候需要统一报错处理，如update nothing）
- Exist语义：判断EntID是否存在，只需要检查EntID是否存在
- ExistConds语义：判断满足条件的记录是否存在，只需要检查满足调试的记录是否存在
- Delete语义：使用ID或EntID删除，需要检查ID或者EntID是否存在且能够删除，使用ID和EntID删除，需要检查ID和EntID匹配，实作上通常先取出记录，然后删除，如果取出记录失败，直接返回空，如果记录不存在不返回错误，返回空；删除成功也返回空
- Get语义：将EntID指定记录取出，Get语义如果记录不存在不返回错误，返回空
- Gets语义：将符合条件的记录取出
- GetOnly语义：将符合条件且仅有一条记录的记录取出，GetOnly语义如果记录不存在不返回错误，返回空，如果多于一条记录返回错误
- 资源唯一性：不再由Redis锁控制，创建或更新时由数据库的exists子句来确认资源唯一性（需要将deleted_at不为0的资源排除在外）
- query：query需要同时支持query，exist的写法，将公共的query部分提取到basequery.go，queryHandler和existHandler继承baseQueryHandler使用相同的query过程
- 当一个接口的参数在同一个数据库时，需要检查ID和EntID的有效性
- 当一个接口的参数不在同一个数据库时，仅需检查EntID为UUID即可

## gateway CRUD语义及规范
- Update：需要携带ID和EntID更新，找不到记录需要返回错误信息
- Delete：需要携带ID和EntID删除，找不到记录需要返回错误信息
- gateway增加check pattern
- 跨模块的检查放在gateway，其他检查放在middleware

## gateway path规范
- 大后台操作的grpc path统一加上Admin前缀，如AdminGetFees
- 大后台操作的http path统一加上admin，如/v1/admin/get/appfees
- 携带Admin前缀的接口应该包含TargetAppID，以及TargetUserID（如果需要获取某用户信息）

## middleware和gateway
- middleware需要支持全部不需要和其他模板交互的业务逻辑
- gateway需要支持跨模块的检查
- middleware和gateway每个接口都需要做入参合法性检查（gw如果检查返回的是grpc的报错，则说明gw没有处理，需要补上检查）

## 用例命名规范（未更新）
- master分支，采用```服务名-接口名-序号-用例描述```，如：
  - appuser-gateway-CreateUser-1-创建邮箱用户成功
  - appuser-gateway-CreateUser-2-邮箱已被注册，创建用户失败
- feature分支，采用```服务名-接口名-feature-序号-用例描述```，如：
  - appuser-gateway-feature-CreateUser-1-创建邮箱用户成功

## 测试计划命名规范
- 采用```环境-服务名-分支-日期-序号```，如
  - appuser-gateway-master-testplan(每个服务的base测试计划，仅管理员可修改，供其他人克隆使用)
  - sh-dev-appuser-gateway-master-testplan-2023072517-1
  - sh-dev-appuser-gateway-feature-testplan-2023072517-1
  - yz-testing-appuser-gateway-testing-testplan-2023072517-1

## 测试用例description内容规范
- 待补充

## 开发使用smoketest自测流程
- 向管理员申请smoketest账号
- 管理员为其添加tester权限
- 开发人员在开发环境部署feature分支代码
- 开发人员在smoktest添加feature分支测试用例```命名遵循上述规范```
- 开发人员克隆开发服务或依赖服务的master分支的测试计划```命名遵循上述规范```
- 开发人员为该测试计划添加新的分支测试用例
- 开发人员执行测试并导出测试结果并附加在提测邮件
- 测试完成，代码合并master后，管理员修改测试用例及base测试计划

## 权限控制
- 仅管理员可删除用例及计划
- 待补充
  
## 用例添加条件参考
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
