import type { Topic } from "@/types";

// Oracle Java SE Bronze の出題範囲に沿った章構成。
// 実際の試験問題そのものではなく、出題傾向に合わせたオリジナルの想定問題。
export const topics: Topic[] = [
  {
    id: "program-flow",
    title: "第1章 Javaプログラムの流れ",
    description:
      "コンパイル・実行の流れ、JVMの役割、コメント、package/import文について。",
    questions: [
      {
        id: "pf-1",
        prompt:
          "Javaのソースファイルに `public class Sample` というクラスを定義する場合、ソースファイル名はどうなっている必要がありますか?",
        options: [
          "ファイル名は自由に付けてよい",
          "ファイル名は `Sample.java` でなければならない",
          "ファイル名は `sample.java`(小文字)でなければならない",
          "ファイル名は `Sample.class` でなければならない",
        ],
        correctIndex: 1,
        explanation:
          "public修飾子が付いたクラスは、そのクラス名と(大文字・小文字を含めて)完全に一致するファイル名で保存しなければなりません。拡張子は `.java` です。",
      },
      {
        id: "pf-2",
        prompt: "`javac Sample.java` を実行すると何が生成されますか?",
        options: [
          "実行可能な `.exe` ファイル",
          "バイトコードを含む `Sample.class` ファイル",
          "テキスト形式のログファイル",
          "何も生成されない",
        ],
        correctIndex: 1,
        explanation:
          "javac(Javaコンパイラ)はソースコードをコンパイルし、JVMが実行できるバイトコード形式の `.class` ファイルを生成します。",
      },
      {
        id: "pf-3",
        prompt:
          "Javaプログラムが「Write Once, Run Anywhere(一度書けばどこでも実行できる)」と言われる理由として最も適切なものはどれですか?",
        options: [
          "Javaのソースコードはコンパイル不要だから",
          "コンパイルされたバイトコードをJVMが各プラットフォームに合わせて実行するから",
          "Javaは特定のOS専用に設計されているから",
          "Javaにはコンパイラが存在しないから",
        ],
        correctIndex: 1,
        explanation:
          "Javaはソースコードを中間コードであるバイトコードにコンパイルし、各プラットフォームに用意されたJVM(Java仮想マシン)がそれを解釈・実行するため、同じ.classファイルを異なるOS上で動かせます。",
      },
      {
        id: "pf-4",
        prompt:
          "Javaプログラムの実行時にJVMが最初に呼び出すメソッドとして正しいシグネチャはどれですか?",
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
        id: "pf-5",
        prompt: "Javaで複数行にわたるコメントを記述する方法として正しいものはどれですか?",
        options: [
          "# から行末まで",
          "// で囲む",
          "/* から */ で囲む",
          "<!-- --> で囲む",
        ],
        correctIndex: 2,
        explanation:
          "Javaでは `//` が1行コメント、`/* ... */` が複数行コメント(範囲コメント)、`/** ... */` がJavadocコメントとして使われます。`#` や `<!-- -->` はJavaのコメント構文ではありません。",
      },
      {
        id: "pf-6",
        prompt: "ソースファイル内で `package` 文を書く位置のルールとして正しいものはどれですか?",
        options: [
          "ソースファイルの一番最後に書く",
          "コメントを除き、ソースファイルの先頭(import文よりも前)に1つだけ書く",
          "クラス定義の内部に書く",
          "1つのファイルに何個でも自由な位置に書ける",
        ],
        correctIndex: 1,
        explanation:
          "package文はコメントを除いてソースファイルの先頭に、1ファイルにつき1つだけ記述する必要があり、import文より前に書きます。",
      },
      {
        id: "pf-7",
        prompt: "`java.util` パッケージ内のすべてのクラスをまとめてインポートする書き方はどれですか?",
        options: [
          "import java.util.*;",
          "import java.util.All;",
          "include java.util.*;",
          "using java.util;",
        ],
        correctIndex: 0,
        explanation:
          "アスタリスク `*` を使うことで、指定したパッケージ直下のすべてのクラスをまとめてインポートできます(サブパッケージは対象外)。",
      },
      {
        id: "pf-8",
        prompt: "1つのJavaソースファイルの中に、複数の `public` クラスを定義することはできますか?",
        options: [
          "できる。制限はない",
          "できない。1つのファイルに `public` クラスは1つまでで、ファイル名はそのクラス名と一致させる必要がある",
          "できるが、2つ目以降は別ファイルにコンパイルされる",
          "publicクラスは1つのプロジェクトに1つしか定義できない",
        ],
        correctIndex: 1,
        explanation:
          "1つの.javaファイルに定義できる `public` クラスは最大1つです。ファイル名はその `public` クラスの名前と一致させる必要があります(publicでないクラスは複数定義可)。",
      },
    ],
  },
  {
    id: "data",
    title: "第2章 データの宣言と使用",
    description: "変数の宣言、プリミティブ型、リテラル、キャスト、配列、スコープについて。",
    questions: [
      {
        id: "data-1",
        prompt: "次のうち、Javaのプリミティブ型として正しいものはどれですか?",
        options: ["string", "int", "Integer", "Number"],
        correctIndex: 1,
        explanation:
          "`int` はJavaの8つのプリミティブ型の1つです。`String` と `Integer` はプリミティブ型ではなくクラスです(大文字表記に注意)。`Number` は抽象クラスです。",
      },
      {
        id: "data-2",
        prompt: "Javaの`long`型のサイズはどれくらいですか?",
        options: ["16ビット", "32ビット", "64ビット", "OSによって異なる"],
        correctIndex: 2,
        explanation:
          "Javaのプリミティブ型のサイズは言語仕様で固定されており、プラットフォームに依存しません。`long` は常に64ビットです。",
      },
      {
        id: "data-3",
        prompt: "次のうち、`long` 型のリテラルとして正しい書き方はどれですか?",
        options: ["100", "100L", "100.0", "100D"],
        correctIndex: 1,
        explanation:
          "long型のリテラルには末尾に `L`(または小文字の `l`)を付けます。付けない整数リテラルはデフォルトで `int` として扱われます。",
      },
      {
        id: "data-4",
        prompt: "次のコードの結果として正しいものはどれですか?",
        code: `int i = 300;\nbyte b = (byte) i;\nSystem.out.println(b);`,
        options: ["300", "コンパイルエラー", "44", "実行時エラー"],
        correctIndex: 2,
        explanation:
          "`int` から `byte` への変換は精度を落とすダウンキャストのため、明示的なキャストが必要です。300を8ビットに切り詰めると44となり、`b` には44が代入されます。",
      },
      {
        id: "data-5",
        prompt: "次のコードをコンパイルするとどうなりますか?",
        code: `public static void main(String[] args) {\n  int x;\n  System.out.println(x);\n}`,
        options: [
          "0 が出力される",
          "コンパイルエラーになる",
          "null が出力される",
          "実行時に例外がスローされる",
        ],
        correctIndex: 1,
        explanation:
          "ローカル変数はフィールドと異なり自動的に初期化されません。初期化せずに使用しようとすると「変数が初期化されていない可能性があります」というコンパイルエラーになります。",
      },
      {
        id: "data-6",
        prompt: "クラスのフィールド(インスタンス変数)として宣言された `boolean` 型の初期値はどうなりますか?",
        options: ["true", "false", "0", "null"],
        correctIndex: 1,
        explanation:
          "インスタンス変数(フィールド)は明示的に初期化しなくても、型に応じたデフォルト値が自動的に設定されます。`boolean` のデフォルト値は `false` です(数値型は0、参照型は `null`)。",
      },
      {
        id: "data-7",
        prompt: "要素数5の `int` 配列を宣言・生成する正しい書き方はどれですか?",
        options: [
          "int[] nums = new int[5];",
          "int nums[5];",
          "int[5] nums = new int[];",
          "int nums = new int[5];",
        ],
        correctIndex: 0,
        explanation:
          "配列は `型[] 変数名 = new 型[要素数];` の形式で宣言・生成します。生成された各要素は型に応じたデフォルト値(intなら0)で初期化されます。",
      },
      {
        id: "data-8",
        prompt: "次のコードのうち、コンパイルエラーになるものはどれですか?",
        code: `if (true) {\n  int x = 10;\n}\nSystem.out.println(x);`,
        options: [
          "問題なくコンパイルできる",
          "ブロックの外で `x` を参照しているためコンパイルエラーになる",
          "実行時にのみエラーになる",
          "xは自動的に0として扱われる",
        ],
        correctIndex: 1,
        explanation:
          "変数のスコープ(有効範囲)は、それが宣言されたブロック `{ }` の中に限定されます。ブロックの外から `x` を参照するとコンパイルエラーになります。",
      },
    ],
  },
  {
    id: "operators",
    title: "第3章 演算子と条件分岐文",
    description: "算術・比較・論理演算子、三項演算子、if文とswitch文による条件分岐。",
    questions: [
      {
        id: "op-1",
        prompt: "このコードは何を出力しますか?",
        code: `int x = 7;\nint y = 2;\nSystem.out.println(x / y);`,
        options: ["3.5", "3", "4", "コンパイルエラー"],
        correctIndex: 1,
        explanation:
          "2つの`int`値を割り算すると整数除算になり、小数部分は切り捨てられるため、`7 / 2` は `3` になります。",
      },
      {
        id: "op-2",
        prompt: "次のコードは何を出力しますか?",
        code: `int a = 5;\nint b = a++ + ++a;\nSystem.out.println(b);`,
        options: ["10", "11", "12", "13"],
        correctIndex: 2,
        explanation:
          "`a++` は現在の値(5)を使ってから1加算するので式の値は5、その後aは6になります。続く `++a` は先にaを1加算して7にしてから7を返します。よって `b = 5 + 7 = 12` です。",
      },
      {
        id: "op-3",
        prompt: "次のコードの出力として正しいものはどれですか?",
        code: `int[] arr = null;\nif (arr != null && arr.length > 0) {\n  System.out.println("has elements");\n} else {\n  System.out.println("empty or null");\n}`,
        options: [
          "has elements",
          "empty or null",
          "NullPointerExceptionが発生する",
          "コンパイルエラーになる",
        ],
        correctIndex: 1,
        explanation:
          "`&&` は短絡評価(ショートサーキット)されるため、左側の `arr != null` がfalseの時点で右側の `arr.length > 0` は評価されず、NullPointerExceptionは発生しません。結果としてelse節が実行されます。",
      },
      {
        id: "op-4",
        prompt: "次のコードで `result` に代入される値は何ですか?",
        code: `int score = 65;\nString result = (score >= 60) ? "合格" : "不合格";`,
        options: ["合格", "不合格", "true", "コンパイルエラー"],
        correctIndex: 0,
        explanation:
          "三項演算子 `条件 ? 値1 : 値2` は、条件がtrueなら値1、falseなら値2を返します。`score` は65で60以上のため `\"合格\"` が代入されます。",
      },
      {
        id: "op-5",
        prompt: "次のコードは何を出力しますか?",
        code: `int day = 2;\nswitch (day) {\n  case 1:\n    System.out.println("Mon");\n  case 2:\n    System.out.println("Tue");\n  case 3:\n    System.out.println("Wed");\n    break;\n  default:\n    System.out.println("Other");\n}`,
        options: ["Tue のみ", "Tue と Wed", "Mon と Tue と Wed", "Other"],
        correctIndex: 1,
        explanation:
          "`break` が無い場合、一致したcase以降の処理はそのまま次のcaseに継続して実行されます(フォールスルー)。`day=2`はcase 2に一致してTueを出力した後、breakが無いためcase 3に処理が続いてWedも出力され、そこでbreakにより終了します。",
      },
      {
        id: "op-6",
        prompt: "次のコードの出力は何ですか?",
        code: `int x = 10;\nx %= 3;\nSystem.out.println(x);`,
        options: ["3", "1", "0", "3.33"],
        correctIndex: 1,
        explanation:
          "`%=` は剰余を計算して代入する複合代入演算子です。`10 % 3` のあまりは1になるため、`x` は1になります。",
      },
      {
        id: "op-7",
        prompt: "次の式の評価結果はどれですか?",
        code: `int result = 2 + 3 * 4;`,
        options: ["20", "14", "24", "9"],
        correctIndex: 1,
        explanation:
          "演算子には優先順位があり、乗算 `*` は加算 `+` より先に評価されます。したがって `3 * 4 = 12` を計算してから `2 + 12 = 14` となります。",
      },
      {
        id: "op-8",
        prompt: "次のコードは何を出力しますか?",
        code: `int x = 5;\nif (x > 10) {\n  System.out.println("big");\n} else if (x > 3) {\n  System.out.println("medium");\n} else {\n  System.out.println("small");\n}`,
        options: ["big", "medium", "small", "何も出力されない"],
        correctIndex: 1,
        explanation: "`x` は5なので `x > 10` は満たしませんが `x > 3` は満たすため、\"medium\" が出力されます。",
      },
    ],
  },
  {
    id: "loops",
    title: "第4章 繰り返し文と繰り返し制御文",
    description: "for・while・do-while文と、break/continueによる繰り返し制御。",
    questions: [
      {
        id: "loop-1",
        prompt: "このループは何を出力しますか?",
        code: `for (int i = 0; i < 3; i++) {\n  System.out.println(i);\n}`,
        options: ["0 1 2", "1 2 3", "0 1 2 3", "無限ループ"],
        correctIndex: 0,
        explanation:
          "ループは `i = 0` から始まり `i < 3` の間実行されるため、0, 1, 2 が出力されます。",
      },
      {
        id: "loop-2",
        prompt: "本体が少なくとも1回は実行されることを保証するループはどれですか?",
        options: ["for", "while", "do-while", "for-each"],
        correctIndex: 2,
        explanation:
          "`do-while` はループ本体を実行した後に条件を評価するため、条件がfalseでも本体は必ず1回実行されます。",
      },
      {
        id: "loop-3",
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
        id: "loop-4",
        prompt: "このループは何回実行されますか?",
        code: `int i = 0;\nwhile (i < 5) {\n  i += 2;\n}`,
        options: ["2", "3", "5", "無限"],
        correctIndex: 1,
        explanation: "iは 0 → 2 → 4 → 6 と変化するため、条件は4回チェックされますが、本体はi=0,2,4の3回実行され、i=6で停止します。",
      },
      {
        id: "loop-5",
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
      {
        id: "loop-6",
        prompt: "次のコードは何回 \"Hi\" を出力しますか?",
        code: `for (int i = 0; i < 3; i++) {\n  for (int j = 0; j < 2; j++) {\n    System.out.println("Hi");\n  }\n}`,
        options: ["2", "3", "5", "6"],
        correctIndex: 3,
        explanation:
          "外側のループが3回、内側のループがそれぞれ2回実行されるため、合計 `3 × 2 = 6` 回 \"Hi\" が出力されます。",
      },
      {
        id: "loop-7",
        prompt: "次のコードは何を出力しますか?",
        code: `int[] nums = {1, 2, 3};\nint sum = 0;\nfor (int n : nums) {\n  sum += n;\n}\nSystem.out.println(sum);`,
        options: ["3", "6", "123", "コンパイルエラー"],
        correctIndex: 1,
        explanation:
          "拡張for文(for-each)は配列の各要素を順に取り出して処理します。`sum` には1, 2, 3が順に加算され、最終的に6になります。",
      },
      {
        id: "loop-8",
        prompt: "次のコードは何を出力しますか?",
        code: `for (int i = 0; i < 5; i++) {\n  if (i == 3) {\n    break;\n  }\n  System.out.print(i);\n}`,
        options: ["01234", "012", "0124", "何も出力されない"],
        correctIndex: 1,
        explanation:
          "`i` が3になった時点で `break` によりループ全体が終了するため、0, 1, 2 のみが出力されます(3は出力されません)。",
      },
    ],
  },
  {
    id: "oop-concept",
    title: "第5章 オブジェクト指向コンセプト",
    description:
      "カプセル化・継承・ポリモーフィズム・抽象化など、オブジェクト指向の基本的な考え方。",
    questions: [
      {
        id: "concept-1",
        prompt: "オブジェクト指向プログラミングの重要な概念として一般的に挙げられる4つの要素はどれですか?",
        options: [
          "カプセル化・継承・ポリモーフィズム・抽象化",
          "変数・メソッド・クラス・パッケージ",
          "コンパイル・実行・デバッグ・テスト",
          "配列・リスト・マップ・セット",
        ],
        correctIndex: 0,
        explanation:
          "オブジェクト指向の基本概念として、カプセル化(隠蔽)、継承、ポリモーフィズム(多態性)、抽象化の4つがよく挙げられます。",
      },
      {
        id: "concept-2",
        prompt: "「クラス」と「オブジェクト(インスタンス)」の関係を正しく説明しているものはどれですか?",
        options: [
          "クラスとオブジェクトは全く同じものである",
          "クラスは設計図であり、オブジェクトはその設計図から生成された実体である",
          "オブジェクトはクラスより先に作られる",
          "1つのクラスからはオブジェクトを1つしか作れない",
        ],
        correctIndex: 1,
        explanation:
          "クラスはオブジェクトの構造や振る舞いを定義する「設計図」であり、オブジェクト(インスタンス)はその設計図をもとに `new` によって生成された実体です。1つのクラスから複数のオブジェクトを生成できます。",
      },
      {
        id: "concept-3",
        prompt: "カプセル化(encapsulation)の主な目的として最も適切なものはどれですか?",
        options: [
          "プログラムの実行速度を上げるため",
          "フィールドを外部から直接アクセスできないようにし、データを保護・管理しやすくするため",
          "複数のクラスを1つのファイルにまとめるため",
          "ループ処理を簡略化するため",
        ],
        correctIndex: 1,
        explanation:
          "カプセル化とは、フィールドを `private` にして外部から直接変更できないようにし、公開されたメソッド(getter/setterなど)を通じてアクセスさせることで、データの整合性や保守性を高める考え方です。",
      },
      {
        id: "concept-4",
        prompt: "クラスにおける「属性(フィールド)」と「振る舞い(メソッド)」の説明として正しいものはどれですか?",
        options: [
          "属性はオブジェクトが持つデータ、振る舞いはオブジェクトが実行できる処理を表す",
          "属性は処理内容、振る舞いはデータを表す",
          "属性と振る舞いに違いはない",
          "振る舞いは必ずstaticでなければならない",
        ],
        correctIndex: 0,
        explanation:
          "クラスの属性(フィールド)はオブジェクトが保持するデータを表し、振る舞い(メソッド)はそのオブジェクトが実行できる処理・機能を表します。",
      },
      {
        id: "concept-5",
        prompt: "「抽象化」の説明として最も適切なものはどれですか?",
        options: [
          "実装の詳細を隠し、重要な機能や特徴だけに着目すること",
          "すべてのクラスをabstractにすること",
          "変数を全て抽象型として宣言すること",
          "コードのコメントを増やすこと",
        ],
        correctIndex: 0,
        explanation:
          "抽象化とは、複雑な内部の実装の詳細を隠し、利用者にとって重要な機能や振る舞いだけに着目して設計する考え方です。",
      },
      {
        id: "concept-6",
        prompt: "オブジェクト指向プログラミングの利点として適切でないものはどれですか?",
        options: [
          "コードの再利用性が高まる",
          "保守性・拡張性が向上する",
          "現実世界の概念をモデル化しやすい",
          "プログラムのコード量が必ず減る",
        ],
        correctIndex: 3,
        explanation:
          "オブジェクト指向は再利用性・保守性・拡張性の向上や、現実世界の概念をモデル化しやすいという利点がありますが、必ずしもコード量が減るとは限りません。",
      },
      {
        id: "concept-7",
        prompt: "手続き型プログラミングと比較した際のオブジェクト指向プログラミングの特徴として正しいものはどれですか?",
        options: [
          "データと処理(メソッド)を1つのオブジェクトとしてまとめて管理できる",
          "全ての変数をグローバル変数として扱う",
          "処理を1つの巨大な関数にまとめる",
          "型の概念が存在しない",
        ],
        correctIndex: 0,
        explanation:
          "オブジェクト指向では、データ(フィールド)とそれを操作する処理(メソッド)を1つのオブジェクトとしてまとめて扱うことができ、手続き型プログラミングに比べて保守や再利用がしやすくなります。",
      },
      {
        id: "concept-8",
        prompt: "次のうち、現実世界のモデルとして「オブジェクト」の例として最も適切なものはどれですか?",
        options: [
          "for文",
          "1台の自動車(色や速度などの属性と、走る・止まるなどの振る舞いを持つ)",
          "コメント文",
          "コンパイルエラー",
        ],
        correctIndex: 1,
        explanation:
          "オブジェクトは、属性(データ)と振る舞い(処理)を持つ実体です。例えば「自動車」は色や速度といった属性と、走る・止まるといった振る舞いを持つオブジェクトの一例としてよく用いられます。",
      },
    ],
  },
  {
    id: "class-object",
    title: "第6章 クラス定義とオブジェクトの生成・使用",
    description: "クラスの定義、フィールド・メソッド・コンストラクタ、オブジェクトの生成と利用。",
    questions: [
      {
        id: "cls-1",
        prompt: "クラスの本体に定義できるものとして適切な組み合わせはどれですか?",
        options: [
          "フィールドとメソッドのみ",
          "フィールド、メソッド、コンストラクタなど",
          "パッケージ宣言のみ",
          "import文のみ",
        ],
        correctIndex: 1,
        explanation:
          "クラスの本体には、フィールド(属性)、メソッド(振る舞い)、コンストラクタ、内部クラスなどを定義できます。",
      },
      {
        id: "cls-2",
        prompt: "コンストラクタの説明として正しいものはどれですか?",
        options: [
          "戻り値の型として `void` を指定する",
          "クラス名と同じ名前を持ち、戻り値の型を指定しない",
          "必ず `static` を付けなければならない",
          "1つのクラスに1つしか定義できない",
        ],
        correctIndex: 1,
        explanation:
          "コンストラクタはクラス名と同じ名前を持ち、戻り値の型は指定しません(`void` も書きません)。オーバーロードにより複数のコンストラクタを定義することもできます。",
      },
      {
        id: "cls-3",
        prompt: "クラスに1つもコンストラクタを定義しなかった場合、どうなりますか?",
        options: [
          "コンパイルエラーになる",
          "コンパイラが引数のないデフォルトコンストラクタを自動的に生成する",
          "そのクラスはインスタンス化できなくなる",
          "全てのフィールドがfinalになる",
        ],
        correctIndex: 1,
        explanation:
          "コンストラクタを1つも定義しない場合、コンパイラが引数を持たないデフォルトコンストラクタを自動的に生成します。ただし、引数ありのコンストラクタを1つでも定義すると、デフォルトコンストラクタは自動生成されなくなります。",
      },
      {
        id: "cls-4",
        prompt: "次のコードでオブジェクトを生成している部分はどこですか?",
        code: `Sample s = new Sample();`,
        options: [
          "`Sample s` の部分",
          "`new Sample()` の部分",
          "`=` の部分",
          "`;` の部分",
        ],
        correctIndex: 1,
        explanation:
          "`new` 演算子に続けてコンストラクタを呼び出す `new Sample()` の部分が、実際にヒープ上にオブジェクトを生成する処理です。生成されたオブジェクトへの参照が変数 `s` に代入されます。",
      },
      {
        id: "cls-5",
        prompt: "次のコードの `this.name` は何を指していますか?",
        code: `class Person {\n  String name;\n  Person(String name) {\n    this.name = name;\n  }\n}`,
        options: [
          "引数のname",
          "このインスタンス自身が持つフィールドのname",
          "親クラスのname",
          "staticなname",
        ],
        correctIndex: 1,
        explanation:
          "`this` は現在のインスタンス自身を指す参照です。引数名とフィールド名が同じ場合、`this.name` と書くことでフィールドの方を明示的に指定できます。",
      },
      {
        id: "cls-6",
        prompt: "`static` が付けられたフィールドやメソッドの説明として正しいものはどれですか?",
        options: [
          "インスタンスごとに個別に値を持つ",
          "クラスに1つだけ存在し、インスタンスを生成しなくてもアクセスできる",
          "サブクラスから絶対にアクセスできない",
          "コンストラクタの中でのみ使用できる",
        ],
        correctIndex: 1,
        explanation:
          "`static` メンバーはクラスに1つだけ存在し、インスタンスを生成しなくても `クラス名.メンバー名` の形式でアクセスできます。インスタンスごとに異なる値を持ちません。",
      },
      {
        id: "cls-7",
        prompt: "Javaのガベージコレクションの説明として正しいものはどれですか?",
        options: [
          "プログラマが `delete` 文を使って明示的にメモリを解放する仕組み",
          "どこからも参照されなくなったオブジェクトを自動的に検出し、メモリを解放する仕組み",
          "コンパイル時に不要なコードを削除する仕組み",
          "配列のサイズを自動的に縮小する仕組み",
        ],
        correctIndex: 1,
        explanation:
          "Javaにはガベージコレクションという仕組みがあり、どこからも参照されなくなった(到達不能になった)オブジェクトをJVMが自動的に検出してメモリを解放します。C言語などと異なり、明示的な解放処理は不要です。",
      },
      {
        id: "cls-8",
        prompt: "メソッドのオーバーロードの説明として正しいものはどれですか?",
        options: [
          "同じクラス内に、同じ名前で引数の型や数が異なる複数のメソッドを定義すること",
          "サブクラスで親クラスのメソッドを再定義すること",
          "メソッドをprivateにすること",
          "1つのメソッドを複数回呼び出すこと",
        ],
        correctIndex: 0,
        explanation:
          "オーバーロードとは、同じクラス内で同じメソッド名を持ちながら、引数の型・数・順序が異なる複数のメソッドを定義することです(戻り値の型だけが異なる場合はオーバーロードとして成立しません)。",
      },
    ],
  },
  {
    id: "inheritance",
    title: "第7章 継承",
    description: "extends・superによるクラスの継承と、メソッドのオーバーライド。",
    questions: [
      {
        id: "inh-1",
        prompt: "クラスが他のクラスを継承するために使うキーワードは何ですか?",
        options: ["implements", "extends", "inherits", "super"],
        correctIndex: 1,
        explanation:
          "`extends` はクラスの継承に使われます。`implements` はインターフェースに使われ、`super` は親クラスのインスタンスを指します。",
      },
      {
        id: "inh-2",
        prompt: "Javaのクラスは直接いくつのクラスをextendsできますか?",
        options: ["0", "1", "最大2つ", "無制限"],
        correctIndex: 1,
        explanation:
          "Javaのクラスは単一継承のみをサポートしており、1つのクラスは他の1つのクラスだけをextendsできます(複数のインターフェースは `implements` で実装可能です)。",
      },
      {
        id: "inh-3",
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
        id: "inh-4",
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
        id: "inh-5",
        prompt: "Javaにおいて、明示的に継承を指定しない全てのクラスが暗黙的に継承しているクラスはどれですか?",
        options: ["Objectクラス", "Systemクラス", "Classクラス", "Voidクラス"],
        correctIndex: 0,
        explanation:
          "Javaでは `extends` を指定しない場合、すべてのクラスは暗黙的に `java.lang.Object` クラスを継承します。`Object` はJavaのクラス階層の頂点(ルート)です。",
      },
      {
        id: "inh-6",
        prompt:
          "スーパークラスの `protected` メソッドをサブクラスでオーバーライドする際のアクセス修飾子のルールとして正しいものはどれですか?",
        options: [
          "アクセスレベルを `private` に狭めることができる",
          "アクセスレベルは同じか、より広く(緩く)する必要がある",
          "アクセス修飾子は必ず変更しなければならない",
          "アクセス修飾子は考慮されない",
        ],
        correctIndex: 1,
        explanation:
          "メソッドをオーバーライドする際、アクセスレベルをスーパークラスのメソッドより狭くすることはできません。同じか、より広い(緩い)アクセスレベルにする必要があります。",
      },
      {
        id: "inh-7",
        prompt: "アクセス修飾子 `protected` の説明として正しいものはどれですか?",
        options: [
          "同じクラス内からのみアクセスできる",
          "同じパッケージ内のクラス、および別パッケージのサブクラスからアクセスできる",
          "どこからでも自由にアクセスできる",
          "サブクラスからは絶対にアクセスできない",
        ],
        correctIndex: 1,
        explanation:
          "`protected` は同じパッケージ内のクラスに加えて、別パッケージであってもそのクラスを継承したサブクラスからアクセスできるアクセス修飾子です。",
      },
      {
        id: "inh-8",
        prompt: "コンストラクタは継承されますか?",
        options: [
          "コンストラクタもフィールドやメソッドと同様に継承される",
          "コンストラクタは継承されない。ただしサブクラスのコンストラクタから `super()` でスーパークラスのコンストラクタを呼び出せる",
          "コンストラクタは常に自動的にオーバーライドされる",
          "コンストラクタは `static` メソッドとしてのみ継承される",
        ],
        correctIndex: 1,
        explanation:
          "コンストラクタはフィールドやメソッドと異なり継承されません。サブクラスのコンストラクタの中で `super(...)` を呼び出すことで、スーパークラスのコンストラクタの処理を利用できます。",
      },
    ],
  },
  {
    id: "polymorphism-package",
    title: "第8章 ポリモーフィズムとパッケージ",
    description: "スーパークラス参照によるポリモーフィズムと、パッケージ・アクセス修飾子の仕組み。",
    questions: [
      {
        id: "poly-1",
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
      {
        id: "poly-2",
        prompt:
          "次のコードのように、スーパークラス型の変数でサブクラスのインスタンスを参照することを何と呼びますか?",
        code: `Animal a = new Dog();`,
        options: ["ダウンキャスト", "アップキャスト", "オーバーロード", "ガベージコレクション"],
        correctIndex: 1,
        explanation:
          "サブクラスのインスタンスをスーパークラス型の変数で参照することを「アップキャスト」と呼びます。アップキャストは暗黙的に(明示的なキャスト無しで)行うことができます。",
      },
      {
        id: "poly-3",
        prompt:
          "次のコードは何を出力しますか?(`Dog` は `Animal` を継承し、`sound()` をオーバーライドしているとします)",
        code: `class Animal {\n  void sound() { System.out.println("..."); }\n}\nclass Dog extends Animal {\n  void sound() { System.out.println("Bark"); }\n}\n\nAnimal a = new Dog();\na.sound();`,
        options: ["...", "Bark", "コンパイルエラー", "何も出力されない"],
        correctIndex: 1,
        explanation:
          "参照の型(Animal)ではなく、実際に生成されたオブジェクトの型(Dog)のメソッドが実行時に呼び出されます。これを動的束縛(実行時ポリモーフィズム)と呼びます。",
      },
      {
        id: "poly-4",
        prompt:
          "スーパークラス型の変数をサブクラス型に戻す「ダウンキャスト」を安全に行うために、事前にチェックすべき演算子はどれですか?",
        options: ["instanceof", "sizeof", "typeof", "hashCode"],
        correctIndex: 0,
        explanation:
          "ダウンキャストを行う前に `instanceof` 演算子でオブジェクトが実際にそのサブクラスのインスタンスであるかを確認することで、`ClassCastException` を防ぐことができます。",
      },
      {
        id: "poly-5",
        prompt: "インターフェースの説明として正しいものはどれですか?",
        options: [
          "インターフェースは `new` によって直接インスタンス化できる",
          "クラスは `implements` を使ってインターフェースを実装する",
          "インターフェースはクラスと同じく複数継承できない",
          "インターフェースにはメソッドを1つも定義できない",
        ],
        correctIndex: 1,
        explanation:
          "クラスは `implements` キーワードを使ってインターフェースを実装します。インターフェース自体は `new` で直接インスタンス化できませんが、クラスは複数のインターフェースを実装(複数実装)できます。",
      },
      {
        id: "poly-6",
        prompt: "パッケージ(package)の主な役割として正しいものはどれですか?",
        options: [
          "プログラムの実行速度を上げる",
          "クラスを整理し、名前の衝突を防ぐための名前空間を提供する",
          "コンパイルエラーを自動的に修正する",
          "変数の型を自動的に変換する",
        ],
        correctIndex: 1,
        explanation:
          "パッケージは関連するクラスやインターフェースをグループ化して整理し、異なるパッケージであれば同名のクラスが存在しても衝突しないようにする名前空間の役割を持ちます。",
      },
      {
        id: "poly-7",
        prompt: "アクセス修飾子を何も付けない(デフォルトアクセス)フィールドやメソッドには、どこからアクセスできますか?",
        options: [
          "どこからでもアクセスできる",
          "同じパッケージ内のクラスからのみアクセスできる",
          "同じクラス内からのみアクセスできる",
          "サブクラスであれば別パッケージからでもアクセスできる",
        ],
        correctIndex: 1,
        explanation:
          "アクセス修飾子を指定しない場合(デフォルト/パッケージプライベート)は、同じパッケージに属するクラスからのみアクセスできます。別パッケージのサブクラスからはアクセスできません(それには `protected` が必要です)。",
      },
      {
        id: "poly-8",
        prompt: "Javaプログラムを実行する際、JVMが `.class` ファイルやライブラリを検索する場所を指定する仕組みは何ですか?",
        options: [
          "クラスパス(classpath)",
          "パスワード",
          "レジストリ",
          "環境変数PATH(OSのコマンド検索専用)",
        ],
        correctIndex: 0,
        explanation:
          "クラスパス(classpath)は、JVMが実行時にクラスファイルやライブラリ(jarファイルなど)を検索する際に参照するパスの集合です。`-classpath` オプションや `CLASSPATH` 環境変数で指定します。",
      },
    ],
  },
];

export function getTopic(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}
