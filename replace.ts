import { glob, path, fs } from 'zx'

const replaces: [string | RegExp, string][] = [
  // 格式错误
  ['\n\n**\\[] ', '\n\n---\n\n- [ ] '],
  ['\n\\[]', '\n- [ ]'],
  ['\n\\- \\[]', '\n  - [ ]'],
  ['**\n\n\\=====​\n', '\n\n---\n'],
  ['\n\\-\\[x] ', '\n- [x] '],
  ['\n\\-\\[x]', '\n- [x] '],
  // 替换单引号为双引号
  [/"(.*?)"/g, '“$1”'],
  // 替换斜体为粗体
  [
    /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)|(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g,
    '**$1**',
  ],
  // 替换 - 为中文的 ——
  [/([\u4e00-\u9fa5]+?)-([\u4e00-\u9fa5”]+?)/g, '$1——$2'],
  ['-”', '——”'],
  [/([\u4e00-\u9fa5]+?)-$/mg, '$1——'],
  [/^-([\u4e00-\u9fa5]+?)/mg, '——$1'],

  ['Apprehension pt.', '忧虑'],
  ['鹿目小圆', '鹿目圆'],
  ['美滨市', '见泷原市'],
  ['见滨', '见泷原'],
  ['笠美野', '风见野市'],
  ['京介', '恭介'],
  ['真纱美', '正美'],
  ['奥里可', '织莉子'],
  ['Walpurgisnacht', '魔女之夜'],
  ['圣瓦尔普吉斯之夜', '魔女之夜'],
  ['瓦尔普吉斯之夜', '魔女之夜'],
  ['美滨中学', '见泷原中学'],
  ['泽诺的悖论', '芝诺悖论'],
  ['猎魔', '狩猎'],
  ['盒子魔女', '箱之魔女'],
  ['城之白学院', '私立白羽女校'],
  ['白梦中学', '私立白羽女校'],
  ['白魅学院方向', '私立白羽女校'],
  ['城南学园', '私立白羽女校'],
  ['悲伤种子', '悲叹之种'],
  ['时间旅者', '时间旅行者'],
  ['培育者', '孵化者'],
  ['Sabrina', '萨布丽娜'],
]

for (const it of await glob('./books/zh-CN/*.md')) {
  // for (const it of ['./books/zh-CN/201.md']) {
  console.log(it)
  const fsPath = path.resolve(it)
  const r = replaces.reduce(
    (acc, [reg, rep]) => acc.replaceAll(reg, rep),
    await fs.readFile(fsPath, 'utf-8'),
  )
  await fs.writeFile(fsPath, r)
}
