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
