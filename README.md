# 实训云手机端（前端）

## 基本介绍

这是“实训云手机端”项目的前端，是大二的在校实训作业。

它是通过SpringBoot+Vue来模拟实训云网站的手机端APP（但代码实现本身并不是APP而是网站），前后端分离，采用了Shiro整合Redis，是一个学习项目。

> 关于实训云：是我校教辅平台，用于交实训作业



## 安装

- 本项目使用的JAVA版本为`1.8.0_121`，Nodejs版本`v16.14.2`

- 需要自行安装redis

- 导入数据库文件 [](practice.sql)并在[](src/main/resources/application.yml)中修改数据库密码

- 前端部分 [Monster20220101/practice_fount](https://github.com/Monster20220101/practice_fount) 需要安装Node的依赖模块（node_modules)：在前端项目的终端输入`npm install`



## 运行

- 运行项目前要先打开redis

- 后端部分：在IDEA中运行application类启动项目

- 前端部分：前端项目的终端输入 `npm run dev` 运行项目。在浏览器按`F12`打开控制台，`Ctrl+Shift+M`开启设备仿真，可以选择iPhone SE等尺寸



## 技术栈介绍

### 1. 后端技术栈：

- 框架：springboot

- 数据层：mybatis-plus

- 权限框架：shiro

- 缓存：redis

- 用户身份凭证：jwt

### 2. 前端技术栈：

- vue2
- vant组件库
- axios

### 3. 数据库：

MySQL

- id采用雪花算法
- 数据库自动填充字段create_time和update_time



# 其余请参见 [Monster20220101/practice](https://github.com/Monster20220101/practice?tab=readme-ov-file#实训云手机端后端)

