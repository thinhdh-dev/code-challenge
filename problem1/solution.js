/**
 * Problem 1: Three ways to sum to n
 * sum_to_n(n) returns the sum of all integers from 1 to n.
 * Example: sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15
 */

/**
 * Validates that n is a positive integer strictly less than Number.MAX_SAFE_INTEGER.
 * Returns true when the input is safe to process, false otherwise.
 */
function isValidN(n) {
  return Number.isInteger(n) && n > 0 && n < Number.MAX_SAFE_INTEGER;
}

/**
 * Approach A: Mathematical formula (Gauss)
 * Uses the closed-form arithmetic series formula: n * (n + 1) / 2
 * Time complexity: O(1) | Space complexity: O(1)
 */
var sum_to_n_a = function (n) {
  if (!isValidN(n)) return null;
  return (n * (n + 1)) / 2;
};

/**
 * Approach B: Iterative (for loop)
 * Accumulates the sum by iterating from 1 to n.
 * Time complexity: O(n) | Space complexity: O(1)
 */
var sum_to_n_b = function (n) {
  if (!isValidN(n)) return null;
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

/**
 * Approach C: Recursive
 * Adds n to the sum of all integers from 1 to n - 1.
 * Time complexity: O(n) | Space complexity: O(n) due to the call stack
 */
var sum_to_n_c = function (n) {
  if (!isValidN(n)) return null;

  function sum(current) {
    if (current === 1) return 1;
    return current + sum(current - 1);
  }

  return sum(n);
};
