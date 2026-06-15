/**
 * 通用脱敏工具
 *
 * 提供敏感模式检测与替换功能，避免提交真实生产数据。此处仅为示例，
 * 请根据具体业务需求扩展 patterns 中的正则表达式。
 */

const patterns = [
  {
    name: 'mobile',
    regex: /1\d{10}/g,
    replacer: (match) => match.replace(/\d{4}$/g, '****')
  },
  {
    name: 'id_card',
    regex: /\b\d{14,17}[\dXx]\b/g,
    replacer: (match) => match.substring(0, 6) + '********' + match.slice(-4)
  },
  {
    name: 'email',
    regex: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
    replacer: (match) => {
      const [user, domain] = match.split('@');
      return user.substring(0, 2) + '***@' + domain;
    }
  },
  {
    name: 'address',
    regex: /[\u4e00-\u9fa5]{2,}(省|市|自治区|区|县).{0,10}\d{1,4}号?/g,
    replacer: () => '[地址已隐藏]'
  }
];

export function sanitize(input) {
  let output = String(input);
  for (const { regex, replacer } of patterns) {
    output = output.replace(regex, replacer);
  }
  return output;
}

export function detectSensitive(input) {
  const results = [];
  for (const { name, regex } of patterns) {
    const matches = Array.from(input.matchAll(regex)).map((m) => m[0]);
    if (matches.length) {
      results.push({ name, matches });
    }
  }
  return results;
}

if (process.env.NODE_ENV !== 'test' && process.argv[1] === new URL(import.meta.url).pathname) {
  const demo = '姓名: 张三, 电话: 13812345678, 身份证: 110101199003074015, 邮箱: test@example.com, 地址: 北京市海淀区中关村大街100号';
  console.log('检测结果:', detectSensitive(demo));
  console.log('脱敏结果:', sanitize(demo));
}
