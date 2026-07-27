# Task: Refresh stakeholder cases and deploy production

- **日期**：2026-07-27
- **状态**：进行中
- **关联**：GitHub #18、#19、#20、#21、#22、#23、#24、#25

## Problem / 目标

甲方提供新的 `案例.zip` 并确认其中四个真实项目目录、23 张照片及目录归属均可公开，需要以该案例包替换现有案例，修复首页案例区溢出，将案例地图复用到首页，统一标签页标题和页脚展示，并更正已确认的 ISO 14001 编号。全部改动必须经过固定候选验收后部署到现有生产服务器，并保留可验证回滚来源。

## 核心思路

使用 GitHub #18 作为今日发布闭环，六个原生子 Issue 分别负责 OSS 素材、案例实现、ISO 更正、发布候选、生产部署和首页/全局展示。每个实现 Issue 同时交付代码、测试和对应文档，并以独立提交进入 `origin/main`。`案例.zip` 的项目文件夹是权威关联证据；页面不强制补齐来源未提供的详情字段，也不公开内部素材溯源。旧 OSS 对象保留以支持回滚。地图视觉优化由独立非阻塞 #24 跟踪。

## 受影响的文件 / 模块

- `frontend/src/data/projects.json`、`frontend/src/data/case-map.json`、`frontend/src/types/index.ts` — 四项最新案例、可选详情字段和三个地图点。
- `frontend/src/components/case-map/`、`frontend/src/components/case-carousel/`、`frontend/src/pages/cases/` — 地图复用、案例列表/详情和首页溢出修复。
- `frontend/src/config/pageMeta.ts`、`frontend/**/*.html`、`frontend/src/components/footer/` — 标签页标题与页脚展示。
- `frontend/src/data/company.json` — ISO 14001 三语更正。
- `frontend/src/data/image-resources.json`、`ai-memories/materials/` — 23 张图片的 OSS 登记、授权和内部溯源。
- `frontend/tests/` — 案例、首页、全局壳、About 和发布回归契约。
- `CONTEXT.md`、`README.md`、`ai-memories/memories/`、`ai-memories/releases/` — 领域、运行方式、状态和发布证据。

## 分步计划

- [x] Step 1: 完成 grilling/domain-modeling，创建 #18 及六个执行子 Issue，并建立原生父子和阻塞关系；创建非阻塞地图优化 #24。
- [x] Step 2: 处理四个项目的 23 张图片，更新授权台账和资源登记，上传 OSS 并回读验证。
- [x] Step 3: 用甲方案例包更新案例模型、列表、详情和三个有地理依据的地图点。
- [x] Step 4: 完成首页地图复用、案例卡溢出、页脚、浏览器标题和 ISO 14001 更正。
- [x] Step 5: 更新测试和项目文档，执行完整回归并记录固定发布候选。
- [ ] Step 6: 推送候选，备份当前生产站，部署固定提交并完成线上验收。
- [ ] Step 7: 记录发布结果，关闭全部执行 Issue 和总 Issue；在总结中向甲方询问浩达项目地点。

## Debug Notes

- 2026-07-27 甲方确认 `案例.zip` 是最新权威案例包；四个真实项目目录中的 23 张照片均已获准公开，文件夹归类足以证明项目归属。
- 2026-07-27 浩达工具说明未提供地点；案例保留但不生成地图点，最终总结必须请求甲方确认地点。
- 2026-07-27 甲方确认 `ISO140001` 为笔误，正确编号是 `ISO14001`；旧任务和旧发布记录保留当时待确认的历史事实。
- 2026-07-27 当前 macOS 缺少 OpenCV、系统 `cwebp` 和 `ossutil`，现有忽略目录中的 `cwebp.exe` 是 Windows PE 文件；甲方已批准安装本机所需工具。
- 2026-07-27 使用 Python 3.14 隔离环境、OpenCV 和原生 `cwebp` 将 23 张图限制在 1MP、quality 70；19.6MB 原图生成 1.4MB WebP。首次运行因 Homebrew 缺失 `libtiff.6.dylib` 全部明确失败，补装 `libtiff` 后 23/23 成功。
- 2026-07-27 使用最小前缀权限的 `ossutil` 上传 23 个新对象；公开 CDN 全部返回 HTTP 200、`image/webp`，旧 OSS 对象未删除或覆盖。
- 2026-07-27 首页代表性项目区直接复用案例中心地图，并为轮播卡片增加稳定锚点；移除轮播容器负右边距后横向滚动限制在组件内。全站静态和运行时标题统一为“格灵空调”，共用页脚不再展示 tagline。类型检查、23 项测试和生产构建通过。
- 2026-07-27 固定 `9742d1ba7998c37e0239f63bedb80f6822320d10` 为唯一应用候选；根路径和 `/rc/` 构建各连续两次得到稳定的 47 文件摘要。Chrome 150 在五个宽度、三个关键路由和三种语言下通过无横向溢出、地图/链接和语言状态检查；23 张新增 OSS 图片再次全部通过。

## Lessons Learned

- 待任务完成后填写。
