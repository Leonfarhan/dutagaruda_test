// 1. Program deret angka Fibonacci
function generateFibonacci(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];

  const sequence = [0, 1];
  while (sequence.length < n) {
    const nextNumber = sequence[sequence.length - 1] + sequence[sequence.length - 2];
    sequence.push(nextNumber);
  }
  
  // Memastikan deret memiliki panjang n
  return sequence.slice(0, n);
}

console.log("1. Deret Fibonacci:");
console.log('Deret untuk 9 angka pertama:', generateFibonacci(9));


// 2. Fungsi untuk mengambil keuntungan terbaik dari saham
function calculateMaxProfit(prices) {
  if (!prices || prices.length < 2) {
    return 0; // Tidak bisa profit jika kurang dari 2 harga
  }

  let minPrice = Infinity;
  let maxProfit = 0;

  for (let i = 0; i < prices.length; i++) {
    if (prices[i] < minPrice) {
      minPrice = prices[i];
    } else if (prices[i] - minPrice > maxProfit) {
      maxProfit = prices[i] - minPrice;
    }
  }

  return maxProfit;
}

console.log("\n2. Keuntungan Saham Terbaik:");
// Contoh dari user: Input: [10, 9, 6, 5, 15] -> Output yang diharapkan adalah keuntungan, yaitu 10 (Beli di 5, Jual di 15)
console.log("Contoh: [10, 9, 6, 5, 15] -> Keuntungan:", calculateMaxProfit([10, 9, 6, 5, 15]));

console.log("Soal:");
console.log("1. [7, 8, 3, 10, 8] -> Keuntungan:", calculateMaxProfit([7, 8, 3, 10, 8]));
console.log("2. [5, 12, 11, 12, 10] -> Keuntungan:", calculateMaxProfit([5, 12, 11, 12, 10]));
console.log("3. [7, 18, 27, 10, 29] -> Keuntungan:", calculateMaxProfit([7, 18, 27, 10, 29]));
console.log("4. [20, 17, 15, 14, 10] -> Keuntungan:", calculateMaxProfit([20, 17, 15, 14, 10]));


// 3. Fungsi untuk menghitung jumlah angka dalam array
function countNumbersInArray(arr) {
  let count = 0;
  for (const item of arr) {
    if (typeof item === 'number' && !isNaN(item)) {
      count++;
    }
  }
  return count;
}

console.log("\n3. Menghitung Jumlah Angka:");
// Contoh dari user: Input: [2, 'h', 6, 'u', 'y', 't', 7, 'j', 'y', 'h', 8] -> Output: 4
console.log("Contoh: [2, 'h', 6, 'u', 'y', 't', 7, 'j', 'y', 'h', 8] -> Jumlah Angka:", countNumbersInArray([2, 'h', 6, 'u', 'y', 't', 7, 'j', 'y', 'h', 8]));

console.log("Soal:");
console.log("1. ['b', 7, 'h', 6, 'h', 'k', 'i', 5, 'g', 7, 8] -> Jumlah Angka:", countNumbersInArray(['b', 7, 'h', 6, 'h', 'k', 'i', 5, 'g', 7, 8]));
console.log("2. [7, 'b', 8, 5, 6, 9, 'n', 'f', 'y', 6, 9] -> Jumlah Angka:", countNumbersInArray([7, 'b', 8, 5, 6, 9, 'n', 'f', 'y', 6, 9]));
console.log("3. ['u', 'h', 'b', 'n', 7, 6, 5, 1, 'g', 7, 9] -> Jumlah Angka:", countNumbersInArray(['u', 'h', 'b', 'n', 7, 6, 5, 1, 'g', 7, 9]));
