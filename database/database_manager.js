// 数据库管理器 - 实现资产和卡片数据的编码和读取

// 资产类型代号映射
const ASSET_TYPES = {
    PHOTO: 'PHO',      // 图片资产
    TEXT: 'TEX',       // 文本资产
    SHEET: 'SHE',      // 表格资产
    METHOD: 'MET',     // 方法资产
    AUDIO: 'AUD',      // 音频资产
    VIDEO: 'VID',      // 视频资产
    CONFIG: 'CFG',     // 配置资产
    SCRIPT: 'SCR'      // 脚本资产
};

// 卡片类型代号映射
const CARD_TYPES = {
    FACILITY: 'FAC',   // 设施
    FIGURE: 'FIG',     // 角色
    TECHNOLOGY: 'TEC', // 科技
    MECHANISM: 'MEC',  // 机构
    CULTURE: 'CUL',    // 文化
    LAW: 'LAW',        // 法律
    ARMY: 'ARM'        // 军队
};

class DatabaseManager {
    constructor(database) {
        this.db = database;
        this.initTables();
    }

    // 初始化数据库表
    initTables() {
        // 创建asset表
        const createAssetSQL = `
            CREATE TABLE IF NOT EXISTS asset (
                id VARCHAR(15) PRIMARY KEY,
                asset_type VARCHAR(3) NOT NULL,
                relative_path TEXT NOT NULL
            );
        `;
        
        // 创建card表
        const createCardSQL = `
            CREATE TABLE IF NOT EXISTS card (
                id VARCHAR(15) PRIMARY KEY,
                card_type VARCHAR(3) NOT NULL,
                name TEXT NOT NULL,
                description_id VARCHAR(15),
                icon_id VARCHAR(15),
                function_id VARCHAR(15),
                function_data TEXT,
                build_cost INTEGER DEFAULT 0,
                maintain_cost INTEGER DEFAULT 0,
                build_progress INTEGER DEFAULT 0,
                build_speed INTEGER DEFAULT 1,
                tree_id VARCHAR(15)
            );
        `;
        
        this.db.run(createAssetSQL);
        this.db.run(createCardSQL);
    }

    // 生成资产ID
    generateAssetId(assetType, sequence) {
        const typeCode = ASSET_TYPES[assetType];
        if (!typeCode) {
            throw new Error(`无效的资产类型: ${assetType}`);
        }
        return `${typeCode}${sequence.toString().padStart(3, '0')}`;
    }

    // 生成卡片ID
    generateCardId(cardType, sequence) {
        const typeCode = CARD_TYPES[cardType];
        if (!typeCode) {
            throw new Error(`无效的卡片类型: ${cardType}`);
        }
        return `${typeCode}${sequence.toString().padStart(3, '0')}`;
    }

    // 添加资产
    addAsset(assetType, relativePath, sequence) {
        const id = this.generateAssetId(assetType, sequence);
        const typeCode = ASSET_TYPES[assetType];
        
        const stmt = this.db.prepare(`
            INSERT INTO asset (id, asset_type, relative_path) 
            VALUES (?, ?, ?);
        `);
        
        stmt.bind([id, typeCode, relativePath]);
        stmt.step();
        stmt.free();
        
        return id;
    }

    // 添加卡片
    addCard(cardData) {
        const {
            cardType, sequence, name, descriptionId, iconId, 
            functionId, functionData, buildCost = 0, maintainCost = 0,
            buildProgress = 0, buildSpeed = 1, treeId
        } = cardData;
        
        const id = this.generateCardId(cardType, sequence);
        const typeCode = CARD_TYPES[cardType];
        
        const stmt = this.db.prepare(`
            INSERT INTO card (
                id, card_type, name, description_id, icon_id, 
                function_id, function_data, build_cost, maintain_cost,
                build_progress, build_speed, tree_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `);
        
        stmt.bind([
            id, typeCode, name, descriptionId, iconId,
            functionId, functionData, buildCost, maintainCost,
            buildProgress, buildSpeed, treeId
        ]);
        stmt.step();
        stmt.free();
        
        return id;
    }

    // 读取资产
    getAsset(id) {
        const results = this.db.exec(`SELECT * FROM asset WHERE id = '${id}';`);
        if (results.length > 0 && results[0].values.length > 0) {
            const row = results[0].values[0];
            const columns = results[0].columns;
            
            const asset = {};
            columns.forEach((col, index) => {
                asset[col] = row[index];
            });
            return asset;
        }
        return null;
    }

    // 读取卡片
    getCard(id) {
        const results = this.db.exec(`SELECT * FROM card WHERE id = '${id}';`);
        if (results.length > 0 && results[0].values.length > 0) {
            const row = results[0].values[0];
            const columns = results[0].columns;
            
            const card = {};
            columns.forEach((col, index) => {
                card[col] = row[index];
            });
            return card;
        }
        return null;
    }

    // 按类型获取资产列表
    getAssetsByType(assetType) {
        const typeCode = ASSET_TYPES[assetType];
        if (!typeCode) {
            throw new Error(`无效的资产类型: ${assetType}`);
        }
        
        const results = this.db.exec(`SELECT * FROM asset WHERE asset_type = '${typeCode}';`);
        return this.formatResults(results);
    }

    // 按类型获取卡片列表
    getCardsByType(cardType) {
        const typeCode = CARD_TYPES[cardType];
        if (!typeCode) {
            throw new Error(`无效的卡片类型: ${cardType}`);
        }
        
        const results = this.db.exec(`SELECT * FROM card WHERE card_type = '${typeCode}';`);
        return this.formatResults(results);
    }

    // 格式化查询结果
    formatResults(results) {
        if (results.length === 0) return [];
        
        const { columns, values } = results[0];
        return values.map(row => {
            const obj = {};
            columns.forEach((col, index) => {
                obj[col] = row[index];
            });
            return obj;
        });
    }

    // 获取下一个可用序号
    getNextSequence(type, isAsset = true) {
        const table = isAsset ? 'asset' : 'card';
        const typeField = isAsset ? 'asset_type' : 'card_type';
        const typeCode = isAsset ? ASSET_TYPES[type] : CARD_TYPES[type];
        
        if (!typeCode) {
            throw new Error(`无效的类型: ${type}`);
        }
        
        const results = this.db.exec(`
            SELECT COUNT(*) as count FROM ${table} 
            WHERE ${typeField} = '${typeCode}';
        `);
        
        if (results.length > 0 && results[0].values.length > 0) {
            return results[0].values[0][0] + 1;
        }
        return 1;
    }
}

// 导出类和常量
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DatabaseManager, ASSET_TYPES, CARD_TYPES };
}