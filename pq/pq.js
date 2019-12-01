class PQ {
  constructor() {
    this.array = [];
  }

  put(val, item) {
    this.array.push({val, item});

    let index = this.array.length - 1;
    while(index > 0) {
      let current = this.array[index];
      let parentIndex = Math.floor((index - 1) / 2);
      let parent = this.array[parentIndex];

      if (current.val >= parent.val) {
        break;
      }
      this.array[index] = parent;
      this.array[parentIndex] = current;
      index = parentIndex;
    }
  }

  get() {
    if (!this.array.length) {
      return null;
    }
    if (this.array.length === 1) {
      return this.array.pop();
    }
    let item = this.array[0];
    this.array[0] = this.array.pop();
    const len = this.array.length;
    let index = 0;
    while (true) {
      let leftChildIndex = index * 2 + 1;
      if (leftChildIndex >= len) {
        break;
      }
      let leftChild = this.array[leftChildIndex];

      let rightChildIndex = index * 2 + 2;
      let rightChild = rightChildIndex < len ? this.array[rightChildIndex] : null;

      let current = this.array[index];


      if (rightChild) {
        if (leftChild.val >= current.val && rightChild.val >= current.val) {
          break;
        }

        if (rightChild.val < leftChild.val) {
          this.array[rightChildIndex] = current;
          this.array[index] = rightChild;
          index = rightChildIndex;
        } else {
          this.array[leftChildIndex] = current;
          this.array[index] = leftChild;
          index = leftChildIndex;
        }
      } else {
        if (leftChild.val < current.val) {
          this.array[leftChildIndex] = current;
          this.array[index] = leftChild;
          index = leftChildIndex;
        }
      }
      break;
    }
    return item;
  }
}

let pq = new PQ();
pq.put(1, "L - 1");
pq.put(8, "L - 8");
pq.put(6, "L - 6");
pq.put(7, "L - 7");
pq.put(3, "L - 3");
pq.put(9, "L - 9");
console.log(pq.array.map(i => i.val));
let item;
do {
  item = pq.get();
  console.log("VALUE: " + (item ? item.val : "END"));
  console.log(pq.array.map(i => i.val));
  console.log();
} while(item);

