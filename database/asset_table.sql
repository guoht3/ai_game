-- 资产表定义
-- 编号结构：类型代号 + 序号
-- 类型代号：PHO(图片), TEX(文本), SHE(表格), MET(方法), AUD(音频), VID(视频), CFG(配置), SCR(脚本)

CREATE TABLE asset (
    id VARCHAR(15) PRIMARY KEY,           -- 资产编号，格式：类型代号+序号，如PHO001, TEX001
    asset_type VARCHAR(3) NOT NULL,       -- 资产类型代号：PHO/TEX/SHE/MET/AUD/VID/CFG/SCR
    relative_path TEXT NOT NULL           -- 资产相对地址，相对于resource文件夹的路径
);

-- 插入示例数据
INSERT INTO asset (id, asset_type, relative_path) VALUES
('PHO001', 'PHO', 'photo/icon_001.png'),
('PHO002', 'PHO', 'photo/background_001.jpg'),
('TEX001', 'TEX', 'text/description_001.txt'),
('TEX002', 'TEX', 'text/story_001.txt'),
('SHE001', 'SHE', 'sheet/data_001.csv'),
('MET001', 'MET', 'method/function_001.js'),
('AUD001', 'AUD', 'audio/bgm_001.mp3'),
('VID001', 'VID', 'video/intro_001.mp4'),
('CFG001', 'CFG', 'config/settings_001.json'),
('SCR001', 'SCR', 'script/init_001.js');