/* 토큰 값을 px 숫자로 읽는다.
 *
 * getPropertyValue 는 "적힌 그대로" 를 준다. --pad-card 가
 * calc(var(--spacing) * 4) 로 적혀 있으면 그 문자열이 그대로 나오고,
 * parseFloat 은 NaN 을 돌려준다. --radius 는 rem 이라 16을 곱해야 px 이 된다.
 *
 * 그래서 파싱하지 않고 브라우저에게 물어본다 — 눈에 안 보이는 상자에 그 값을
 * 폭으로 주고, 계산된 폭을 읽는다. 단위가 무엇이든, calc 가 몇 겹이든 맞다. */

let probe: HTMLDivElement | null = null

function getProbe() {
  if (probe?.isConnected) return probe
  probe = document.createElement("div")
  probe.setAttribute("aria-hidden", "true")
  probe.style.cssText =
    "position:absolute;visibility:hidden;pointer-events:none;height:0;top:-9999px"
  document.body.appendChild(probe)
  return probe
}

/** --name 의 값을 px 로. 읽을 수 없으면 null. */
export function readPx(name: string): number | null {
  if (typeof window === "undefined") return null
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(`--${name}`)
    .trim()
  if (!raw) return null
  const el = getProbe()
  el.style.width = "0px"
  el.style.width = `var(--${name})`
  const w = parseFloat(getComputedStyle(el).width)
  return Number.isNaN(w) ? null : w
}

/** 밀도 기준값(px). 다른 간격 토큰을 "몇 배" 로 되돌릴 때의 분모다. */
export function readBase(): number {
  return readPx("spacing-base") ?? 4
}
