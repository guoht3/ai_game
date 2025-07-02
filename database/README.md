# 游戏数据库系统

这是一个基于 SQL.js 的游戏资产和卡片管理系统，支持资产编码、数据存储和读取功能。

## 文件结构

```
database/
├── README.md              # 说明文档
├── asset_table.sql        # 资产表SQL定义
├── card_table.sql         # 卡片表SQL定义
├── database_manager.js    # 数据库管理器核心类
└── usage_example.js       # 使用示例代码

resource/
├── photo/                 # 图片资产文件夹
├── text/                  # 文本资产文件夹
├── sheet/                 # 表格资产文件夹
├── method/                # 方法资产文件夹
├── audio/                 # 音频资产文件夹
├── video/                 # 视频资产文件夹
├── config/                # 配置资产文件夹
└── script/                # 脚本资产文件夹
```

## 数据表设计

### 资产表 (asset)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | VARCHAR(15) | 资产编号，格式：类型代号+序号 |
| asset_type | VARCHAR(3) | 资产类型代号 |
| relative_path | TEXT | 资产相对路径 |

**资产类型代号：**
- `PHO` - 图片资产 (PHOTO)
- `TEX` - 文本资产 (TEXT)
- `SHE` - 表格资产 (SHEET)
- `MET` - 方法资产 (METHOD)
- `AUD` - 音频资产 (AUDIO)
- `VID` - 视频资产 (VIDEO)
- `CFG` - 配置资产 (CONFIG)
- `SCR` - 脚本资产 (SCRIPT)

**编号示例：** `PHO001`, `TEX001`, `MET001`

### 卡片表 (card)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | VARCHAR(15) | 卡片编号，格式：类型代号+序号 |
| card_type | VARCHAR(3) | 卡片类型代号 |
| name | TEXT | 卡片名称 |
| description_id | VARCHAR(15) | 描述文本资产ID |
| icon_id | VARCHAR(15) | 图标资产ID |
| function_id | VARCHAR(15) | 功能方法资产ID |
| function_data | TEXT | 功能数据（JSON格式） |
| build_cost | INTEGER | 建造成本 |
| maintain_cost | INTEGER | 维护成本 |
| build_progress | INTEGER | 建造进度 |
| build_speed | INTEGER | 建造速度 |
| tree_id | VARCHAR(15) | 科技树ID |

**卡片类型代号：**
- `FAC` - 设施 (FACILITY)
- `FIG` - 角色 (FIGURE)
- `TEC` - 科技 (TECHNOLOGY)
- `MEC` - 机构 (MECHANISM)
- `CUL` - 文化 (CULTURE)
- `LAW` - 法律 (LAW)
- `ARM` - 军队 (ARMY)

**编号示例：** `FAC001`, `FIG001`, `TEC001`

## 使用方法

### 1. 初始化数据库管理器

```javascript
// 加载 sql.js
const SQL = await initSqlJs({
    locateFile: file => `lib/${file}`
});

// 创建数据库实例
const db = new SQL.Database();

// 创建数据库管理器
const dbManager = new DatabaseManager(db);
```

### 2. 添加资产

```javascript
// 添加图片资产
const iconId = dbManager.addAsset('PHOTO', 'photo/hero_icon.png', 1);
// 结果: PHO001

// 添加文本资产
const descId = dbManager.addAsset('TEXT', 'text/hero_desc.txt', 1);
// 结果: TEX001

// 添加方法资产
const funcId = dbManager.addAsset('METHOD', 'method/hero_attack.js', 1);
// 结果: MET001
```

### 3. 添加卡片

```javascript
// 添加角色卡片
const heroId = dbManager.addCard({
    cardType: 'FIGURE',
    sequence: 1,
    name: '英雄战士',
    descriptionId: 'TEX001',
    iconId: 'PHO001',
    functionId: 'MET001',
    functionData: JSON.stringify({ attack: 10, defense: 8 }),
    buildCost: 0,
    maintainCost: 5,
    treeId: 'TEC001'
});
// 结果: FIG001
```

### 4. 读取数据

```javascript
// 读取单个资产
const asset = dbManager.getAsset('PHO001');

// 读取单个卡片
const card = dbManager.getCard('FIG001');

// 按类型读取资产列表
const photos = dbManager.getAssetsByType('PHOTO');

// 按类型读取卡片列表
const heroes = dbManager.getCardsByType('FIGURE');
```

### 5. 获取下一个序号

```javascript
// 获取下一个图片资产序号
const nextPhotoSeq = dbManager.getNextSequence('PHOTO', true);

// 获取下一个角色卡片序号
const nextHeroSeq = dbManager.getNextSequence('FIGURE', false);
```

## 数据编码规则

### 资产编码
- 格式：`类型代号 + 3位序号`
- 示例：`PHO001`, `TEX002`, `MET003`

### 卡片编码
- 格式：`类型代号 + 3位序号`
- 示例：`FAC001`, `FIG002`, `TEC003`

## 文件夹结构说明

### resource/ 文件夹
存放所有游戏资产文件，按类型分类：

- **photo/** - 存放图片文件（.png, .jpg, .gif等）
- **text/** - 存放文本文件（.txt, .md等）
- **sheet/** - 存放表格文件（.csv, .xlsx等）
- **method/** - 存放方法脚本（.js等）
- **audio/** - 存放音频文件（.mp3, .wav等）
- **video/** - 存放视频文件（.mp4, .avi等）
- **config/** - 存放配置文件（.json, .xml等）
- **script/** - 存放脚本文件（.js, .py等）

### database/ 文件夹
存放数据库相关文件：

- **asset_table.sql** - 资产表的SQL定义和示例数据
- **card_table.sql** - 卡片表的SQL定义和示例数据
- **database_manager.js** - 核心数据库管理类
- **usage_example.js** - 完整的使用示例

## 注意事项

1. **ID唯一性**：确保每个资产和卡片的ID在系统中是唯一的
2. **外键关系**：卡片表中的 `description_id`, `icon_id`, `function_id` 应该对应资产表中的有效ID
3. **JSON数据**：`function_data` 字段存储JSON格式的数据，使用时需要 `JSON.parse()` 解析
4. **文件路径**：资产的 `relative_path` 是相对于 `resource/` 文件夹的路径
5. **序号管理**：建议使用 `getNextSequence()` 方法获取下一个可用序号，避免ID冲突

## 扩展功能

可以根据需要扩展以下功能：

- 添加资产和卡片的删除功能
- 实现数据导入/导出功能
- 添加数据验证和错误处理
- 实现批量操作功能
- 添加搜索和过滤功能
- 实现数据备份和恢复功能