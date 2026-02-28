import { FONT_SIZE, FONT_RESPONSIVE } from '../theme.js';

const fieldStyle = {
  width: '100%',
  maxWidth: 'min(420px, 85%)',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: 'clamp(14px, 2vw, 28px)',
  padding: '0 clamp(8px, 1.5vw, 16px)',
};

const labelStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  fontFamily: 'Pixelify Sans',
  color: '#004FC6',
  fontSize: FONT_RESPONSIVE.label,
  fontWeight: '100',
  lineHeight: 'normal',
  width: 'clamp(80px, 12vw, 140px)',
  flexShrink: 0,
};

const inputFieldContainerStyle = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  flex: 1,
  minWidth: 0,
  maxWidth: 'min(300px, 72%)',
};

const textFieldsStyle = {
  position: 'relative',
  minHeight: '42px',
  height: 'clamp(42px, 4.8vh, 54px)',
  width: '100%',
  borderRadius: '12px',
  background: '#F8F8F8',
  border: '1px solid #004FC6',
  padding: 'clamp(8px, 1vw, 12px) clamp(14px, 2vw, 24px)',
  display: 'flex',
  alignItems: 'center',
};

const errorTextFieldsStyle = {
  border: '1px solid rgba(198, 0, 3, 0.64)',
};

const inputStyle = {
  flex: 1,
  minWidth: 0,
  position: 'relative',
  width: '100%',
  height: '100%',
  fontSize: FONT_RESPONSIVE.input,
  fontFamily: 'Pretendard',
  fontWeight: 600,
  color: '#004FC6',
  zIndex: 2,
  background: 'transparent',
  lineHeight: 1.5,
};

const errorMessageStyle = {
  position: 'absolute',
  top: 'calc(100%)',
  left: '12px',
  fontSize: FONT_SIZE.sm,
  fontFamily: 'Pretendard',
  color: 'rgba(198, 0, 3, 0.64)',
  marginTop: '2px',
};

/**
 * props:
 *   id        - input id / label htmlFor
 *   label     - label 텍스트 (JSX 허용, 줄바꿈 등)
 *   type      - input type (text | email | password)
 *   name      - input name
 *   value     - input value
 *   onChange  - change handler
 *   onBlur    - (optional) blur handler
 *   placeholder - (optional) placeholder
 *   error     - (optional) 에러 메시지 문자열
 *   maxLength - (optional) 최대 글자 수
 *   children  - (optional) input 박스 내부 추가 요소 (예: 인증 요청 버튼)
 *   extra     - (optional) input 박스 하단 추가 요소 (예: Timer)
 */
function InputField({
  id,
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  maxLength,
  children,
  extra,
}) {
  return (
    <div style={fieldStyle}>
      <label htmlFor={id} style={labelStyle}>
        {label}
      </label>
      <div style={inputFieldContainerStyle}>
        <div style={{ ...textFieldsStyle, ...(error ? errorTextFieldsStyle : {}) }}>
          <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            maxLength={maxLength}
            style={inputStyle}
          />
          {children}
        </div>
        {extra}
        {error && <div style={errorMessageStyle}>{error}</div>}
      </div>
    </div>
  );
}

export default InputField;
