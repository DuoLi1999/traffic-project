// 事故原因分类映射表
// 将原始的详细事故原因描述映射为简短分类

const CAUSE_RULES: Array<[RegExp | string, string]> = [
  [/不按规定与前车保持必要的安全距离/, "未保持安全距离"],
  [/逆行/, "逆行"],
  [/倒车/, "违规倒车"],
  [/超速/, "超速行驶"],
  [/疲劳/, "疲劳驾驶"],
  [/饮酒|醉酒/, "酒驾"],
  [/变更车道/, "违规变道"],
  [/未按规定让行/, "未按规定让行"],
  [/违反交通信号/, "闯红灯/违反信号"],
  [/低于规定最低时速/, "低速行驶"],
  [/占用应急车道/, "占用应急车道"],
  [/货物遗洒|抛洒物/, "货物遗洒"],
  [/停车/, "违规停车"],
  [/行人/, "行人违规"],
  [/非机动车/, "非机动车违规"],
  [/轮胎|爆胎/, "车辆故障(爆胎)"],
  [/制动|刹车/, "车辆故障(制动)"],
  [/转向/, "车辆故障(转向)"],
  [/灯光/, "灯光使用不当"],
  [/载客|载人|超员/, "超员"],
  [/超载|超限/, "超载"],
  [/无证/, "无证驾驶"],
  [/不按规定车道/, "不按规定车道行驶"],
  [/操作不当|操作不规范/, "操作不当"],
  [/其他影响安全行为/, "其他违法行为"],
];

export function mapCause(raw: string): string {
  if (!raw || raw.trim() === "" || raw === "&nbsp;" || /^\d+$/.test(raw.trim())) {
    return "未记录";
  }
  const trimmed = raw.trim();
  for (const [pattern, label] of CAUSE_RULES) {
    if (typeof pattern === "string") {
      if (trimmed.includes(pattern)) return label;
    } else {
      if (pattern.test(trimmed)) return label;
    }
  }
  // 如果原因描述过长，截取前 20 字
  return trimmed.length > 20 ? trimmed.slice(0, 20) + "…" : trimmed;
}
