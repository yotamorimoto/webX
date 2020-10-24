import { Brown } from './brown.js'
import { seed } from './random.js'

// seed(0)
let b = new Brown(3)

console.log(b.next(1,0.1))
console.log(b.next(1,0.1))
console.log(b.next(1,0.1))
