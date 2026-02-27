const fieldStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 'clamp(12px, 2vw, 24px)',
};

const labelStyle = {
  fontFamily: 'Jersey 10',
  color: '#004FC6',
  fontSize: 'clamp(16px, 2.2vw, 32px)',
  fontWeight: '400',
  lineHeight: 'normal',
  width: 'clamp(80px, 12vw, 140px)',
  flexShrink: 0,
};

const inputFieldContainerStyle = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: 'min(318px, 55%)',
};

const textFieldsStyle = {
  position: 'relative',
  height: 'clamp(40px, 5vh, 58px)',
  width: '100%',
  borderRadius: '18px',
  background: '#F8F8F8',
  boxShadow: '0px 4px 10px 3px rgba(0, 79, 198, 0.32) inset',
  padding: 'clamp(10px, 1.5vw, 20px) clamp(12px, 2vw, 25px)',
};

const errorTextFieldsStyle = {
  boxShadow: '0px 4px 10px 3px rgba(198, 0, 3, 0.32) inset',
};

const inputStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
  fontSize: 'clamp(13px, 1.4vw, 18px)',
  fontFamily: 'Pretendard',
  fontWeight: 500,
  color: '#004FC6',
  zIndex: 2,
  background: 'transparent',
  lineHeight: 'normal',
  padding: '0',
  border: 'none',
  outline: 'none',
};

const errorMessageStyle = {
  position: 'absolute',
  top: 'calc(100% + 4px)',
  left: '12px',
  fontSize: 'clamp(10px, 1vw, 13px)',
  fontFamily: 'Pretendard',
  color: 'rgba(198, 0, 3, 0.64)',
  marginTop: '4px',
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
