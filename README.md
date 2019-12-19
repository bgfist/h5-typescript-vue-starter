# 项目结构

- assets：图片等静态资源
- business：业务相关
- components：公共组件
- core：应用入口、核心骨架
- store：全局状态 vuex
- styles：全局样式
- types：全局 ts 类型
- utils：工具方法
- views：页面

# 项目约定

- 业务相关的逻辑全部写到`business`目录下
  - api：业务后端接口
  - config：业务配置
  - constants：业务常量
  - helpers：业务工具方法
  - literals：业务文案
- 业务无关的工具方法全部写到`utils`目录下
  - ajax：网络请求
  - store：本地存储
  - validators：数据校验
- plugins 和 mixins 写到`core`目录下
  - 数量不多，但影响全局
  - 要在`types`目录下添加相应类型文件
- 组件、过滤器建议用全局注册，方便使用
  - 过滤器的实现写在`utils`目录下或者`business/helpers`中
- vue 组件的文件名采用大写形式，以 Qy 开头，并在 types 目录下添加相应类型文件
- vue 组件的 computed 属性需要标注返回值类型
  - [https://cn.vuejs.org/v2/guide/typescript.html#%E6%A0%87%E6%B3%A8%E8%BF%94%E5%9B%9E%E5%80%BC]
- SFC 组件的书写顺序为 `template`->`script`->`style`
- 推荐用 html 语法写`template`，IDE 有更好的文档和格式化支持
- Vue Router 跳转用`name`，不要用 path

# TodoList

- 打包配置
  - [x] 阿里云 oss 上传
  - [x] 后台通用主题样式配置，sass 编译配置
- 实现主要公共组件
  - [ ] QyApp：应用布局、导航菜单、面包屑、顶部 tab
  - [ ] QyForm：表单提交
  - [ ] QyTable：表格展示(支持从 url 中填充查询参数)
  - [ ] QyDialog：表单提交模态框
- 通用 vuex 状态实现
  - [ ] 服务器配置(通用枚举值)
  - [ ] 登录用户信息
  - [ ] 导航及对应的路由权限逻辑（前端控制）
- 实现通用工具方法
  - [x] ajax 重构，支持传自定义参数(如：是否显示全局 loading)
  - [ ] 通用数据校验器 validators
- [ ] 实现页面无缝传参(json 序列化)
