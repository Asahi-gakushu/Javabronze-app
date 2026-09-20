import type { Topic } from "@/types";

export const topics: Topic[] = [
  {
    id: "basics",
    title: "Javaの基礎",
    description: "変数、プリミティブ型、演算子、出力の基本。",
    questions: [
      {
        id: "basics-1",
        prompt: "次のうち、Javaのプリミティブ型として正しいものはどれですか?",
        options: ["string", "int", "Integer", "Number"],
        correctIndex: 1,
        explanation:
          "`int` はJavaの8つのプリミティブ型の1つです。`String` と `Integer` はプリミティブ型ではなくクラスです(大文字表記に注意)。`Number` は抽象クラスです。",
      },
      {
        id: "basics-2",
        prompt: "このコードは何を出力しますか?",
        code: `int x = 7;\nint y = 2;\nSystem.out.println(x / y);`,
        options: ["3.5", "3", "4", "コンパイルエラー"],
        correctIndex: 1,
        explanation:
          "2つの`int`値を割り算すると整数除算になり、小数部分は切り捨てられるため、`7 / 2` は `3` になります。",
      },
      {
        id: "basics-3",
        prompt: "Javaで定数を宣言するキーワードはどれですか?",
        options: ["const", "static", "final", "readonly"],
        correctIndex: 2,
        explanation:
          "`final` は初期化後に変数を再代入できないようにします。`const` は予約語ですが使われておらず、`readonly` はJavaには存在しません。",
      },
      {
        id: "basics-4",
        prompt: "Javaの`long`型のサイズはどれくらいですか?",
        options: ["16ビット", "32ビット", "64ビット", "OSによって異なる"],
        correctIndex: 2,
        explanation:
          "Javaのプリミティブ型のサイズは言語仕様で固定されており、プラットフォームに依存しません。`long` は常に64ビットです。",
      },
      {
        id: "basics-5",
        prompt: "プリミティブ値の等価性を調べる演算子はどれですか?",
        options: ["=", "==", ".equals()", "==="],
        correctIndex: 1,
        explanation:
          "`==` はプリミティブ値を直接比較します。`.equals()` はオブジェクトの内容を比較するために使われ、`===` はJavaには存在しません。",
      },
      {
        id: "basics-6",
        prompt: "Javaアプリケーションのエントリーポイントとして正しいシグネチャはどれですか?",
        options: [
          "public void main(String[] args)",
          "public static void main(String[] args)",
          "static main(String args)",
          "public static int main(String[] args)",
        ],
        correctIndex: 1,
        explanation:
          "JVMは `public static void main(String[] args)` をプログラムのエントリーポイントとして探します。",
      },
      {
        id: "basics-7",
        prompt: "`String.equals()` は `==` と比べて何を比較しますか?",
        options: [
          "Stringに対してはどちらも同じ動作をする",
          "`.equals()` は参照を比較し、`==` は内容を比較する",
          "`.equals()` は内容を比較し、`==` は参照を比較する",
          "どちらも内容を比較しない",
        ],
        correctIndex: 2,
        explanation:
          "`String` のようなオブジェクトの場合、`==` は2つの参照が同じオブジェクトを指しているかを調べ、`.equals()` は実際の文字内容を比較します。",
      },
      {
        id: "basics-8",
        prompt: "int型の要素3つの配列を宣言・初期化する正しい方法はどれですか?",
        options: [
          "int[] nums = new int[3];",
          "int nums[3];",
          "array<int> nums = new array(3);",
          "int nums = new int[3];",
        ],
        correctIndex: 0,
        explanation:
          "`int[] nums = new int[3];` は要素数3の配列を作成し、各要素はデフォルトで0になります。",
      },
    ],
  },
  {
    id: "control-flow",
    title: "制御構文",
    description: "if/else、ループ、switch文、break/continueについて。",
    questions: [
      {
        id: "cf-1",
        prompt: "このループは何を出力しますか?",
        code: `for (int i = 0; i < 3; i++) {\n  System.out.println(i);\n}`,
        options: ["0 1 2", "1 2 3", "0 1 2 3", "無限ループ"],
        correctIndex: 0,
        explanation:
          "ループは `i = 0` から始まり `i < 3` の間実行されるため、0, 1, 2 が出力されます。",
      },
      {
        id: "cf-2",
        prompt: "`switch` の case内で `break` を使う目的は何ですか?",
        options: [
          "プログラム全体を終了する",
          "次のcaseへの処理の継続(フォールスルー)を止める",
          "switch文を再実行する",
          "効果のない必須構文である",
        ],
        correctIndex: 1,
        explanation:
          "`break` がないと処理は次のcaseのコードに流れ込み(フォールスルー)、通常は意図しない動作になります。",
      },
      {
        id: "cf-3",
        prompt: "本体が少なくとも1回は実行されることを保証するループはどれですか?",
        options: ["for", "while", "do-while", "for-each"],
        correctIndex: 2,
        explanation:
          "`do-while` はループ本体を実行した後に条件を評価するため、条件がfalseでも本体は必ず1回実行されます。",
      },
      {
        id: "cf-4",
        prompt: "ループ内での `continue` の動作は何ですか?",
        options: [
          "ループを直ちに終了する",
          "現在の反復の残りをスキップして次の反復に進む",
          "ループを一時停止する",
          "プログラムを再起動する",
        ],
        correctIndex: 1,
        explanation:
          "`continue` は次の反復にジャンプし、現在の反復の残りのコードをスキップします。",
      },
      {
        id: "cf-5",
        prompt: "このコードは何を出力しますか?",
        code: `int x = 5;\nif (x > 10) {\n  System.out.println("big");\n} else if (x > 3) {\n  System.out.println("medium");\n} else {\n  System.out.println("small");\n}`,
        options: ["big", "medium", "small", "何も出力されない"],
        correctIndex: 1,
        explanation: "`x` は5なので `x > 10` は満たしませんが `x > 3` は満たすため、\"medium\" が出力されます。",
      },
      {
        id: "cf-6",
        prompt: "Javaの `switch` 文が(従来)扱える型はどれですか?",
        options: [
          "intのみ",
          "int、char、String、enumなど",
          "booleanのみ",
          "Stringのみ",
        ],
        correctIndex: 1,
        explanation:
          "Javaの `switch` はbyte、short、char、int、それらのラッパークラス、enum、Stringに対応しています。",
      },
      {
        id: "cf-7",
        prompt: "このループは何回実行されますか?",
        code: `int i = 0;\nwhile (i < 5) {\n  i += 2;\n}`,
        options: ["2", "3", "5", "無限"],
        correctIndex: 1,
        explanation: "iは 0 → 2 → 4 → 6 と変化するため、条件は4回チェックされますが、本体はi=0,2,4の3回実行され、i=6で停止します。",
      },
      {
        id: "cf-8",
        prompt: "「ラベル付きbreak」は何のために使いますか?",
        options: [
          "ネストしたループの中から外側のループを抜けるため",
          "ループ内の変数に名前を付けるため",
          "switch文からだけ抜けるため",
          "Javaには存在しない",
        ],
        correctIndex: 0,
        explanation:
          "ループの前にラベル(例: `outer:`)を置くと、ネストしたループの中から `break outer;` でその特定の外側のループを抜けられます。",
      },
    ],
  },
  {
    id: "oop",
    title: "オブジェクト指向の基礎",
    description: "クラス、オブジェクト、継承、インターフェース、ポリモーフィズム。",
    questions: [
      {
        id: "oop-1",
        prompt: "クラスが他のクラスを継承するために使うキーワードは何ですか?",
        options: ["implements", "extends", "inherits", "super"],
        correctIndex: 1,
        explanation:
          "`extends` はクラスの継承に使われます。`implements` はインターフェースに使われ、`super` は親クラスのインスタンスを指します。",
      },
      {
        id: "oop-2",
        prompt: "Javaのクラスは直接いくつのクラスをextendsできますか?",
        options: ["0", "1", "最大2つ", "無制限"],
        correctIndex: 1,
        explanation:
          "Javaのクラスは単一継承のみをサポートしており、1つのクラスは他の1つのクラスだけをextendsできます(複数のインターフェースは `implements` で実装可能です)。",
      },
      {
        id: "oop-3",
        prompt: "メソッドのオーバーライドとは何ですか?",
        options: [
          "同じ名前で引数の異なる複数のメソッドを定義すること",
          "サブクラスがスーパークラスから継承したメソッドを独自に実装し直すこと",
          "メソッドをprivateにすること",
          "メソッドを複数回呼び出すこと",
        ],
        correctIndex: 1,
        explanation:
          "オーバーライドにより、サブクラスは継承したメソッド(同じシグネチャ)の動作を再定義でき、実行時ポリモーフィズムが可能になります。",
      },
      {
        id: "oop-4",
        prompt: "インスタンスメソッド内で `this` は何を指しますか?",
        options: [
          "クラス自体",
          "現在のオブジェクトインスタンス",
          "親クラス",
          "static フィールド",
        ],
        correctIndex: 1,
        explanation:
          "`this` はそのメソッドが呼び出された現在のオブジェクトへの参照です。",
      },
      {
        id: "oop-5",
        prompt: "同じクラス内のみに可視性を制限するアクセス修飾子はどれですか?",
        options: ["public", "protected", "private", "デフォルト(パッケージプライベート)"],
        correctIndex: 2,
        explanation:
          "`private` メンバーは宣言されたクラス自身の中からのみアクセス可能です。",
      },
      {
        id: "oop-6",
        prompt: "抽象クラスとインターフェースの(従来の)違いは何ですか?",
        options: [
          "違いはない",
          "抽象クラスはコンストラクタやインスタンスフィールドを持てるが、インターフェース(Java 8以前)は持てなかった",
          "インターフェースは直接インスタンス化できる",
          "抽象クラスはメソッドを一切持てない",
        ],
        correctIndex: 1,
        explanation:
          "抽象クラスはコンストラクタ、インスタンスの状態、部分的な実装をサポートしますが、従来のインターフェースはメソッドのシグネチャのみを定義していました(現代のJavaではdefaultメソッドも許可されていますが、状態の保持は依然として制限されています)。",
      },
      {
        id: "oop-7",
        prompt: "コンストラクタ内で `super()` を呼び出すと何が起こりますか?",
        options: [
          "staticメソッドを呼び出す",
          "スーパークラスのコンストラクタを呼び出す",
          "新しいオブジェクトを作成する",
          "親オブジェクトを削除する",
        ],
        correctIndex: 1,
        explanation:
          "`super()` は直接のスーパークラスのコンストラクタを明示的に呼び出すもので、使用する場合はサブクラスのコンストラクタの最初の文でなければなりません。",
      },
      {
        id: "oop-8",
        prompt: "Javaにおけるポリモーフィズムとは何ですか?",
        options: [
          "複数のmainメソッドを持つこと",
          "オブジェクトが複数の形を取れる性質。例えばスーパークラスの参照がサブクラスのインスタンスを指すこと",
          "複数のスレッドを使用すること",
          "複数の変数を一度に宣言すること",
        ],
        correctIndex: 1,
        explanation:
          "ポリモーフィズムにより、コードは汎用的な(スーパークラス/インターフェース)型を扱いながら、実際の動作はオブジェクトの実行時(サブクラス)の型によって決まります。",
      },
    ],
  },
  {
    id: "collections",
    title: "コレクション",
    description: "List、Set、MapなどJavaコレクションフレームワークについて。",
    questions: [
      {
        id: "col-1",
        prompt: "重複を許す順序付きコレクションを表すインターフェースはどれですか?",
        options: ["Set", "List", "Map", "Queue"],
        correctIndex: 1,
        explanation:
          "`List` は挿入順序を保持し、重複する要素を許可します(例: `ArrayList`、`LinkedList`)。",
      },
      {
        id: "col-2",
        prompt: "重複する要素を許さないコレクションはどれですか?",
        options: ["List", "ArrayList", "Set", "LinkedList"],
        correctIndex: 2,
        explanation: "`Set` の実装(`HashSet` など)は要素の一意性を強制します。",
      },
      {
        id: "col-3",
        prompt: "`Map` は何を格納しますか?",
        options: [
          "一意な値のみ",
          "重複を許す順序付き要素",
          "キーと値のペア",
          "固定サイズの並び",
        ],
        correctIndex: 2,
        explanation:
          "`Map`(`HashMap`、`TreeMap` など)は一意なキーと値を関連付け、キーによる高速な検索を可能にします。",
      },
      {
        id: "col-4",
        prompt: "`ArrayList` に要素を追加するメソッドはどれですか?",
        options: ["insert()", "push()", "add()", "append()"],
        correctIndex: 2,
        explanation: "`add()` は `List` に要素を追加するための標準的なメソッドです。",
      },
      {
        id: "col-5",
        prompt: "`ArrayList` の `get(index)` の時間計算量はどれですか?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
        correctIndex: 0,
        explanation:
          "`ArrayList` は配列を内部で使用しているため、インデックスによるランダムアクセスは定数時間 O(1) です。",
      },
      {
        id: "col-6",
        prompt: "要素を自動的にソートされた順序で保持するコレクションはどれですか?",
        options: ["HashSet", "ArrayList", "TreeSet", "LinkedList"],
        correctIndex: 2,
        explanation:
          "`TreeSet` は `SortedSet` を実装しており、自然順序または指定された `Comparator` に従って要素をソートされた状態で保持します。",
      },
      {
        id: "col-7",
        prompt: "`List<String>` の names を for-each ループで反復処理するには、どう書きますか?",
        options: [
          "for (String n in names) {}",
          "for (String n : names) {}",
          "for (n : names) {}",
          "foreach (names as n) {}",
        ],
        correctIndex: 1,
        explanation:
          "Javaの拡張for文の構文は `for (Type item : collection) { ... }` です。",
      },
      {
        id: "col-8",
        prompt: "「不明な型のList」を意味するジェネリクスのワイルドカードはどれですか?",
        options: ["List<Object>", "List<?>", "List<*>", "List<any>"],
        correctIndex: 1,
        explanation:
          "`List<?>` は非境界ワイルドカードで、不明な型のリストを表し、読み取り専用のジェネリックAPIなどで役立ちます。",
      },
    ],
  },
  {
    id: "exceptions",
    title: "例外処理",
    description: "try/catch/finally、チェック例外と非チェック例外、例外のスロー。",
    questions: [
      {
        id: "exc-1",
        prompt: "例外がスローされたかどうかに関わらず常に実行されるブロックはどれですか?",
        options: ["try", "catch", "finally", "throw"],
        correctIndex: 2,
        explanation:
          "`finally` は例外の発生有無に関わらず `try`/`catch` の後に実行されます(JVMの終了などの例外的なケースを除く)。",
      },
      {
        id: "exc-2",
        prompt: "次のうちチェック例外はどれですか?",
        options: ["NullPointerException", "ArrayIndexOutOfBoundsException", "IOException", "ArithmeticException"],
        correctIndex: 2,
        explanation:
          "`IOException` はチェック例外であり、コンパイル時に宣言するかキャッチする必要があります。他は非チェック例外である `RuntimeException` のサブクラスです。",
      },
      {
        id: "exc-3",
        prompt: "例外を手動で発生させるために使うキーワードはどれですか?",
        options: ["throw", "throws", "raise", "catch"],
        correctIndex: 0,
        explanation:
          "`throw new SomeException(...)` は例外を発生させます。`throws` はメソッドのシグネチャで発生しうるチェック例外を宣言するために使われます。",
      },
      {
        id: "exc-4",
        prompt: "`catch` ブロックがスローされた例外の型と一致しない場合、何が起こりますか?",
        options: [
          "それでもキャッチされる",
          "例外は呼び出しスタックを上位へ伝播する",
          "プログラムは何事もなく続行する",
          "コンパイルエラーが発生する",
        ],
        correctIndex: 1,
        explanation:
          "一致する `catch` ブロックが例外を処理しない場合、例外は呼び出し元へ伝播し、最終的に一度もキャッチされなければプログラムがクラッシュします。",
      },
      {
        id: "exc-5",
        prompt: "Javaにおける全ての例外とエラーのスーパークラスは何ですか?",
        options: ["Exception", "RuntimeException", "Throwable", "Object"],
        correctIndex: 2,
        explanation:
          "`Throwable` がルートクラスであり、`Exception` と `Error` はどちらもこれを継承しています。",
      },
      {
        id: "exc-6",
        prompt: "「非チェック例外」とはどういう意味ですか?",
        options: [
          "キャッチできない",
          "コンパイラがキャッチや宣言を強制しない",
          "コンパイル時にのみ発生する",
          "構文エラーである",
        ],
        correctIndex: 1,
        explanation:
          "非チェック例外(`RuntimeException` のサブクラス)はコンパイラによってチェックされないため、キャッチや宣言をする必要がありません。",
      },
      {
        id: "exc-7",
        prompt: "try-with-resources は自動的に何を行いますか?",
        options: [
          "失敗した場合にtryブロックを再試行する",
          "ブロックを抜ける際にリソース(ストリームなど)を自動的にクローズする",
          "全ての例外を黙って握りつぶす",
          "例外をファイルに記録する",
        ],
        correctIndex: 1,
        explanation:
          "try-with-resources(`try (Resource r = ...) { }`)は、ブロックが終了する際に `AutoCloseable` を実装するリソースに対して自動的に `close()` を呼び出します。",
      },
      {
        id: "exc-8",
        prompt: "1つの `try` ブロックに対して複数の `catch` ブロックを持てますか?",
        options: [
          "いいえ、catchブロックは1つしか使えない",
          "はい、異なる例外の型ごとに個別に処理できる",
          "新しいJavaのバージョンでのみ可能",
          "全て同じ例外を継承している場合のみ可能",
        ],
        correctIndex: 1,
        explanation:
          "1つの `try` の後に複数の `catch` ブロックを連ねることができ、それぞれが異なる例外の型を処理します(順番に評価されます)。",
      },
    ],
  },
];

export function getTopic(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}
