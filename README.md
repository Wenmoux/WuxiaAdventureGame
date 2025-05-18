# 剑指风云录：青萍之末 (文字武侠冒险)

<p align="center">
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-blue" alt="license MIT"></a>
    <a href="https://github.com/wenmoux/WuxiaAdventureGame"><img src="https://img.shields.io/github/stars/wenmoux/WuxiaAdventureGame?style=social" alt="GitHub Stars"></a>
</p>

## 项目简介

《剑指风云录：青萍之末》是一款基于浏览器的文字武侠冒险游戏。玩家将扮演一位初出茅庐的少年“凌云”，在风云变幻的江湖中历练成长，遭遇奇遇，邂逅佳人，习得绝世武学，并最终影响整个武林的格局。游戏通过丰富的剧情分支、多样的选择和属性检定，为玩家带来沉浸式的文字冒险体验。

## 技术栈

- **前端框架**: [Vue.js 3](https://cn.vuejs.org)
- **构建工具**: [Vite](https://cn.vite.dev)
- **状态管理**: [Pinia](https://pinia.vuejs.org/zh)
- **UI 风格**: 定制化UI，营造武侠/古风氛围 (未使用大型UI组件库)
- **路由**: [Vue Router](https://router.vuejs.org/zh/)

## 主要功能/系统
- [x] **动态剧情系统**：基于节点和选择的非线性叙事
- [x] **角色属性系统**：体力、武力、敏捷、悟性、声望、金钱等
- [x] **物品包裹系统**：武器、防具、消耗品、关键物品的获取与管理
- [x] **技能系统**：被动与主动技能的学习与应用
- [x] **好感度系统**：与关键NPC的互动影响关系
- [x] **成就系统**：记录玩家的探索与里程碑
- [x] **图鉴系统 (CG Gallery)**：收集角色、场景、事件的精美图片
- [x] **故事标记 (Flags)**：驱动剧情变化和条件判断
- [x] **属性/技能检定**：基于角色能力和运气的挑战机制
- [x] **游戏日志系统**：记录剧情、选择和重要事件
- [x] **存档/读档系统**：支持游戏进度保存与加载
- [ ] **战斗系统 (简化/规划中)**：目前为属性检定，未来可扩展
- [ ] **道具制作/合成 (规划中)**：利用收集的材料制作新物品
- [ ] **更多NPC与支线任务 (持续扩展)**

## 快速开始 (NPM部署)

```bash
# 克隆项目 (如果项目已在GitHub上)
# git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
# cd YOUR_REPO_NAME

# 安装依赖
npm install

# 开发环境运行 (通常会启动在 http://localhost:5173)
npm run dev

# 构建生产版本 (生成 dist 文件夹)
npm run build

# 预览生产版本 (需要先构建)
npm run preview
