export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  tags: string[];
  author: {
    name: string;
    image: string;
    bio: string;
  };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export const tags: Tag[] = [
  { id: "1", name: "テクノロジー", slug: "technology", count: 5 },
  { id: "2", name: "デザイン", slug: "design", count: 4 },
  { id: "3", name: "プログラミング", slug: "programming", count: 6 },
  { id: "4", name: "ライフスタイル", slug: "lifestyle", count: 3 },
  { id: "5", name: "写真", slug: "photography", count: 2 },
  { id: "6", name: "旅行", slug: "travel", count: 3 },
];

const authors = {
  tanaka: {
    name: "田中太郎",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    bio: "10年以上のWeb開発経験を持つシニアエンジニア。モダンな技術スタックを得意としています。",
  },
  yamada: {
    name: "山田花子",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
    bio: "UI/UXデザイナー。美しく機能的なインターフェースデザインを追求しています。",
  },
  suzuki: {
    name: "鈴木一郎",
    image:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400",
    bio: "AI・機械学習専門のソフトウェアエンジニア。最新技術のリサーチと開発に携わっています。",
  },
  sato: {
    name: "佐藤美咲",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    bio: "旅するフォトグラファー。世界中の風景や文化を写真で切り取っています。",
  },
};

export const posts: Post[] = [
  {
    id: "1",
    title: "Web開発の未来：AIとノーコードツールの台頭",
    slug: "future-of-web-development",
    excerpt:
      "人工知能とノーコードプラットフォームが、Web開発の世界をどのように変革しているのかを探ります。",
    content: `
# Web開発の未来

AIツールとノーコードプラットフォームの登場により、Web開発の世界は大きく変わりつつあります。この変化は開発をより身近なものにすると同時に、プロの開発者に新たな機会をもたらしています。

## AIの台頭

人工知能は、コード補完から自動テストまで、開発ワークフローの様々な側面で革新をもたらしています。

## ノーコード革命

ノーコードプラットフォームにより、技術的な知識がなくても高度なWebアプリケーションの作成が可能になっています。

## 開発者への影響

1. より高度な問題解決への注力
2. 生産性の向上
3. 新しい専門分野の出現
4. アーキテクチャとデザインの重要性増大

## まとめ

Web開発の未来は可能性に満ちています。ツールや技術は進化し続けますが、基本原則を理解した熟練開発者の需要は依然として高いままです。
    `,
    coverImage:
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=1000",
    date: "2024-03-21",
    tags: ["テクノロジー", "プログラミング"],
    author: authors.tanaka,
  },
  {
    id: "2",
    title: "モダンUIデザインの基本原則を学ぶ",
    slug: "mastering-modern-ui-design",
    excerpt:
      "現代のUIデザイン原則と、その効果的な適用方法について詳しく解説します。",
    content: `
# モダンUIデザインの基礎

直感的で美しいユーザーインターフェースを作るには、デザイン原則とユーザー心理の深い理解が必要です。

## 重要なデザイン原則

1. 視覚的階層
2. 余白の活用
3. 色彩理論
4. タイポグラフィ
5. 一貫性

## 実践的な応用

これらの原則を実際のプロジェクトでどのように活用するかを学びます。
    `,
    coverImage:
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=1000",
    date: "2024-03-20",
    tags: ["デザイン", "テクノロジー"],
    author: authors.yamada,
  },
  {
    id: "3",
    title: "京都の隠れた絶景スポットを巡る",
    slug: "exploring-kyoto-photography",
    excerpt: "古都京都の知られざる絶景ポイントと、その魅力を写真で紹介します。",
    content: `
# 京都の隠れた絶景スポット

千年の歴史を持つ古都の隠れた名所を、写真を通じて巡る旅へご案内します。

## 古寺と庭園

静寂に包まれた古寺と、手入れの行き届いた日本庭園の魅力。

## 路地裏の風景

観光客があまり訪れない、京都の路地裏に残る昔ながらの風景。
    `,
    coverImage:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1000",
    date: "2024-03-19",
    tags: ["写真", "旅行"],
    author: authors.sato,
  },
  {
    id: "4",
    title: "はじめての機械学習：基礎から応用まで",
    slug: "machine-learning-fundamentals",
    excerpt:
      "機械学習の基本概念から実践的な応用まで、初心者にもわかりやすく解説します。",
    content: `
# 機械学習の基礎

機械学習は様々な産業で革新をもたらしています。この記事では、基本概念から応用まで解説します。

## 重要な概念

1. 教師あり学習
2. 教師なし学習
3. ニューラルネットワーク
4. ディープラーニング

## 実践的な応用例

実際のビジネスでの機械学習の活用事例を紹介します。
    `,
    coverImage:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000",
    date: "2024-03-18",
    tags: ["テクノロジー", "プログラミング"],
    author: authors.suzuki,
  },
  {
    id: "5",
    title: "ミニマリストライフのすすめ",
    slug: "art-of-minimalist-living",
    excerpt: "物を減らすことで得られる、より充実した暮らしについて考えます。",
    content: `
# ミニマリストライフの実践

ミニマリズムは単に物を減らすことではなく、本当に大切なものに集中する生き方です。

## ミニマリズムのメリット

1. ストレス軽減
2. 集中力の向上
3. 環境への配慮
4. 経済的な自由

## 始め方

ミニマリストライフを始めるための具体的なステップを紹介します。
    `,
    coverImage:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1000",
    date: "2024-03-17",
    tags: ["ライフスタイル"],
    author: authors.yamada,
  },
  {
    id: "6",
    title: "スケーラブルなWebアプリケーションの構築",
    slug: "building-scalable-web-applications",
    excerpt:
      "数百万人規模のユーザーに対応できるWebアプリケーションの設計原則を解説します。",
    content: `
# スケーラブルなWebアプリケーション開発

成長に対応できるアプリケーションを作るには、適切な設計と判断が重要です。

## 重要な原則

1. マイクロサービスアーキテクチャ
2. キャッシュ戦略
3. データベース最適化
4. 負荷分散

## ベストプラクティス

実装のガイドラインと実例を紹介します。
    `,
    coverImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
    date: "2024-03-16",
    tags: ["プログラミング", "テクノロジー"],
    author: authors.tanaka,
  },
  {
    id: "7",
    title: "環境に優しいWebデザインの実践",
    slug: "sustainable-web-design",
    excerpt:
      "美しいWebサイトを作りながら、環境負荷を最小限に抑える方法を探ります。",
    content: `
# 環境に配慮したWebデザイン

Webデザインの選択が環境に与える影響について考え、持続可能なデジタル体験を作る方法を学びます。

## 重要なポイント

1. パフォーマンス最適化
2. グリーンホスティング
3. 効率的なアセット管理
4. 持続可能なUXパターン

## 実装ガイド

より環境に優しいWebプロジェクトを作るための具体的なステップを紹介します。
    `,
    coverImage:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1000",
    date: "2024-03-15",
    tags: ["デザイン", "テクノロジー"],
    author: authors.yamada,
  },
  {
    id: "8",
    title: "都市の日常を切り取る：スナップ写真の技法",
    slug: "street-photography-guide",
    excerpt:
      "都市での印象的なスナップ写真を撮影するためのテクニックとコツを紹介します。",
    content: `
# スナップ写真撮影ガイド

都市の日常の一瞬を切り取る技術を学びましょう。

## 基本テクニック

1. 構図のルール
2. 光の扱い方
3. タイミングと忍耐
4. 機材選び

## 上級テクニック

スナップ写真をより印象的なものにするためのテクニックを紹介します。
    `,
    coverImage:
      "https://images.unsplash.com/photo-1476801071117-fbc157ae3f01?auto=format&fit=crop&q=80&w=1000",
    date: "2024-03-14",
    tags: ["写真", "ライフスタイル"],
    author: authors.sato,
  },
];

export const profile = {
  name: "クラシックブログ",
  description:
    "テクノロジー、デザイン、ライフスタイルについての考えやアイデアを共有するモダンなブログ。",
  author: {
    name: "クラシックチーム",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    bio: "知識と経験を共有することに情熱を持つライターとクリエイターのチームです。",
  },
  social: {
    twitter: "https://twitter.com",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
};
