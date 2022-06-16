import fs from 'fs'
import * as path from 'path'

const generateHTMLFileWithTestNames = (fileName) => {
  const extractTestNamesFromSpecFiles = (confluenceFileName) => {
    const testFilePaths = getAllFiles('cypress/integration/').filter(filePath => filePath.includes('spec'))
  
    testFilePaths.forEach((testFilePath) => {
      const fileContent = fs.readFileSync(testFilePath, { encoding: 'utf8' })
  
      appendDescribeAndItValuesToConfluenceFile(fileContent, confluenceFileName)
    })
  }

  const getAllFiles = (dirPath, arrayOfFiles) => {
    const files = fs.readdirSync(dirPath)
  
    arrayOfFiles = arrayOfFiles || []
  
    files.forEach((file) => {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
      } else {
        arrayOfFiles.push(path.join(dirPath, "/", file))
      }
    })
  
    return arrayOfFiles
  }

  const appendDescribeAndItValuesToConfluenceFile = (fileContent, confluenceFileName) => {
    const fileLines = fileContent.split('\n')
  
    fileLines.forEach((line) => {
      if (doesLineContainDescribe(line)) {
        const lineText = getDescribeValueFromLine(line)
        
        appendDescribeValueToFile(confluenceFileName, lineText)
  
        return
      } 
  
      if (!doesLineContainIt(line)) {
        return
      }
      
      const lineText = getItValueFromLine(line)
        
      line.includes('${') 
        ? appendItValueToFile(confluenceFileName, `<b>DYNAMIC</b> | ${lineText}`) 
        : appendItValueToFile(confluenceFileName, lineText)
    })
  }

  const doesLineContainDescribe = (line) => /describe\(/.test(line)

  const getDescribeValueFromLine = (line) => line.split('\'')[1].replace(/&/g, 'and')
  
  const appendDescribeValueToFile = (confluenceFileName, value) => {
    fs.appendFileSync(confluenceFileName, `<h2><u>${value}</u></h2>`)
  }
  
  const doesLineContainIt = (line) => / it\(/.test(line)
  
  const getItValueFromLine = (line) => (
    line.replace(/`/g, '\'')
        .split('\'')[1]
        .replace(/\$/g, '')
        .replace(/{/g, '<code>')
        .replace(/}/g, '</code>')
        .replace(/&/g, 'and')
  )
  
  const appendItValueToFile = (confluenceFileName, value) => {
    fs.appendFileSync(confluenceFileName, `<p>${value}</p>`)
  }
  
  fs.writeFileSync(fileName, '') // makes file empty

  extractTestNamesFromSpecFiles(fileName)
}

export default generateHTMLFileWithTestNames
