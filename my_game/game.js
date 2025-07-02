// 获取用于显示日志的DOM元素
const outputEl = document.getElementById('output');
function log(message) {
    console.log(message);
    outputEl.textContent += `${message}\n`;
}

// 你的技能数据
// 将数据存储为JS对象数组，这是最常用和最方便的方式
const skillData = [
    { name: '强力攻击', id: 1, iconId: 1, descId: 1, cost: 10, funcId: 1, funcData: '5', tableId: 1 },
    { name: '猛力攻击', id: 2, iconId: 2, descId: 2, cost: 15, funcId: 1, funcData: '10', tableId: 1 },
    { name: '加强防御', id: 3, iconId: 3, descId: 3, cost: 15, funcId: 2, funcData: '5,-10', tableId: 2 },
    { name: '抱头防御', id: 4, iconId: 4, descId: 4, cost: 15, funcId: 2, funcData: '15,-30', tableId: 2 },
    { name: '蓄力一击', id: 5, iconId: 5, descId: 5, cost: 10, funcId: 3, funcData: '1,2.0', tableId: 1 },
    { name: '鲜血狂怒', id: 6, iconId: 6, descId: 6, cost: 5, funcId: 4, funcData: '20,15', tableId: 4 },
    { name: '破釜沉舟', id: 7, iconId: 7, descId: 7, cost: 10, funcId: 4, funcData: '50,40', tableId: 4 },
    { name: '火球术', id: 8, iconId: 8, descId: 8, cost: 20, funcId: 5, funcData: '25', tableId: 3 },
    { name: '冰霜新星', id: 9, iconId: 9, descId: 9, cost: 25, funcId: 6, funcData: '20,-5', tableId: 3 },
    { name: '魔法护盾', id: 10, iconId: 10, descId: 10, cost: 15, funcId: 7, funcData: '20,0', tableId: 3 },
    { name: '元素屏障', id: 11, iconId: 11, descId: 11, cost: 25, funcId: 7, funcData: '40,-15', tableId: 3 },
    { name: '削弱诅咒', id: 12, iconId: 12, descId: 12, cost: 20, funcId: 8, funcData: '-10,-10', tableId: 5 },
    { name: '治愈之光', id: 13, iconId: 13, descId: 13, cost: 30, funcId: 9, funcData: '50', tableId: 6 },
    { name: '旋风斩', id: 14, iconId: 14, descId: 14, cost: 35, funcId: 10, funcData: '12', tableId: 1 },
    { name: '雷电风暴', id: 15, iconId: 15, descId: 15, cost: 50, funcId: 10, funcData: '40', tableId: 3 }
];


// sql.js 的初始化过程是异步的，所以我们把所有代码都放在一个 async 函数中
async function main() {
    try {
        // 1. 初始化 sql.js 并加载 wasm 文件
        // initSqlJs 会返回一个 Promise，所以我们使用 await
        const SQL = await initSqlJs({
            locateFile: file => `lib/${file}`
        });

        log("✅ sql.js 库加载成功!");

        // 2. 创建一个新的数据库
        // 数据库在此时仅存在于内存中
        const db = new SQL.Database();
        log("✅ 内存数据库创建成功!");

        // 3. 创建我们的 `skill_card` 表
        // 使用标准的 SQL CREATE TABLE 语句
        // 为字段选择合适的数据类型：TEXT, INTEGER, REAL
        log("准备创建 `skill_card` 表...");
        const createTableSQL = `
            CREATE TABLE skill_card (
                skill_id INTEGER PRIMARY KEY,
                skill_name TEXT,
                icon_id INTEGER,
                description_id INTEGER,
                energy_cost INTEGER,
                function_id INTEGER,
                function_data TEXT,
                tree_id INTEGER
            );
        `;
        db.run(createTableSQL); // .run() 方法执行不返回结果的SQL语句
        log("✅ `skill_card` 表创建成功!");

        // 4. 【核心】向数据库中写入数据
        // 我们将使用“预处理语句”（Prepared Statements），这是插入多行数据的最佳实践
        // 它更安全、更高效
        log("准备向表中写入15条技能数据...");

        // 准备一个插入语句的模板
        const stmt = db.prepare(`
            INSERT INTO skill_card (skill_id, skill_name, icon_id, description_id, energy_cost, function_id, function_data, tree_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `);

        // 遍历我们的JavaScript数据数组，将每一条数据绑定到预处理语句并执行
        skillData.forEach(skill => {
            stmt.bind([
                skill.id,
                skill.name,
                skill.iconId,
                skill.descId,
                skill.cost,
                skill.funcId,
                skill.funcData,
                skill.tableId
            ]);
            stmt.step(); // 执行绑定好的一行
            stmt.reset(); // 重置语句以便下一次循环使用
        });

        // 释放预处理语句
        stmt.free();
        log("✅ 15条技能数据全部写入成功!");

        // 5. 验证数据：从数据库中读取数据并展示
        log("\n--- 开始验证数据 ---");
        log("从 `skill_card` 表中读取所有数据:");
        
        const results = db.exec("SELECT skill_id, skill_name, energy_cost FROM skill_card WHERE energy_cost > 20;");
        // .exec() 方法会返回一个结果数组
        
        if (results.length > 0) {
            log(`查询到 ${results[0].values.length} 条“能量消耗 > 20”的技能:`);
            // 将结果格式化为更易读的JSON字符串
            const skills = results[0].values.map(row => {
                let obj = {};
                results[0].columns.forEach((col, index) => {
                    obj[col] = row[index];
                });
                return obj;
            });
            log(JSON.stringify(skills, null, 2));
        } else {
            log("未查询到任何数据。");
        }
        
        log("--- 验证完毕 ---");

    } catch (err) {
        log(`❌ 发生错误: ${err.message}`);
        console.error(err);
    }
}

// 执行主函数
main();