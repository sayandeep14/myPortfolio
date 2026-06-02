"use client";

import { useEffect, useRef, useState } from "react";

// ── Colours ────────────────────────────────────────────────────────────────
const C = {
  bg:      "#0d1117",
  chrome:  "#161b22",
  border:  "#30363d",
  lineNum: "#484f58",
  comment: "#8b949e",
  keyword: "#ff7b72",
  string:  "#a5d6ff",
  number:  "#79c0ff",
  plain:   "#c9d1d9",
  accent:  "#ff7b72",
};

// ── Language definitions with 7 snippets each ──────────────────────────────
interface LangDef {
  id: string; name: string; ext: string;
  lineComment: string; keywords: string[];
  snippets: string[];
}

const LANGS: LangDef[] = [
  {
    id: "python", name: "Python", ext: "main.py",
    lineComment: "#",
    keywords: ["def","return","for","in","if","elif","else","while","import",
               "from","class","True","False","None","and","or","not","lambda",
               "pass","break","continue","print","range","yield","with","as"],
    snippets: [
`# FizzBuzz
def fizzbuzz(n):
    for i in range(1, n + 1):
        if i % 15 == 0:
            print("FizzBuzz")
        elif i % 3 == 0:
            print("Fizz")
        elif i % 5 == 0:
            print("Buzz")
        else:
            print(i)

fizzbuzz(15)`,

`# List comprehension
words = ["hello","world","python","code"]

long_upper = [
    w.upper()
    for w in words
    if len(w) > 4
]

print(long_upper)
# ['HELLO', 'WORLD', 'PYTHON']`,

`# Timer decorator
import time

def timer(fn):
    def wrapper(*args, **kwargs):
        t0 = time.perf_counter()
        result = fn(*args, **kwargs)
        dt = time.perf_counter() - t0
        print(f"{fn.__name__}: {dt:.4f}s")
        return result
    return wrapper

@timer
def slow_sum(n):
    return sum(range(n))

slow_sum(5_000_000)`,

`# Fibonacci generator
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

gen = fibonacci()
first_ten = [next(gen) for _ in range(10)]
print(first_ten)
# [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`,

`# Dataclass
from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float

    def distance(self) -> float:
        return (self.x**2 + self.y**2) ** 0.5

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

p = Point(3.0, 4.0)
print(p.distance())   # 5.0`,

`# Dict comprehension + sort
scores = {"Alice": 92, "Bob": 85, "Carol": 97}
bonus  = {"Dave": 78, "Alice": 5}

merged = {
    k: scores.get(k, 0) + bonus.get(k, 0)
    for k in scores | bonus
}
ranked = sorted(merged.items(),
                key=lambda x: -x[1])
print(ranked)`,

`# Context manager
class ManagedFile:
    def __init__(self, path, mode):
        self.path = path
        self.mode = mode

    def __enter__(self):
        self.file = open(self.path, self.mode)
        return self.file

    def __exit__(self, *args):
        self.file.close()

with ManagedFile("log.txt", "w") as f:
    f.write("Hello, context!")`,
    ],
  },

  {
    id: "javascript", name: "JavaScript", ext: "index.js",
    lineComment: "//",
    keywords: ["function","return","const","let","var","if","else","for","of",
               "in","while","class","new","this","typeof","null","undefined",
               "true","false","async","await","import","export","from","throw"],
    snippets: [
`// Debounce utility
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

const onSearch = debounce(
  (q) => console.log("search:", q), 300
);`,

`// Async / await + error handling
async function fetchUser(id) {
  try {
    const res = await fetch(
      \`/api/users/\${id}\`
    );
    if (!res.ok) throw new Error(res.status);
    const user = await res.json();
    return user;
  } catch (err) {
    console.error("Failed:", err.message);
    return null;
  }
}`,

`// Array pipeline
const orders = [
  { item: "book",  price: 12, qty: 3 },
  { item: "pen",   price: 2,  qty: 10 },
  { item: "desk",  price: 95, qty: 1 },
];

const total = orders
  .filter(o => o.price > 5)
  .map(o => o.price * o.qty)
  .reduce((sum, v) => sum + v, 0);

console.log("Total:", total); // 131`,

`// Closure — counter factory
function makeCounter(start = 0, step = 1) {
  let count = start;
  return {
    next:  () => (count += step),
    reset: () => (count = start),
    value: () => count,
  };
}

const c = makeCounter(0, 5);
console.log(c.next());  // 5
console.log(c.next());  // 10
console.log(c.reset()); // 0`,

`// Currying
const curry = (fn) => {
  const arity = fn.length;
  return function curried(...args) {
    if (args.length >= arity)
      return fn(...args);
    return (...more) =>
      curried(...args, ...more);
  };
};

const add = curry((a, b, c) => a + b + c);
console.log(add(1)(2)(3)); // 6
console.log(add(1, 2)(3)); // 6`,

`// Event emitter
class Emitter {
  #listeners = new Map();

  on(event, fn) {
    if (!this.#listeners.has(event))
      this.#listeners.set(event, []);
    this.#listeners.get(event).push(fn);
    return this;
  }

  emit(event, ...args) {
    this.#listeners.get(event)
      ?.forEach(fn => fn(...args));
  }
}

const bus = new Emitter();
bus.on("data", console.log);
bus.emit("data", { id: 1 });`,

`// Promise combinator
const delay = (ms, val) =>
  new Promise(res => setTimeout(() => res(val), ms));

async function main() {
  const [a, b, c] = await Promise.all([
    delay(100, "alpha"),
    delay(200, "beta"),
    delay(150, "gamma"),
  ]);
  console.log(a, b, c);
}

main();`,
    ],
  },

  {
    id: "cpp", name: "C++", ext: "main.cpp",
    lineComment: "//",
    keywords: ["int","long","void","bool","auto","return","if","else","for",
               "while","include","using","namespace","std","const","struct",
               "class","public","private","template","typename","new","delete"],
    snippets: [
`#include <iostream>
using namespace std;

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    for (int i = 0; i <= 10; i++)
        cout << i << "! = "
             << factorial(i) << "\\n";
}`,

`#include <vector>
#include <algorithm>
using namespace std;

int binarySearch(vector<int>& v, int t) {
    int lo = 0, hi = v.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (v[mid] == t) return mid;
        v[mid] < t ? lo = mid+1 : hi = mid-1;
    }
    return -1;
}`,

`#include <iostream>
#include <memory>
using namespace std;

struct Node {
    int val;
    shared_ptr<Node> next;
    Node(int v) : val(v), next(nullptr) {}
};

int main() {
    auto head = make_shared<Node>(1);
    head->next = make_shared<Node>(2);
    head->next->next = make_shared<Node>(3);
    for (auto n = head; n; n = n->next)
        cout << n->val << " ";
}`,

`#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

template<typename T>
T clamp(T val, T lo, T hi) {
    return max(lo, min(val, hi));
}

int main() {
    vector<int> v = {5, -2, 12, 0, 7, 99};
    for (auto& x : v)
        x = clamp(x, 0, 10);
    for (int x : v) cout << x << " ";
}`,

`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> nums = {4, 1, 8, 3, 6};

    auto is_even = [](int x) {
        return x % 2 == 0;
    };

    sort(nums.begin(), nums.end());
    auto it = remove_if(
        nums.begin(), nums.end(), is_even);
    nums.erase(it, nums.end());
    for (int x : nums) cout << x << " ";
}`,

`#include <iostream>
using namespace std;

struct Vec2 {
    float x, y;
    Vec2 operator+(const Vec2& o) const {
        return {x + o.x, y + o.y};
    }
    float dot(const Vec2& o) const {
        return x*o.x + y*o.y;
    }
};

int main() {
    Vec2 a{3, 4}, b{1, 2};
    Vec2 c = a + b;
    cout << "dot: " << a.dot(b) << "\\n";
}`,

`#include <map>
#include <string>
#include <sstream>
#include <iostream>
using namespace std;

map<string,int> wordCount(const string& s) {
    map<string,int> freq;
    istringstream ss(s);
    string w;
    while (ss >> w) freq[w]++;
    return freq;
}

int main() {
    auto f = wordCount("to be or not to be");
    for (auto& [w, c] : f)
        cout << w << ": " << c << "\\n";
}`,
    ],
  },

  {
    id: "java", name: "Java", ext: "Main.java",
    lineComment: "//",
    keywords: ["public","private","static","void","int","long","String","class",
               "return","if","else","for","while","new","import","boolean",
               "true","false","null","this","extends","interface","final","var"],
    snippets: [
`public class Fibonacci {
  static long fib(int n) {
    if (n <= 1) return n;
    long a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
      long c = a + b;
      a = b; b = c;
    }
    return b;
  }

  public static void main(String[] args) {
    for (int i = 0; i < 10; i++)
      System.out.println(fib(i));
  }
}`,

`import java.util.*;
import java.util.stream.*;

public class StreamDemo {
  public static void main(String[] args) {
    List<Integer> nums =
      List.of(1,2,3,4,5,6,7,8,9,10);

    int sumOfSquaresOfEvens = nums.stream()
      .filter(n -> n % 2 == 0)
      .mapToInt(n -> n * n)
      .sum();

    System.out.println(sumOfSquaresOfEvens);
  }
}`,

`import java.util.Optional;

public class SafeDivide {
  static Optional<Double> divide(
      double a, double b) {
    if (b == 0) return Optional.empty();
    return Optional.of(a / b);
  }

  public static void main(String[] args) {
    divide(10, 3)
      .map(r -> String.format("%.2f", r))
      .ifPresentOrElse(
        System.out::println,
        () -> System.out.println("NaN")
      );
  }
}`,

`import java.util.*;

public class WordCount {
  static Map<String,Integer> count(String s) {
    Map<String,Integer> map = new HashMap<>();
    for (String w : s.split("\\\\s+"))
      map.merge(w, 1, Integer::sum);
    return map;
  }

  public static void main(String[] args) {
    var result = count("to be or not to be");
    result.forEach((k, v) ->
      System.out.println(k + ": " + v));
  }
}`,

`public class BinarySearch {
  static int search(int[] arr, int target) {
    int lo = 0, hi = arr.length - 1;
    while (lo <= hi) {
      int mid = (lo + hi) >>> 1;
      if (arr[mid] == target) return mid;
      if (arr[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return -1;
  }

  public static void main(String[] args) {
    int[] a = {1,3,5,7,9,11,13};
    System.out.println(search(a, 7)); // 3
  }
}`,

`interface Shape {
  double area();
  default String describe() {
    return getClass().getSimpleName()
      + ": " + String.format("%.2f", area());
  }
}

record Circle(double r) implements Shape {
  public double area() {
    return Math.PI * r * r;
  }
}

record Rect(double w, double h) implements Shape {
  public double area() { return w * h; }
}`,

`import java.util.function.*;

public class Functional {
  static <T, R> Function<T, R> memoize(
      Function<T, R> fn) {
    var cache = new java.util.HashMap<T, R>();
    return x -> cache.computeIfAbsent(x, fn);
  }

  public static void main(String[] args) {
    Function<Integer, Long> fib =
      memoize(n -> n <= 1 ? n
        : fib(n-1) + fib(n-2));
    System.out.println(fib.apply(40));
  }
}`,
    ],
  },

  {
    id: "rust", name: "Rust", ext: "main.rs",
    lineComment: "//",
    keywords: ["fn","let","mut","return","if","else","for","in","while","use",
               "struct","impl","pub","true","false","u64","i32","usize","Vec",
               "Some","None","Ok","Err","match","loop","break","enum","trait"],
    snippets: [
`fn is_prime(n: u64) -> bool {
    if n < 2 { return false; }
    if n == 2 { return true; }
    if n % 2 == 0 { return false; }
    let mut i = 3u64;
    while i * i <= n {
        if n % i == 0 { return false; }
        i += 2;
    }
    true
}

fn main() {
    let primes: Vec<u64> = (2..30)
        .filter(|&n| is_prime(n))
        .collect();
    println!("{:?}", primes);
}`,

`#[derive(Debug)]
struct Stack<T> {
    items: Vec<T>,
}

impl<T> Stack<T> {
    fn new() -> Self {
        Stack { items: Vec::new() }
    }
    fn push(&mut self, item: T) {
        self.items.push(item);
    }
    fn pop(&mut self) -> Option<T> {
        self.items.pop()
    }
    fn is_empty(&self) -> bool {
        self.items.is_empty()
    }
}`,

`#[derive(Debug)]
enum Shape {
    Circle(f64),
    Rect(f64, f64),
    Triangle(f64, f64, f64),
}

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle(r)    => std::f64::consts::PI * r * r,
            Shape::Rect(w, h)   => w * h,
            Shape::Triangle(a,b,c) => {
                let s = (a+b+c) / 2.0;
                (s*(s-a)*(s-b)*(s-c)).sqrt()
            }
        }
    }
}`,

`use std::collections::HashMap;

fn word_count(text: &str) -> HashMap<&str, usize> {
    let mut map = HashMap::new();
    for word in text.split_whitespace() {
        *map.entry(word).or_insert(0) += 1;
    }
    map
}

fn main() {
    let counts = word_count("to be or not to be");
    let mut pairs: Vec<_> = counts.iter().collect();
    pairs.sort_by_key(|&(w, _)| w);
    for (w, c) in pairs { println!("{w}: {c}"); }
}`,

`trait Summarise {
    fn summary(&self) -> String;
    fn preview(&self) -> String {
        format!("{}...", &self.summary()[..20])
    }
}

struct Article {
    title: String,
    body:  String,
}

impl Summarise for Article {
    fn summary(&self) -> String {
        format!("{}: {}", self.title, self.body)
    }
}`,

`fn quicksort(mut v: Vec<i32>) -> Vec<i32> {
    if v.len() <= 1 { return v; }
    let pivot = v.remove(0);
    let left: Vec<i32> =
        v.iter().filter(|&&x| x <= pivot)
         .copied().collect();
    let right: Vec<i32> =
        v.iter().filter(|&&x| x > pivot)
         .copied().collect();
    let mut result = quicksort(left);
    result.push(pivot);
    result.extend(quicksort(right));
    result
}`,

`use std::fmt;

#[derive(Debug)]
struct Matrix([[f64; 2]; 2]);

impl fmt::Display for Matrix {
    fn fmt(&self, f: &mut fmt::Formatter)
        -> fmt::Result {
        write!(f, "[{} {}]\\n[{} {}]",
            self.0[0][0], self.0[0][1],
            self.0[1][0], self.0[1][1])
    }
}

fn main() {
    let m = Matrix([[1.,2.],[3.,4.]]);
    println!("{m}");
}`,
    ],
  },

  {
    id: "go", name: "Go", ext: "main.go",
    lineComment: "//",
    keywords: ["package","import","func","return","var","const","if","else",
               "for","range","go","defer","chan","make","len","append","true",
               "false","nil","struct","interface","map","type","select","case"],
    snippets: [
`package main

import "fmt"

func fibonacci() func() int {
    a, b := 0, 1
    return func() int {
        a, b = b, a+b
        return a
    }
}

func main() {
    next := fibonacci()
    for i := 0; i < 10; i++ {
        fmt.Println(next())
    }
}`,

`package main

import (
    "fmt"
    "sync"
)

func merge(cs ...<-chan int) <-chan int {
    var wg sync.WaitGroup
    out := make(chan int)
    output := func(c <-chan int) {
        for n := range c { out <- n }
        wg.Done()
    }
    wg.Add(len(cs))
    for _, c := range cs { go output(c) }
    go func() { wg.Wait(); close(out) }()
    return out
}`,

`package main

import "fmt"

type Animal interface {
    Sound() string
    Name()  string
}

type Dog struct{}
type Cat struct{}

func (d Dog) Sound() string { return "Woof" }
func (d Dog) Name()  string { return "Dog"  }
func (c Cat) Sound() string { return "Meow" }
func (c Cat) Name()  string { return "Cat"  }

func describe(a Animal) {
    fmt.Printf("%s says %s\\n", a.Name(), a.Sound())
}`,

`package main

import (
    "errors"
    "fmt"
)

var ErrNotFound = errors.New("not found")

func findUser(id int) (string, error) {
    users := map[int]string{1: "Alice", 2: "Bob"}
    u, ok := users[id]
    if !ok {
        return "", fmt.Errorf(
            "findUser(%d): %w", id, ErrNotFound)
    }
    return u, nil
}`,

`package main

import "fmt"

func filter[T any](s []T, fn func(T) bool) []T {
    var out []T
    for _, v := range s {
        if fn(v) { out = append(out, v) }
    }
    return out
}

func mapSlice[T, U any](s []T, fn func(T) U) []U {
    out := make([]U, len(s))
    for i, v := range s { out[i] = fn(v) }
    return out
}

func main() {
    nums := []int{1,2,3,4,5,6,7,8}
    evens := filter(nums, func(n int) bool { return n%2 == 0 })
    fmt.Println(mapSlice(evens, func(n int) int { return n * n }))
}`,

`package main

import (
    "fmt"
    "strings"
)

func wordFreq(s string) map[string]int {
    freq := make(map[string]int)
    for _, w := range strings.Fields(s) {
        freq[strings.ToLower(w)]++
    }
    return freq
}

func main() {
    text := "Go is fast Go is simple Go is fun"
    for w, c := range wordFreq(text) {
        fmt.Printf("%s: %d\\n", w, c)
    }
}`,

`package main

import "fmt"

func flatten(nested []interface{}) []int {
    var result []int
    for _, item := range nested {
        switch v := item.(type) {
        case int:
            result = append(result, v)
        case []interface{}:
            result = append(result, flatten(v)...)
        }
    }
    return result
}

func main() {
    data := []interface{}{1, []interface{}{2, 3}, 4}
    fmt.Println(flatten(data))
}`,
    ],
  },

  {
    id: "kotlin", name: "Kotlin", ext: "main.kt",
    lineComment: "//",
    keywords: ["fun","val","var","return","if","else","for","in","while","class",
               "object","null","true","false","when","is","as","data","by",
               "lazy","override","open","sealed","companion","import","package"],
    snippets: [
`fun isPalindrome(s: String): Boolean {
    val cleaned = s.lowercase()
        .filter { it.isLetterOrDigit() }
    return cleaned == cleaned.reversed()
}

fun main() {
    listOf("racecar", "hello", "level")
        .forEach { word ->
            println("$word → \${isPalindrome(word)}")
        }
}`,

`data class Point(val x: Double, val y: Double) {
    operator fun plus(other: Point) =
        Point(x + other.x, y + other.y)

    fun distanceTo(other: Point): Double {
        val dx = x - other.x
        val dy = y - other.y
        return Math.sqrt(dx*dx + dy*dy)
    }
}

fun main() {
    val a = Point(0.0, 0.0)
    val b = Point(3.0, 4.0)
    println(a.distanceTo(b)) // 5.0
}`,

`// Extension functions
fun String.isPalindrome(): Boolean {
    val s = this.lowercase()
              .filter { it.isLetterOrDigit() }
    return s == s.reversed()
}

fun Int.factorial(): Long =
    if (this <= 1) 1L
    else this * (this - 1).factorial()

fun main() {
    println("racecar".isPalindrome()) // true
    println(10.factorial())           // 3628800
}`,

`sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Failure(val error: String) : Result<Nothing>()
}

fun divide(a: Double, b: Double): Result<Double> =
    if (b == 0.0) Result.Failure("Division by zero")
    else Result.Success(a / b)

fun main() {
    when (val r = divide(10.0, 3.0)) {
        is Result.Success -> println(r.data)
        is Result.Failure -> println(r.error)
    }
}`,

`fun <T> List<T>.chunked(size: Int): List<List<T>> {
    val chunks = mutableListOf<List<T>>()
    var i = 0
    while (i < this.size) {
        chunks += this.subList(i, minOf(i + size, this.size))
        i += size
    }
    return chunks
}

fun main() {
    val nums = (1..10).toList()
    nums.chunked(3).forEach { println(it) }
}`,

`// Null safety + scope functions
data class User(val name: String, val email: String?)

fun notify(user: User) {
    user.email?.let { addr ->
        println("Sending to: $addr")
    } ?: println("No email for \${user.name}")
}

fun main() {
    val users = listOf(
        User("Alice", "alice@example.com"),
        User("Bob",   null),
    )
    users.forEach { notify(it) }
}`,

`fun fibonacci(): Sequence<Long> = sequence {
    var a = 0L; var b = 1L
    while (true) {
        yield(a)
        a = b.also { b = a + b }
    }
}

fun main() {
    fibonacci()
        .take(15)
        .filter { it % 2 == 0L }
        .forEach { print("$it ") }
}`,
    ],
  },

  {
    id: "scala", name: "Scala", ext: "main.scala",
    lineComment: "//",
    keywords: ["def","val","var","class","object","extends","with","import",
               "return","if","else","for","while","match","case","true","false",
               "null","new","override","trait","sealed","final","lazy","yield"],
    snippets: [
`object Primes extends App {
  def sieve(
    nums: LazyList[Int]
  ): LazyList[Int] =
    nums.head #:: sieve(
      nums.tail.filter(
        _ % nums.head != 0
      )
    )

  val primes = sieve(LazyList.from(2))
  primes.take(10).foreach(println)
}`,

`sealed trait Shape
case class Circle(r: Double)        extends Shape
case class Rect(w: Double, h: Double) extends Shape

def area(s: Shape): Double = s match {
  case Circle(r)   => math.Pi * r * r
  case Rect(w, h)  => w * h
}

val shapes = List(Circle(3), Rect(4, 5))
shapes.map(area).foreach(println)`,

`case class Person(name: String, age: Int)

object Person {
  implicit val ordering: Ordering[Person] =
    Ordering.by(_.age)
}

val people = List(
  Person("Alice", 30),
  Person("Bob",   25),
  Person("Carol", 35),
)

people.sorted.foreach(println)`,

`def safeDiv(a: Double, b: Double): Option[Double] =
  if (b == 0) None else Some(a / b)

val result = for {
  x <- safeDiv(10, 2)
  y <- safeDiv(x, 2.5)
  z <- safeDiv(y, 0) // None — short-circuits
} yield z

println(result) // None`,

`import scala.annotation.tailrec

def fib(n: Int): BigInt = {
  @tailrec
  def loop(n: Int, a: BigInt, b: BigInt): BigInt =
    if (n == 0) a
    else loop(n - 1, b, a + b)
  loop(n, 0, 1)
}

(0 until 15).map(fib).foreach(print)`,

`val words = List(
  "scala","is","concise",
  "and","expressive","and","fun"
)

val freq = words
  .groupBy(identity)
  .view.mapValues(_.size)
  .toMap

freq.toSeq
  .sortBy(-_._2)
  .foreach { case (w, c) =>
    println(s"$w: $c")
  }`,

`trait Printable[A] {
  def print(value: A): String
}

given Printable[Int] with
  def print(v: Int) = s"Int($v)"

given Printable[String] with
  def print(v: String) = s"Str($v)"

def display[A](v: A)(using p: Printable[A]) =
  println(p.print(v))

display(42)
display("hello")`,
    ],
  },

  {
    id: "elixir", name: "Elixir", ext: "main.exs",
    lineComment: "#",
    keywords: ["defmodule","def","defp","do","end","if","else","case","when",
               "fn","true","false","nil","import","alias","use","require",
               "for","in","receive","send","spawn","self","cond","with"],
    snippets: [
`defmodule Fibonacci do
  def sequence(n) do
    Stream.unfold({0, 1}, fn {a, b} ->
      {a, {b, a + b}}
    end)
    |> Enum.take(n)
  end
end

Fibonacci.sequence(10)
|> Enum.each(&IO.inspect/1)`,

`defmodule Pipeline do
  def process(text) do
    text
    |> String.downcase()
    |> String.split()
    |> Enum.reject(&(&1 in ~w[a an the]))
    |> Enum.frequencies()
    |> Enum.sort_by(fn {_, v} -> -v end)
    |> Enum.take(5)
  end
end`,

`defmodule Shape do
  def area({:circle, r}),
    do: :math.pi() * r * r

  def area({:rect, w, h}),
    do: w * h

  def area({:triangle, b, h}),
    do: 0.5 * b * h
end

IO.inspect Shape.area({:circle, 5})
IO.inspect Shape.area({:rect, 4, 6})`,

`defmodule MyList do
  def flatten([]), do: []
  def flatten([h | t]) when is_list(h) do
    flatten(h) ++ flatten(t)
  end
  def flatten([h | t]) do
    [h | flatten(t)]
  end
end

MyList.flatten([1, [2, [3, 4]], 5])
|> IO.inspect()`,

`defmodule WordCount do
  def count(text) do
    text
    |> String.split(~r/\s+/)
    |> Enum.reduce(%{}, fn word, acc ->
      Map.update(acc, word, 1, &(&1 + 1))
    end)
  end
end

"to be or not to be"
|> WordCount.count()
|> IO.inspect()`,

`defmodule BubbleSort do
  def sort(list), do: do_sort(list, [])

  defp do_sort([], sorted), do: sorted
  defp do_sort(list, sorted) do
    {rest, [max]} = Enum.split(
      list, length(list) - 1)
    do_sort(
      Enum.sort(rest),
      [max | sorted])
  end
end`,

`defmodule Cache do
  def new(), do: %{}

  def put(cache, key, val),
    do: Map.put(cache, key, val)

  def get(cache, key),
    do: Map.get(cache, key)

  def memoize(cache, key, fun) do
    case get(cache, key) do
      nil ->
        val = fun.()
        {put(cache, key, val), val}
      val ->
        {cache, val}
    end
  end
end`,
    ],
  },

  {
    id: "ruby", name: "Ruby", ext: "main.rb",
    lineComment: "#",
    keywords: ["def","end","return","if","elsif","else","unless","while","for",
               "in","do","class","module","nil","true","false","self","puts",
               "print","require","attr","each","map","select","times","lambda"],
    snippets: [
`# Memoized Fibonacci
def fib(n, memo = {})
  return n if n <= 1
  memo[n] ||= fib(n - 1, memo) +
              fib(n - 2, memo)
end

10.times do |i|
  puts "fib(#{i}) = #{fib(i)}"
end`,

`# Comparable mixin
class Temperature
  include Comparable
  attr_reader :degrees

  def initialize(degrees)
    @degrees = degrees
  end

  def <=>(other)
    @degrees <=> other.degrees
  end
end

temps = [30, 15, 42, 5].map { Temperature.new(_1) }
puts temps.min.degrees  # 5
puts temps.max.degrees  # 42`,

`# Lazy enumerator
natural_numbers = Enumerator.new do |y|
  n = 0
  loop { y << n; n += 1 }
end

first_even_squares = natural_numbers
  .lazy
  .select { _1.even? }
  .map    { _1 ** 2  }
  .first(5)

p first_even_squares
# [0, 4, 16, 36, 64]`,

`# DSL with method_missing
class FluentQuery
  def initialize = @parts = []

  def method_missing(name, *args)
    @parts << "#{name}(#{args.join(",")})"
    self
  end

  def to_s = @parts.join(" -> ")
end

result = FluentQuery.new
  .select(:name, :age)
  .from(:users)
  .where(age: 18)

puts result`,

`# Module mixin
module Greetable
  def greet(name)
    "#{salutation}, #{name}! I am #{self.class}."
  end

  private

  def salutation = "Hello"
end

class Friend
  include Greetable
end

class FormalGuest
  include Greetable
  private def salutation = "Good day"
end

puts Friend.new.greet("Alice")`,

`# Block / yield
def timed
  start = Time.now
  result = yield
  elapsed = Time.now - start
  puts "Done in #{elapsed.round(4)}s"
  result
end

total = timed do
  (1..1_000_000).sum
end

puts "Sum: #{total}"`,

`# Symbol to proc + pipeline
words = %w[apple banana cherry date elderberry]

result = words
  .select { _1.length > 4 }
  .map(&:capitalize)
  .map(&:chars)
  .map { _1.first(3).join }
  .sort

p result`,
    ],
  },
];

// ── Tokenizer ──────────────────────────────────────────────────────────────
type TType = "keyword"|"string"|"comment"|"number"|"plain";
type Token = { t: TType; v: string };

function tokenize(line: string, lang: LangDef): Token[] {
  const tokens: Token[] = [];
  const trimmed = line.trimStart();

  if (trimmed.startsWith(lang.lineComment))
    return [{ t: "comment", v: line }];

  let s = line;
  while (s.length > 0) {
    if (s.startsWith(lang.lineComment)) {
      tokens.push({ t: "comment", v: s });
      break;
    }

    // String
    if (s[0] === '"' || s[0] === "'" || s[0] === "`") {
      const q = s[0];
      let end = 1;
      while (end < s.length) {
        if (s[end] === "\\" && end + 1 < s.length) { end += 2; continue; }
        if (s[end] === q) { end++; break; }
        end++;
      }
      tokens.push({ t: "string", v: s.slice(0, end) });
      s = s.slice(end);
      continue;
    }

    // Number
    const nm = s.match(/^[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?(_[0-9]+)*/);
    if (nm) {
      tokens.push({ t: "number", v: nm[0] });
      s = s.slice(nm[0].length);
      continue;
    }

    // Word / keyword
    const wm = s.match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
    if (wm) {
      const w = wm[0];
      tokens.push({ t: lang.keywords.includes(w) ? "keyword" : "plain", v: w });
      s = s.slice(w.length);
      continue;
    }

    tokens.push({ t: "plain", v: s[0] });
    s = s.slice(1);
  }

  return tokens;
}

function colorOf(t: TType): string {
  if (t === "keyword") return C.keyword;
  if (t === "string")  return C.string;
  if (t === "comment") return C.comment;
  if (t === "number")  return C.number;
  return C.plain;
}

// ── Component ──────────────────────────────────────────────────────────────
export default function LiveCodeEditor() {
  const [langIdx,    setLangIdx]    = useState(0);
  const [snippetIdx, setSnippetIdx] = useState(0);
  const [charIdx,    setCharIdx]    = useState(0);
  const [isIdle,     setIsIdle]     = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const lang      = LANGS[langIdx];
  const snippet   = lang.snippets[snippetIdx];
  const totalLines = snippet.split("\n").length;

  // When language OR snippet changes → restart typing
  useEffect(() => {
    clearTimeout(timerRef.current);
    setCharIdx(0);
    setIsIdle(false);
    let i = 0;

    function type() {
      if (i >= snippet.length) {
        setIsIdle(true);
        // After idle pause, move to next snippet (same language)
        timerRef.current = setTimeout(() => {
          setSnippetIdx(idx => (idx + 1) % lang.snippets.length);
        }, 2800);
        return;
      }
      i++;
      setCharIdx(i);
      const ch = snippet[i - 1];
      const delay = ch === "\n" ? 150 : ch === " " ? 25 : 40;
      timerRef.current = setTimeout(type, delay);
    }

    timerRef.current = setTimeout(type, 450);
    return () => clearTimeout(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langIdx, snippetIdx]);

  // Language switch → reset snippet + char
  function switchLang(idx: number) {
    clearTimeout(timerRef.current);
    setLangIdx(idx);
    setSnippetIdx(0);
  }

  const typedLines = snippet.slice(0, charIdx).split("\n");

  return (
    <div className="lcd-root" style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      backgroundColor: C.bg,
      borderRadius: 14,
      overflow: "hidden",
      fontFamily: "'Fira Code','JetBrains Mono','Cascadia Code','Courier New',monospace",
      fontSize: "12px", lineHeight: "1.7",
      boxShadow: "0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)",
    }}>

      {/* Chrome bar */}
      <div style={{
        flexShrink: 0, height: 38,
        backgroundColor: C.chrome,
        borderRadius: "14px 14px 0 0",
        borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center",
        padding: "0 14px", gap: 10,
      }}>
        <div style={{ display: "flex", gap: 7 }}>
          {["#ff5f57","#febc2e","#28c840"].map(col => (
            <div key={col} style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: col }} />
          ))}
        </div>
        <span style={{
          flex: 1, textAlign: "center",
          color: C.lineNum, fontSize: "11px",
          letterSpacing: "0.04em",
        }}>
          {lang.ext}
          <span style={{ marginLeft: 8, fontSize: "10px", color: "#2d3748" }}>
            {snippetIdx + 1}/{lang.snippets.length}
          </span>
        </span>
      </div>

      {/* Language tabs */}
      <div className="lcd-tabs" style={{
        flexShrink: 0, display: "flex",
        overflowX: "auto",
        backgroundColor: C.chrome,
        borderBottom: `1px solid ${C.border}`,
      }}>
        {LANGS.map((l, i) => (
          <button key={l.id} onClick={() => switchLang(i)} style={{
            flexShrink: 0,
            padding: "5px 11px",
            fontSize: "10px",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            background: "none", border: "none",
            borderBottom: i === langIdx
              ? `2px solid ${C.keyword}`
              : "2px solid transparent",
            color: i === langIdx ? C.plain : C.lineNum,
            cursor: "pointer",
            transition: "color 0.15s",
            whiteSpace: "nowrap",
          }}>
            {l.name}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Line numbers */}
        <div style={{
          flexShrink: 0, width: 34,
          paddingTop: 10,
          textAlign: "right", paddingRight: 8,
          color: C.lineNum,
          userSelect: "none",
          borderRight: `1px solid ${C.border}`,
          fontSize: "11px",
        }}>
          {Array.from({ length: totalLines }, (_, i) => (
            <div key={i} style={{ opacity: i < typedLines.length ? 0.9 : 0.15 }}>
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code */}
        <div style={{ flex: 1, overflow: "auto", padding: "10px 16px" }}>
          <pre style={{
            margin: 0,
            fontFamily: "inherit", fontSize: "inherit", lineHeight: "inherit",
          }}>
            {typedLines.map((line, li) => {
              const tokens = tokenize(line, lang);
              const isCursor = li === typedLines.length - 1;
              return (
                <div key={li}>
                  {tokens.map((tok, ti) => (
                    <span key={ti} style={{ color: colorOf(tok.t) }}>{tok.v}</span>
                  ))}
                  {isCursor && (
                    <span className={isIdle ? "lcd-cur-blink" : "lcd-cur-solid"} style={{
                      display: "inline-block", width: "1ch",
                      backgroundColor: C.plain,
                      verticalAlign: "text-bottom", height: "1.1em",
                    }} />
                  )}
                </div>
              );
            })}
          </pre>
        </div>
      </div>

      {/* Status bar */}
      <div style={{
        flexShrink: 0, height: 22,
        backgroundColor: "#0a0e14",
        borderTop: `1px solid ${C.border}`,
        display: "flex", alignItems: "center",
        padding: "0 14px",
        justifyContent: "space-between",
        borderRadius: "0 0 14px 14px",
      }}>
        <span style={{ color: "#3a4050", fontSize: "10px", letterSpacing: "0.05em" }}>
          Ln {typedLines.length} · Col {(typedLines[typedLines.length-1] ?? "").length + 1}
        </span>
        <span style={{ color: "#3a4050", fontSize: "10px", letterSpacing: "0.05em" }}>
          {lang.name} · UTF-8
        </span>
      </div>

      <style>{`
        .lcd-cur-solid { opacity: 1; }
        .lcd-cur-blink { animation: lcd-blink 1.1s step-end infinite; }
        @keyframes lcd-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .lcd-tabs { scrollbar-width: thin; scrollbar-color: ${C.border} transparent; }
        .lcd-tabs::-webkit-scrollbar { height: 2px; }
        .lcd-tabs::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 2px; }
        @media (max-width: 767px) {
          .lcd-root { font-size: 11px !important; }
        }
      `}</style>
    </div>
  );
}
