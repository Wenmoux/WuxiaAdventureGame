// src/gameData/cgs.js
const IMG_PATH = '/src/assets/images/'; // 确保路径正确

export const cgsData = {
    // 角色CG
    'cg_player_lingyun_default': { id: 'cg_player_lingyun_default', name: '凌云(初始)', description: '青萍镇的打铁学徒凌云。', path: `${IMG_PATH}cg_player_lingyun_default.jpg`, type: 'character' },
    'cg_master_blacksmith': { id: 'cg_master_blacksmith', name: '铁匠师父', description: '凌云的师父，一位经验丰富的铁匠。', path: `${IMG_PATH}cg_master_blacksmith.jpg`, type: 'character' },
    'cg_wang_dashen': { id: 'cg_wang_dashen', name: '王大婶', description: '青萍镇杂货铺老板娘。', path: `${IMG_PATH}cg_wang_dashen.jpg`, type: 'character' },
    'cg_su_qingsxue_profile': { id: 'cg_su_qingsxue_profile', name: '苏晴雪', description: '神秘的白衣少女。', path: `${IMG_PATH}cg_su_qingsxue_profile.jpg`, type: 'character' },
    'cg_yingshatang_assassin': { id: 'cg_yingshatang_assassin', name: '影杀堂刺客', description: '影杀堂的蒙面刺客。', path: `${IMG_PATH}cg_yingshatang_assassin.jpg`, type: 'character' },
    // 场景与事件CG
    'cg_qingping_town_overview': { id: 'cg_qingping_town_overview', name: '青萍镇风貌', description: '宁静的青萍镇。', path: `${IMG_PATH}scene_qingping_town_morning.jpg`, type: 'scene' },
    'cg_player_meditating_glow': { id: 'cg_player_meditating_glow', name: '丹药生效', description: '服用丹药后，身体发生异变。', path: `${IMG_PATH}scene_player_meditating_glow.jpg`, type: 'event' },
    'cg_longji_mountain_path': { id: 'cg_longji_mountain_path', name: '龙脊山路', description: '通往龙脊山的山路。', path: `${IMG_PATH}scene_longji_mountain_forest.jpg`, type: 'scene' },
    'cg_su_qingsxue_fighting': { id: 'cg_su_qingsxue_fighting', name: '苏晴雪遇袭', description: '苏晴雪在林中遭遇围攻。', path: `${IMG_PATH}scene_girl_ambushed_forest.jpg`, type: 'event' },
    'cg_attackers_flee': { id: 'cg_attackers_flee', name: '凶徒遁走', description: '黑衣刺客不敌逃窜。', path: `${IMG_PATH}scene_attackers_flee.jpg`, type: 'event' },
    'cg_player_injured_being_helped': { id: 'cg_player_injured_being_helped', name: '少女施救', description: '受伤的你被苏晴雪救助。', path: `${IMG_PATH}scene_player_injured_escape.jpg`, type: 'event' },
    'cg_player_sneak_attack': { id: 'cg_player_sneak_attack', name: '致命一击', description: '你成功地偷袭了敌人。', path: `${IMG_PATH}scene_sneak_attack_success.jpg`, type: 'event' },
    'cg_qingping_yamen': { id: 'cg_qingping_yamen', name: '青萍镇衙门', description: '青萍镇的官府衙门。', path: `${IMG_PATH}scene_report_to_officials.jpg`, type: 'scene' },
    'cg_old_man_dead_body': { id: 'cg_old_man_dead_body', name: '老者遗体', description: '苏晴雪父亲的遗体。', path: `${IMG_PATH}scene_forest_aftermath_handkerchief.jpg`, type: 'event' }, // 可以用一个更侧重尸体的图
    'cg_su_qingsxue_thanks': { id: 'cg_su_qingsxue_thanks', name: '佳人致谢', description: '苏晴雪向你道谢。', path: `${IMG_PATH}cg_su_qingsxue_thanks.jpg`, type: 'event' },
    'cg_su_father_dead': { id: 'cg_su_father_dead', name: '慈父永逝', description: '苏晴雪为父亲的逝去而悲伤。', path: `${IMG_PATH}cg_su_father_dead.jpg`, type: 'event' }, // 新增
    'cg_su_father_grave': { id: 'cg_su_father_grave', name: '青山忠骨', description: '苏晴雪父亲的墓碑。', path: `${IMG_PATH}scene_father_grave.jpg`, type: 'scene' },
    'cg_qingping_scroll_revealed': { id: 'cg_qingping_scroll_revealed', name: '剑谱现世', description: '《青萍剑法》残卷重现江湖。', path: `${IMG_PATH}item_qingping_scroll.jpg`, type: 'event' },
    'cg_skill_qingping_sword_art': { id: 'cg_skill_qingping_sword_art', name: '青萍剑意', description: '参悟青萍剑法的奥秘。', path: `${IMG_PATH}scene_player_learning_sword_art.jpg`, type: 'skill' },
    'cg_su_qingsxue_grateful': { id: 'cg_su_qingsxue_grateful', name: '感激动容', description: '苏晴雪因你的决定而感动。', path: `${IMG_PATH}cg_su_qingsxue_grateful.jpg`, type: 'event' },
    'cg_su_qingsxue_farewell': { id: 'cg_su_qingsxue_farewell', name: '临别赠帕', description: '苏晴雪与你分别，赠予丝帕。', path: `${IMG_PATH}cg_su_qingsxue_farewell.jpg`, type: 'event' }, // 新增
    'cg_master_examining_clues': { id: 'cg_master_examining_clues', name: '师父的凝视', description: '师父仔细研究你带回的线索。', path: `${IMG_PATH}cg_master_examining_clues.jpg`, type: 'event' }, // 新增
    'cg_master_farewell_gift': { id: 'cg_master_farewell_gift', name: '师门赠别', description: '师父赠予你行囊与期望。', path: `${IMG_PATH}item_swiftwind_manual_token.jpg`, type: 'event' },
    'cg_skill_swift_wind_step': { id: 'cg_skill_swift_wind_step', name: '疾风步法', description: '习得轻功疾风步。', path: `${IMG_PATH}cg_skill_swift_wind_step.jpg`, type: 'skill' }, // 新增
    'cg_journey_with_su_qingsxue': { id: 'cg_journey_with_su_qingsxue', name: '洛阳同行', description: '与苏晴雪一同前往洛阳。', path: `${IMG_PATH}scene_journey_with_su_qingsxue.jpg`, type: 'event' },
    'cg_player_traveling_swiftly': { id: 'cg_player_traveling_swiftly', name: '独行侠(速)', description: '凭借轻功，独自快速前往洛阳。', path: `${IMG_PATH}scene_road_to_luoyang_swift.jpg`, type: 'event' },
    'cg_player_traveling_hardship': { id: 'cg_player_traveling_hardship', name: '独行侠(苦)', description: '步履维艰，独自前往洛阳。', path: `${IMG_PATH}scene_road_to_luoyang_hard.jpg`, type: 'event' },
    'cg_luoyang_city_overview': { id: 'cg_luoyang_city_overview', name: '东都洛阳', description: '繁华的洛阳城。', path: `${IMG_PATH}cg_luoyang_city_overview.jpg`, type: 'scene' },
    // 物品CG
    'cg_item_mystic_jade_pendant': { id: 'cg_item_mystic_jade_pendant', name: '神秘玉佩', description: '你获得的神秘玉佩。', path: `${IMG_PATH}item_jade_pendant.png`, type: 'item' },
    'cg_item_common_ointment': { id: 'cg_item_common_ointment', name: '普通伤药', description: '一包普通的伤药。', path: `${IMG_PATH}item_common_ointment.png`, type: 'item' },
    'cg_item_gengu_dan': { id: 'cg_item_gengu_dan', name: '洗髓丹(仿)', description: '一枚奇异的丹药。', path: `${IMG_PATH}item_gengu_dan.png`, type: 'item' },
    'cg_item_charcoal_bundle': { id: 'cg_item_charcoal_bundle', name: '青冈碳', description: '一捆上好的青冈碳。', path: `${IMG_PATH}item_charcoal_bundle.png`, type: 'item' },
    'cg_item_silk_handkerchief': { id: 'cg_item_silk_handkerchief', name: '绣花丝帕', description: '一块精致的绣花丝帕。', path: `${IMG_PATH}item_silk_handkerchief.png`, type: 'item' },
    'cg_item_letter': { id: 'cg_item_letter', name: '求援信', description: '一封未寄出的信件。', path: `${IMG_PATH}item_letter.png`, type: 'item' },
    'cg_item_locked_box': { id: 'cg_item_locked_box', name: '上锁的铁盒', description: '一个神秘的上锁铁盒。', path: `${IMG_PATH}item_locked_box.png`, type: 'item' },
    'cg_item_qingping_sword_art_vol1': { id: 'cg_item_qingping_sword_art_vol1', name: '青萍剑法残卷', description: '《青萍剑法残卷·壹》。', path: `${IMG_PATH}item_qingping_scroll.png`, type: 'item' },
    'cg_item_swiftwind_manual': { id: 'cg_item_swiftwind_manual', name: '疾风步残页', description: '《疾风步残页》。', path: `${IMG_PATH}item_swiftwind_manual.png`, type: 'item' },
    'cg_item_golden_arrow_token': { id: 'cg_item_golden_arrow_token', name: '金箭令', description: '一枚金箭令牌。', path: `${IMG_PATH}item_golden_arrow_token.png`, type: 'item' },
    // 结局CG (除了已有的洛阳开端CG)
    'cg_player_death_generic': { id: 'cg_player_death_generic', name: '英雄末路', description: '不幸的结局。', path: `${IMG_PATH}scene_player_defeated.jpg`, type: 'ending' },
};