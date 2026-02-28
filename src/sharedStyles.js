/**
 * 페이지/레이아웃 공통 스타일
 */

export const pageCentered = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const backButton = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  opacity: 0.7,
  transition: 'opacity 0.15s',
  display: 'flex',
  alignItems: 'center',
};

export const rowCentered = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
};

export const fullSize = {
  width: '100%',
  height: '100%',
};

export const pageFlex = {
  width: '100%',
  height: '100%',
  display: 'flex',
};

/** 로그인/회원가입 등 인증 폼용 중앙 블록 */
export const authCenterBlock = {
  display: 'flex',
  width: 'min(500px, 90vw)',
  maxHeight: '95vh',
  overflowY: 'auto',
  padding: 'clamp(24px, 4vw, 60px) clamp(16px, 2vw, 28px) clamp(20px, 2.5vw, 30px)',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  border: '4px solid #004FC6',
  background: 'rgba(235, 243, 255, 0.92)',
  boxShadow: '6px 6px 0px rgba(0, 79, 198, 0.35)',
  gap: 'clamp(20px, 3vw, 36px)',
};

/** 인증 폼 컨테이너 */
export const authFormStyle = {
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 'clamp(18px, 2.8vw, 36px)',
  flexShrink: '0',
};
