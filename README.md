# vue_shop

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

# 查询物流的接口貌似不能用，查询物流功能未完成，订单列表 修改功能没有接口，包括商品列表的修改操作也没有接口

笔记：

# 登录/退出功能

## 登录业务的相关技术点

- http 是无状态的
- 通过 cookie 在客户端记录状态
- 通过 session 在服务端记录状态
- 通过 token 方式维持状态(存在跨域问题使用 token 维持登录状态)

## 实现登录功能

- 登录页面的布局--使用 Element-UI 布局
- - 使用的组件：el-from el-from-item el-input el-button 字体图标

## git

- git status =>查看当前目录有是否干净
- git chenkout -b 名字 => 创建一个分支
- git checkout => 切换分支
- git branch =>查看当前所处分支
- 合并分支
- - git merge \*\*\*\* 要合并的分支名称
- 在远程创建分支
- - git push -u origin \*\*\*(分支名称)
