/**
 * 模块化规则引擎
 *
 * 此模块根据字段名称、id、标签或其它提示信息生成表单字段填充建议。
 * 它支持平台分类、字段别名、模糊匹配以及置信度打分。
 *
 * 添加或修改规则时，请不要引入任何敏感信息，只使用示例字段和值。
 */

const platformDefaults = {
  default: {
    name: '张三',
    phone: '13800000000',
    email: 'example@example.com',
    address: '北京市海淀区某街道100号'
  },
  platform_a: {
    nickname: '测试用户',
    city: '深圳'
  },
  platform_b: {
    username: 'demoUser',
    zip: '100000'
  }
};

const fieldAliases = {
  name: ['姓名', 'full_name', 'real_name'],
  phone: ['联系电话', 'phone_number', '手机号'],
  email: ['电子邮件', 'mail', 'e-mail', '邮箱'],
  address: ['住址', 'address_line', '所在地'],
  username: ['用户名', 'username', 'user_name'],
  nickname: ['昵称', 'display_name'],
  city: ['城市', 'city_name'],
  zip: ['邮编', 'zip_code']
};

function fuzzyMatch(fieldName) {
  fieldName = (fieldName || '').toLowerCase();
  for (const key of Object.keys(fieldAliases)) {
    const aliases = fieldAliases[key];
    for (const alias of aliases) {
      if (fieldName.includes(alias.toLowerCase())) {
        const confidence = alias.length / Math.max(fieldName.length, alias.length);
        return { key, confidence };
      }
    }
  }
  return null;
}

export function getSuggestion(fieldName, platform = 'default') {
  const defaults = { ...platformDefaults.default, ...(platformDefaults[platform] || {}) };
  const match = fuzzyMatch(fieldName);
  if (match && defaults[match.key]) {
    return {
      value: defaults[match.key],
      confidence: match.confidence
    };
  }
  return { value: null, confidence: 0 };
}

export function generateSuggestions(fields, platform = 'default') {
  return fields.map(({ name }) => {
    const { value, confidence } = getSuggestion(name, platform);
    return { field: name, suggestion: value, confidence };
  });
}

if (process.env.NODE_ENV !== 'test' && process.argv[1] === new URL(import.meta.url).pathname) {
  const demo = ['姓名', '联系电话', '邮箱', '城市'];
  console.log(generateSuggestions(demo, process.env.FORM_PLATFORM || 'default'));
}
