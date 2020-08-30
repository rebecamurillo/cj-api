# cj-api

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

## Setup 

### 1. Loopback
Setup Loopback (https://loopback.io/doc/en/lb4/Getting-started.html)
```bash
npm i -g @loopback/cli
npm start
```

### 2. Database 
Run the following commands to install DB schema (https://loopback.io/doc/en/lb4/todo-list-tutorial-sqldb.html)
```bash
$ npm run build
$ npm run migrate
```

## Create routes and models

### Create datasource
```bash
lb4 controller
```

### Create model
```bash
lb4 model
```
### Create repository
```bash
lb4 repository
```

### Create controller
```bash
lb4 controller
```

When updating files (deletion, etc), run the following commands to update the environment files. 
```bash
npm run clean
npm run build
``` 