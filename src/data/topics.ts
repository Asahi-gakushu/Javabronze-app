import type { Topic } from "@/types";

export const topics: Topic[] = [
  {
    id: "basics",
    title: "Java Basics",
    description: "Variables, primitive types, operators, and printing output.",
    questions: [
      {
        id: "basics-1",
        prompt: "Which of these is a valid Java primitive type?",
        options: ["string", "int", "Integer", "Number"],
        correctIndex: 1,
        explanation:
          "`int` is one of Java's eight primitive types. `String` and `Integer` are classes, not primitives (note the capitalization), and `Number` is an abstract class.",
      },
      {
        id: "basics-2",
        prompt: "What does this code print?",
        code: `int x = 7;\nint y = 2;\nSystem.out.println(x / y);`,
        options: ["3.5", "3", "4", "Compile error"],
        correctIndex: 1,
        explanation:
          "Dividing two `int` values performs integer division, truncating the decimal part, so `7 / 2` evaluates to `3`.",
      },
      {
        id: "basics-3",
        prompt: "Which keyword declares a constant in Java?",
        options: ["const", "static", "final", "readonly"],
        correctIndex: 2,
        explanation:
          "`final` prevents a variable from being reassigned after initialization. `const` is reserved but unused, and `readonly` doesn't exist in Java.",
      },
      {
        id: "basics-4",
        prompt: "What is the size of a `long` in Java?",
        options: ["16 bits", "32 bits", "64 bits", "It depends on the OS"],
        correctIndex: 2,
        explanation:
          "Java's primitive sizes are fixed by the language spec regardless of platform. `long` is always 64 bits.",
      },
      {
        id: "basics-5",
        prompt: "Which operator checks for equality of primitive values?",
        options: ["=", "==", ".equals()", "==="],
        correctIndex: 1,
        explanation:
          "`==` compares primitive values directly. `.equals()` is used for comparing object contents, and `===` doesn't exist in Java.",
      },
      {
        id: "basics-6",
        prompt: "What is the correct entry point signature for a Java application?",
        options: [
          "public void main(String[] args)",
          "public static void main(String[] args)",
          "static main(String args)",
          "public static int main(String[] args)",
        ],
        correctIndex: 1,
        explanation:
          "The JVM looks for `public static void main(String[] args)` as the program's entry point.",
      },
      {
        id: "basics-7",
        prompt: "What does `String.equals()` compare, versus `==`?",
        options: [
          "They behave identically for Strings",
          "`.equals()` compares references, `==` compares content",
          "`.equals()` compares content, `==` compares references",
          "Neither compares content",
        ],
        correctIndex: 2,
        explanation:
          "For objects like `String`, `==` checks whether two references point to the same object, while `.equals()` compares the actual character content.",
      },
      {
        id: "basics-8",
        prompt: "Which is a valid way to declare and initialize an array of 3 ints?",
        options: [
          "int[] nums = new int[3];",
          "int nums[3];",
          "array<int> nums = new array(3);",
          "int nums = new int[3];",
        ],
        correctIndex: 0,
        explanation:
          "`int[] nums = new int[3];` creates an array of 3 elements, each defaulting to 0.",
      },
    ],
  },
  {
    id: "control-flow",
    title: "Control Flow",
    description: "if/else, loops, switch statements, and break/continue.",
    questions: [
      {
        id: "cf-1",
        prompt: "What does this loop print?",
        code: `for (int i = 0; i < 3; i++) {\n  System.out.println(i);\n}`,
        options: ["0 1 2", "1 2 3", "0 1 2 3", "Infinite loop"],
        correctIndex: 0,
        explanation:
          "The loop starts at `i = 0` and runs while `i < 3`, printing 0, 1, and 2.",
      },
      {
        id: "cf-2",
        prompt: "What is the purpose of `break` inside a `switch` case?",
        options: [
          "It exits the entire program",
          "It stops execution from falling through to the next case",
          "It restarts the switch statement",
          "It is required syntax with no effect",
        ],
        correctIndex: 1,
        explanation:
          "Without `break`, execution falls through to the next case's code, which is usually unintended.",
      },
      {
        id: "cf-3",
        prompt: "Which loop guarantees the body runs at least once?",
        options: ["for", "while", "do-while", "for-each"],
        correctIndex: 2,
        explanation:
          "`do-while` checks its condition after executing the loop body, so the body always runs once even if the condition is false.",
      },
      {
        id: "cf-4",
        prompt: "What does `continue` do inside a loop?",
        options: [
          "Exits the loop immediately",
          "Skips the rest of the current iteration and moves to the next one",
          "Pauses the loop",
          "Restarts the program",
        ],
        correctIndex: 1,
        explanation:
          "`continue` jumps to the next iteration, skipping any remaining code in the current one.",
      },
      {
        id: "cf-5",
        prompt: "What does this code print?",
        code: `int x = 5;\nif (x > 10) {\n  System.out.println("big");\n} else if (x > 3) {\n  System.out.println("medium");\n} else {\n  System.out.println("small");\n}`,
        options: ["big", "medium", "small", "Nothing"],
        correctIndex: 1,
        explanation: "`x` is 5, which fails `x > 10` but passes `x > 3`, so \"medium\" is printed.",
      },
      {
        id: "cf-6",
        prompt: "Which types can a Java `switch` statement operate on (traditionally)?",
        options: [
          "Only int",
          "int, char, String, and enums (among others)",
          "Only boolean",
          "Only String",
        ],
        correctIndex: 1,
        explanation:
          "Java's `switch` supports byte, short, char, int, their wrapper classes, enums, and String.",
      },
      {
        id: "cf-7",
        prompt: "How many times does this loop execute?",
        code: `int i = 0;\nwhile (i < 5) {\n  i += 2;\n}`,
        options: ["2", "3", "5", "Infinite"],
        correctIndex: 1,
        explanation: "i goes 0 → 2 → 4 → 6, so the condition is checked 4 times but the body runs 3 times (at i=0,2,4) before i=6 stops it.",
      },
      {
        id: "cf-8",
        prompt: "What is a 'labeled break' used for?",
        options: [
          "Breaking out of an outer loop from within a nested loop",
          "Naming a variable inside a loop",
          "Breaking a switch statement only",
          "It doesn't exist in Java",
        ],
        correctIndex: 0,
        explanation:
          "A label (e.g. `outer:`) placed before a loop lets `break outer;` exit that specific outer loop from inside a nested loop.",
      },
    ],
  },
  {
    id: "oop",
    title: "OOP Fundamentals",
    description: "Classes, objects, inheritance, interfaces, and polymorphism.",
    questions: [
      {
        id: "oop-1",
        prompt: "What keyword is used for a class to inherit from another class?",
        options: ["implements", "extends", "inherits", "super"],
        correctIndex: 1,
        explanation:
          "`extends` is used for class inheritance. `implements` is used for interfaces, and `super` refers to the parent class instance.",
      },
      {
        id: "oop-2",
        prompt: "How many classes can a Java class directly extend?",
        options: ["0", "1", "Up to 2", "Unlimited"],
        correctIndex: 1,
        explanation:
          "Java supports only single inheritance for classes — a class can extend exactly one other class (multiple interfaces are allowed via `implements`).",
      },
      {
        id: "oop-3",
        prompt: "What is method overriding?",
        options: [
          "Defining multiple methods with the same name but different parameters",
          "A subclass providing its own implementation of a method inherited from its superclass",
          "Making a method private",
          "Calling a method more than once",
        ],
        correctIndex: 1,
        explanation:
          "Overriding lets a subclass redefine behavior of an inherited method (with matching signature), enabling runtime polymorphism.",
      },
      {
        id: "oop-4",
        prompt: "What does `this` refer to inside an instance method?",
        options: [
          "The class itself",
          "The current object instance",
          "The parent class",
          "A static field",
        ],
        correctIndex: 1,
        explanation:
          "`this` is a reference to the current object on which the method was called.",
      },
      {
        id: "oop-5",
        prompt: "Which access modifier restricts visibility to only within the same class?",
        options: ["public", "protected", "private", "default (package-private)"],
        correctIndex: 2,
        explanation:
          "`private` members are only accessible within the declaring class itself.",
      },
      {
        id: "oop-6",
        prompt: "What is the difference between an abstract class and an interface (traditionally)?",
        options: [
          "There is no difference",
          "An abstract class can have constructors and instance fields; an interface (pre-Java 8) could not",
          "Interfaces can be instantiated directly",
          "Abstract classes cannot have any methods",
        ],
        correctIndex: 1,
        explanation:
          "Abstract classes support constructors, instance state, and partial implementation, while classic interfaces defined only method signatures (modern Java allows default methods too, but state is still limited).",
      },
      {
        id: "oop-7",
        prompt: "What does `super()` do when called inside a constructor?",
        options: [
          "Calls a static method",
          "Invokes the superclass's constructor",
          "Creates a new object",
          "Deletes the parent object",
        ],
        correctIndex: 1,
        explanation:
          "`super()` explicitly invokes the constructor of the immediate superclass, and must be the first statement in the subclass constructor if used.",
      },
      {
        id: "oop-8",
        prompt: "What is polymorphism in Java?",
        options: [
          "Having multiple main methods",
          "The ability of an object to take many forms, e.g. a superclass reference pointing to a subclass instance",
          "Using multiple threads",
          "Declaring multiple variables at once",
        ],
        correctIndex: 1,
        explanation:
          "Polymorphism lets code work with a general (superclass/interface) type while the actual behavior is determined by the object's runtime (subclass) type.",
      },
    ],
  },
  {
    id: "collections",
    title: "Collections",
    description: "List, Set, Map, and the Java Collections Framework.",
    questions: [
      {
        id: "col-1",
        prompt: "Which interface represents an ordered collection that allows duplicates?",
        options: ["Set", "List", "Map", "Queue"],
        correctIndex: 1,
        explanation:
          "`List` maintains insertion order and allows duplicate elements (e.g. `ArrayList`, `LinkedList`).",
      },
      {
        id: "col-2",
        prompt: "Which collection does NOT allow duplicate elements?",
        options: ["List", "ArrayList", "Set", "LinkedList"],
        correctIndex: 2,
        explanation: "`Set` implementations (like `HashSet`) enforce uniqueness of elements.",
      },
      {
        id: "col-3",
        prompt: "What does a `Map` store?",
        options: [
          "Only unique values",
          "Ordered elements with duplicates allowed",
          "Key-value pairs",
          "A fixed-size sequence",
        ],
        correctIndex: 2,
        explanation:
          "`Map` (e.g. `HashMap`, `TreeMap`) associates unique keys with values, allowing fast lookup by key.",
      },
      {
        id: "col-4",
        prompt: "Which method adds an element to an `ArrayList`?",
        options: ["insert()", "push()", "add()", "append()"],
        correctIndex: 2,
        explanation: "`add()` is the standard method to append an element to a `List`.",
      },
      {
        id: "col-5",
        prompt: "What is the time complexity of `get(index)` on an `ArrayList`?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
        correctIndex: 0,
        explanation:
          "`ArrayList` is backed by an array, so random access by index is constant time, O(1).",
      },
      {
        id: "col-6",
        prompt: "Which collection type maintains elements in sorted order automatically?",
        options: ["HashSet", "ArrayList", "TreeSet", "LinkedList"],
        correctIndex: 2,
        explanation:
          "`TreeSet` implements `SortedSet` and keeps its elements sorted according to their natural ordering or a provided `Comparator`.",
      },
      {
        id: "col-7",
        prompt: "How do you iterate over a `List<String>` names using a for-each loop?",
        options: [
          "for (String n in names) {}",
          "for (String n : names) {}",
          "for (n : names) {}",
          "foreach (names as n) {}",
        ],
        correctIndex: 1,
        explanation:
          "Java's enhanced for loop syntax is `for (Type item : collection) { ... }`.",
      },
      {
        id: "col-8",
        prompt: "Which generic wildcard means 'a List of some unknown type'?",
        options: ["List<Object>", "List<?>", "List<*>", "List<any>"],
        correctIndex: 1,
        explanation:
          "`List<?>` is an unbounded wildcard representing a list of some unknown type, useful for read-only generic APIs.",
      },
    ],
  },
  {
    id: "exceptions",
    title: "Exceptions",
    description: "try/catch/finally, checked vs unchecked exceptions, and throwing errors.",
    questions: [
      {
        id: "exc-1",
        prompt: "What block always executes, whether or not an exception was thrown?",
        options: ["try", "catch", "finally", "throw"],
        correctIndex: 2,
        explanation:
          "`finally` runs after `try`/`catch` regardless of whether an exception occurred (except in cases like JVM exit).",
      },
      {
        id: "exc-2",
        prompt: "Which of these is a checked exception?",
        options: ["NullPointerException", "ArrayIndexOutOfBoundsException", "IOException", "ArithmeticException"],
        correctIndex: 2,
        explanation:
          "`IOException` is a checked exception that must be declared or caught at compile time. The others are unchecked `RuntimeException` subclasses.",
      },
      {
        id: "exc-3",
        prompt: "What keyword is used to manually raise an exception?",
        options: ["throw", "throws", "raise", "catch"],
        correctIndex: 0,
        explanation:
          "`throw new SomeException(...)` raises an exception. `throws` is used in a method signature to declare possible checked exceptions.",
      },
      {
        id: "exc-4",
        prompt: "What happens if a `catch` block doesn't match the thrown exception's type?",
        options: [
          "It catches it anyway",
          "The exception propagates up the call stack",
          "The program silently continues",
          "A compile error occurs",
        ],
        correctIndex: 1,
        explanation:
          "If no matching `catch` block handles the exception, it propagates to the caller, and eventually crashes the program if never caught.",
      },
      {
        id: "exc-5",
        prompt: "What is the superclass of all exceptions and errors in Java?",
        options: ["Exception", "RuntimeException", "Throwable", "Object"],
        correctIndex: 2,
        explanation:
          "`Throwable` is the root class; `Exception` and `Error` both extend it.",
      },
      {
        id: "exc-6",
        prompt: "What does 'unchecked exception' mean?",
        options: [
          "It cannot be caught",
          "The compiler doesn't force you to catch or declare it",
          "It only occurs at compile time",
          "It's a syntax error",
        ],
        correctIndex: 1,
        explanation:
          "Unchecked exceptions (subclasses of `RuntimeException`) aren't checked by the compiler, so you're not required to catch or declare them.",
      },
      {
        id: "exc-7",
        prompt: "What does try-with-resources automatically do?",
        options: [
          "Retries the try block on failure",
          "Closes resources (like streams) automatically when the block exits",
          "Catches all exceptions silently",
          "Logs exceptions to a file",
        ],
        correctIndex: 1,
        explanation:
          "Try-with-resources (`try (Resource r = ...) { }`) automatically calls `close()` on any resource implementing `AutoCloseable` when the block ends.",
      },
      {
        id: "exc-8",
        prompt: "Can you have multiple `catch` blocks for one `try` block?",
        options: [
          "No, only one catch block is allowed",
          "Yes, to handle different exception types differently",
          "Only in newer Java versions",
          "Only if they all extend the same exception",
        ],
        correctIndex: 1,
        explanation:
          "You can chain multiple `catch` blocks after a single `try`, each handling a different exception type (evaluated in order).",
      },
    ],
  },
];

export function getTopic(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}
