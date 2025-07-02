// 数据库管理器使用示例
// 展示如何使用DatabaseManager进行资产和卡片的编码和读取

// 引入数据库管理器（在浏览器环境中需要先加载database_manager.js）
// const { DatabaseManager, ASSET_TYPES, CARD_TYPES } = require('./database_manager.js');

async function databaseExample() {
    try {
        // 初始化sql.js
        const SQL = await initSqlJs({
            locateFile: file => `../lib/${file}`
        });
        
        // 创建数据库实例
        const db = new SQL.Database();
        
        // 创建数据库管理器
        const dbManager = new DatabaseManager(db);
        
        console.log("✅ 数据库管理器初始化成功!");
        
        // === 资产管理示例 ===
        console.log("\n=== 资产管理示例 ===");
        
        // 添加图片资产
        const photoId1 = dbManager.addAsset('PHOTO', 'photo/hero_icon.png', 1);
        const photoId2 = dbManager.addAsset('PHOTO', 'photo/building_farm.jpg', 2);
        console.log(`添加图片资产: ${photoId1}, ${photoId2}`);
        
        // 添加文本资产
        const textId1 = dbManager.addAsset('TEXT', 'text/hero_description.txt', 1);
        const textId2 = dbManager.addAsset('TEXT', 'text/farm_description.txt', 2);
        console.log(`添加文本资产: ${textId1}, ${textId2}`);
        
        // 添加方法资产
        const methodId1 = dbManager.addAsset('METHOD', 'method/hero_attack.js', 1);
        const methodId2 = dbManager.addAsset('METHOD', 'method/farm_produce.js', 2);
        console.log(`添加方法资产: ${methodId1}, ${methodId2}`);
        
        // 读取资产
        const asset = dbManager.getAsset(photoId1);
        console.log(`读取资产 ${photoId1}:`, asset);
        
        // 按类型获取资产
        const photos = dbManager.getAssetsByType('PHOTO');
        console.log('所有图片资产:', photos);
        
        // === 卡片管理示例 ===
        console.log("\n=== 卡片管理示例 ===");
        
        // 添加角色卡片
        const heroCardId = dbManager.addCard({
            cardType: 'FIGURE',
            sequence: 1,
            name: '英雄战士',
            descriptionId: textId1,
            iconId: photoId1,
            functionId: methodId1,
            functionData: JSON.stringify({ attack: 10, defense: 8, health: 100 }),
            buildCost: 0,
            maintainCost: 5,
            buildProgress: 0,
            buildSpeed: 1,
            treeId: 'TEC001'
        });
        console.log(`添加角色卡片: ${heroCardId}`);
        
        // 添加设施卡片
        const farmCardId = dbManager.addCard({
            cardType: 'FACILITY',
            sequence: 1,
            name: '农场',
            descriptionId: textId2,
            iconId: photoId2,
            functionId: methodId2,
            functionData: JSON.stringify({ production: 'food', rate: 10 }),
            buildCost: 100,
            maintainCost: 2,
            buildProgress: 0,
            buildSpeed: 5,
            treeId: 'TEC002'
        });
        console.log(`添加设施卡片: ${farmCardId}`);
        
        // 添加科技卡片
        const techCardId = dbManager.addCard({
            cardType: 'TECHNOLOGY',
            sequence: 1,
            name: '农业技术',
            descriptionId: textId2,
            iconId: photoId2,
            functionId: methodId2,
            functionData: JSON.stringify({ unlocks: ['FAC001', 'FAC002'] }),
            buildCost: 200,
            maintainCost: 0,
            buildProgress: 0,
            buildSpeed: 10,
            treeId: null
        });
        console.log(`添加科技卡片: ${techCardId}`);
        
        // 读取卡片
        const heroCard = dbManager.getCard(heroCardId);
        console.log(`读取卡片 ${heroCardId}:`, heroCard);
        
        // 按类型获取卡片
        const facilities = dbManager.getCardsByType('FACILITY');
        console.log('所有设施卡片:', facilities);
        
        // === 高级功能示例 ===
        console.log("\n=== 高级功能示例 ===");
        
        // 获取下一个可用序号
        const nextPhotoSeq = dbManager.getNextSequence('PHOTO', true);
        const nextFacilitySeq = dbManager.getNextSequence('FACILITY', false);
        console.log(`下一个图片资产序号: ${nextPhotoSeq}`);
        console.log(`下一个设施卡片序号: ${nextFacilitySeq}`);
        
        // 批量添加示例
        console.log("\n=== 批量添加示例 ===");
        
        // 批量添加音频资产
        const audioAssets = [
            { type: 'AUDIO', path: 'audio/bgm_main.mp3' },
            { type: 'AUDIO', path: 'audio/sfx_attack.wav' },
            { type: 'AUDIO', path: 'audio/sfx_build.wav' }
        ];
        
        audioAssets.forEach((asset, index) => {
            const id = dbManager.addAsset(asset.type, asset.path, index + 1);
            console.log(`添加音频资产: ${id}`);
        });
        
        // 批量添加军队卡片
        const armyCards = [
            {
                name: '步兵',
                functionData: JSON.stringify({ attack: 5, defense: 4, speed: 3 }),
                buildCost: 50,
                maintainCost: 3
            },
            {
                name: '骑兵',
                functionData: JSON.stringify({ attack: 8, defense: 3, speed: 6 }),
                buildCost: 100,
                maintainCost: 5
            }
        ];
        
        armyCards.forEach((cardData, index) => {
            const id = dbManager.addCard({
                cardType: 'ARMY',
                sequence: index + 1,
                name: cardData.name,
                descriptionId: textId1,
                iconId: photoId1,
                functionId: methodId1,
                functionData: cardData.functionData,
                buildCost: cardData.buildCost,
                maintainCost: cardData.maintainCost,
                buildProgress: 0,
                buildSpeed: 3,
                treeId: 'TEC003'
            });
            console.log(`添加军队卡片: ${id}`);
        });
        
        // 显示所有军队卡片
        const armies = dbManager.getCardsByType('ARMY');
        console.log('所有军队卡片:', armies);
        
        console.log("\n✅ 数据库操作示例完成!");
        
    } catch (error) {
        console.error('❌ 发生错误:', error.message);
        console.error(error);
    }
}

// 如果在浏览器环境中运行，可以调用这个函数
// databaseExample();

// 如果在Node.js环境中，需要先安装sql.js
// npm install sql.js
// 然后取消注释下面的代码
/*
const initSqlJs = require('sql.js');
databaseExample();
*/