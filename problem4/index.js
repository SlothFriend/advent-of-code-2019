const fs = require('fs')

const fileContent = fs.readFileSync('./input.txt', 'utf8')

const [line1] = fileContent.split('\n')
const [lowNumStr, highNumStr] = line1.split('-')
const lowNum = parseInt(lowNumStr)
const highNum = parseInt(highNumStr)

const hasAdjacentButNotTooMany = (numStr) => {
  for (let i = 0; i < numStr.length - 1; i++) {
    if (numStr[i] === numStr[i + 1]) {
      // At end of string, and a pair, so true
      if (i + 2 >= numStr.length) return true
      // Third digit is different, so true
      if (numStr[i] !== numStr[i + 2]) return true
      // At least three in a row, so pass this group
      while (i < numStr.length && numStr[i] === numStr[i + 2]) i++
      i++
    }
  }
  return false
}

const doesNotDecrease = (numStr) => {
  for (let i = 0; i < numStr.length - 1; i++) {
    if (numStr[i] > numStr[i + 1]) return false
  }
  return true
}

let count = 0
for (let i = lowNum; i <= highNum; i++) {
  const numStr = i.toString()
  if (hasAdjacentButNotTooMany(numStr) && doesNotDecrease(numStr)) count++
}

console.log(count)
