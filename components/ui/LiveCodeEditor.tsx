"use client";

import { useEffect, useRef, useState } from "react";

// ── Colour palette (GitHub dark) ──────────────────────────────────────────
const C = {
  bg:      "#0d1117",
  chrome:  "#161b22",
  border:  "#30363d",
  lineNum: "#484f58",
  comment: "#8b949e",
  keyword: "#ff7b72",
  string:  "#a5d6ff",
  number:  "#79c0ff",
  builtin: "#d2a8ff",
  plain:   "#c9d1d9",
};

// ── Language definitions ───────────────────────────────────────────────────
interface LangDef {
  id: string; name: string; ext: string;
  lineComment: string; keywords: string[];
  snippet: string;
}

const LANGS: LangDef[] = [
  {
    id: "python", name: "Python", ext: "main.py",
    lineComment: "#",
    keywords: ["def","return","for","in","if","elif","else","while","import",
               "from","class","True","False","None","and","or","not","lambda",
               "pass","break","continue","print","range","len"],
    snippet:
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

fizzbuzz(20)`,
  },
  {
    id: "javascript", name: "JavaScript", ext: "index.js",
    lineComment: "//",
    keywords: ["function","return","const","let","var","if","else","for","of",
               "in","while","class","new","this","typeof","null","undefined",
               "true","false","async","await","import","export","from","=>"],
    snippet:
`// Debounce utility
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

const onSearch = debounce(
  (q) => console.log("search:", q),
  300
);`,
  },
  {
    id: "cpp", name: "C++", ext: "main.cpp",
    lineComment: "//",
    keywords: ["int","long","void","bool","auto","return","if","else","for",
               "while","include","using","namespace","std","const","struct",
               "class","public","private","true","false","nullptr"],
    snippet:
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
  return 0;
}`,
  },
  {
    id: "java", name: "Java", ext: "Main.java",
    lineComment: "//",
    keywords: ["public","private","static","void","int","long","String","class",
               "return","if","else","for","while","new","import","boolean",
               "true","false","null","this","extends","implements"],
    snippet:
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
  },
  {
    id: "rust", name: "Rust", ext: "main.rs",
    lineComment: "//",
    keywords: ["fn","let","mut","return","if","else","for","in","while","use",
               "struct","impl","pub","true","false","u64","i32","usize","Vec",
               "Some","None","Ok","Err","match","loop","break","continue"],
    snippet:
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
  },
  {
    id: "go", name: "Go", ext: "main.go",
    lineComment: "//",
    keywords: ["package","import","func","return","var","const","if","else",
               "for","range","go","defer","chan","make","len","append","fmt",
               "true","false","nil","struct","interface","map","type"],
    snippet:
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
  },
  {
    id: "kotlin", name: "Kotlin", ext: "main.kt",
    lineComment: "//",
    keywords: ["fun","val","var","return","if","else","for","in","while","class",
               "object","null","true","false","when","is","as","data","by",
               "lazy","override","open","sealed","companion","import","package"],
    snippet:
`fun isPalindrome(s: String): Boolean {
    val cleaned = s.lowercase()
        .filter { it.isLetterOrDigit() }
    return cleaned == cleaned.reversed()
}

fun main() {
    listOf("racecar", "hello", "level")
        .forEach { word ->
            val result = isPalindrome(word)
            println("$word: $result")
        }
}`,
  },
  {
    id: "scala", name: "Scala", ext: "main.scala",
    lineComment: "//",
    keywords: ["def","val","var","class","object","extends","with","import",
               "return","if","else","for","while","match","case","true","false",
               "null","new","override","trait","sealed","final","lazy","yield"],
    snippet:
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
  },
  {
    id: "elixir", name: "Elixir", ext: "main.exs",
    lineComment: "#",
    keywords: ["defmodule","def","defp","do","end","if","else","case","when",
               "fn","true","false","nil","import","alias","use","require",
               "for","in","receive","send","spawn","self"],
    snippet:
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
  },
  {
    id: "ruby", name: "Ruby", ext: "main.rb",
    lineComment: "#",
    keywords: ["def","end","return","if","elsif","else","unless","while","for",
               "in","do","class","module","nil","true","false","self","puts",
               "print","require","attr","each","map","select","times"],
    snippet:
`# Memoized Fibonacci
def fib(n, memo = {})
  return n if n <= 1
  memo[n] ||= fib(n - 1, memo) +
              fib(n - 2, memo)
end

10.times do |i|
  puts "fib(#{i}) = #{fib(i)}"
end`,
  },
];

// ── Tokenizer ─────────────────────────────────────────────────────────────
type TType = "keyword" | "string" | "comment" | "number" | "plain";
type Token = { t: TType; v: string };

function tokenize(line: string, lang: LangDef): Token[] {
  const tokens: Token[] = [];
  let s = line;

  // Whole-line comment
  const trimmed = s.trimStart();
  if (trimmed.startsWith(lang.lineComment)) {
    return [{ t: "comment", v: line }];
  }

  while (s.length > 0) {
    // Inline comment
    if (s.startsWith(lang.lineComment)) {
      tokens.push({ t: "comment", v: s });
      break;
    }

    // String literal (", ', `)
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
    const numM = s.match(/^[0-9]+(\.[0-9]+)?/);
    if (numM) {
      tokens.push({ t: "number", v: numM[0] });
      s = s.slice(numM[0].length);
      continue;
    }

    // Identifier / keyword
    const wordM = s.match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
    if (wordM) {
      const w = wordM[0];
      tokens.push({ t: lang.keywords.includes(w) ? "keyword" : "plain", v: w });
      s = s.slice(w.length);
      continue;
    }

    // Anything else (operator, bracket, space, etc.)
    tokens.push({ t: "plain", v: s[0] });
    s = s.slice(1);
  }

  return tokens;
}

function colorOf(t: TType): string {
  switch (t) {
    case "keyword": return C.keyword;
    case "string":  return C.string;
    case "comment": return C.comment;
    case "number":  return C.number;
    default:        return C.plain;
  }
}

// ── Component ─────────────────────────────────────────────────────────────
export default function LiveCodeEditor() {
  const [langIdx, setLangIdx]   = useState(0);
  const [charIdx, setCharIdx]   = useState(0);
  const [isIdle, setIsIdle]     = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const lang    = LANGS[langIdx];
  const snippet = lang.snippet;

  useEffect(() => {
    setCharIdx(0);
    setIsIdle(false);
    let i = 0;

    function type() {
      if (i >= snippet.length) {
        setIsIdle(true);
        timerRef.current = setTimeout(() => {
          setLangIdx((idx) => (idx + 1) % LANGS.length);
        }, 3200);
        return;
      }
      i++;
      setCharIdx(i);
      const ch = snippet[i - 1];
      const delay = ch === "\n" ? 160 : ch === " " ? 28 : 42;
      timerRef.current = setTimeout(type, delay);
    }

    timerRef.current = setTimeout(type, 500);
    return () => clearTimeout(timerRef.current);
  }, [langIdx, snippet]);

  const typedLines   = snippet.slice(0, charIdx).split("\n");
  const totalLines   = snippet.split("\n").length;

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", backgroundColor: C.bg, fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', 'Courier New', monospace", fontSize: "12px", lineHeight: "1.65", overflow: "hidden" }}>

      {/* Window chrome */}
      <div style={{ flexShrink: 0, height: 36, backgroundColor: C.chrome, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 12px", gap: 10 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5f57","#febc2e","#28c840"].map((col) => (
            <div key={col} style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: col }} />
          ))}
        </div>
        <span style={{ flex: 1, textAlign: "center", color: C.lineNum, fontSize: "11px", letterSpacing: "0.04em" }}>{lang.ext}</span>
      </div>

      {/* Language tabs */}
      <div style={{ flexShrink: 0, display: "flex", overflowX: "auto", backgroundColor: C.chrome, borderBottom: `1px solid ${C.border}` }}
        className="lang-tabs">
        {LANGS.map((l, i) => (
          <button
            key={l.id}
            onClick={() => setLangIdx(i)}
            style={{
              flexShrink: 0,
              padding: "6px 12px",
              fontSize: "10px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: "none",
              border: "none",
              borderBottom: i === langIdx ? `2px solid ${C.keyword}` : "2px solid transparent",
              color: i === langIdx ? C.plain : C.lineNum,
              cursor: "pointer",
              transition: "color 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            {l.name}
          </button>
        ))}
      </div>

      {/* Editor body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Line numbers */}
        <div style={{ flexShrink: 0, width: 36, paddingTop: 10, textAlign: "right", paddingRight: 8, color: C.lineNum, userSelect: "none", borderRight: `1px solid ${C.border}` }}>
          {Array.from({ length: totalLines }, (_, i) => (
            <div key={i} style={{ opacity: i < typedLines.length ? 1 : 0.18 }}>
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code */}
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px" }}>
          <pre style={{ margin: 0, fontFamily: "inherit", fontSize: "inherit", lineHeight: "inherit" }}>
            {typedLines.map((line, li) => {
              const tokens = tokenize(line, lang);
              const isCursorLine = li === typedLines.length - 1;
              return (
                <div key={li}>
                  {tokens.map((tok, ti) => (
                    <span key={ti} style={{ color: colorOf(tok.t) }}>{tok.v}</span>
                  ))}
                  {isCursorLine && (
                    <span
                      className={isIdle ? "cursor-blink" : "cursor-solid"}
                      style={{ display: "inline-block", width: "1ch", backgroundColor: C.plain, verticalAlign: "text-bottom", height: "1.1em" }}
                    />
                  )}
                </div>
              );
            })}
          </pre>
        </div>
      </div>

      {/* Status bar */}
      <div style={{ flexShrink: 0, height: 22, backgroundColor: C.chrome, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 12px", justifyContent: "space-between" }}>
        <span style={{ color: C.lineNum, fontSize: "10px", letterSpacing: "0.06em" }}>
          Ln {typedLines.length}, Col {(typedLines[typedLines.length - 1] ?? "").length + 1}
        </span>
        <span style={{ color: C.lineNum, fontSize: "10px", letterSpacing: "0.06em" }}>
          {lang.name} · UTF-8
        </span>
      </div>

      <style>{`
        .cursor-solid { opacity: 1; }
        .cursor-blink { animation: cur-blink 1.1s step-end infinite; }
        @keyframes cur-blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        .lang-tabs::-webkit-scrollbar { height: 2px; }
        .lang-tabs::-webkit-scrollbar-thumb { background: ${C.border}; }
      `}</style>
    </div>
  );
}
