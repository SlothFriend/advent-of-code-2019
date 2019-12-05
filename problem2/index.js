const fs = require('fs')

const fileContent = fs.readFileSync('./input.txt', 'utf8')

const nums = fileContent.split(',').map(n => parseInt(n))

const calcPos0 = (inputNums, num1, num2) => {
  const nums = [...inputNums]
  nums[1] = num1
  nums[2] = num2

  let addressPt = 0
  while (addressPt < nums.length) {
    const [op, valPos1, valPos2, storePos] = nums.slice(addressPt, addressPt + 4)

    if (op === 99) break

    const val1 = nums[valPos1]
    const val2 = nums[valPos2]
    if (op === 1) { // add
      nums[storePos] = val1 + val2
    } else if (op === 2) { // multiple
      nums[storePos] = val1 * val2
    }

    addressPt += 4
  }

  return nums[0]
}

// Part 1
// console.log('Value at position 0 is:', calcPos0(nums, 12, 2))

// Part 2 - find num1 (noun) and num2 (verb) that result in 19690720 (then output 100 * noun + verb)
for (let i = 0; i < 100; i++) {
  for (let j = 0; j < 100; j++) {
    const val = calcPos0(nums, i, j)
    if (val === 19690720) {
      console.log('noun is', i, '; verb is', j)
      console.log('100 * noun + verb is:', 100 * i + j)
      return
    }
  }
}
