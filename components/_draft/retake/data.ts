/* 왜: 리테이크 화면 넷(랜딩 · 대화 · 생성 대기 · 홈)이 같은 템플릿 목록을 본다.
 *     한쪽에만 두면 다른 화면이 낡는다.
 * 어디서: /retake. 2026-09-01 */

export type Template = {
  cat: string
  dur: string
  name: string
  /* 카드에 담기는 것은 이름표가 아니라 프롬프트 그 자체다 —
   * 유저가 알아야 하는 건 «Cat vlog» 이 아니라 무엇을 찍는지다. */
  desc: string
}

export const CATEGORIES = ["All", "Shorts", "Cinematic", "ASMR", "Product", "Anime", "POV"]

export const TEMPLATES: Template[] = [
  { cat: "Shorts", dur: "5s", name: "Dog shorts", desc: "A golden retriever bursting through tall grass, slow motion" },
  { cat: "Cinematic", dur: "10s", name: "Movie scene remake", desc: "Rain-soaked rooftop standoff, anamorphic flares, 35mm grain" },
  { cat: "POV", dur: "15s", name: "Backrooms POV", desc: "Endless yellow corridors, flickering fluorescent hum, POV" },
  { cat: "Shorts", dur: "5s", name: "Cat vlog", desc: "A cat narrating its morning routine, handheld selfie framing" },
  { cat: "Anime", dur: "10s", name: "Retro anime opening", desc: "90s cel-shaded anime opening, city skyline pan" },
  { cat: "Cinematic", dur: "10s", name: "Noir interrogation", desc: "Single desk lamp, venetian blind shadows, black and white" },
  { cat: "ASMR", dur: "15s", name: "Glass cutting ASMR", desc: "Close-up blade on frosted glass, crisp high-frequency detail" },
  { cat: "Product", dur: "5s", name: "Bottle turntable", desc: "Studio seamless white, slow 360 rotation, soft key light" },
  { cat: "Shorts", dur: "5s", name: "Street food close-up", desc: "Sizzling griddle, steam backlit at dusk, handheld" },
  { cat: "ASMR", dur: "10s", name: "Rain on window", desc: "Droplets racing down glass, muted city bokeh behind" },
]

/* 공개 테스트·문서용 클립이다. 데모까지만 쓴다 —
 * 서비스에 올릴 때는 라이선스가 확인된 소스나 직접 올린 파일로 바꾼다.
 * <video src> 는 CORS 를 타지 않아 직링크면 대부분 그대로 재생된다.
 * 해상도가 높은 것부터 둔다 — 앞 인덱스가 큰 카드로 간다. */
export const VIDEOS = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://test-videos.co.uk/vids/jellyfish/mp4/h264/360/Jellyfish_360_10s_1MB.mp4",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4",
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
  "https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4",
  "https://www.w3schools.com/html/movie.mp4",
]

/* 히어로에서 카드가 앉는 자리. 가운데는 비워 둔다 — 글이 있는 자리다.
 * x·y 는 뷰포트 %, w 는 간격 스케일 클래스, depth 는 시차의 세기다.
 * depth 가 클수록 앞에 있는 것처럼 크게 밀린다. */
export type Spot = { x: number; y: number; w: string; rot: number; depth: number; ratio: string }

export const SPOTS: Spot[] = [
  { x: 33, y: 9, w: "w-36", rot: -6, depth: 0.4, ratio: "9 / 11" },
  { x: 67, y: 8, w: "w-36", rot: 7, depth: 0.38, ratio: "9 / 11" },
  { x: 8, y: 17, w: "w-40", rot: -8, depth: 0.75, ratio: "9 / 10" },
  { x: 92, y: 15, w: "w-40", rot: 6, depth: 0.72, ratio: "9 / 11" },
  { x: 4, y: 55, w: "w-36", rot: 4, depth: 1.35, ratio: "9 / 16" },
  { x: 96, y: 52, w: "w-36", rot: -5, depth: 1.32, ratio: "9 / 16" },
  { x: 17, y: 82, w: "w-44", rot: 8, depth: 1.55, ratio: "9 / 11" },
  { x: 84, y: 80, w: "w-40", rot: -10, depth: 1.5, ratio: "9 / 12" },
  { x: 38, y: 91, w: "w-40", rot: -5, depth: 1.7, ratio: "9 / 12" },
  { x: 63, y: 93, w: "w-40", rot: 6, depth: 1.66, ratio: "9 / 12" },
]

/* 진행 단계. 퍼센트만 있으면 기다림이 견뎌지지 않는다 —
 * 지금 무엇을 하는 중인지가 같이 있어야 한다. */
export const STAGES = [
  { to: 12, label: "모델 준비 중" },
  { to: 38, label: "장면 구성 중" },
  { to: 72, label: "디테일 채우는 중" },
  { to: 94, label: "인코딩 중" },
  { to: 100, label: "마무리 중" },
]

/* 생성 옵션. 기본값이 이미 골라져 있고, 바꾸고 싶은 것만 누른다 */
export const OPTIONS = [
  { key: "비율", items: ["9:16", "16:9", "1:1"], def: "9:16" },
  { key: "길이", items: ["5초", "10초", "15초"], def: "10초" },
  { key: "모델", items: ["Retake 2 Pro", "Retake 2", "Turbo"], def: "Retake 2 Pro" },
]

const ADJ = ["조용한", "성실한", "빠른", "느긋한", "선명한", "다정한"]
const NOUN = ["연출가", "편집자", "촬영감독", "각본가", "관객"]

/* 빈 칸으로 두면 «무엇을 적어야 하나» 에서 멈춘다. 채워 두고 고치게 한다. */
export function suggestName() {
  const n = 100 + Math.floor(Math.random() * 900)
  return `${ADJ[Math.floor(Math.random() * ADJ.length)]} ${NOUN[Math.floor(Math.random() * NOUN.length)]} ${n}`
}

/* 입력한 글과 낱말이 겹치는 만큼 점수를 준다.
 * 진짜 추천은 서버가 하겠지만, 화면이 무엇을 근거로 고르는지는 여기서 정해진다. */
export function recommend(text: string, count = 3): Template[] {
  const words = (text ?? "")
    .toLowerCase()
    .split(/[^a-z가-힣0-9]+/)
    .filter((w) => w.length > 2)
  return TEMPLATES.map((t) => {
    const hay = `${t.desc} ${t.name} ${t.cat}`.toLowerCase()
    return { t, score: words.reduce((n, w) => n + (hay.includes(w) ? 1 : 0), 0) }
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((x) => x.t)
}
