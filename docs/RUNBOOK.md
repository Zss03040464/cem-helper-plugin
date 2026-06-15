# 运行手册

此文档提供了如何在本地开发和测试此项目的步骤。

## 安装

```bash
git clone <your-fork-url> agent-form-filler
cd agent-form-filler
npm install
```

## 单元测试

运行所有测试确保核心功能正常工作：

```bash
npm test
```

## 脱敏审计

在每次提交前运行以下命令检查代码中是否包含禁止提交的敏感信息：

```bash
npm run audit
```

如果输出包含 `[WARNING]`，请根据提示检查并移除相关内容。

## 加载浏览器扩展

1. 打开浏览器开发者模式，例如 Chrome 的 `chrome://extensions` 页面。
2. 选择“加载已解压的扩展程序”，指向 `extension` 目录。
3. 打开 `examples/mock-form.html` 文件，即可在扩展的作用下观察自动填表和审核面板。

## 开发新功能

你可以修改 `src/rules.js` 增加更多平台和字段规则，或修改 `src/sanitizer.js` 添加新的脱敏模式。修改后运行测试和审计脚本确保正确。

## 发布流程

当准备发布新版本时：

1. 确认所有敏感信息已被移除，并通过 `npm run audit` 验证。
2. 更新 `package.json` 中的 `version` 字段。
3. 更新 `CHANGELOG.md`（如果存在）。
4. 提交到新的分支并推送到你的仓库。
5. 在 GitHub 上创建 Pull Request，供其他维护者审核。
