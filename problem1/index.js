const fs = require('fs')

const fileContent = fs.readFileSync('./input.txt', 'utf8')

const masses = fileContent.split('\n').map(n => parseInt(n)).filter(n => !isNaN(n))

// const fuelNeeded = masses.reduce((total, mass) => {
//   const toAdd = Math.floor(mass / 3) - 2
//   return total + toAdd
// }, 0)

// const message = `Total fuel needed: ${fuelNeeded}`
// console.log(message)

// return message


/** Part 2 **/

const getRecursiveFuel = (mass) => {
  const toAdd = Math.max(Math.floor(mass / 3) - 2, 0)
  if (toAdd === 0) return 0
  return toAdd + getRecursiveFuel(toAdd)
}

const fuelNeeded = masses.reduce((total, mass) => {
  return total + getRecursiveFuel(mass)
}, 0)

const message = `Total fuel needed: ${fuelNeeded}`
console.log(message)

return message
