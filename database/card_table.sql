-- 对象表定义
-- 编号结构：类型代号 + 序号
-- 类型代号：FAC(设施), FIG(角色), TEC(科技), MEC(机构), CUL(文化), LAW(法律), ARM(军队)

CREATE TABLE card (
    id VARCHAR(15) PRIMARY KEY,           -- 对象编号，格式：类型代号+序号，如FAC001, FIG001
    card_type VARCHAR(3) NOT NULL,        -- 对象类型代号：FAC/FIG/TEC/MEC/CUL/LAW/ARM
    name TEXT NOT NULL,                   -- 对象名称
    description_id VARCHAR(15),           -- 描述编号，关联到asset表中的文本资产
    icon_id VARCHAR(15),                  -- 图标编号，关联到asset表中的图片资产
    function_id VARCHAR(15),              -- 对应函数编号，关联到asset表中的方法资产
    function_data TEXT,                   -- 输入函数数据
    build_cost INTEGER DEFAULT 0,        -- 建造成本
    maintain_cost INTEGER DEFAULT 0,     -- 维护成本
    build_progress INTEGER DEFAULT 0,    -- 建造进度
    build_speed INTEGER DEFAULT 1,       -- 建造速度
    tree_id VARCHAR(15),                  -- 科技树编号
    
    -- 外键约束（可选，确保数据完整性）
    FOREIGN KEY (description_id) REFERENCES asset(id),
    FOREIGN KEY (icon_id) REFERENCES asset(id),
    FOREIGN KEY (function_id) REFERENCES asset(id)
);

-- 插入示例数据
INSERT INTO card (id, card_type, name, description_id, icon_id, function_id, function_data, build_cost, maintain_cost, build_progress, build_speed, tree_id) VALUES
-- 设施类
('FAC001', 'FAC', '农场', 'TEX001', 'PHO001', 'MET001', '{"output": "food", "rate": 10}', 100, 5, 0, 2, 'TEC001'),
('FAC002', 'FAC', '工厂', 'TEX002', 'PHO002', 'MET002', '{"output": "goods", "rate": 15}', 200, 10, 0, 3, 'TEC002'),

-- 角色类
('FIG001', 'FIG', '农民', 'TEX003', 'PHO003', 'MET003', '{"skill": "farming", "level": 1}', 50, 2, 0, 1, 'TEC003'),
('FIG002', 'FIG', '工人', 'TEX004', 'PHO004', 'MET004', '{"skill": "building", "level": 1}', 80, 3, 0, 1, 'TEC004'),

-- 科技类
('TEC001', 'TEC', '农业技术', 'TEX005', 'PHO005', 'MET005', '{"unlock": ["FAC001"]}', 150, 0, 0, 5, 'TEC000'),
('TEC002', 'TEC', '工业技术', 'TEX006', 'PHO006', 'MET006', '{"unlock": ["FAC002"]}', 300, 0, 0, 8, 'TEC001'),

-- 机构类
('MEC001', 'MEC', '市政厅', 'TEX007', 'PHO007', 'MET007', '{"capacity": 1000, "range": 5}', 500, 20, 0, 10, 'TEC005'),

-- 文化类
('CUL001', 'CUL', '传统节日', 'TEX008', 'PHO008', 'MET008', '{"happiness": 10, "duration": 7}', 0, 0, 0, 1, 'TEC006'),

-- 法律类
('LAW001', 'LAW', '基本法', 'TEX009', 'PHO009', 'MET009', '{"order": 5, "freedom": -2}', 0, 0, 0, 1, 'TEC007'),

-- 军队类
('ARM001', 'ARM', '民兵', 'TEX010', 'PHO010', 'MET010', '{"attack": 5, "defense": 3}', 100, 5, 0, 3, 'TEC008');