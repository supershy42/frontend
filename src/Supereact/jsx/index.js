import transform from './transform.js';

// preset 함수를 반환
export default function () {
  return {
    plugins: [transform],
  };
}
