const fs = require('fs')

const fileContent = fs.readFileSync('./input.txt', 'utf8')

const [line1, line2] = fileContent.split('\n')
const line1Instructions = line1.split(',')
const line2Instructions = line2.split(',')

const parseInstruction = (instruction) => {
  const direction = instruction.substring(0, 1)
  const magnitude = parseInt(instruction.substring(1))
  return { direction, magnitude }
}

const getNextCoordinate = (coord1, instruction) => {
  const { direction, magnitude } = parseInstruction(instruction)

  let coord2
  if (direction === 'U') {
    coord2 = new Coordinate(coord1.x, coord1.y + magnitude)
  } else if (direction === 'D') {
    coord2 = new Coordinate(coord1.x, coord1.y - magnitude)
  } else if (direction === 'L') {
    coord2 = new Coordinate(coord1.x - magnitude, coord1.y)
  } else if (direction === 'R') {
    coord2 = new Coordinate(coord1.x + magnitude, coord1.y)
  }

  return coord2
}

class Coordinate {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

class Segment {
  constructor(coord1, coord2) {
    this.coord1 = new Coordinate(coord1.x, coord1.y)
    this.coord2 = new Coordinate(coord2.x, coord2.y)
  }

  // Coordinate of the intersection, or empty array
  getIntersections(otherSegment) {
    /** Both segments are horizontal **/
    if (this.coord1.y === this.coord2.y && otherSegment.coord1.y === otherSegment.coord2.y) {
      // If they aren't on the same plane, no intersection
      if (this.coord1.y !== otherSegment.coord1.y) return []

      // On the same plane, so check if they intersect
      const minThisX = Math.min(this.coord1.x, this.coord2.x)
      const maxThisX = Math.max(this.coord1.x, this.coord2.x)
      const minOtherX = Math.min(otherSegment.coord1.x, otherSegment.coord2.x)
      const maxOtherX = Math.max(otherSegment.coord1.x, otherSegment.coord2.x)
      if (maxThisX >= minOtherX && maxThisX <= maxOtherX) {
        const minIntersectionX = minOtherX
        const maxIntersectionX = maxThisX
        // Return all coordinates between these min and max intersection values
        const intersections = []
        for (let x = minIntersectionX; x <= maxIntersectionX; x++) {
          intersections.push(new Coordinate(x, this.coord1.y))
        }
        return intersections
      } else if (maxOtherX >= minThisX && maxOtherX <= maxThisX) {
        const minIntersectionX = minThisX
        const maxIntersectionX = maxOtherX
        // Return all coordinates between these min and max intersection values
        const intersections = []
        for (let x = minIntersectionX; x <= maxIntersectionX; x++) {
          intersections.push(new Coordinate(x, this.coord1.y))
        }
        return intersections
      }
    }

    /** Both segments are vertical **/
    if (this.coord1.x === this.coord2.x && otherSegment.coord1.x === otherSegment.coord2.x) {
      // If they aren't on the same plane, no intersection
      if (this.coord1.x !== otherSegment.coord1.x) return []

      // On the same plane, so check if they intersect
      const minThisY = Math.min(this.coord1.y, this.coord2.y)
      const maxThisY = Math.max(this.coord1.y, this.coord2.y)
      const minOtherY = Math.min(otherSegment.coord1.y, otherSegment.coord2.y)
      const maxOtherY = Math.max(otherSegment.coord1.y, otherSegment.coord2.y)
      if (maxThisY >= minOtherY && maxThisY <= maxOtherY) {
        const minIntersectionY = minOtherY
        const maxIntersectionY = maxThisY
        // Return all coordinates between these min and max intersection values
        const intersections = []
        for (let y = minIntersectionY; y <= maxIntersectionY; y++) {
          intersections.push(new Coordinate(this.coord1.x, y))
        }
        return intersections
      } else if (maxOtherY >= minThisY && maxOtherY <= maxThisY) {
        const minIntersectionY = minThisY
        const maxIntersectionY = maxOtherY
        // Return all coordinates between these min and max intersection values
        const intersections = []
        for (let y = minIntersectionY; y <= maxIntersectionY; y++) {
          intersections.push(new Coordinate(this.coord1.x, y))
        }
        return intersections
      }
    }

    /** One segment is vertical, one horizontal **/

    let horizontalSegment
    let verticalSegment
    if (this.coord1.y === this.coord2.y) { // this is horizontal segment
      horizontalSegment = this
      verticalSegment = otherSegment
    } else {
      horizontalSegment = otherSegment
      verticalSegment = this
    }

    // Vertical segment falls between two x's of horizontal segment...
    const minHorizontalX = Math.min(horizontalSegment.coord1.x, horizontalSegment.coord2.x)
    const maxHorizontalX = Math.max(horizontalSegment.coord1.x, horizontalSegment.coord2.x)
    if (verticalSegment.coord1.x >= minHorizontalX && verticalSegment.coord1.x <= maxHorizontalX) {
      // Horizontal segment falls between two y's of vertical segment...
      const minVerticalY = Math.min(verticalSegment.coord1.y, verticalSegment.coord2.y)
      const maxVerticalY = Math.max(verticalSegment.coord1.y, verticalSegment.coord2.y)
      if (horizontalSegment.coord1.y >= minVerticalY && horizontalSegment.coord1.y <= maxVerticalY) {
        // We have an intersection, so get the coordinate
        const intersectionX = verticalSegment.coord1.x
        const intersectionY = horizontalSegment.coord1.y
        return [new Coordinate(intersectionX, intersectionY)]
      }
    }

    return []
  }

  getLength() {
    return Math.sqrt(((this.coord1.x - this.coord2.x) ** 2) + ((this.coord1.y - this.coord2.y) ** 2))
  }
}

const buildSegmentsFromInstructions = (lineInstructions) => {
  const segments = []

  let currentCoord = new Coordinate(0, 0)
  lineInstructions.forEach(instruction => {
    const nextCoord = getNextCoordinate(currentCoord, instruction)
    segments.push(new Segment(currentCoord, nextCoord))
    currentCoord = nextCoord
  })

  return segments
}

// Build segments from line instructions
const line1Segments = buildSegmentsFromInstructions(line1Instructions)
const line2Segments = buildSegmentsFromInstructions(line2Instructions)

// For each line2 segment, check for intersections with each line1 segment
const intersections = []
line2Segments.forEach(line2Segment => {
  line1Segments.forEach(line1Segment => {
    intersections.push(...line1Segment.getIntersections(line2Segment))
  })
})

const nonOriginIntersections = intersections.filter(coord => coord.x !== 0 || coord.y !== 0)

// const getManhattanDistance = (coord) => {
//   return Math.abs(coord.x) + Math.abs(coord.y)
// }

// // Choose the closest intersection coordinate among all intersections
// const closestIntersection = nonOriginIntersections.reduce((closest, coordinate) => {
//   const currentDist = getManhattanDistance(closest)
//   const newDist = getManhattanDistance(coordinate)
//   if (newDist < currentDist) return coordinate
//   return closest
// }, new Coordinate(Infinity, Infinity))

// console.log(closestIntersection)
// console.log(getManhattanDistance(closestIntersection))

/** Part 2 **/

const countSteps = (intersection, lineSegments) => {
  const intersectionAsSegment = new Segment(intersection, intersection)

  // Check each line segment sequentially to find the one that intersects the point
  for (let i = 0; i < lineSegments.length; i++) {
    const segment = lineSegments[i]
    if (segment.getIntersections(intersectionAsSegment).length) {
      const partialSegment = new Segment(segment.coord1, intersection)
      // Found the segment that intersects, so count the total squares the line occupies to get to the intersection
      const segmentsToIntersection = [...lineSegments.slice(0, i), partialSegment]
      const totalSegmentLengths = segmentsToIntersection.reduce((totalLength, segment) => {
        return totalLength + segment.getLength()
      }, 0)
      return totalSegmentLengths
    }
  }

  throw Error('Expected line to intersect')
}

// For each intersection, count the steps it takes for each line to reach it
const minSteps = nonOriginIntersections.reduce((minSteps, intersection) => {
  const totalSteps = countSteps(intersection, line1Segments) + countSteps(intersection, line2Segments)
  return Math.min(minSteps, totalSteps)
}, Infinity)

console.log(minSteps)
