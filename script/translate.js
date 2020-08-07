// for translate i18n file to target lang by machine
const translate = require('google-translate-open-api').default
const { parseMultiple, getAllCode } = require('google-translate-open-api')
const prompts = require('prompts')
const fs = require('fs')
const chalk = require('chalk')
const ora = require('ora')

const ableLang = getAllCode()
const getTranslate = async function(opt) {
  let strList = []
  if (typeof opt.obj === 'object') {
    for (let key in opt.obj) {
      if (key !== 'locale' && key !== 'country') {
        const result = await getTranslate({
          obj: opt.obj[key]
        })
        if (typeof result === 'string') {
          strList.push(result)
        } else if (Array.isArray(result)) {
          strList = strList.concat(result)
        }
      }
    }
  } else if (Array.isArray(opt.obj)) {
    for (let i = 0; i < opt.obj.length; i++) {
      const result = await getTranslate({
        obj: opt.obj[i]
      })
      if (typeof result === 'string') {
        strList.push(result)
      } else if (Array.isArray(result)) {
        strList = strList.concat(result)
      }
    }
    return strList
  } else {
    return opt.obj
  }
  return strList
}

const withBaseFile = function(str) {
  return ['locale_BASE.js', 'locale_MAP.js'].indexOf(str) === -1
}

const curPath = process.cwd().replace('/script', '') //当前路径
const corePath = `${curPath}/src/core/assets/js` //核心JS文件夹，用于获取项目核心中文对照
const basePath = `${curPath}/src/assets/js/locale` //资源文件，
const coreBasePath = `${corePath}/locale_BASE.js` //项目核心中文对照文件
const translateBasePath = `${basePath}/locale_BASE.js` //项目客制中文对照
const optPath = `${basePath}/locale_MAP.js` //国家代码对照

try {
  // remove all locale file (without locale_BASE.js and locale_MAP.js)
  const deleteFileList = fs.readdirSync(basePath)
  let localeConfig
  deleteFileList.forEach(function(item) {
    //删除除'locale_BASE.js', 'locale_MAP.js'以外的文件
    if (withBaseFile(item)) {
      fs.unlinkSync(`${basePath}/${item}`)
    }
  })
  const isFile = fs.statSync(optPath).isFile()
  let choices = []
  if (isFile) {
    localeConfig = require(optPath)
    for (let key in localeConfig) {
      //查询国家代码是否支持谷歌机翻，支持则加入到交互选择里
      if (ableLang.indexOf(localeConfig[key].locale) !== -1) {
        choices.push({
          title: key,
          value: key
        })
      }
    }
  } else {
    console.log(chalk.red(`Error: ${optPath} is not a file`))
  }
  void (async function() {
    // select target language
    const response = await prompts([
      {
        type: 'multiselect',
        name: 'targetLang',
        instructions: false,
        message: 'Pick target language',
        choices: choices
      }
    ])

    if (response.targetLang.length === 0) {
      console.warn(
        chalk.yellow(
          `Warning: No target file selected. Default locale 'zh-cn, zh-tw, en, ja, ko'`
        )
      )
      //默认翻译语言
      response.targetLang = ['zh_CN', 'zh_TW', 'en_US', 'ja_JP', 'ko_KR']
    }
    // base locale file
    let baseFile = require(translateBasePath)
    const coreBaseFile = require(coreBasePath)
    //中文对照合并
    baseFile = {
      ...baseFile,
      ...coreBaseFile
    }
    const spinner = ora()
    for (let i = 0; i < response.targetLang.length; i++) {
      let item = response.targetLang[i]
      // tips loading
      spinner.text = `translating ${item}...`
      spinner.start()
      let localeCode = localeConfig[item].locale
      let targetFile = JSON.parse(JSON.stringify(baseFile))
      //收集需要翻译的所有中文----对象扁平
      const srcResult = await getTranslate({
        obj: targetFile
      })
      // translate all string  开始翻译
      const finalResult = await translate(srcResult, {
        tld: 'cn',
        from: baseFile.locale || 'auto',
        to: localeCode || 'zh-cn'
      })
      let translatedList = []
      finalResult.data.forEach(function(item) {
        translatedList = translatedList.concat(parseMultiple(item))
      })
      targetFile.locale = localeCode
      targetFile.country = item.split('_')[1]
      let resultText = JSON.stringify(targetFile, null, 4)
      //获取对照表所有key  ‘"xxx.(可选)yyy":’
      const keyList = resultText.match(/".*?":/g)
      //过滤有横杠key ,因为以免object里面出现xx-yy为Key
      keyList.forEach(function(citem) {
        if (!/-/.test(citem)) {
          resultText = resultText.replace(citem, citem.replace(/"/g, ''))
        }
      })
      resultText = resultText.replace(/"/g, "'")
      // replace translate info
      srcResult.forEach(function(citem, cindex) {
        resultText = resultText.replace(citem, translatedList[cindex])
      })
      // save locale file
      let finalText = `export default ${resultText}\n`
      try {
        fs.writeFileSync(`${basePath}/${item}.js`, finalText) //写翻译后的文件
        spinner.succeed(`${item} completed`)
      } catch (e) {
        console.log(e)
      }
    }
    // if all completed
    spinner.succeed(`all completed`)
    const currentLocaleList = fs.readdirSync(basePath)
    let antdLocale = []
    let customLocale = []
    let antdOpt = []
    let customOpt = []
    //组织import 语句，导入antd语言包
    currentLocaleList.forEach(function(citem) {
      if (withBaseFile(citem)) {
        let defaultName = citem.split('.')[0]
        let antdName = defaultName.replace('_', '')
        let customerName = `custom${antdName
          .charAt(0)
          .toUpperCase()}${antdName.slice(1)}`
        antdLocale.push(
          `import ${antdName} from 'ant-design-vue/lib/locale-provider/${defaultName}'`
        )
        customLocale.push(`import ${customerName} from '@locale/${citem}'`)
        antdOpt.push(`[${antdName}.locale]: ${antdName}`)
        customOpt.push(`[${antdName}.locale]: ${customerName}`)
      }
    })
    // read lang.tpl  读取模板文件
    let tplFileCtx = fs.readFileSync(
      `${curPath}/script/tpl/lang/lang.tpl`,
      'utf-8'
    )
    tplFileCtx = tplFileCtx
      .replace(
        '<% importTpl %>',
        `${antdLocale.join('\n')}\n${customLocale.join('\n')}`
      )
      .replace('<% exportAntdTpl %>', `${antdOpt.join(',\n    ')}`)
      .replace('<% exportCustomerTpl %>', `${customOpt.join(',\n        ')}`)
    fs.writeFileSync(`${corePath}/lang.js`, tplFileCtx)
    console.log(chalk.green('translate success'))
  })()
} catch (e) {
  console.log(chalk.red(e))
}
