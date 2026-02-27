// react-router-dom으로 교체 후 남은 autoFetch 등에서 사용하는 navigate 유틸리티
export const navigate = (path) => {
  window.location.href = path;
};

export default navigate;
