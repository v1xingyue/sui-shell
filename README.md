# sui-shell

基于sui的shell 登录权限管理

## 具体实现流程

1. shell提供者将基本信息注册到链上称为ServerInfo
2. shell使用者 注册信息(重点是公钥信息，该配对私钥用于shell登录验证)
3. shell使用者 通过ServerInfo 向提供者申请shell 权限
4. shell 提供者通过 shell 权限申请 (目前直接通过即可)
5. shell 运行环境通过ServerInfo 获取允许的用户列表，并创建相应的用户，添加用户公钥
6. shell使用者 使用配对私钥登录目标lshel 完成授权

