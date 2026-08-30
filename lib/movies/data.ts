/* 씨네덱 카탈로그.
 *
 * 작품은 전부 가상이다. 실재하는 영화에 없는 평점을 붙이면 그 자체가
 * 사실이 아닌 기록이 되므로 제목 · 감독 · 줄거리를 지어냈다.
 * 포스터 자리에는 Unsplash 사진을 쓴다 — 실제 포스터가 아니다.
 *
 * 평점 분포는 [★0.5 … ★5.0] 열 칸. 평균만으로는 판단할 수 없다는 것이
 * 이 제품의 전제라, 데이터도 분포를 먼저 갖고 평균을 거기서 계산한다. */

export type Movie = {
  id: string
  title: string
  titleEn: string
  year: number
  runtime: number
  director: string
  genres: string[]
  /** 관객이 붙인 태그. 평점이 못 말하는 것을 말한다. */
  tags: string[]
  synopsis: string
  synopsisEn: string
  /** 0.5점부터 5.0점까지 열 칸의 표수 */
  dist: number[]
  poster: string
  /** 편집자가 고른 한 줄 */
  pick?: string
}

const P = (id: string, w = 600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`

export const MOVIES: Movie[] = [
  {
    id: "long-way-to-the-sea",
    title: "바다까지 먼 길",
    titleEn: "Long Way to the Sea",
    year: 2024,
    runtime: 128,
    director: "한지운",
    genres: ["드라마", "로드무비"],
    tags: ["느리다", "여운이 길다", "풍경이 좋다", "결말이 열려 있다"],
    synopsis:
      "장례를 마치고 남은 것은 낡은 트럭 한 대와 아버지가 한 번도 가지 못한 항구의 주소뿐이었다. 딸은 그 주소를 향해 사흘을 달린다.",
    synopsisEn:
      "After the funeral, all that's left is an old truck and the address of a harbor her father never reached. She drives toward it for three days.",
    dist: [2, 3, 6, 11, 24, 48, 96, 187, 142, 61],
    poster: P("1470071459604-3b5ec3a7fe05"),
    pick: "올해 가장 조용한 영화. 마지막 12분을 위해 존재한다.",
  },
  {
    id: "seventh-floor-noise",
    title: "7층의 소음",
    titleEn: "Noise on the Seventh Floor",
    year: 2023,
    runtime: 104,
    director: "문세라",
    genres: ["스릴러", "미스터리"],
    tags: ["긴장감", "반전", "밀실", "소리가 무섭다"],
    synopsis:
      "이사 온 첫날부터 위층에서 규칙적인 소리가 들린다. 관리사무소는 7층이 비어 있다고 답한다.",
    synopsisEn:
      "From the first night, a regular sound comes from upstairs. The building office insists the seventh floor is empty.",
    dist: [4, 6, 12, 28, 66, 121, 203, 168, 74, 22],
    poster: P("1478720568477-152d9b164e26"),
  },
  {
    id: "salt-and-lantern",
    title: "소금과 등불",
    titleEn: "Salt and Lantern",
    year: 2025,
    runtime: 141,
    director: "오재림",
    genres: ["시대극", "드라마"],
    tags: ["대작", "미술이 좋다", "길다", "배우 연기"],
    synopsis:
      "염전과 등대 사이, 이름이 두 번 바뀐 마을에서 삼대에 걸쳐 이어진 약속에 관하여.",
    synopsisEn:
      "Between the salt flats and the lighthouse, in a village that changed its name twice, a promise passes through three generations.",
    dist: [3, 4, 9, 17, 38, 74, 152, 241, 203, 96],
    poster: P("1489599849927-2ee91cede3ba"),
    pick: "만듦새가 압도적이다. 러닝타임을 각오하고 볼 것.",
  },
  {
    id: "we-were-nine",
    title: "우리는 아홉이었다",
    titleEn: "We Were Nine",
    year: 2022,
    runtime: 96,
    director: "배윤",
    genres: ["코미디", "드라마"],
    tags: ["웃기다", "따뜻하다", "가볍게 보기 좋다"],
    synopsis:
      "폐교를 앞둔 시골 분교. 아홉 명이 마지막 학예회를 준비한다. 준비물은 하나도 갖춰지지 않았다.",
    synopsisEn:
      "A rural branch school about to close. Nine children prepare a final recital with none of the props they need.",
    dist: [1, 2, 5, 9, 22, 51, 118, 143, 88, 34],
    poster: P("1509909756405-be0199881695"),
  },
  {
    id: "orbit-of-mistakes",
    title: "실수의 궤도",
    titleEn: "Orbit of Mistakes",
    year: 2024,
    runtime: 117,
    director: "정하윤",
    genres: ["SF", "드라마"],
    tags: ["생각할 거리", "차갑다", "설정이 좋다", "호불호"],
    synopsis:
      "궤도 정비사는 하루에 한 번, 12초 전으로 돌아갈 수 있다. 12초로 바꿀 수 있는 것은 생각보다 적다.",
    synopsisEn:
      "An orbital technician can return twelve seconds into the past, once a day. Twelve seconds change less than you'd think.",
    dist: [12, 14, 22, 31, 47, 62, 88, 121, 154, 132],
    poster: P("1451187580459-43490279c0fa"),
    pick: "호불호가 크게 갈린다. 분포를 꼭 보고 결정하길.",
  },
  {
    id: "night-shift-nurse",
    title: "야간 근무",
    titleEn: "Night Shift",
    year: 2023,
    runtime: 88,
    director: "서가온",
    genres: ["드라마"],
    tags: ["담백하다", "현실적", "짧다"],
    synopsis: "응급실 간호사의 열두 시간. 사건은 일어나지 않고, 일만 일어난다.",
    synopsisEn:
      "Twelve hours with an ER nurse. Nothing happens — only the work happens.",
    dist: [2, 3, 7, 14, 31, 58, 94, 112, 67, 24],
    poster: P("1519494026892-80bbd2d6fd0d"),
  },
  {
    id: "the-loud-quiet",
    title: "시끄러운 고요",
    titleEn: "The Loud Quiet",
    year: 2025,
    runtime: 133,
    director: "임채",
    genres: ["음악", "드라마"],
    tags: ["음악이 좋다", "감정선", "극장에서 볼 것"],
    synopsis:
      "청력을 잃어가는 지휘자가 마지막 정기연주회를 준비한다. 단원들은 아직 모른다.",
    synopsisEn:
      "A conductor losing his hearing prepares a final concert. The orchestra doesn't know yet.",
    dist: [2, 2, 4, 8, 19, 44, 103, 196, 178, 89],
    poster: P("1465146344425-f00d5f5c8f07"),
  },
  {
    id: "borrowed-dog",
    title: "빌린 개",
    titleEn: "Borrowed Dog",
    year: 2022,
    runtime: 91,
    director: "노선영",
    genres: ["코미디"],
    tags: ["웃기다", "가볍게 보기 좋다", "동물"],
    synopsis:
      "소개팅 하루 전, 프로필 사진 속 강아지를 급히 빌린다. 개는 돌려줄 생각이 없다.",
    synopsisEn:
      "The day before a blind date, he borrows the dog from his profile photo. The dog has other plans.",
    dist: [3, 5, 11, 21, 44, 78, 112, 96, 41, 12],
    poster: P("1477884213360-7e9d7dcc1e48"),
  },
  {
    id: "cartography-of-rain",
    title: "비의 지도",
    titleEn: "Cartography of Rain",
    year: 2024,
    runtime: 108,
    director: "한지운",
    genres: ["다큐멘터리"],
    tags: ["아름답다", "느리다", "잠온다", "촬영이 좋다"],
    synopsis: "장마 전선을 따라 남에서 북으로. 사람은 거의 나오지 않는다.",
    synopsisEn:
      "Following the rain front from south to north. People barely appear.",
    dist: [8, 9, 14, 22, 38, 51, 66, 71, 58, 41],
    poster: P("1428592953211-077101b2021b"),
  },
  {
    id: "two-weeks-of-summer",
    title: "여름의 이 주",
    titleEn: "Two Weeks of Summer",
    year: 2021,
    runtime: 112,
    director: "배윤",
    genres: ["로맨스", "드라마"],
    tags: ["설렌다", "여름", "청춘", "여운이 길다"],
    synopsis:
      "여름 방학 아르바이트로 만난 둘에게 주어진 시간은 정확히 열나흘이었다.",
    synopsisEn:
      "Two people meet at a summer job. They have exactly fourteen days.",
    dist: [2, 3, 6, 12, 28, 62, 134, 178, 121, 47],
    poster: P("1500530855697-b586d89ba3ee"),
  },
  {
    id: "inventory",
    title: "재고",
    titleEn: "Inventory",
    year: 2023,
    runtime: 99,
    director: "문세라",
    genres: ["스릴러"],
    tags: ["긴장감", "밤", "직업물"],
    synopsis:
      "폐점 후 재고 조사. 장부의 숫자와 창고의 물건이 매번 하나씩 어긋난다.",
    synopsisEn:
      "Stocktaking after closing. The ledger and the warehouse disagree by exactly one, every time.",
    dist: [4, 5, 9, 18, 41, 82, 137, 121, 62, 19],
    poster: P("1441986300917-64674bd600d8"),
  },
  {
    id: "grandmothers-frequency",
    title: "할머니의 주파수",
    titleEn: "Grandmother's Frequency",
    year: 2025,
    runtime: 102,
    director: "오재림",
    genres: ["드라마", "판타지"],
    tags: ["따뜻하다", "울었다", "가족"],
    synopsis:
      "고장 난 라디오에서 3년 전 돌아가신 할머니의 목소리가 들린다. 주파수는 매일 조금씩 밀린다.",
    synopsisEn:
      "A broken radio plays the voice of a grandmother who died three years ago. The frequency drifts a little each day.",
    dist: [2, 3, 5, 10, 24, 56, 121, 189, 156, 78],
    poster: P("1487215078519-e21cc028cb29"),
  },
  {
    id: "concrete-garden",
    title: "콘크리트 정원",
    titleEn: "Concrete Garden",
    year: 2022,
    runtime: 124,
    director: "임채",
    genres: ["드라마", "사회"],
    tags: ["무겁다", "생각할 거리", "현실적"],
    synopsis: "재개발이 확정된 지 4년. 아직 나가지 않은 세 가구의 이야기.",
    synopsisEn:
      "Four years since redevelopment was approved. Three households have not left.",
    dist: [3, 4, 8, 16, 34, 68, 112, 134, 88, 36],
    poster: P("1486406146926-c627a92ad1ab"),
  },
  {
    id: "the-understudy",
    title: "대역",
    titleEn: "The Understudy",
    year: 2024,
    runtime: 118,
    director: "서가온",
    genres: ["스릴러", "드라마"],
    tags: ["반전", "연기 대결", "긴장감"],
    synopsis:
      "20년을 대역으로 산 배우에게 처음으로 주연이 돌아온다. 원래 주연은 아직 살아 있다.",
    synopsisEn:
      "After twenty years as an understudy, he finally gets the lead. The original lead is still alive.",
    dist: [3, 4, 7, 14, 32, 71, 148, 176, 112, 44],
    poster: P("1503095396549-807759245b35"),
  },
  {
    id: "eight-hundred-kilometers",
    title: "팔백 킬로미터",
    titleEn: "Eight Hundred Kilometers",
    year: 2021,
    runtime: 136,
    director: "정하윤",
    genres: ["액션", "스릴러"],
    tags: ["빠르다", "액션", "차량 추격"],
    synopsis: "한 번 멈추면 끝나는 화물차. 목적지까지 팔백 킬로미터가 남았다.",
    synopsisEn:
      "A truck that must not stop. Eight hundred kilometers to go.",
    dist: [6, 8, 14, 26, 52, 94, 142, 121, 58, 21],
    poster: P("1449965408869-eaa3f722e40d"),
  },
  {
    id: "letters-not-sent",
    title: "부치지 않은 편지",
    titleEn: "Letters Not Sent",
    year: 2023,
    runtime: 95,
    director: "노선영",
    genres: ["드라마", "로맨스"],
    tags: ["잔잔하다", "울었다", "편지"],
    synopsis:
      "우체국 분실물 보관함에서 40년 치 편지가 발견된다. 수신인은 모두 같은 사람이다.",
    synopsisEn:
      "Forty years of letters turn up in a post office lost-and-found. Every one has the same addressee.",
    dist: [2, 3, 6, 12, 27, 58, 118, 156, 108, 41],
    poster: P("1516414447565-b14be0adf13e"),
  },
  {
    id: "midnight-cartographer",
    title: "자정의 측량사",
    titleEn: "The Midnight Cartographer",
    year: 2025,
    runtime: 126,
    director: "한지운",
    genres: ["판타지", "미스터리"],
    tags: ["설정이 좋다", "아름답다", "어렵다", "호불호"],
    synopsis: "자정부터 한 시까지만 존재하는 골목을 지도에 그리는 일을 맡았다.",
    synopsisEn:
      "He is hired to map an alley that exists only between midnight and one.",
    dist: [11, 12, 18, 26, 41, 58, 82, 114, 132, 108],
    poster: P("1502136969935-8d8eef54d77b"),
  },
  {
    id: "score-of-one",
    title: "일 대 영",
    titleEn: "Score of One",
    year: 2022,
    runtime: 107,
    director: "배윤",
    genres: ["스포츠", "드라마"],
    tags: ["뜨겁다", "성장", "팀"],
    synopsis: "3년 연속 전패한 고등학교 축구부에 새 감독이 온다. 목표는 한 골이다.",
    synopsisEn:
      "A high school team on a three-year losing streak gets a new coach. The goal is one goal.",
    dist: [2, 4, 8, 16, 36, 74, 128, 132, 74, 28],
    poster: P("1517649763962-0c623066013b"),
  },
  {
    id: "the-quiet-part",
    title: "말하지 않은 부분",
    titleEn: "The Quiet Part",
    year: 2024,
    runtime: 113,
    director: "문세라",
    genres: ["미스터리", "드라마"],
    tags: ["반전", "차갑다", "두 번 봐야 한다"],
    synopsis:
      "실종 신고 3일 후 스스로 돌아온 사람은, 사라진 동안의 일을 한 문장으로만 말한다.",
    synopsisEn:
      "Three days after being reported missing, she walks back in and describes those days in a single sentence.",
    dist: [4, 5, 9, 17, 36, 72, 128, 158, 102, 42],
    poster: P("1440404653325-ab127d49abc1"),
  },
  {
    id: "rooftop-astronomy",
    title: "옥상 천문학",
    titleEn: "Rooftop Astronomy",
    year: 2021,
    runtime: 89,
    director: "오재림",
    genres: ["드라마", "성장"],
    tags: ["따뜻하다", "짧다", "청춘", "별"],
    synopsis:
      "학원을 빼먹은 아이 둘이 옥상에서 망원경을 조립한다. 도심에서는 별이 다섯 개쯤 보인다.",
    synopsisEn:
      "Two kids skip cram school to build a telescope on a roof. Downtown, you can see about five stars.",
    dist: [1, 2, 4, 9, 21, 48, 104, 121, 72, 27],
    poster: P("1419242902214-272b3f66ee7a"),
  },
  {
    id: "the-second-tenant",
    title: "두 번째 세입자",
    titleEn: "The Second Tenant",
    year: 2023,
    runtime: 101,
    director: "임채",
    genres: ["호러", "스릴러"],
    tags: ["무섭다", "밀실", "소리가 무섭다", "짧다"],
    synopsis: "전세 계약서에 세입자 이름이 두 개 적혀 있다. 한 명은 나다.",
    synopsisEn:
      "The lease lists two tenants. One of them is me.",
    dist: [6, 7, 12, 24, 48, 88, 132, 108, 51, 18],
    poster: P("1520637736862-4d197d17c55a"),
  },
  {
    id: "how-to-fold-a-map",
    title: "지도를 접는 법",
    titleEn: "How to Fold a Map",
    year: 2025,
    runtime: 97,
    director: "서가온",
    genres: ["코미디", "로드무비"],
    tags: ["웃기다", "여행", "가볍게 보기 좋다"],
    synopsis:
      "내비게이션 없이 종이 지도로만 부산까지 가기로 한 부부. 지도는 2003년판이다.",
    synopsisEn:
      "A couple decides to reach Busan on a paper map alone. The map is from 2003.",
    dist: [2, 3, 7, 14, 31, 66, 118, 112, 58, 21],
    poster: P("1502920917128-1aa500764cbd"),
  },
  {
    id: "last-order",
    title: "라스트 오더",
    titleEn: "Last Order",
    year: 2022,
    runtime: 121,
    director: "정하윤",
    genres: ["범죄", "스릴러"],
    tags: ["긴장감", "밤", "반전", "무겁다"],
    synopsis:
      "폐업 전날의 바. 마지막 손님 넷이 서로를 20년 전부터 알고 있었다.",
    synopsisEn:
      "A bar on its last night. The final four customers have known each other for twenty years.",
    dist: [4, 5, 10, 20, 44, 88, 148, 142, 78, 29],
    poster: P("1470337458703-46ad1756a187"),
  },
  {
    id: "paper-boats",
    title: "종이배",
    titleEn: "Paper Boats",
    year: 2024,
    runtime: 84,
    director: "노선영",
    genres: ["애니메이션", "가족"],
    tags: ["아이와 보기 좋다", "따뜻하다", "짧다", "그림이 좋다"],
    synopsis: "매일 종이배를 접어 개천에 띄우는 아이. 어느 날 답장이 떠내려온다.",
    synopsisEn:
      "A child folds a paper boat each day and sets it on the creek. One day, a reply floats back.",
    dist: [1, 2, 3, 7, 18, 44, 98, 142, 108, 52],
    poster: P("1490750967868-88aa4486c946"),
  },
]

/* ── 파생 값 ─────────────────────────────────────────────
 * 평균을 데이터에 적어 두지 않는다. 분포에서 계산한다 —
 * 그래야 둘이 어긋날 수 없다. */

export const STEPS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]

export function votes(m: Movie) {
  return m.dist.reduce((a, b) => a + b, 0)
}

export function average(m: Movie) {
  const n = votes(m)
  if (!n) return 0
  return m.dist.reduce((sum, c, i) => sum + c * STEPS[i], 0) / n
}

/** 분포가 얼마나 갈라졌는가. 값이 클수록 호불호가 심하다. */
export function spread(m: Movie) {
  const n = votes(m)
  if (!n) return 0
  const avg = average(m)
  const v = m.dist.reduce((s, c, i) => s + c * (STEPS[i] - avg) ** 2, 0) / n
  return Math.sqrt(v)
}

export const GENRES = [...new Set(MOVIES.flatMap((m) => m.genres))].sort()
export const TAGS = [...new Set(MOVIES.flatMap((m) => m.tags))].sort()
export const YEARS = [...new Set(MOVIES.map((m) => m.year))].sort((a, b) => b - a)

export const byId = (id: string) => MOVIES.find((m) => m.id === id)

export const top = (n: number) =>
  [...MOVIES].sort((a, b) => average(b) - average(a)).slice(0, n)

export const popular = (n: number) =>
  [...MOVIES].sort((a, b) => votes(b) - votes(a)).slice(0, n)

export const divisive = (n: number) =>
  [...MOVIES].sort((a, b) => spread(b) - spread(a)).slice(0, n)

export const newest = (n: number) =>
  [...MOVIES].sort((a, b) => b.year - a.year).slice(0, n)

export const byGenre = (g: string, n = 12) =>
  MOVIES.filter((m) => m.genres.includes(g)).slice(0, n)

/** 태그와 감독이 겹치는 정도로 비슷함을 잰다. */
export function similar(m: Movie, n = 6) {
  return MOVIES.filter((x) => x.id !== m.id)
    .map((x) => ({
      m: x,
      score:
        x.tags.filter((t) => m.tags.includes(t)).length * 2 +
        x.genres.filter((g) => m.genres.includes(g)).length * 3 +
        (x.director === m.director ? 2 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.m)
}

export function runtimeLabel(min: number, lang: "ko" | "en") {
  const h = Math.floor(min / 60)
  const r = min % 60
  return lang === "ko" ? `${h}시간 ${r}분` : `${h}h ${r}m`
}
