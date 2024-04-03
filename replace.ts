import { glob, path, fs } from 'zx'

const english: [string | RegExp, string][] = [
  // 格式错误
  ['[X]', '[x]'],
  ['\n\n**\\[] ', '\n\n---\n\n- [ ] '],
  ['\n\n\\*\\*\\[] ', '\n\n---\n\n- [] '],
  ['**\\[]', '\n---\n\n- [] '],
  ['\n**\\[x] ', '\n---\n\n- [x] '],
  ['\n\\[]', '\n- [ ]'],
  ['\n-\\[]', '\n- [ ]'],
  ['\n\\[x]', '\n- [x]'],
  ['\n-\\[', '\n- ['],
  ['\n\\[', '\n- ['],
  ['\n\\- \\[]', '\n  - [ ]'],
  ['\n\\-- \\[]', '\n    - [ ]'],
  ['\n\\-- \\[x]', '\n    - [x]'],
  ['\n\\--\\[', '\n  - ['],
  ['\n\\---\\[', '\n    - ['],
  ['\n\\--- \\[', '\n    - ['],
  ['\n\\----\\[', '\n      - ['],
  ['\n\\-----\\[', '\n        - ['],
  ['\n\\------\\[', '\n          - ['],
  ['\n\\-------\\[', '\n            - ['],
  ['\n\\--------\\[', '\n              - ['],
  ['\n\\- \\[', '\n  - ['],
  ['\n> \\[', '\n> - ['],
  ['**\n\n\\=====​\n', '\n\n---\n'],
  ['\n\\-\\[x] ', '\n- [x] '],
  ['\n\\-\\[x]', '\n- [x] '],
  [/^~~- \\\[x\] (.+?)~~/gm, '- [x] ~~$1~~'],
  [/^~~\\\[\] (.+?)~~/gm, '- [] ~~$1~~'],
  [/^~~-- \\\[\] (.+?)~~/gm, '  - [ ] ~~$1~~'],
  [/^\*\*~~\\\[\] (.+?)~~/gm, '---\n\n- [] ~~$1~~'],
  ['\\*', '*'],
]

const chinese: [string | RegExp, string][] = [
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
  [/([\u4e00-\u9fa5]+?)-$/gm, '$1——'],
  [/^-([\u4e00-\u9fa5]+?)/gm, '——$1'],
  // 替换英文 , 为中文的，
  [',', '，'],
  [/([\u4e00-\u9fa5]+?)!/g, '$1！'],
  [/([\u4e00-\u9fa5]+?)\?/g, '$1？'],
  [/([\u4e00-\u9fa5]+?):/g, '$1：'],

  ['鹿目小圆', '鹿目圆'],
  ['美滨市', '见泷原市'],
  ['见滨', '见泷原'],
  ['见泽原市', '见泷原市'],
  ['笠美野', '风见野市'],
  ['京介', '恭介'],
  ['真纱美', '正美'],
  ['奥里可', '织莉子'],
  ['基里卡', '纪里香'],
  ['Walpurgisnacht', '魔女之夜'],
  // [/ ?Mami ?/, '麻美'],
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
  ['力场使', '念力使'],
  ['吉莉香', '纪里香'],
  ['织里香', '纪里香'],
  [/(?<!纪)(?<!吴纪)里香/g, '纪里香'],
  ['由奈', '友奈'],
  ['梅子优子', '梅子裕子'],
  ['心电感应', '心灵感应'],
  ['津叶蝶子', '椿蝶子'],
  ['Apprehension pt.', '忧虑'],
  [`“We've Got Hostiles” pt.`, '"敌人出现"'],
  // ['Sabrina', '萨布丽娜'],
]

const lang = process.argv[3]
const replaces = lang === 'en' ? english : chinese
console.log('language:', process.argv[3])
for (const it of await glob(
  lang === 'en' ? './books/en-US/*.md' : './books/zh-CN/*.md',
)) {
  console.log(it)
  const fsPath = path.resolve(it)
  const r = replaces.reduce(
    (acc, [reg, rep]) => acc.replaceAll(reg, rep),
    await fs.readFile(fsPath, 'utf-8'),
  )
  await fs.writeFile(fsPath, r)
}
