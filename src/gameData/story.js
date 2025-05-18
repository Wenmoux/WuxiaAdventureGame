// src/gameData/story.js
const IMG_PATH = '/src/assets/images/';

// --- 预定义物品和技能 (理想情况下应在单独文件中) ---
// initialItemsData 和 skillsData 保持与您上一版提供的一致
const initialItemsData = {
    'worn_sword': { id: 'worn_sword', name: '磨损的铁剑', description: '一把陪伴你多年的旧剑，剑刃多处缺口。', type: '武器', damageBonus: 1, image: `${IMG_PATH}item_worn_sword.png` },
    'coarse_clothes': { id: 'coarse_clothes', name: '粗布衣衫', description: '普通的粗布衣服，勉强蔽体。', type: '防具', defenseBonus: 0, image: `${IMG_PATH}item_coarse_clothes.png` }, // 确保有图片
    'dried_rations': { id: 'dried_rations', name: '干粮', description: '几块能充饥的干饼。', type: '消耗品', effects: [{type: 'stat', stat: '体力', value: 3}], image: `${IMG_PATH}item_dried_rations.png` },
    'mystic_jade_pendant': { id: 'mystic_jade_pendant', name: '神秘玉佩', description: '一块温润的古玉，似乎蕴含奇异力量。', type: '关键物品', image: `${IMG_PATH}item_jade_pendant.png` },
    'swift_wind_boots_manual': { id: 'swift_wind_boots_manual', name: '《疾风步残页》', description: '记载了一种轻功步法的残缺书页。', type: '武学秘籍', skillId: 'skill_swift_wind_step_basic', image: `${IMG_PATH}item_swiftwind_manual.png` },
    'gengu_dan': { id: 'gengu_dan', name: '洗髓丹(仿)', description: '一枚散发异香的丹药，据说能改善根骨（效果微弱）。', type: '消耗品', effects: [{type: 'stat', stat: '根骨', value: 1}, {type: 'stat', stat: '体力上限', value: 2}], image: `${IMG_PATH}item_gengu_dan.png` },
    'ironwood_staff': { id: 'ironwood_staff', name: '铁木棍', description: '一根沉重的铁木棍，比普通木棍坚硬许多。', type: '武器', damageBonus: 2, image: `${IMG_PATH}item_ironwood_staff.png` },
    'golden_arrow_token': { id: 'golden_arrow_token', name: '金箭令', description: '一枚刻有金色箭矢的令牌，似乎是某个组织的信物。', type: '关键物品', image: `${IMG_PATH}item_golden_arrow_token.png` },
    'silk_handkerchief_qin': { id: 'silk_handkerchief_qin', name: '绣花丝帕(琴)', description: '一块淡雅的丝帕，绣着一枝寒梅，散发着淡淡幽香。', type: '关键物品', image: `${IMG_PATH}item_silk_handkerchief.png` },
    'qingping_sword_art_vol1': { id: 'qingping_sword_art_vol1', name: '《青萍剑法残卷·壹》', description: '失传已久的青萍剑法上部残篇，剑招灵动迅捷。', type: '武学秘籍', skillId: 'skill_qingping_sword_art_1', image: `${IMG_PATH}item_qingping_scroll.png`},
    'common_ointment': {id: 'common_ointment', name: '普通伤药', description: '止血化瘀的草药膏。', type: '消耗品', effects: [{type: 'stat', stat: '体力', value: 8}], image: `${IMG_PATH}item_common_ointment.png`},
    'charcoal_bundle': {id: 'charcoal_bundle', name: '一捆青冈碳', description: '上好的青冈碳。', image: `${IMG_PATH}item_charcoal_bundle.png`},
    'letter_to_wang_guanjia': {id: 'letter_to_wang_guanjia', name: '给王总管的信', description: '一封写给洛阳金刀王府王总管的求援信。', type: '关键物品', image: `${IMG_PATH}item_letter.png` },
    'locked_iron_box_su': {id: 'locked_iron_box_su', name: '上锁的铁盒(苏)', description: '一个苏家老者携带的上了锁的铁盒，不知内藏何物。', type: '关键物品', image: `${IMG_PATH}item_locked_box.png` },
};

export const storyData = {
  // --- 序章：青萍之末，风云将起 ---
  start: {
    id: 'start',
    title: "青萍镇的清晨",
    text: "<p>你叫凌云，青萍镇一个普通的打铁学徒，年方十六。</p><p>师父常说你骨骼清奇，是块练武的料子，可惜家境贫寒，只能每日与炉火铁锤为伴，将那份江湖梦深埋心底。</p><p>今日，师父让你去镇外的龙脊山采些上好的青冈碳。</p>",
    image: `${IMG_PATH}scene_qingping_town_morning.jpg`,
    effects: [
      { type: 'item', item: initialItemsData['worn_sword'], action: 'add' },
      { type: 'item', item: initialItemsData['coarse_clothes'], action: 'add' },
      { type: 'item', item: initialItemsData['dried_rations'], action: 'add' },
      { type: 'item', item: initialItemsData['mystic_jade_pendant'], action: 'add' },
      { type: 'stat', stat: '根骨', value: 7 }, // 初始属性设定
      { type: 'stat', stat: '金钱', value: 20 },
      { type: 'skill_unlock', skillId: 'skill_basic_fist' },
      { type: 'cg', cgId: 'cg_player_lingyun_default' }, // 玩家初始形象CG
      { type: 'cg', cgId: 'cg_master_blacksmith' },     // 师父CG
      { type: 'cg', cgId: 'cg_qingping_town_overview' },// 青萍镇CG
      { type: 'cg', cgId: 'cg_item_mystic_jade_pendant' } // 玉佩物品CG
    ],
    choices: [
      { text: "领命而去，直奔龙脊山", nextNodeId: 'to_longji_mountain_direct' },
      { text: "先去镇上杂货铺买点东西备用", nextNodeId: 'visit_grocery_store_qingping' }
    ]
  },
  visit_grocery_store_qingping: {
    id: 'visit_grocery_store_qingping',
    title: "青萍杂货铺",
    text: "<p>杂货铺的王大婶正打着哈欠。“哟，是凌云小子啊，今儿个要买点啥？”</p><p>你看到柜台上放着一捆绳索、几包【普通伤药】(10文)，还有一枚看起来颇为古旧的【洗髓丹(仿)】，标价50文。</p>",
    image: `${IMG_PATH}scene_grocery_store.jpg`,
    effects: [ { type: 'cg', cgId: 'cg_wang_dashen' } ], // 王大婶CG
    choices: [
      { text: "“大婶，我买一包伤药。” (花费10文)", nextNodeId: 'buy_medicine_qingping', conditions: [{type: 'stat', stat: '金钱', min: 10}], effects: [{type: 'stat', stat: '金钱', value: -10}, {type: 'item', item: initialItemsData['common_ointment'], action: 'add'}, {type: 'cg', cgId: 'cg_item_common_ointment'}] },
      { text: "“这枚丹药是何物？”", nextNodeId: 'ask_about_gengu_dan' },
      { text: "“不了，我这就去龙脊山。”", nextNodeId: 'to_longji_mountain_direct' }
    ]
  },
  buy_medicine_qingping: {
    id: 'buy_medicine_qingping',
    title: "伤药到手",
    text: "<p>你买下了一包【普通伤药】，以备不时之需。</p>",
    choices: [
        { text: "“这枚丹药是何物？”", nextNodeId: 'ask_about_gengu_dan' },
        { text: "“多谢大婶，我这就去龙脊山。”", nextNodeId: 'to_longji_mountain_direct' }
    ]
  },
  ask_about_gengu_dan: {
    id: 'ask_about_gengu_dan',
    title: "奇异丹药",
    text: "<p>王大婶神秘兮兮地说：“这可是好东西，据说是游方郎中留下的，能伐毛洗髓，改善根骨！不过嘛，只是仿品，效果嘛……嘿嘿，五十文，童叟无欺！”</p>",
    effects: [ { type: 'cg', cgId: 'cg_item_gengu_dan' } ],
    choices: [
      { text: "“我买了！” (花费50文)", nextNodeId: 'get_gengu_dan_qingping', conditions: [{type: 'stat', stat: '金钱', min: 50}], effects: [{type: 'stat', stat: '金钱', value: -50}, {type: 'item', item: initialItemsData['gengu_dan'], action: 'add'}] },
      { text: "“太贵了，我还是先去采碳吧。”", nextNodeId: 'to_longji_mountain_direct' }
    ]
  },
  get_gengu_dan_qingping: {
    id: 'get_gengu_dan_qingping',
    title: "丹药到手",
    text: "<p>你肉痛地付了钱，将【洗髓丹(仿)】收入怀中。王大婶笑眯了眼：“小子有眼光！祝你好运！”</p>",
    choices: [
      { text: "即刻服用丹药 (有风险)", nextNodeId: 'take_gengu_dan_now' },
      { text: "先收着，去龙脊山采碳", nextNodeId: 'to_longji_mountain_direct' }
    ]
  },
  take_gengu_dan_now: {
    id: 'take_gengu_dan_now',
    title: "服食丹药",
    text: "<p>你寻了个僻静处，将丹药服下。片刻后，一股暖流自丹田升起，游走四肢百骸，浑身骨骼噼啪作响，皮肤渗出些许黑色污垢。</p><p>你感觉身体轻盈了不少，力量也似乎增强了！</p>",
    image: `${IMG_PATH}scene_player_meditating_glow.jpg`,
    effects: [
      { type: 'item', itemId: 'gengu_dan', action: 'remove' },
      { type: 'stat', stat: '根骨', value: 2 },
      { type: 'stat', stat: '体力上限', value: 5 }, {type: 'stat', stat: '体力', value: 5}, // 服用后体力也恢复一些
      { type: 'stat', stat: '武力', value: 1 },
      { type: 'stat', stat: '悟性', value: 1 },
      { type: 'stat', stat: '敏捷', value: 2 },
      { type: 'stat', stat: '勇气', value: 6 },
      { type: 'log', message: '你服用了洗髓丹(仿)，感觉脱胎换骨！根骨、体力、武力、悟性、敏捷均有提升！' },
      { type: 'achievement', achievementId: 'ACH_FIRST_ENHANCEMENT' },
      { type: 'cg', cgId: 'cg_player_meditating_glow' }
    ],
    choices: [
      { text: "神清气爽！前往龙脊山！", nextNodeId: 'to_longji_mountain_direct' }
    ]
  },

  // --- 第一章：龙脊奇遇，风起之时 ---
  to_longji_mountain_direct: {
    id: 'to_longji_mountain_direct',
    title: "龙脊山麓",
    text: "<p>龙脊山山路崎岖，林木茂密。你寻到一片上好的青冈林，正准备砍伐，忽然听到不远处传来兵刃交击之声和女子的惊呼！</p>",
    image: `${IMG_PATH}scene_longji_mountain_forest.jpg`,
    effects: [{ type: 'cg', cgId: 'cg_longji_mountain_path' }],
    choices: [
      { text: "小心靠近，查看情况", nextNodeId: 'investigate_fight_longji' },
      { text: "事不关己，专心采碳", nextNodeId: 'ignore_fight_focus_charcoal', effects: [{ type: 'log', message: '你决定不理会争斗，专心完成师父的任务。'}, {type: 'item', item: initialItemsData['charcoal_bundle'], action: 'add'}, { type: 'cg', cgId: 'cg_item_charcoal_bundle' }] }
    ]
  },
  ignore_fight_focus_charcoal: {
    id: 'ignore_fight_focus_charcoal',
    title: "埋头苦干",
    text: "<p>你砍足了青冈碳，虽然远处的声音让你有些在意，但你还是决定先完成任务。你扛着碳下了山。</p>",
    image: `${IMG_PATH}scene_carrying_charcoal.jpg`,
    choices: [
      { text: "返回青萍镇铁匠铺", nextNodeId: 'return_to_blacksmith_charcoal' }
    ]
  },
  investigate_fight_longji: {
    id: 'investigate_fight_longji',
    title: "林间恶斗",
    text: "<p>你拨开树丛，只见三名黑衣蒙面人正围攻一名白衣少女！少女手持长剑，剑法灵动，但双拳难敌六手，已渐落下风，衣裙上染了几处血迹。</p><p>她身旁还倒着一位老者，生死不知。</p>",
    image: `${IMG_PATH}scene_girl_ambushed_forest.jpg`,
    effects: [
        { type: 'flag', flag: 'knows_yingshatang_superficial', value: true }, // 初步知道有黑衣人
        { type: 'cg', cgId: 'cg_yingshatang_assassin' },
        { type: 'cg', cgId: 'cg_su_qingsxue_fighting' } // 苏晴雪战斗CG
    ],
    choices: [
      { text: "大喝一声，冲出去相助！", nextNodeId: 'help_girl_fight_longji', effects: [{type: 'stat', stat: '勇气', value: 3}] },
      { text: "寻找机会，偷袭其中一名黑衣人 (需要 敏捷 ≥ 7)", nextNodeId: 'sneak_attack_black_clothed', conditions: [{type: 'stat', stat: '敏捷', min: 7}] },
      { text: "实力悬殊，悄悄离开，去镇上报官 (可能延误时机)", nextNodeId: 'flee_to_report_officials_longji' }
    ]
  },
  help_girl_fight_longji: {
    id: 'help_girl_fight_longji',
    title: "拔刀相助",
    effects: [
        { type: 'characterAffection', character: 'su_qingsxue', value: 5 },
    ],
   
    text: "<p>“鼠辈，光天化日之下竟敢行凶！”你怒喝着挥剑加入战团，替白衣少女挡下一名黑衣人的攻击。</p><p>黑衣人狞笑：“又来一个送死的！”</p>",
    skillCheck: { stat: '武力', target: 5, successParams: { statBonus: '根骨', bonusMultiplier: 0.5 }, successNodeId: 'fight_black_clothed_success_longji', failureNodeId: 'fight_black_clothed_fail_longji' }
  },
  fight_black_clothed_success_longji: {
    id: 'fight_black_clothed_success_longji',
    title: "击退凶徒",
    text: "<p>你与白衣少女并肩作战，你的勇猛（或许还有【洗髓丹】带来的根骨优势）让你越战越勇。黑衣人见讨不到便宜，其中一人发出一声唿哨，三人虚晃一招，迅速遁入密林深处。</p>",
    image: `${IMG_PATH}scene_attackers_flee.jpg`,
    effects: [
      { type: 'stat', stat: '武力', value: 1 }, // 战斗胜利加属性
      { type: 'stat', stat: '声望', value: 5 },
      { type: 'log', message: '你成功击退了黑衣人！' },
      { type: 'achievement', achievementId: 'ACH_FOREST_HEROICS' },
      { type: 'cg', cgId: 'cg_attackers_flee' }
    ],
    choices: [
      { text: "“姑娘，你没事吧？”", nextNodeId: 'check_white_clothed_girl_longji' }
    ]
  },
  fight_black_clothed_fail_longji: {
    id: 'fight_black_clothed_fail_longji',
    title: "力有不逮",
    text: "<p>你虽奋勇，但黑衣人武功远在你之上。你身中数创，眼看就要不支。</p><p>白衣少女见状，一咬银牙，突然使出一招搏命剑法，逼退两名黑衣人，拉起你便往林中深处逃去。“快走！他们是‘影杀堂’的人，不是我们能对付的！”</p>",
    image: `${IMG_PATH}scene_player_injured_escape.jpg`,
    effects: [
      { type: 'stat', stat: '体力', value: -15 },
      { type: 'log', message: '你受了重伤，被白衣少女救走。' },
      { type: 'flag', flag: 'knows_yingshatang_confirmed', value: true }, // 确认是影杀堂
      { type: 'cg', cgId: 'cg_player_injured_being_helped' }
    ],
    choices: [
      { text: "“多谢姑娘……影杀堂？” (跟随少女逃亡)", nextNodeId: 'escape_with_girl_longji' }
    ]
  },
  sneak_attack_black_clothed: {
    id: 'sneak_attack_black_clothed',
    title: "伺机而动",
    text: "<p>你屏息凝神，悄然绕到一名黑衣人身后，在他攻击少女露出破绽的瞬间，猛地刺出！</p>",
    skillCheck: { stat: '敏捷', target: 7, successParams: {statBonus: '悟性', bonusMultiplier: 0.3}, successNodeId: 'sneak_attack_success_longji', failureNodeId: 'sneak_attack_fail_spotted_longji' }
  },
  sneak_attack_success_longji: {
    id: 'sneak_attack_success_longji',
    title: "一击得手",
    text: "<p>黑衣人惨叫一声，被你刺中要害，当即毙命！另外两名黑衣人大惊，白衣少女趁机反攻。</p><p>你加入战局，很快将剩余两人也击退（或击杀，可根据难度调整）。</p>",
    image: `${IMG_PATH}scene_sneak_attack_success.jpg`,
    effects: [
      { type: 'stat', stat: '武力', value: 1 }, { type: 'stat', stat: '敏捷', value: 1 },
      { type: 'stat', stat: '声望', value: 8 },
      { type: 'log', message: '你成功偷袭并与少女联手击退敌人！' },
      { type: 'achievement', achievementId: 'ACH_SHADOW_STRIKE' },
      { type: 'cg', cgId: 'cg_player_sneak_attack' }
    ],
    choices: [
      { text: "“姑娘，你没事吧？”", nextNodeId: 'check_white_clothed_girl_longji' }
    ]
  },
  sneak_attack_fail_spotted_longji: {
    id: 'sneak_attack_fail_spotted_longji',
    title: "偷袭失手",
    text: "<p>你的脚步声（或气息）惊动了黑衣人，他猛地转身避开你的攻击，并与其他两人将你和少女一同包围！“又来一个送死的！”情况变得更加危急。</p>",
    effects: [ { type: 'log', message: '偷袭失败，你被发现了！' } ],
    choices: [
      { text: "事已至此，只能死战！", nextNodeId: 'fight_black_clothed_desperate_longji' }
    ]
  },
  fight_black_clothed_desperate_longji: { // 偷袭失败后的战斗
    id: 'fight_black_clothed_desperate_longji',
    title: "困兽之斗",
    text: "<p>你与白衣少女背靠背，与三名黑衣人展开死斗！</p>",
    skillCheck: { stat: '武力', target: 7, successParams: { statBonus: '勇气', bonusMultiplier: 1 }, successNodeId: 'fight_black_clothed_success_longji', failureNodeId: 'fight_black_clothed_fail_longji' }
  },
  flee_to_report_officials_longji: {
    id: 'flee_to_report_officials_longji',
    title: "奔走报官",
    text: "<p>你衡量实力后，决定先去镇上报官。你飞奔下山，找到青萍镇的衙役，将事情原委告知。</p><p>衙役们听闻是“影杀堂”，面露难色，磨蹭了半天才集结人手上山。</p>",
    image: `${IMG_PATH}scene_report_to_officials.jpg`,
    effects: [
        { type: 'flag', flag: 'reported_to_officials_longji', value: true },
        { type: 'stat', stat: '勇气', value: -2 }, // 逃跑扣勇气
        { type: 'cg', cgId: 'cg_qingping_yamen' }
    ],
    choices: [
      { text: "带领衙役返回龙脊山", nextNodeId: 'return_with_officials_longji' }
    ]
  },
  return_with_officials_longji: {
    id: 'return_with_officials_longji',
    title: "姗姗来迟",
    text: "<p>当你和衙役们赶回现场时，打斗早已结束。林间只剩下几滩血迹和那位老者的尸体。白衣少女和黑衣人都不见了踪影。</p><p>你在附近找到了一块沾血的【绣花丝帕(琴)】。</p>",
    image: `${IMG_PATH}scene_forest_aftermath_handkerchief.jpg`,
    effects: [
      { type: 'item', item: initialItemsData['silk_handkerchief_qin'], action: 'add' },
      { type: 'log', message: '你来迟一步，只找到了老者的尸体和一块丝帕。白衣少女不知所踪。' },
      { type: 'stat', stat: '声望', value: -2 },
      { type: 'achievement', achievementId: 'ACH_TOO_LATE_HERO' },
      { type: 'cg', cgId: 'cg_item_silk_handkerchief' },
      { type: 'cg', cgId: 'cg_old_man_dead_body' }
    ],
    choices: [
      { text: "检查老者尸体，希望能找到线索", nextNodeId: 'examine_old_man_body_longji' },
      { text: "唉，只能先回去向师父复命了（未采到碳）。", nextNodeId: 'return_to_blacksmith_empty_handed' }
    ]
  },
  examine_old_man_body_longji: {
    id: 'examine_old_man_body_longji',
    title: "搜寻线索",
    text: "<p>你仔细检查了老者的遗体，发现他怀中藏有一封未寄出的【给王总管的信】和一个小巧的【上锁的铁盒(苏)】。信是写给洛阳金刀王府王总管的，内容提及“青萍剑谱之事万分紧急，请王总管速派援手”。</p>",
    effects: [
        { type: 'item', item: initialItemsData['letter_to_wang_guanjia'], action: 'add' },
        { type: 'item', item: initialItemsData['locked_iron_box_su'], action: 'add' },
        { type: 'flag', flag: 'knows_su_family_seeks_help_from_jindao', value: true },
        { type: 'cg', cgId: 'cg_item_letter' },
        { type: 'cg', cgId: 'cg_item_locked_box' }
    ],
    choices: [
        { text: "“金刀王府……洛阳……” (收好信和铁盒)", nextNodeId: 'return_to_blacksmith_with_clues' }
    ]
  },

  // --- 与白衣少女的互动 ---
  check_white_clothed_girl_longji: {
    id: 'check_white_clothed_girl_longji',
    title: "佳人脱险",
    text: "<p>白衣少女惊魂稍定，向你盈盈一拜：“多谢公子仗义相助，小女子苏晴雪，感激不尽。这是家父……”她望向倒地的老者，泪如雨下。</p>",
    image: `${IMG_PATH}cg_su_qingsxue_thanks.jpg`,
    effects: [
      { type: 'cg', cgId: 'cg_su_qingsxue_thanks' },
      { type: 'cg', cgId: 'cg_su_qingsxue_profile' }, // 苏晴雪人物立绘CG
      { type: 'achievement', achievementId: 'ACH_MEET_SU_QINGXUE' },
      { type: 'characterAffection', character: 'su_qingsxue', value: 10 },
      { type: 'flag', flag: 'met_su_qingsxue', value: true }
    ],
    choices: [
      { text: "“苏姑娘不必多礼，先看看老丈的伤势。”", nextNodeId: 'examine_father_su_qingsxue' },
      { text: "“那些黑衣人是什么来头？为何袭击你们？”", nextNodeId: 'ask_su_qingsxue_about_attackers' }
    ]
  },
  escape_with_girl_longji: {
    id: 'escape_with_girl_longji',
    title: "密林暂歇",
    text: "<p>你们逃入一片更深的密林，暂时摆脱了追兵。苏晴雪为你简单包扎了伤口（如果你受伤了）。</p><p>“我叫苏晴雪，多谢公子刚才出手。那些是‘影杀堂’的杀手，他们是为了一份我苏家世代守护的《青萍剑法》残卷而来。”</p>",
    image: `${IMG_PATH}scene_forest_hideout.jpg`,
    effects: [
      { type: 'characterAffection', character: 'su_qingsxue', value: 15 },
      { type: 'flag', flag: 'met_su_qingsxue', value: true },
      { type: 'achievement', achievementId: 'ACH_MEET_SU_QINGXUE' }, // 如果之前没触发
      { type: 'cg', cgId: 'cg_su_qingsxue_profile' },
      { type: 'flag', flag: 'knows_about_qingping_sword_art_scroll', value: true },
      { type: 'flag', flag: 'knows_yingshatang_confirmed', value: true }
    ],
    choices: [
      { text: "“《青萍剑法》？莫非是传说中剑圣青萍子所创的那套绝学？”", nextNodeId: 'discuss_qingping_sword_art_su' },
      { text: "“影杀堂……我记住了。姑娘接下来有何打算？”", nextNodeId: 'ask_su_qingsxue_plans' }
    ]
  },
  examine_father_su_qingsxue: {
    id: 'examine_father_su_qingsxue',
    title: "回天乏术",
    text: "<p>你上前查看，老者身上有多处致命伤，早已没了气息。苏晴雪悲痛欲绝：“爹——！”</p>",
    effects: [ { type: 'cg', cgId: 'cg_su_father_dead' } ],
    choices: [
      { text: "“苏姑娘，节哀顺变。我们先将老丈安葬了吧。”", nextNodeId: 'bury_father_su_qingsxue' },
      { text: "“请问姑娘，这究竟是怎么回事？” (若未询问过袭击者)", nextNodeId: 'ask_su_qingsxue_about_attackers', conditions: [{type: 'flag', flag: 'knows_yingshatang_confirmed', value: false}] },
      { text: "“苏姑娘，接下来你有何打算？” (若已询问过)", nextNodeId: 'ask_su_qingsxue_plans_after_father_death', conditions: [{type: 'flag', flag: 'knows_yingshatang_confirmed', value: true}]}
    ]
  },
  bury_father_su_qingsxue: {
    id: 'bury_father_su_qingsxue',
    title: "青山忠骨",
    text: "<p>你帮助苏晴雪在山间寻了一处僻静之地，将她的父亲安葬。苏晴雪在墓前立誓，必报此仇。</p>",
    image: `${IMG_PATH}scene_father_grave.jpg`,
    effects: [ { type: 'characterAffection', character: 'su_qingsxue', value: 5 }, { type: 'cg', cgId: 'cg_su_father_grave' } ],
    choices: [
      { text: "“苏姑娘，接下来你有何打算？”", nextNodeId: 'ask_su_qingsxue_plans_after_burial' }
    ]
  },
  ask_su_qingsxue_about_attackers: {
    id: 'ask_su_qingsxue_about_attackers',
    title: "仇家身份",
    text: "<p>苏晴雪拭去泪水，眼中充满恨意：“他们是‘影杀堂’的人，江湖上臭名昭著的杀手组织！他们一直觊觎我家传的《青萍剑法》残卷。”</p>",
    effects: [ { type: 'flag', flag: 'knows_yingshatang_confirmed', value: true }, { type: 'flag', flag: 'knows_about_qingping_sword_art_scroll', value: true } ],
    choices: [
      { text: "“《青萍剑法》？那可是绝世武学！”", nextNodeId: 'discuss_qingping_sword_art_su' },
      { text: "“影杀堂……我会记住的。姑娘有何打算？” (若已知晓父亲去世)", nextNodeId: 'ask_su_qingsxue_plans_after_father_death', conditions: [{type: 'flag', flag: 'su_father_confirmed_dead', value: true}]}, // 需要一个flag确认父亲已死
      { text: "“影杀堂……我会记住的。我们先看看老丈伤势。” (若未查看父亲)", nextNodeId: 'examine_father_su_qingsxue', conditions: [{type: 'flag', flag: 'su_father_confirmed_dead', value: false}]}
    ]
  },
  discuss_qingping_sword_art_su: {
    id: 'discuss_qingping_sword_art_su',
    title: "剑法之秘",
    text: "<p>苏晴雪点头：“正是。传说青萍剑法共有三卷，我家只有上卷残篇。影杀堂不知从何处得知消息，便痛下杀手。</p><p>这份残卷，爹爹（或在逃亡路上）交给了我。”她从怀中取出一卷泛黄的绢布——【《青萍剑法残卷·壹》】。</p>",
    image: `${IMG_PATH}item_qingping_scroll.jpg`,
    effects: [ { type: 'cg', cgId: 'cg_qingping_scroll_revealed' } ],
    choices: [
      { text: "“此物干系重大，姑娘务必小心保管！”", nextNodeId: 'advise_su_qingsxue_caution' },
      { text: "（心生向往）“不知是否有幸一窥这绝世剑法？” (需 苏晴雪好感度 ≥ 15 或 勇气 ≥ 6)", nextNodeId: 'request_see_qingping_sword_art', conditions: [{type: 'affection_check', character: 'su_qingsxue', min: 15}, {type: 'stat', stat: '勇气', min: 6, checkType: 'OR'}]} // checkType OR
    ]
  },
  advise_su_qingsxue_caution: {
    id: 'advise_su_qingsxue_caution',
    title: "善意提醒",
    text: "<p>苏晴雪感激地看了你一眼：“多谢公子提醒，晴雪明白。只是如今怀璧其罪，不知如何是好。”</p>",
    effects: [{type: 'characterAffection', character: 'su_qingsxue', value: 3}],
    choices: [
        { text: "“姑娘有何打算？”", nextNodeId: 'ask_su_qingsxue_plans' } // 统一导向询问计划
    ]
  },
  request_see_qingping_sword_art: {
    id: 'request_see_qingping_sword_art',
    title: "剑谱示君",
    text: "<p>苏晴雪犹豫了一下，看了看你坚毅的眼神（和你之前的义举），最终点了点头：“公子大恩，小女子无以为报。这残卷公子若有兴趣，不妨一看。或许对公子日后行走江湖亦有助益。”</p><p>她将【《青萍剑法残卷·壹》】递给你。</p>",
    effects: [
      { type: 'item', item: initialItemsData['qingping_sword_art_vol1'], action: 'add' },
      { type: 'log', message: '苏晴雪将《青萍剑法残卷·壹》赠予你！' },
      { type: 'achievement', achievementId: 'ACH_QINGPING_SCROLL_GET' },
      { type: 'cg', cgId: 'cg_item_qingping_sword_art_vol1' }, // 剑谱物品CG
      { type: 'characterAffection', character: 'su_qingsxue', value: 10 }
    ],
    choices: [
      { text: "“多谢苏姑娘厚赠！此恩此情，凌云铭记于心！” (学习剑法)", nextNodeId: 'learn_qingping_sword_art_now' },
      { text: "“此物太过贵重，我不能夺人所爱。” (婉拒)", nextNodeId: 'refuse_qingping_sword_art_su', effects: [{type: 'characterAffection', character: 'su_qingsxue', value: 20}, {type: 'item', itemId: 'qingping_sword_art_vol1', action: 'remove'}] }
    ]
  },
  learn_qingping_sword_art_now: {
    id: 'learn_qingping_sword_art_now',
    title: "参悟剑意",
    text: "<p>你展开残卷，只见上面剑招图谱精妙绝伦，心法口诀亦是玄奥非常。你对照图谱，尝试演练，只觉剑随意动，威力远胜从前所学！</p>",
    image: `${IMG_PATH}scene_player_learning_sword_art.jpg`,
    effects: [
      { type: 'skill_unlock', skillId: 'skill_qingping_sword_art_1' },
      { type: 'stat', stat: '剑法', value: 15 }, // 学习后剑法大幅提升
      { type: 'stat', stat: '悟性', value: 1 }, // 学习秘籍加悟性
      { type: 'log', message: '你习得了【青萍剑法(上)】！剑法大进！' },
      { type: 'cg', cgId: 'cg_skill_qingping_sword_art' } // 技能CG
    ],
    choices: [
      { text: "剑法初成，信心大增！", nextNodeId: 'ask_su_qingsxue_plans_after_learning' }
    ]
  },
  refuse_qingping_sword_art_su: {
    id: 'refuse_qingping_sword_art_su',
    title: "高义薄云",
    text: "<p>苏晴雪见你坚辞不受，眼中异彩连连：“凌公子高义，晴雪佩服。此剑谱乃家传之物，公子既不愿取，晴雪亦不会强人所难。不过，公子今日恩情，晴雪定会设法报答。”</p>",
    effects: [ { type: 'achievement', achievementId: 'ACH_NOBLE_REFUSAL' } ],
    choices: [
      { text: "“姑娘言重了。我们还是先商议如何应对影杀堂吧。”", nextNodeId: 'ask_su_qingsxue_plans_after_refusal' }
    ]
  },
  // 统一询问苏晴雪计划的节点，通过不同入口汇合
  ask_su_qingsxue_plans: {
    id: 'ask_su_qingsxue_plans', title: "何去何从",
    text: "<p>苏晴雪沉吟道：“影杀堂势力遍布，我一个弱女子（带着残卷，如果玩家未获得），恐怕难以安全。我打算前往洛阳投奔一位故交的叔父，他是‘金刀王府’的客卿，或许能庇护一二。只是路途遥远……”她看向你，带着一丝期盼。</p>",
    choices: [
      { text: "“苏姑娘，若不嫌弃，凌云愿护送你一程！”", nextNodeId: 'offer_escort_su_qingsxue_to_luoyang' },
      { text: "“洛阳路远，姑娘一路保重。我尚有师门任务未了。”", nextNodeId: 'part_ways_with_su_qingsxue_longji' }
    ]
  },

  
  ask_su_qingsxue_plans_after_father_death: { id: 'ask_su_qingsxue_plans_after_father_death', refNodeId: 'ask_su_qingsxue_plans' }, // 使用 refNodeId 指向通用节点
  ask_su_qingsxue_plans_after_burial: { id: 'ask_su_qingsxue_plans_after_burial', refNodeId: 'ask_su_qingsxue_plans' },
  ask_su_qingsxue_plans_after_learning: { id: 'ask_su_qingsxue_plans_after_learning', refNodeId: 'ask_su_qingsxue_plans' },
  ask_su_qingsxue_plans_after_refusal: { id: 'ask_su_qingsxue_plans_after_refusal', refNodeId: 'ask_su_qingsxue_plans' },

  offer_escort_su_qingsxue_to_luoyang: {
    id: 'offer_escort_su_qingsxue_to_luoyang',
    title: "护花使者",
    text: "<p>苏晴雪闻言，眼中泛起感动的泪光：“凌公子高义，晴雪感激不尽！有公子同行，此行定能平安许多。”</p>",
    image: `${IMG_PATH}cg_su_qingsxue_grateful.jpg`,
    effects: [
      { type: 'characterAffection', character: 'su_qingsxue', value: 15 },
      { type: 'flag', flag: 'escorting_su_qingsxue', value: true },
      { type: 'log', message: '你决定护送苏晴雪前往洛阳。一段新的旅程即将开始。' },
      { type: 'achievement', achievementId: 'ACH_ESCORT_DUTY_ACCEPTED' },
      { type: 'cg', cgId: 'cg_su_qingsxue_grateful' }
    ],
    choices: [
      { text: "事不宜迟，我们即刻出发！ (采碳之事暂放一边)", nextNodeId: 'journey_to_luoyang_start_with_su' }
    ]
  },
  part_ways_with_su_qingsxue_longji: {
    id: 'part_ways_with_su_qingsxue_longji',
    title: "分道扬镳",
    text: "<p>苏晴雪略显失望，但还是强笑道：“凌公子有要事在身，晴雪不敢强留。此去洛阳，山高水长，公子若有机会路过，定要来金刀王府寻我。”</p><p>她将一块【绣花丝帕(琴)】交给你：“此物赠予公子，聊作纪念。”</p>",
    effects: [
      { type: 'item', item: initialItemsData['silk_handkerchief_qin'], action: 'add' },
      { type: 'log', message: '你与苏晴雪在龙脊山分别。她赠你丝帕作为信物。' },
      { type: 'achievement', achievementId: 'ACH_PARTING_GIFT' },
      { type: 'cg', cgId: 'cg_su_qingsxue_farewell' }
    ],
    choices: [
      { text: "“苏姑娘保重，后会有期！” (回去采碳)", nextNodeId: 'collect_charcoal_after_parting' }
    ]
  },
  collect_charcoal_after_parting: {
    id: 'collect_charcoal_after_parting',
    title: "重拾旧业",
    text: "<p>送别苏晴雪后，你回到青冈林，砍足了青冈碳，心情却有些复杂。</p>",
    effects: [{type: 'item', item: initialItemsData['charcoal_bundle'], action: 'add'}],
    choices: [
        { text: "返回青萍镇铁匠铺", nextNodeId: 'return_to_blacksmith_after_parting_with_charcoal' }
    ]
  },

  // --- 返回青萍镇的分支 ---
  return_to_blacksmith_charcoal: { // 直接采碳回来
    id: 'return_to_blacksmith_charcoal',
    title: "交还青冈碳",
    text: "<p>你将采好的青冈碳交给师父。师父点点头：“嗯，这次的碳不错。山里没遇到什么事吧？”</p>",
    choices: [
        { text: "“一切顺利，师父。” (隐瞒遭遇)", nextNodeId: 'hide_encounter_from_master'},
        { text: "将龙脊山上的遭遇简略说出 (不提剑谱和苏晴雪身份)", nextNodeId: 'tell_master_longji_encounter_briefly_no_su'}
    ]
  },
  return_to_blacksmith_empty_handed: { // 报官线回来，未采碳
    id: 'return_to_blacksmith_empty_handed',
    title: "空手而归",
    text: "<p>你回到铁匠铺，师父见你两手空空，有些奇怪。“凌云，碳呢？山上出事了？”</p><p>你将龙脊山的遭遇和报官的经过说了一遍（如果你得到了丝帕和信，选择是否提及）。</p>",
    choices: [
      { text: "提及丝帕和信件", nextNodeId: 'return_to_blacksmith_with_clues', conditions: [{type: 'item', itemId: 'letter_to_wang_guanjia', check: 'has'}] },
      { text: "只说报官之事，隐瞒物品", nextNodeId: 'master_advice_qingping_generic_trouble' }
    ]
  },
  return_to_blacksmith_with_clues: { // 报官线并检查了尸体回来
    id: 'return_to_blacksmith_with_clues',
    title: "带回线索",
    text: "<p>你回到铁匠铺，师父见你两手空空，神色凝重。“凌云，碳呢？山上出事了？”</p><p>你将龙脊山的遭遇、报官以及从老者身上发现的【给王总管的信】和【上锁的铁盒(苏)】之事说了一遍。</p>",
    effects: [{ type: 'cg', cgId: 'cg_master_examining_clues'}],
    nextNodeId: 'master_advice_qingping_with_clues' // 直接跳转到师父的反应
  },
  return_to_blacksmith_after_parting_with_charcoal: { // 与苏晴雪分别后，带碳回来
    id: 'return_to_blacksmith_after_parting_with_charcoal',
    title: "返回铁匠铺",
    text: "<p>你回到青萍镇的铁匠铺，将青冈碳交给师父。师父见你神色有异，便询问你在山上的遭遇。</p><p>你将龙脊山发生的事情简略说了一遍（隐去了剑谱、苏晴雪的具体身份等关键信息，但提及了影杀堂和赠帕之事）。</p>",
    choices: [
      { text: "师父叹了口气：“江湖险恶，你还需多加历练啊。”", nextNodeId: 'master_advice_qingping_after_su_encounter' }
    ]
  },
  hide_encounter_from_master: {
    id: 'hide_encounter_from_master',
    title: "守口如瓶",
    text: "<p>师父没有多问，让你去干别的活了。你心中却因龙脊山之事难以平静，决定找个机会向师父辞行，出去闯荡一番。</p>",
    effects: [{type: 'flag', flag: 'decided_to_leave_secretly', value: true}],
    choices: [
        { text: "向师父辞行", nextNodeId: 'prepare_to_leave_qingping_town_early' }
    ]
  },
  tell_master_longji_encounter_briefly_no_su: { // 仅采碳，未深入了解苏晴雪
    id: 'tell_master_longji_encounter_briefly_no_su',
    title: "略述见闻",
    text: "<p>你将山中遇到打斗之事简略告知师父，只说是两伙江湖人争斗，你未敢靠近，采完碳便回来了。</p><p>师父听完，眉头微皱：“江湖事少管为妙。你没事就好。”</p>",
    choices: [
        { text: "“弟子明白。师父，我想出去闯荡一番，增长见识。”", nextNodeId: 'master_advice_qingping_generic_leave' } // 通用的辞行节点
    ]
  },
  master_advice_qingping_generic_trouble: { // 报官回来，未提及详细线索
    id: 'master_advice_qingping_generic_trouble',
    title: "师父的担忧",
    text: "<p>师父听完你的讲述，叹了口气：“影杀堂……唉，江湖险恶，你这次也算是有惊无险。以后遇事，当以自身安全为重。”</p>",
    choices: [
      { text: "“弟子明白了。师父，我想出去闯荡一番。”", nextNodeId: 'master_advice_qingping_generic_leave' }
    ]
  },
  master_advice_qingping_after_su_encounter: { // 与苏晴雪分别后，师父的指点
    id: 'master_advice_qingping_after_su_encounter',
    title: "师父的指点",
    text: "<p>师父听完你的讲述（包括影杀堂和苏姑娘赠帕），沉吟片刻：“影杀堂行事狠辣，苏家之事恐怕牵连甚广。你既与苏姑娘有一面之缘，日后若有能力，或可相助一二。”</p><p>他从怀中取出一本破旧的小册子和一枚令牌：“这是我年轻时偶然得到的一本【《疾风步残页》】和一枚【金箭令】。疾风步能让你身轻如燕，金箭令或许能在关键时刻派上用场。你天资不错，如今也算见了血，是时候出去闯荡一番了。拿着这些，去看看外面的世界吧。”</p>",
    image: `${IMG_PATH}item_swiftwind_manual_token.jpg`,
    effects: [
      { type: 'item', item: initialItemsData['swift_wind_boots_manual'], action: 'add' },
      { type: 'item', item: initialItemsData['golden_arrow_token'], action: 'add' },
      { type: 'log', message: '师父赠予你《疾风步残页》和金箭令，鼓励你闯荡江湖！' },
      { type: 'achievement', achievementId: 'ACH_MASTERS_GIFT' },
      { type: 'cg', cgId: 'cg_master_farewell_gift' }
    ],
    choices: [
      { text: "“多谢师父！弟子定不负所望！” (学习疾风步)", nextNodeId: 'learn_swift_wind_step_from_master' },
      { text: "“师父大恩，弟子铭记。我这就去收拾行囊。”", nextNodeId: 'prepare_to_leave_qingping_town_solo' }
    ]
  },
  master_advice_qingping_with_clues: { // 带重要线索回来，师父的反应
    id: 'master_advice_qingping_with_clues',
    title: "师父的凝重",
    text: "<p>师父听完你的讲述，又看了看你带回的【给王总管的信】和【上锁的铁盒(苏)】，面色变得异常凝重。“金刀王府……洛阳……苏家……青萍剑谱……唉，果然是这桩陈年旧事又起波澜了。”</p><p>他叹了口气，从怀中取出一本【《疾风步残页》】和一枚【金箭令】：“这些你拿着。影杀堂和金刀王府都不是善茬，此去洛阳，万事小心。这铁盒上的锁……我或许有办法，但需时日。”</p>",
    image: `${IMG_PATH}item_swiftwind_manual_token.jpg`,
    effects: [ /* ... (同上一版，确保CG和成就) ... */
        { type: 'item', item: initialItemsData['swift_wind_boots_manual'], action: 'add' },
        { type: 'item', item: initialItemsData['golden_arrow_token'], action: 'add' },
        { type: 'log', message: '师父赠予你《疾风步残页》和金箭令，并对你带回的线索表示凝重。' },
        { type: 'achievement', achievementId: 'ACH_MASTERS_GIFT' },
        { type: 'cg', cgId: 'cg_master_farewell_gift' },
        { type: 'flag', flag: 'master_knows_about_box_and_letter', value: true }
    ],
    choices: [
      { text: "“多谢师父！弟子定当小心！” (学习疾风步)", nextNodeId: 'learn_swift_wind_step_from_master' },
      { text: "“师父，这铁盒……”", nextNodeId: 'ask_master_about_iron_box' }
    ]
  },
  master_advice_qingping_generic_leave: { // 通用的师父允许离开的节点
    id: 'master_advice_qingping_generic_leave',
    title: "师父的允诺",
    text: "<p>师父叹了口气：“也罢，男儿志在四方。你根骨尚可，若有机缘，未必不能在江湖上闯出名堂。”他想了想，从柜子里取出一枚有些年头的【金箭令】：“这是我早年游历时所得，或许对你有些用处。去吧，山高水远，一切小心。”（此分支下，师父未赠予《疾风步》）</p>",
    effects: [
      { type: 'item', item: initialItemsData['golden_arrow_token'], action: 'add' },
      { type: 'log', message: '师父赠予你金箭令，允许你外出闯荡。' },
      { type: 'achievement', achievementId: 'ACH_PERMISSION_TO_ROAM' }
    ],
    choices: [
      { text: "“多谢师父教诲！”", nextNodeId: 'prepare_to_leave_qingping_town_solo_no_swift' }
    ]
  },
  ask_master_about_iron_box: {
    id: 'ask_master_about_iron_box',
    title: "铁盒之秘",
    text: "<p>师父摆了摆手：“此盒机关精巧，非寻常锁匠能开。你先去洛阳，若有机会，可去寻‘鬼手’张三，他或许有办法。或者，待我研究明白，再设法通知你。”</p>",
    effects: [{type: 'flag', flag: 'master_will_study_box', value: true}, { type: 'log', message: '师父提及洛阳的“鬼手”张三可能知道如何打开铁盒。' }],
    choices: [
        { text: "“是，师父。弟子明白了。” (学习疾风步)", nextNodeId: 'learn_swift_wind_step_from_master_after_box_talk' }
    ]
  },
  learn_swift_wind_step_from_master: {
    id: 'learn_swift_wind_step_from_master',
    title: "疾风初成",
    text: "<p>你依照残页上的图示和心法修炼【疾风步】，在师父的指点下，很快便掌握了入门诀窍。你感觉自己的脚步轻快了许多。</p>",
    effects: [
      { type: 'skill_unlock', skillId: 'skill_swift_wind_step_basic' },
      { type: 'stat', stat: '敏捷', value: 3 }, // 学习技能加属性
      { type: 'stat', stat: '悟性', value: 1 },
      { type: 'achievement', achievementId: 'ACH_SWIFT_WIND_LEARNED' },
      { type: 'cg', cgId: 'cg_skill_swift_wind_step' }
    ],
    choices: [
      { text: "身法精进，准备闯荡江湖！", nextNodeId: 'prepare_to_leave_qingping_town_solo' }
    ]
  },
  learn_swift_wind_step_from_master_after_box_talk: { id: 'learn_swift_wind_step_from_master_after_box_talk', refNodeId: 'learn_swift_wind_step_from_master' },
  
  prepare_to_leave_qingping_town_solo: { // 独自离开，学了疾风步
    id: 'prepare_to_leave_qingping_town_solo',
    title: "告别青萍 (独行)",
    text: "<p>你向师父辞行，他拍了拍你的肩膀：“江湖路远，好自为之。”</p><p>你踏出青萍镇，前方是未知的江湖路。你决定先去最近的大城——洛阳，看看能否找到更多关于影杀堂或（如果你知道的话）《青萍剑法》的消息，或许还能打探苏姑娘的下落（如果你与她分别）。</p>",
    effects: [ { type: 'achievement', achievementId: 'ACH_FIRST_STEP_SOLO' } ],
    choices: [
      { text: "剑指洛阳，风云再起！", nextNodeId: 'journey_to_luoyang_start_solo_swift' }
    ]
  },
  prepare_to_leave_qingping_town_solo_no_swift: { // 独自离开，没学疾风步
    id: 'prepare_to_leave_qingping_town_solo_no_swift',
    title: "告别青萍 (独行)",
    text: "<p>你向师父辞行，他拍了拍你的肩膀：“江湖路远，好自为之。”</p><p>你踏出青萍镇，前方是未知的江湖路。你决定先去最近的大城——洛阳，看看能否找到更多关于影杀堂或（如果你知道的话）《青萍剑法》的消息，或许还能打探苏姑娘的下落（如果你与她分别）。</p>",
    effects: [ { type: 'achievement', achievementId: 'ACH_FIRST_STEP_SOLO' } ],
    choices: [
      { text: "剑指洛阳，风云再起！", nextNodeId: 'journey_to_luoyang_start_solo_no_swift' }
    ]
  },
  prepare_to_leave_qingping_town_early: { // 隐瞒遭遇后辞行
    id: 'prepare_to_leave_qingping_town_early',
    title: "不告而别亦或坦诚",
    text: "<p>你找到师父，向他表达了想要外出闯荡江湖的想法。</p>",
    choices: [
        { text: "“师父，我想出去看看。” (简单辞行)", nextNodeId: 'master_simple_farewell' },
        { text: "还是将龙脊山之事告知师父 (回到之前的分支)", nextNodeId: 'tell_master_longji_encounter_briefly_no_su' } // 假设此时玩家若坦白，只会说遇到打斗
    ]
  },
  master_simple_farewell: {
    id: 'master_simple_farewell',
    title: "简单的告别",
    text: "<p>师父看了你一眼，似乎明白了你的心思，并未多问，只是叹了口气：“也罢，雏鸟总要离巢。这是我早年得到的一枚【金箭令】，你且收好，或许有用。”他并未提及《疾风步》。</p>",
    effects: [
      { type: 'item', item: initialItemsData['golden_arrow_token'], action: 'add' },
      { type: 'log', message: '师父赠予你金箭令。' },
      { type: 'achievement', achievementId: 'ACH_FIRST_STEP_SOLO' }
    ],
    choices: [
        { text: "“多谢师父。” (离开青萍镇)", nextNodeId: 'journey_to_luoyang_start_solo_no_swift' }
    ]
  },

  // --- 第二章：洛阳风云 (开端) ---
  journey_to_luoyang_start_with_su: {
    id: 'journey_to_luoyang_start_with_su',
    title: "前往洛阳 (与苏晴雪同行)",
    text: "<p>你与苏晴雪一同踏上了前往东都洛阳的官道。路途遥远，你们晓行夜宿，相互照应。</p><p>苏晴雪向你讲述了一些江湖见闻和她对《青萍剑法》的理解（如果你获得了剑谱，她会与你共同参详）。你也向她分享了你在青萍镇的学徒生活。</p>",
    image: `${IMG_PATH}scene_journey_with_su_qingsxue.jpg`,
    effects: [ { type: 'cg', cgId: 'cg_journey_with_su_qingsxue' } ],
    choices: [
      { text: "抵达洛阳城", nextNodeId: 'luoyang_city_gate_with_su' }
    ]
  },
  journey_to_luoyang_start_solo_swift: {
    id: 'journey_to_luoyang_start_solo_swift',
    title: "前往洛阳 (独行，习得疾风步)",
    text: "<p>你独自一人，凭借新学的【疾风步】，身轻如燕地踏上了前往东都洛阳的官道。路途虽远，但你的轻功让你行进颇快，也避开了一些不必要的麻烦。</p>",
    image: `${IMG_PATH}scene_road_to_luoyang_swift.jpg`,
    effects: [ { type: 'cg', cgId: 'cg_player_traveling_swiftly' } ],
    choices: [
      { text: "抵达洛阳城", nextNodeId: 'luoyang_city_gate_solo' }
    ]
  },
  journey_to_luoyang_start_solo_no_swift: {
    id: 'journey_to_luoyang_start_solo_no_swift',
    title: "前往洛阳 (独行，步履沉重)",
    text: "<p>你独自一人踏上了前往东都洛阳的官道。没有轻功傍身，你感觉路途比想象中更为漫长和艰辛。一路上风餐露宿，也遇到些许小波折，但总算有惊无险。</p>",
    image: `${IMG_PATH}scene_road_to_luoyang_hard.jpg`,
    effects: [ { type: 'cg', cgId: 'cg_player_traveling_hardship' } ],
    choices: [
      { text: "抵达洛阳城", nextNodeId: 'luoyang_city_gate_solo' }
    ]
  },

  luoyang_city_gate_with_su: {
    id: 'luoyang_city_gate_with_su',
    title: "东都洛阳 (与苏晴雪)",
    text: "<p>经过数日跋涉，你们终于抵达了气势恢宏的洛阳城。城门口车水马龙，人声鼎沸。</p><p>苏晴雪略显疲惫却又带着一丝兴奋：“凌公子，我们到了！多谢你一路护送。我们先去找我那位叔父吧，他在城南的金刀王府。”</p>",
    image: `${IMG_PATH}scene_luoyang_gate_with_su.jpg`,
    effects: [
        { type: 'achievement', achievementId: 'ACH_LUOYANG_ARRIVAL_WITH_SU' },
        { type: 'cg', cgId: 'cg_luoyang_city_overview' }
    ],
    isEnding: true, // 序章/第一章结束的标志
    endingTitle: "洛阳风云初起 (苏线)",
    cg: `${IMG_PATH}cg_luoyang_city_overview.jpg`, // 结局CG
    achievementId: 'ACH_ENDING_LUOYANG_BEGINNINGS_SU' // 特定结局成就
  },
  luoyang_city_gate_solo: {
    id: 'luoyang_city_gate_solo',
    title: "东都洛阳 (独行)",
    text: "<p>经过数日跋涉，你终于抵达了气势恢宏的洛阳城。城门口车水马龙，人声鼎沸。</p><p>你深吸一口气，感受着大都市的繁华与喧嚣。这里机会与危险并存，是你江湖之路的新起点。</p>",
    image: `${IMG_PATH}scene_luoyang_gate_solo.jpg`,
    effects: [
        { type: 'achievement', achievementId: 'ACH_LUOYANG_ARRIVAL_SOLO' },
        { type: 'cg', cgId: 'cg_luoyang_city_overview' }
    ],
    isEnding: true, // 序章/第一章结束的标志
    endingTitle: "洛阳风云初起 (独行线)",
    cg: `${IMG_PATH}cg_luoyang_city_overview.jpg`,
    achievementId: 'ACH_ENDING_LUOYANG_BEGINNINGS_SOLO'
  },

  // --- 死亡/游戏结束节点 (示例) ---
  player_death_generic: {
    id: 'player_death_generic',
    title: "江湖路断",
    text: "<p>你的江湖之路，到此为止了……</p>",
    image: `${IMG_PATH}scene_player_defeated.jpg`,
    isEnding: true,
    endingTitle: "力竭而亡",
    cg: `${IMG_PATH}cg_player_death_generic.jpg`,
    achievementId: 'ACH_GAME_OVER_DEATH'
  }
};