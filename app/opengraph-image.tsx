import { ImageResponse } from "next/og";

// 링크 공유 시(카카오톡, 슬랙, X 등) 보이는 썸네일 이미지 (빌드 시 한 번 생성됨)
export const alt = "링크 - 자주 찾는 웹페이지를 폴더별로 저장하는 북마크 서비스";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// globals.css의 테마 색상과 같은 값 (이미지 생성기는 CSS 변수를 읽지 못해 직접 지정)
const COLORS = {
  bg: "#f5f5f5",
  card: "#ffffff",
  text: "#1e1e1e",
  textSub: "#6b6b6b",
  accent: "#1c9a95",
  hoverBg: "#e9f9f8",
  point: "#ffd600",
};

// 줄 단위로 나눠 두어 어색한 곳에서 줄바꿈되지 않게 함
const TAGLINES = ["자주 찾는 웹페이지를", "폴더별로 저장하고"];
const TAGLINE_ACCENT = "한눈에 모아 보세요";
const CARDS = [
  { title: "Next.js Docs", description: "Next.js 공식 문서", host: "nextjs.org", folder: "개발" },
  { title: "Figma", description: "협업 디자인 툴", host: "figma.com", folder: "디자인" },
  { title: "Hacker News", description: "기술 뉴스와 토론", host: "news.ycombinator.com", folder: "뉴스" },
];

// 기본 글꼴에는 한글이 없어서, 이미지에 쓰인 글자만 담은 Noto Sans KR을 Google Fonts에서 받아 옴
async function loadKoreanFont(text: string): Promise<ArrayBuffer> {
  const query = new URLSearchParams({ family: "Noto Sans KR:wght@800", text });
  const css = await (await fetch(`https://fonts.googleapis.com/css2?${query}`)).text();
  const fontUrl = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
  if (!fontUrl) throw new Error("Noto Sans KR 글꼴 주소를 찾지 못했습니다.");
  return (await fetch(fontUrl)).arrayBuffer();
}

const usedText = ["링크", ...TAGLINES, TAGLINE_ACCENT, ...CARDS.flatMap((card) => Object.values(card))].join("");
const notoSansKr = await loadKoreanFont(usedText);

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: COLORS.bg,
          fontFamily: "Noto Sans KR",
          padding: "0 80px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: 520 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ width: 40, height: 40, borderRadius: 999, background: COLORS.point }} />
            <div style={{ fontSize: 112, color: COLORS.text, lineHeight: 1 }}>링크</div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 40,
              fontSize: 38,
              lineHeight: 1.45,
              color: COLORS.textSub,
            }}
          >
            {TAGLINES.map((line) => (
              <span key={line}>{line}</span>
            ))}
            <span style={{ color: COLORS.accent }}>{TAGLINE_ACCENT}</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 480 }}>
          {CARDS.map((card, index) => (
            <div
              key={card.title}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                padding: "22px 30px",
                borderRadius: 24,
                background: COLORS.card,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                // 카드를 살짝 엇갈리게 배치해 쌓인 느낌을 줌
                marginLeft: index === 1 ? 0 : 40,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 30, color: COLORS.text }}>{card.title}</span>
                <span
                  style={{
                    fontSize: 20,
                    color: COLORS.card,
                    // 흰 글자와 3:1 이상 명암비가 나오도록 진한 액센트 사용
                    background: COLORS.accent,
                    borderRadius: 10,
                    padding: "4px 14px",
                  }}
                >
                  {card.folder}
                </span>
              </div>
              <span style={{ fontSize: 22, color: COLORS.textSub }}>{card.description}</span>
              <span
                style={{
                  alignSelf: "flex-start",
                  fontSize: 20,
                  color: COLORS.accent,
                  background: COLORS.hoverBg,
                  borderRadius: 10,
                  padding: "4px 14px",
                }}
              >
                {card.host}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Noto Sans KR", data: notoSansKr, style: "normal", weight: 800 }],
    },
  );
}
